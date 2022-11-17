package com.living.core.domain.send;

/**
 * 消息类型枚举
 * @author lizijian
 */
public enum SendMessageType {
  /**
   * 用户消息
   */
  USER_MESSAGE("USER_MESSAGE"),
  /**
   * 官方消息
   */
  OFFICIAL_MESSAGE("OFFICIAL_MESSAGE"),

  /**
   * 消息已读
   */
  ALREADY_READ("ALREADY_READ"),

  /**
   * 撤回消息
   */
  WITHDRAW("WITHDRAW"),

  /**
   * 互动消息，包括评论，关注，点赞，收藏
   */
  INTERACTIVE("INTERACTIVE");

  private String name;

  SendMessageType(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
