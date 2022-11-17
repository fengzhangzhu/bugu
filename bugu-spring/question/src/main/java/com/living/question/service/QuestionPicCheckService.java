package com.living.question.service;

import com.aliyuncs.exceptions.ClientException;
import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.send.DingMessage;
import com.living.core.service.ALiCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @Author mulan
 * @Date 2022/7/18 22:35
 * @PackageName:com.living.bugu.question.service
 * @ClassName: PicCheckService
 * @Description: TODO
 * @Version 1.0
 */
@Service
@Slf4j
public class QuestionPicCheckService extends ALiCheckService {
    @Autowired
    private QuestionDao questionDao;

    @Autowired
    private AnswerDao answerDao;
    /**
     * 异步审核问题图片
     * @param picNames 图片名数组
     * @throws ClientException
     */
    @Async("checkContent")
    public void checkQuestionPics(String [] picNames,int questionId,int publisherId) throws ClientException {
        for (String picName : picNames) {
            boolean isPass = getCheckResult(QiNiuConfig.URL+picName);
            if(!isPass){
                //删除动态
                questionDao.delete(questionId);
                //给发布者发布官方消息
                officialMessageService.sendOfficialMessage("您发布的问题含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
                SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+questionId+"号问题图片内容审核未通过"));
                return;
            }
        }
    }

    /**
     * 异步审核回答图片
     * @param picNames 图片名数组
     * @throws ClientException
     */
    @Async("checkContent")
    public void checkAnswerPics(String [] picNames,int answerId,int publisherId) throws ClientException {
        for (String picName : picNames) {
            boolean isPass = getCheckResult(QiNiuConfig.URL+picName);
            if(!isPass){
                //删除动态
                answerDao.delete(answerId);
                //给发布者发布官方消息
                officialMessageService.sendOfficialMessage("您发布的回答含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
                SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+answerId+"号回答图片内容审核未通过"));
                return;
            }
        }
    }
}
