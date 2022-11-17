package com.living.activity.domain.factory;

import com.living.core.domain.dao.Message;

/**
 * @author lizijian
 */
public class MessageFactory {

  public static Message getMessage(String content, int fromUserId, int toUserId, short type,Integer time){
    Message message = new Message();
    message.setContent(content);
    message.setFromUserId(fromUserId);
    message.setToUserId(toUserId);
    message.setType(type);
    message.setTime(time);
    return message;
  }

}
