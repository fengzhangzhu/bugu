package com.living.question.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.living.core.config.HotConfig;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.User;
import com.living.core.domain.helper.CommentUser;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.ActionErrorException;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.exception.WeiXinException;
import com.living.core.util.UserUtil;
import com.living.question.dao.Answer;
import com.living.question.dao.AnswerComment;
import com.living.question.dao.AnswerCommentResponse;
import com.living.question.dao.Question;
import com.living.question.dto.AnswerCommentDto;
import com.living.question.dto.AnswerCommentResponseDto;
import com.living.question.dto.AnswerCommentResultWithCommentResponseResult;
import com.living.question.exception.AnswerCommentNotExist;
import com.living.question.exception.AnswerNotExistException;
import com.living.question.mapper.AnswerCommentDao;
import com.living.question.mapper.AnswerDao;
import com.living.question.result.AnswerCommentResponseResult;
import com.living.question.result.AnswerCommentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description 答案评论服务
 * @date 2022年 07月25日 15:27:44
 */
@Component
@Slf4j
public class AnswerCommentService {
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private AnswerCommentDao commentDao;
    @Autowired
    private AnswerMessageService answerMessageService;

    @Autowired
    private  QuestionTextCheckService textCheckService;

    /**
     * 评论回答
     */
    public Integer comment(Integer answerId, String content, Short type)
            throws AnswerNotExistException, WeiXinException, IOException {
        User my = UserUtil.getUser();
       Answer answer = answerDao.getAnswerDetail(answerId, my.getId());
        if (answer == null) {
            throw new AnswerNotExistException();
        }

        AnswerComment comment = AnswerComment.create(my.getId(), answerId, content, type);

        if (commentDao.addComment(comment) > 0) {
            //增加回答的评论总数
            answerDao.updateCommentSum(answerId, HotConfig.COMMENT);
            //如果不是自己的回答,向回答发布者发送通知
            if (answer.getPublisher().getId() != my.getId()) {
                answerMessageService.comment(my,answerId,answer.getPublisher().getId());
            }
            /**
             * 如果评论是文字,异步内容审核
             */
            if(type==(short)0){
                textCheckService.checkCommentText(content,comment.getId(),my.getId(),my.getOpenid());
            }
        }

        return comment.getId();
    }

    /**
     * 获取指定回答的所有评论
     */
    public PageResult<List<AnswerCommentResultWithCommentResponseResult>> getCommentList(int answerId, int startPage, int pageSize,int son_startPage,int son_pageSize)
            throws AnswerNotExistException, AnswerCommentNotExist {
        Answer answer = answerDao.getAnswerById(answerId);
        if(answer==null){
            throw new AnswerNotExistException();
        }
        PageHelper.startPage(startPage,pageSize);
        List<AnswerCommentDto> comment = commentDao.getCommentByAnswerId(answerId,
                UserUtil.getUserId());
        //如果是匿名动态,评论者是动态发布者,将评论者用户信息隐藏
        if(answer.getIsAnonymity()==1){
            for (AnswerCommentDto answerCommentDto : comment) {
                if(answerCommentDto.getPublisher().getId()==answer.getUserId()){
                    CommentUser commentUser = answerCommentDto.getPublisher();
                    commentUser.setId(0);
                    commentUser.setUsername("某只小布咕");
                    commentUser.setAvatar(QiNiuConfig.ANONYMOUS_AVATAR);
                }
            }
        }
        PageInfo<AnswerCommentDto> pageInfo = new PageInfo<>(comment);
        List<AnswerCommentResult> answerCommentResults = comment.stream().map(AnswerCommentResult::new).collect(Collectors.toList());
        List<AnswerCommentResultWithCommentResponseResult> res=new ArrayList<>();
        for (AnswerCommentResult father : answerCommentResults) {
            //每个父评论加上三个子评论一起返回
            List<AnswerCommentResponseResult> sonResults = commentResponseList(father.getId(), son_startPage, son_pageSize);
            AnswerCommentResultWithCommentResponseResult build = AnswerCommentResultWithCommentResponseResult.builder().father(father).sons(sonResults).build();
            res.add(build);
        }
        return new PageResult<>(pageInfo,res);
    }

    public AnswerCommentResult getCommentDetail(int commentId)
            throws AnswerNotExistException {
        AnswerCommentDto answerCommentDto = commentDao.getCommentById(commentId);
        AnswerCommentResult answerCommentResult = new AnswerCommentResult(answerCommentDto);
        if(answerCommentResult.getIsDeleted()==1){
            answerCommentResult.setContent("");
        }
        return answerCommentResult;
    }
    /**
     * 点赞评论
     */
    @Transactional(rollbackFor = Exception.class)
    public void likeComment(int commentId) throws ActionErrorException {
        int i = commentDao.addLikeSum(commentId);
        if (i > 0) {
            try {
                commentDao.likeComment(UserUtil.getUserId(), commentId);
            } catch (DuplicateKeyException e) {
                log.error(UserUtil.getUserId() + "-重复点赞");
                throw new ActionErrorException("请不要重复点赞");
            }
        }
    }

