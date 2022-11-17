package com.living.question.service;

import com.aliyuncs.exceptions.ClientException;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;


import com.living.core.config.HotConfig;
import com.living.core.domain.dao.User;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.core.service.InteractiveMessageService;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import com.living.question.dao.Label;
import com.living.question.dao.Question;
import com.living.question.decorate.QuestionHotAnswerDecorate;
import com.living.question.decorate.QuestionLabelDecorate;
import com.living.question.mapper.QuestionLabelDao;
import com.living.question.mapper.QuestionDao;
import com.living.question.result.QuestionResult;
import com.qiniu.common.QiniuException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月18日 16:48:24
 */
@Service
@Slf4j
public class QuestionService {
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private UserService userService;
    @Autowired
    private Gson gson;
    @Autowired
    private QuestionLabelDao labelDao;

    @Autowired
    private QuestionVideoCheckService videoCheckService;

    @Autowired
    private QuestionTextCheckService textCheckService;
    @Autowired
    private QuestionPicCheckService picCheckService;

    @Autowired
    private QuestionMessageService questionMessageService;
    @Autowired
    private QuestionLabelDecorate questionLabelDecorate;

    @Autowired
    private QuestionHotAnswerDecorate questionHotAnswerDecorate;
    private final int PAGE_SIZE = 10;
    @Transactional(rollbackFor = Exception.class)
    public void publish( String title,String text, String pics,String video,short isAnonymity,String labelIds)
            throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {
        User my = UserUtil.getUser();
        //如果是视频，只有vip和实名认证过的用户才能发
        String[] videos = gson.fromJson(video, String[].class);
        if(videos.length>0){
            userService.checkVip(my.getId());
            userService.checkVerify(my.getId());
        }
        Question question = Question.publish(title,text, pics,video, my.getId(), isAnonymity);
        questionDao.publish(question);
        if (labelIds != null) {
            int[] ids = gson.fromJson(labelIds, int[].class);
            if (ids != null&&ids.length>0) {
                if (ids.length > 5) {
                    throw new ParamErrorException("标签数过多");
                }
                labelDao.addQuestionLabels(ids, question.getId());
                labelDao.addLabelsHot(5,ids);
            }
        }
        /**
         * 异步审核动态文本
         */
        if(text!=null){
            textCheckService.checkQuestionText(title+text,question.getId(),my.getId(),my.getOpenid());
        }
        /**
         * 异步审核动态图片/视频
         */
        if(pics!=null){
            picCheckService.checkQuestionPics(gson.fromJson(pics,String[].class),question.getId(),my.getId());
        }
        if(video!=null){
            videoCheckService.checkQuestionVideo(gson.fromJson(video,String[].class),question.getId(),my.getId());
        }

    }


    /**
     * 获取标签
     */
    public PageResult<List<Label>> labelList(int page) {
        PageHelper.startPage(page, 10);
        List<Label> labelList = labelDao.getLabelList();
        PageInfo<Label> pageInfo = new PageInfo<>(labelList);
        return new PageResult<>(pageInfo, labelList);
    }

    /**
     * 增加标签
     */
    public Integer addLabel(String content) {
        Label label = new Label();
        label.setContent(content);
        try {
            labelDao.addLabel(label);
            return label.getId();
        } catch (DuplicateKeyException e) {
            return labelDao.getLabelByContent(content).getId();
        }
    }

    /**
     * 模糊搜索标签
     */
    public List<Label> fuzzyQueryLabel(String content) {
        StringBuilder finalContent = new StringBuilder();
        for (int i = 0; i < content.length(); i++) {
            finalContent.append(content.charAt(i));
            finalContent.append("%");
        }
        return labelDao.fuzzyQueryLabel(finalContent.toString());
    }

