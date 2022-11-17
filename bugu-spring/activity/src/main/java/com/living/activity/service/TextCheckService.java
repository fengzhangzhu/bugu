package com.living.activity.service;

import com.living.activity.mapper.ActivityDao;
import com.living.activity.mapper.CommentDao;
import com.living.core.config.OfficialMessageType;
import com.living.core.domain.receive.weixin.ContentCheckResponse;
import com.living.core.domain.send.DingMessage;
import com.living.core.exception.WeiXinException;
import com.living.core.service.WeiXinCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
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
public class TextCheckService extends WeiXinCheckService {
    @Autowired
    private ActivityDao activityDao;
    @Autowired
    private CommentDao commentDao;

    /**
     *  异步动态文字内容审核
     * @param content 文字内容
     * @throws WeiXinException
     * @throws IOException
     */
    @Async("checkContent")
    public void checkActivityText(String content,int activityId,int publisherId,String openId)
            throws WeiXinException, IOException {
        ContentCheckResponse contentCheckResponse = getCheckResult(content, openId);
        //审核不通过
        if(!"pass".equals(contentCheckResponse.getResult().getSuggest())){
            //删除动态
            activityDao.delete(activityId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您的动态含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+activityId+"号动态文字内容审核未通过"));
        }
    }
    /**
     *  异步评论文字内容审核
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
            //删除评论
            commentDao.deleteComment(commentId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您的动态含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+commentId+"号动态文字内容审核未通过"));
        }
    }
    /**
     *  异步回复文字内容审核
     * @param content 文字内容
     * @throws WeiXinException
     * @throws IOException
     */
    @Async("checkContent")
    public void checkCommentResponseText(String content,int responseId,int publisherId,String openId)
            throws WeiXinException, IOException {
        ContentCheckResponse contentCheckResponse = getCheckResult(content, openId);
        //审核不通过
        if(!"pass".equals(contentCheckResponse.getResult().getSuggest())){
            //删除回复
            commentDao.deleteCommentResponse(responseId);
            //给发布者发布官方消息
            officialMessageService.sendOfficialMessage("您的回复含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
            SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+responseId+"号回复文字内容审核未通过"));
        }
    }
}
