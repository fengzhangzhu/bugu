package com.living.activity.domain.result;

import com.living.core.domain.dto.UnReadUser;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class UnReadUserResult {
  private int userId;
  private boolean isOnline;
  private String username;
  private String avatar;
  private int unReadSum;
  private String lastTime;
  private String lastMessage;
  private short lastMessageType;

  public UnReadUserResult(UnReadUser unReadUser) {
    this.userId= unReadUser.getUserId();
    this.username= unReadUser.getUsername();
    this.avatar= new QiNiuAddress(unReadUser.getAvatar()).toString();
    this.unReadSum= unReadUser.getUnReadSum();
    this.lastTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(unReadUser.getLastTime());
    this.lastMessage=unReadUser.getLastMessage();
    this.lastMessageType= unReadUser.getLastMessageType();
  }
}
