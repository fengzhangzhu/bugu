package com.living.core.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

/**
 * 官方消息列表显示消息
 */
@Data
public class UnreadOfficialMessage {
  private String type;
  private int unreadSum;
  private String lastText;
  private Timestamp lastTime;
}
