package com.living.activity.config;

import lombok.Data;

/**
 * 用户处罚类型
 */
@Data
public class UserPunishType {

  /**
   * 禁言
   */
  public static final String MUTE="mute";

  /**
   * 封号
   */
  public static final String BAN_ACCOUNT="banAccount";



  public static boolean contain(String type){
    return MUTE.equals(type) || BAN_ACCOUNT.equals(type);
  }
}
