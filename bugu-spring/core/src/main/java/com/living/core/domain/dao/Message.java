package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class Message {
  protected int id;
  protected String content;
  protected int fromUserId;
  protected int toUserId;
  protected short type;
  protected Integer time;
  protected Timestamp createTime;
}
