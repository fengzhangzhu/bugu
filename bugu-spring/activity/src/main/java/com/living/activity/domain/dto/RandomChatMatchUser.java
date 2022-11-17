package com.living.activity.domain.dto;

import lombok.Data;

@Data
public class RandomChatMatchUser {
  private Integer userId;
  private Short sex;
  private Integer matchUserId;
  private long lastPingTime;

  public RandomChatMatchUser(Integer userId, Short sex) {
    this.userId = userId;
    this.sex = sex;
    this.lastPingTime =System.currentTimeMillis();
  }
}