    public PageResult<List<QuestionResult>> userQuestion(int userId, int page) throws ResourseNotExistException {
        List<Question> questions = null;
        PageHelper.startPage(page,PAGE_SIZE);
        if (userId == UserUtil.getUserId()) {
            questions = questionDao.getMyQuestion(userId);
        }else {
            questions=questionDao.getUserQuestion(userId,UserUtil.getUserId());
        }
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream().map(QuestionResult::new)
                .collect(Collectors.toList());
        /**
         * 如果动态总数大于0，为动态增加标签
         */
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
        }
        return new PageResult<>(pageInfo,questionResults);
    }

    public PageResult<List<QuestionResult>> getAllQuestion(int page) {
        int userId = UserUtil.getUserId();
        //如果是第一页,获取新的动态到浏览记录
        if (page == 1) {
            Integer[] questions = questionDao.getNewQuestion(userId);
            if (questions.length > 0) {
                //动态id升序排序
                Arrays.sort(questions);
                questionDao.viewQuestion(questions, userId);
                questionDao.updateViewSum(questions);
            }
        }

        PageHelper.startPage(page, PAGE_SIZE);
        List<Question> questionHistory = questionDao.getQuestionHistory(userId);
        PageInfo<Question> pageInfo = new PageInfo<>(questionHistory);
        List<QuestionResult> questionResults = questionHistory.stream()
                //筛选出未删除的
                .filter(a->a.getIsDeleted()==0)
                .map(QuestionResult::new)
                .collect(Collectors.toList());
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
            questionHotAnswerDecorate.decorate(questionResults);
        }

        return new PageResult<>(pageInfo,questionResults);
    }

    /**
     * 获取热门问题
     */
    public PageResult<List<QuestionResult>> getHotQuestion(int page) {
        int userId = UserUtil.getUserId();
        //如果是第一页,获取新的动态到浏览记录

        PageHelper.startPage(page, PAGE_SIZE);
        List<Question> questions = questionDao.getHotQuestion(userId);
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream()
                .map(QuestionResult::new)
                .collect(Collectors.toList());
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
            questionHotAnswerDecorate.decorate(questionResults);
        }

        return new PageResult<>(pageInfo,questionResults);
    }
    public ApiResult<QuestionResult> getQuestionDetail(int questionId){
        int userId = UserUtil.getUserId();
        Question res = questionDao.getQuestionDetail(questionId,userId);
        if(res == null || res.getIsDeleted()==1){
            return ApiResult.fail(ResultCode.RESOURCE_NOT_EXIST,"already deleted","问题已被删除");
        }else {
            QuestionResult questionResult = new QuestionResult(res);
            List<Label> labels = labelDao.getLabelsByQuestionId(questionResult.getId());
            questionResult.setLabels(labels);
            return ApiResult.success(questionResult);
        }

    };
    /**
     * 删除问题
     */
    public void delete(Integer id)
            throws ResourseNotExistException, NoPermissionException, QiniuException {
        Question question = questionDao.getQuestionById(id);
        if (question == null) {
            throw new ResourseNotExistException("问题不存在");
        }
        if (question.getUserId() != UserUtil.getUserId()) {
            throw new NoPermissionException("没有权限");
        }
        questionDao.delete(id);
    }
    @Transactional(rollbackFor = Exception.class)
    public void like(int id) throws Exception {
        User my = UserUtil.getUser();
        try {
            questionDao.addLikeSum(id, HotConfig.LIKE);
            questionDao.like(my.getId(), id);
        } catch (DuplicateKeyException e) {
            log.error(my.getId() + "号用户重复点赞-" + id);
            throw new ActionErrorException("请不要重复点赞");
        }
        /**
         * 如果不是自己的动态,给动态发布者发送互动消息
         */
        questionMessageService.like(my,id);
    }

    /**
     * 取消点赞
     * @param id
     */
    @Transactional(rollbackFor = Exception.class)
    public void removeLike(int id) {
        int i = questionDao.removeLike(UserUtil.getUserId(), id);
        if (i > 0) {
            questionDao.reduceLikeSum(id,HotConfig.LIKE);
        }
    }

    /**
     * 取消收藏
     * @param id
     */
    @Transactional(rollbackFor = Exception.class)
    public void removeCollect(int id) {
        int i = questionDao.removeCollect(UserUtil.getUserId(), id);
        if (i > 0) {
            questionDao.reduceCollectSum(id,HotConfig.COLLECT);
        }
    }
    @Transactional(rollbackFor = Exception.class)
    public void collect(int id) throws Exception {
        User my = UserUtil.getUser();
        try {
            questionDao.addCollectSum(id, HotConfig.COLLECT);
            questionDao.collect(my.getId(), id);
        } catch (DuplicateKeyException e) {
            log.error(my.getId() + "号用户重复收藏-" + id);
            throw new ActionErrorException("请不要重复收藏");
        }
        /**
         * 如果不是自己的问题,给问题发布者发送互动消息
         */
        questionMessageService.collect(my,id);
    }

    public PageResult<List<QuestionResult>> getMyQuestion( int page) throws ResourseNotExistException {
        List<Question> questions = null;
        PageHelper.startPage(page,PAGE_SIZE);
        int myId = UserUtil.getUserId();
        questions = questionDao.getMyQuestion(myId);
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream().map(QuestionResult::new)
                .collect( Collectors.toList());
        /**
         * 如果动态总数大于0，为动态增加标签
         */
        if(questionResults.size()>0){
           questionLabelDecorate.decorate(questionResults);
           questionHotAnswerDecorate.decorate(questionResults);
        }
        return new PageResult<>(pageInfo,questionResults);
    }
    public PageResult<List<QuestionResult>> getMyCollectedQuestion( int page) throws ResourseNotExistException {
        List<Question> questions = null;
        PageHelper.startPage(page,PAGE_SIZE);
        int myId = UserUtil.getUserId();
        questions = questionDao.getUserCollectedQuestion(myId);
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream().map(QuestionResult::new)
                .collect( Collectors.toList());
        /**
         * 如果动态总数大于0，为动态增加标签
         */
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
            questionHotAnswerDecorate.decorate(questionResults);
        }
        return new PageResult<>(pageInfo,questionResults);
    }

    /**
     * 获取指定id标签下的问题
     */
    public PageResult<List<QuestionResult>> groupByLabel(int labelId,int page){
        PageHelper.startPage(page,PAGE_SIZE);
        List<Question> questions = questionDao.findQuestionByLabel(labelId,UserUtil.getUserId());
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream().map(QuestionResult::new)
                .collect(Collectors.toList());
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
            questionHotAnswerDecorate.decorate(questionResults);
        }
        labelDao.addLabelHot(1,labelId);
        return new PageResult<>(pageInfo,questionResults);
    }

    public PageResult<List<QuestionResult>> fullTextQuery(String subText,int page) throws ParamErrorException {
        if(subText.length()<2){
            throw new ParamErrorException("subText参数过短");
        }
        PageHelper.startPage(page, PAGE_SIZE);
        List<Question> questions = questionDao.getFullTextQuery(subText,UserUtil.getUserId());
        PageInfo<Question> pageInfo = new PageInfo<>(questions);
        List<QuestionResult> questionResults = questions.stream().map(QuestionResult::new)
                .collect(Collectors.toList());
        if(questionResults.size()>0){
            questionLabelDecorate.decorate(questionResults);
            questionHotAnswerDecorate.decorate(questionResults);
        }
        return new PageResult<>(pageInfo,questionResults);
    }
}
