package com.living.core.service;

import com.living.core.domain.send.*;

import com.living.core.mapper.MessageDao;
import com.living.core.websocket.WebSocket;
import com.living.core.domain.dao.User;
import com.living.core.domain.dto.FansUser;
import com.living.core.mapper.UserDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 异步发送互动消息
 */
@Component
@Slf4j
public class InteractiveMessageService {

  @Autowired
  private UserDao userDao;

  @Autowired
  private MessageDao messageDao;



  @Async("sendMessage")
  public void publish(User my, int activityId) {
    List<FansUser> fansList = userDao.getFansList(my.getId());
    List<Integer> unSuccess = new ArrayList<>(10);
    for (FansUser fansUser : fansList) {
      boolean isSuccess = WebSocket.sendMessage(fansUser.getId(),
          new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
              new InteractiveMessage(activityId, my.getId(), my.getUsername(), my.getAvatar(),
                  InteractiveMessageType.PUBLISH,InteractiveMessageGroup.ACTIVITY)));
      if (!isSuccess) {
        unSuccess.add(fansUser.getId());
      }
    }
    if (unSuccess.size() > 0) {
      messageDao.addInteractiveMessageList(my.getId(), unSuccess, InteractiveMessageType.PUBLISH,
          activityId, InteractiveMessageGroup.ACTIVITY);
    }
  }

  @Async("sendMessage")
  public void attention(User my, int attentionUserId) {
    boolean isSuccess = WebSocket.sendMessage(attentionUserId,
        new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
            new InteractiveMessage(0, my.getId(), my.getUsername(), my.getAvatar(),
                InteractiveMessageType.ATTENTION,InteractiveMessageGroup.ACTIVITY)));
    if (!isSuccess) {
      messageDao.addInteractiveMessage(my.getId(), attentionUserId,
          InteractiveMessageType.ATTENTION, 0,InteractiveMessageGroup.ACTIVITY);
    }
  }



  @Async("sendMessage")
  public void comment(User my,int activityId,int publisherId){
    boolean isSuccess = WebSocket.sendMessage(publisherId,
        new SendMessage<>(SendMessageType.INTERACTIVE.getName(),
            new InteractiveMessage(activityId, my.getId(), my.getUsername(), my.getAvatar(),
                InteractiveMessageType.COMMENT,InteractiveMessageGroup.ACTIVITY)));
    //如果消息未发送成功,存储至数据库，等待用户登陆时获取
    if (!isSuccess) {
      messageDao.addInteractiveMessage(my.getId(),publisherId,
          InteractiveMessageType.COMMENT, activityId,InteractiveMessageGroup.ACTIVITY);
    }
  }

}
