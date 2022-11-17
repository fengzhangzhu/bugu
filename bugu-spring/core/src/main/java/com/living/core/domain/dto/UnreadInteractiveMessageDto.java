package com.living.core.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

/**
 * 未读互动消息
 * @author lizijian
 */
@Data
public class UnreadInteractiveMessageDto {
  private int id;
  private int contentId;
  private int userId;
  private String username;
  private String avatar;
  private String type;
  private String group;
  private Timestamp createTime;
}
