package com.living.core.domain.dao;

import lombok.Data;

import java.util.Date;

/**
 * @author lizijian
 */
@Data
public class User {
  private int id;
  private String openid;
  private String username;
  private String avatar;
  private int beAttentionSum;
  private int visitorSum;
  private int attentionSum;
  private Short sex;
  private String background;
  private Date createTime;

  public User(String openid, String username, String avatar) {
    this.openid = openid;
    this.username = username;
    this.avatar = avatar;
  }
}
