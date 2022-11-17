package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserPunish {
  private int id;
  private int userId;
  private String type;
  private short isDeleted;
  private Timestamp endTime;
  private Timestamp createTime;
}
