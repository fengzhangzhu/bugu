package com.living.activity.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class BlindBox {
  private long id;
  private long userId;
  private String text;
  private short sex;
  private short isDeleted;
  private short isCollected;
  private Timestamp createTime;
}
