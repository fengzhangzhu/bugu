package com.living.core.domain.send;

import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

/**
 * 互动消息
 * @author lizijian
 */
@Data
public class InteractiveMessage {
  private int activityId;
  private int userId;
  private String username;
  private String avatar;
  private String type;

  private String group;
  public InteractiveMessage(int activityId, int userId, String username, String avatar,
                            String type,String group) {
    this.activityId = activityId;
    this.userId = userId;
    this.username = username;
    this.avatar = new QiNiuAddress(avatar).toString();
    this.type = type;
    this.group = group;
  }
}
