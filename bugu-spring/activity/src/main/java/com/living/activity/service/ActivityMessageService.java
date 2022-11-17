package com.living.activity.service;

import com.living.activity.domain.dao.Activity;
import com.living.activity.mapper.ActivityDao;
import com.living.core.domain.dao.User;
import com.living.core.domain.send.*;
import com.living.core.mapper.MessageDao;
import com.living.core.mapper.UserDao;
import com.living.core.websocket.WebSocket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月20日 10:15:09
 */
@Component
@Slf4j
public class ActivityMessageService {
    @Autowired
    private ActivityDao activityDao;
    @Autowired
    private MessageDao messageDao;
    @Async("sendMessage")
    public void like(User my, int activityId){
        Activity activity = activityDao.getActivityById(activityId);
        if(activity==null){
            return;
        }
        if (my.getId() != activity.getUserId()) {
            boolean isSuccess = WebSocket.sendMessage(activity.getUserId(),
                    new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
                            new InteractiveMessage(activity.getId(),
                                    my.getId(), my.getUsername(), my.getAvatar(), InteractiveMessageType.LIKE, InteractiveMessageGroup.ACTIVITY)));
            if (!isSuccess) {
                messageDao.addInteractiveMessage(my.getId(), activity.getUserId(),
                        InteractiveMessageType.LIKE, activity.getId(),InteractiveMessageGroup.ACTIVITY);
            }
        }
    }
}
