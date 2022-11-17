package com.living.question.service;

import com.living.core.config.OfficialMessageType;
import com.living.core.domain.receive.weixin.ContentCheckResponse;
import com.living.core.domain.send.DingMessage;
import com.living.core.exception.WeiXinException;
import com.living.core.service.WeiXinCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
import com.living.question.mapper.AnswerCommentDao;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * @Author mulan
 * @Date 2022/7/18 22:22
 * @PackageName:com.living.question.service
 * @ClassName: TextCheckService
 * @Description: TODO
 * @Version 1.0
 */
@Service
@Slf4j
public class QuestionTextCheckService extends WeiXinCheckService {
    @Autowired
    private QuestionDao questionDao;

    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private AnswerCommentDao commentDao;
    /**
     *  异步问题文字内容审核
     * @param content 文字内容
     * @throws WeiXinException
     * @throws IOException
     */
    @Async("checkContent")
    public void checkQuestionText(String content,int questionId,int publisherId,String openId)
            throws WeiXinException, IOException {
        ContentCheckResponse contentCheckResponse = getCheckResult(content, openId);
        //审核不通过
        if(!"pass".equals(contentCheckResponse.getResult().getSuggest())){
            //删除动态
            questionDao.delete(questionId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您发布的问题含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+questionId+"号问题文字内容审核未通过"));
        }
    }
    /**
     *  异步问题文字内容审核
     * @param content 文字内容
     * @throws WeiXinException
     * @throws IOException
     */
    @Async("checkContent")
    public void checkAnswerText(String content,int answerId,int publisherId,String openId)
            throws WeiXinException, IOException {
        ContentCheckResponse contentCheckResponse = getCheckResult(content, openId);
        //审核不通过
        if(!"pass".equals(contentCheckResponse.getResult().getSuggest())){
            //删除动态
            answerDao.delete(answerId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您发布的回答含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+answerId+"号回答文字内容审核未通过"));
        }
    }
    /**
     *  异步问题文字内容审核
     * @param content 文字内容
     * @throws WeiXinException
     * @throws IOException
     */
    @Async("checkContent")
    public void checkCommentText(String content,int commentId,int publisherId,String openId)
            throws WeiXinException, IOException {
        ContentCheckResponse contentCheckResponse = getCheckResult(content, openId);
        //审核不通过
        if(!"pass".equals(contentCheckResponse.getResult().getSuggest())){
            //删除动态
            commentDao.deleteComment(commentId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您发布的回答评论含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+commentId+"号回答评论文字内容审核未通过"));
        }
    }
}
