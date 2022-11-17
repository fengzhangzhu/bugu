package com.living.core.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class UnReadUser {
  private int userId;
  private String username;
  private String avatar;
  private int unReadSum;
  private String lastMessage;
  private short lastMessageType;
  private Timestamp lastTime;
}
