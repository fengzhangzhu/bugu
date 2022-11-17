package com.living.activity.domain.dto;

import lombok.Data;

@Data
public class NightPhoneMatchUser {
  private Integer userId;
  private Short sex;
  private Integer matchUserId;
  private String roomId;
  private long lastPingTime;

  public NightPhoneMatchUser(Integer userId, Short sex) {
    this.userId = userId;
    this.sex = sex;
    this.lastPingTime =System.currentTimeMillis();
  }
}
