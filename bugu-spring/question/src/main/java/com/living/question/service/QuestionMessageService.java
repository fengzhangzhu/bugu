package com.living.question.service;

import com.living.core.domain.dao.User;
import com.living.core.domain.send.*;
import com.living.core.mapper.MessageDao;
import com.living.core.websocket.WebSocket;
import com.living.question.dao.Question;
import com.living.question.mapper.QuestionDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月20日 10:42:16
 */
@Component
@Slf4j
public class QuestionMessageService {
    @Autowired
    private QuestionDao questionDao;
    @Autowired
    private MessageDao messageDao;
    @Async("sendMessage")
    public void like(User my, int questionId){
        Question question = questionDao.getQuestionById(questionId);
        if(question==null){
            return;
        }
        if (my.getId() != question.getUserId()) {
            boolean isSuccess = WebSocket.sendMessage(question.getUserId(),
                    new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                            new InteractiveMessage(question.getId(),
                                    my.getId(), my.getUsername(), my.getAvatar(), InteractiveMessageType.LIKE, InteractiveMessageGroup.QUESTION)));
            if (!isSuccess) {
                messageDao.addInteractiveMessage(my.getId(), question.getUserId(),
                        InteractiveMessageType.LIKE, question.getId(),InteractiveMessageGroup.QUESTION);
            }
        }
    }
    @Async("sendMessage")
    public void collect(User my, int questionId){
        Question question = questionDao.getQuestionById(questionId);
        if(question==null){
            return;
        }
        if (my.getId() != question.getUserId()) {
            boolean isSuccess = WebSocket.sendMessage(question.getUserId(),
                    new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                            new InteractiveMessage(question.getId(),
                                    my.getId(), my.getUsername(), my.getAvatar(), InteractiveMessageType.LIKE, InteractiveMessageGroup.QUESTION)));
            if (!isSuccess) {
                messageDao.addInteractiveMessage(my.getId(), question.getUserId(),
                        InteractiveMessageType.COLLECT, question.getId(),InteractiveMessageGroup.QUESTION);
            }
        }
    }
    @Async("sendMessage")
    public void answer(User my, int questionId){
        Question question = questionDao.getQuestionById(questionId);
        if(question==null){
            return;
        }
        if (my.getId() != question.getUserId()) {
            boolean isSuccess = WebSocket.sendMessage(question.getUserId(),
                    new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                            new InteractiveMessage(question.getId(),
                                    my.getId(), my.getUsername(), my.getAvatar(), InteractiveMessageType.ANSWER, InteractiveMessageGroup.QUESTION)));
            if (!isSuccess) {
                messageDao.addInteractiveMessage(my.getId(), question.getUserId(),
                        InteractiveMessageType.ANSWER, question.getId(),InteractiveMessageGroup.QUESTION);
            }
        }
    }
}
