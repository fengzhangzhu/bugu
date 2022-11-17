package com.living.question.service;

import com.aliyuncs.exceptions.ClientException;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import com.living.core.config.HotConfig;
import com.living.core.domain.dao.User;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import com.living.question.dao.Answer;
import com.living.question.dao.Question;
import com.living.question.decorate.AnswerDecorate;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import com.living.question.result.AnswerResult;
import com.living.question.result.MyAnswerResult;
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
 * @description 回答模块
 * @date 2022年 07月21日 08:43:55
 */
@Service
@Slf4j
public class AnswerService {
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private UserService userService;

    @Autowired
    private Gson gson;

    @Autowired
    private  QuestionTextCheckService textCheckService;
    @Autowired
    private QuestionPicCheckService picCheckService;
    @Autowired
    private  QuestionVideoCheckService videoCheckService;

    @Autowired
    private QuestionMessageService questionMessageService;

    @Autowired
    private AnswerMessageService answerMessageService;

    @Autowired
    private AnswerDecorate answerDecorate;
    private final  int PAGE_SIZE = 10;
    /**
     * 发布回答
     */
    @Transactional(rollbackFor = Exception.class)
    public void publish(int questionId, String text, String pic,short isAnonymity,short isVideo)
            throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {
        User my = UserUtil.getUser();
        //如果是视频，只有vip和实名认证过的用户才能发
        if(isVideo>0){
            userService.checkVip(my.getId());
            userService.checkVerify(my.getId());
        }
        Answer answer= Answer.publish(my.getId(),questionId,text, pic,isAnonymity,isVideo);
        answerDao.publish(answer);
        questionDao.addAnswerSum(questionId, HotConfig.ANSWER);

        /**
         * 异步审核动态文本
         */
        if(text!=null){
            textCheckService.checkAnswerText(text,answer.getId(),my.getId(),my.getOpenid());
        }
        /**
         * 异步审核动态图片/视频
         */
        if(pic!=null && pic.length()>1){
            if(isVideo==1){
                videoCheckService.checkAnswerVideo(gson.fromJson(pic,String[].class),answer.getId(),my.getId());
            }else {
                picCheckService.checkQuestionPics(gson.fromJson(pic,String[].class),answer.getId(),my.getId());
            }
        }
        //发送消息给问题的发布者
        questionMessageService.answer(my,questionId);

    }

    public PageResult<List<AnswerResult>> getAllAnswer(int questionId,int page) {
        int userId = UserUtil.getUserId();
        //如果是第一页,获取新的动态到浏览记录
        if (page == 1) {
            Integer[] answers = answerDao.getNewAnswer(questionId,userId);
            if (answers.length > 0) {
                answerDao.viewAnswer(answers, userId);
                answerDao.updateViewSum(answers);
            }
        }

        PageHelper.startPage(page, PAGE_SIZE);
        List<Answer> answerHistory = answerDao.getAnswerHistory(questionId,userId);

        PageInfo<Answer> pageInfo = new PageInfo<>(answerHistory);
        List<AnswerResult> answerResults = answerHistory.stream()
                //筛选出未删除的
                .filter(a->a.getIsDeleted()==0)
                .map(AnswerResult::new)
                .collect(Collectors.toList());

        return new PageResult<>(pageInfo,answerResults);
    }

    /**
     * 获取指定回答的详细信息
     * @param answerId
     * @return
     */
    public ApiResult<AnswerResult> getAnswerDetail(int answerId){
        int userId = UserUtil.getUserId();
        Answer res = answerDao.getAnswerDetail(answerId,userId);

        if(res == null || res.getIsDeleted()==1){
            return ApiResult.fail(ResultCode.RESOURCE_NOT_EXIST,"already deleted","问题已被删除");
        }else {
            log.info(res.toString());
            AnswerResult answerResult = new AnswerResult(res);
            if(res.getUserId()==userId){
                answerResult.setIsMe((short) 1);
            }else {
                answerResult.setIsMe((short) 0);
            }

            return ApiResult.success(answerResult);
        }

    };

    /**
     * 赞同回答
     * @param id
     * @throws Exception
     */
    @Transactional(rollbackFor = Exception.class)
    public void agree(int id) throws Exception {
        User my = UserUtil.getUser();
        int isOpposed = answerDao.getIsOpposed(id, my.getId());
        if(isOpposed >0){
            log.error(my.getId() + "号用户已反对-" + id);
            throw new ActionErrorException("您已经反对！");
        }
        try {
            answerDao.updateAgreeSum(id, HotConfig.AGREE);
            answerDao.agreeAnswer(id,my.getId());
        } catch (DuplicateKeyException e) {
            log.error(my.getId() + "号用户重复赞同-" + id);
            throw new ActionErrorException("请不要重复赞同");
        }
        /**
         * 如果不是自己的动态,给回答发布者发送互动消息
         */
        answerMessageService.agree(my,id);
    }

    /**
     * 取消赞同
     * @param id
     */
    @Transactional(rollbackFor = Exception.class)
    public void removeAgree(int id) {
        int i = answerDao.removeAgree(UserUtil.getUserId(), id);
        if (i > 0) {
            answerDao.reduceAgreeSum(id,HotConfig.AGREE);
        }
    }

    /**
     * 反对回答
     * @param id
     * @throws Exception
     */
    @Transactional(rollbackFor = Exception.class)
    public void oppose(int id) throws Exception {
        User my = UserUtil.getUser();
        int isAgreed = answerDao.getIsAgreed(id,my.getId());
        if(isAgreed>0){
            log.error(my.getId() + "号用户已赞同-" + id);
            throw new ActionErrorException("您已经赞同！");
        }
        try {
            answerDao.updateOpposeSum(id, HotConfig.AGREE);
            answerDao.opposeAnswer(id,my.getId());
        } catch (DuplicateKeyException e) {
            log.error(my.getId() + "号用户重复反对-" + id);
            throw new ActionErrorException("请不要重复反对");
        }



    }

    /**
     * 取消反对
     * @param id
     */
    @Transactional(rollbackFor = Exception.class)
    public void removeOppose(int id) {
        int i = answerDao.removeOppose(UserUtil.getUserId(), id);
        if (i > 0) {
            answerDao.reduceOpposeSum(id,HotConfig.AGREE);
        }
    }

    /**
     * 删除回答
     * @param id
     */
    public void delete(Integer id)
            throws ResourseNotExistException, NoPermissionException, QiniuException {
        Answer answer = answerDao.getAnswerById(id);
        if (answer == null) {
            throw new ResourseNotExistException("回答不存在");
        }
        if (answer.getUserId() != UserUtil.getUserId()) {
            throw new NoPermissionException("没有权限");
        }
       answerDao.delete(id);
    }

    public PageResult<List<MyAnswerResult>> getMyAnswer(int page) {
        int userId = UserUtil.getUserId();
        List<Answer> answers = answerDao.getMyAnswer(userId);
        PageHelper.startPage(page, PAGE_SIZE);
        PageInfo<Answer> pageInfo = new PageInfo<>(answers);
        List<MyAnswerResult> myAnswerResults = answers.stream()
                .map(MyAnswerResult::new)
                .collect(Collectors.toList());
        if(myAnswerResults.size()>0){
            answerDecorate.decorateFatherQuestion(myAnswerResults);
            answerDecorate.decorateMyUserInfo(myAnswerResults);
        }
        return new PageResult<>(pageInfo,myAnswerResults);
    }
}
