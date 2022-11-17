package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserComplain {
  private int id;
  private int informerId;
  private String objectType;
  private int objectId;
  private String reason;
  private Timestamp createTime;
}
