package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class OfficeMessageObject {
  private int id;
  private int officialMessageId;
  private int userId;
  private int isRead;
  private Timestamp updateTime;
  private Timestamp createTime;
}
