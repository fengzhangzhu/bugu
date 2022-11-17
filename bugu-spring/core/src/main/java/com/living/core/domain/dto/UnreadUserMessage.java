package com.living.core.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class UnreadUserMessage {

  private int id;

  private String content;

  private short type;

  private Integer time;

  private Timestamp createTime;
}
