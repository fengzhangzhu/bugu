package com.living.question.service;

import com.living.core.domain.dao.User;
import com.living.core.domain.send.*;
import com.living.core.mapper.MessageDao;
import com.living.core.websocket.WebSocket;
import com.living.question.dao.Answer;
import com.living.question.dao.Question;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * @author mulan
 * @version 1.0
 * @description 答案发送消息模块
 * @date 2022年 07月23日 11:56:46
 */
@Component
@Slf4j
public class AnswerMessageService {
    @Autowired
    private AnswerDao answerDao;
    @Autowired
    private MessageDao messageDao;
    @Async("sendMessage")
    public void agree(User my, int answerId){
        Answer answer = answerDao.getAnswerById(answerId);
        if(answer==null){
            return;
        }
        if (my.getId() != answer.getUserId()) {
            boolean isSuccess = WebSocket.sendMessage(answer.getUserId(),
                    new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                            new InteractiveMessage(answer.getId(),
                                    my.getId(), my.getUsername(), my.getAvatar(), InteractiveMessageType.LIKE, InteractiveMessageGroup.ANSWER)));
            if (!isSuccess) {
                messageDao.addInteractiveMessage(my.getId(), answer.getUserId(),
                        InteractiveMessageType.AGREE, answer.getId(),InteractiveMessageGroup.ANSWER);
            }
        }
    }
    @Async("sendMessage")
    public void comment(User my,int answerId,int publisherId){
        boolean isSuccess = WebSocket.sendMessage(publisherId,
                new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                        new InteractiveMessage(answerId, my.getId(), my.getUsername(), my.getAvatar(),
                                InteractiveMessageType.ANSWER_COMMENT,InteractiveMessageGroup.ANSWER)));
        //如果消息未发送成功,存储至数据库，等待用户登陆时获取
        if (!isSuccess) {
            messageDao.addInteractiveMessage(my.getId(),publisherId,
                    InteractiveMessageType.ANSWER_COMMENT, answerId,InteractiveMessageGroup.ANSWER);
        }
    }
}