    /**
     * 取消点赞评论
     */
    @Transactional(rollbackFor = Exception.class)
    public void removeLikeComment(int commentId){
        int i = commentDao.removeLikeComment(UserUtil.getUserId(), commentId);
        if(i>0){
            commentDao.subLikeSum(commentId);
        }
    }

    /**
     * 删除评论
     */
    public void deleteComment(int id) throws ResourseNotExistException, NoPermissionException {
        AnswerCommentDto comment = commentDao.getCommentById(id);
        if (comment == null) {
            throw new ResourseNotExistException("评论不存在");
        }
        Answer answer = answerDao.getAnswerById(comment.getAnswerId());
        if(answer == null){
            throw new ResourseNotExistException("动态不存在");
        }
        //如果不是评论发布者也不是动态发布者
        if (comment.getPublisher().getId() != UserUtil.getUserId()&&answer.getUserId()!=UserUtil.getUserId()) {
            throw new NoPermissionException("没有权限删除");
        }
        if (comment.getIsDeleted() == 1) {
            throw new ResourseNotExistException("评论已删除");
        }
        commentDao.deleteComment(id);
    }

    /**
     * 删除回复
     */
    public void deleteCommentResponse(int id) throws ResourseNotExistException, NoPermissionException {
        AnswerCommentResponse commentResponse = commentDao.getCommentResponseById(id);
        if(commentResponse==null){
            throw new ResourseNotExistException("评论回复不存在");
        }
        AnswerCommentDto answerComment = commentDao.getCommentById(commentResponse.getAnswerCommentId());
        if(answerComment==null){
            throw new ResourseNotExistException("动态评论不存在");
        }
        //如果不是评论回复发布者,也不是动态评论发布者
        if(commentResponse.getFromUserId()!=UserUtil.getUserId()&&answerComment.getPublisher().getId()!=UserUtil.getUserId()){
            throw new NoPermissionException("没有权限删除");
        }
        commentDao.deleteCommentResponse(id);
    }

    /**
     * 回复评论
     */
    @Transactional(rollbackFor = Exception.class)
    public Integer commentResponse(int commentId, String content, short type, int toUserId)
            throws ResourseNotExistException, WeiXinException, IOException {
        User my = UserUtil.getUser();

        AnswerCommentDto comment = commentDao.getCommentById(commentId);
        if (comment == null) {
            throw new ResourseNotExistException("评论不存在");
        }

        AnswerCommentResponse commentResponse = AnswerCommentResponse.create(commentId, my.getId(),
                toUserId, content, type);

        commentDao.commentResponse(commentResponse);
        Integer remarkId=commentResponse.getId();
        //增加评论回复总数
        commentDao.addResponseSum(commentId);
        //增加动态评论总数
        answerDao.updateCommentSum(comment.getAnswerId(), HotConfig.COMMENT);

        /**
         * 如果是文字评论,异步审核内容
         */
        if(type==0){
            textCheckService.checkCommentText(content,commentResponse.getId(),my.getId(),my.getOpenid());
        }

        return remarkId;
    }

    /**
     * 获取评论的回复列表
     */
    public List<AnswerCommentResponseResult> commentResponseList(int commentId, Integer startPage, Integer pageSize)
            throws AnswerCommentNotExist, AnswerNotExistException {
        //查找指定评论是否存在
        AnswerCommentDto answerComment = commentDao.getCommentById(commentId);
        if(answerComment==null){
            throw new AnswerCommentNotExist();
        }
        //动态不存在
        Answer answer = answerDao.getAnswerById(answerComment.getAnswerId());
        if(answer==null){
            throw new AnswerNotExistException();
        }

        PageHelper.startPage(startPage,pageSize);
        List<AnswerCommentResponseDto> commentResponses = commentDao.commentResponseList(
                commentId);

        if(answer.getIsAnonymity()==1){
            for (AnswerCommentResponseDto commentResponseResult : commentResponses) {
                if(commentResponseResult.getFromUserId()==answer.getUserId()){
                    commentResponseResult.setFromUserId(0);
                    commentResponseResult.setFromUsername(QiNiuConfig.ANONYMOUS_USERNAME);
                    commentResponseResult.setFromUserAvatar(QiNiuConfig.ANONYMOUS_AVATAR);
                }
            }
        }
        return commentResponses.stream().map(AnswerCommentResponseResult::new).collect(Collectors.toList());
    }
}
