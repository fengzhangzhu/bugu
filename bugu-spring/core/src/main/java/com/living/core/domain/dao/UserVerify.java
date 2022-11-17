package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserVerify {
  private int id;
  private int userId;
  private String stuId;
  private String pic;
  private short isPassed;
  private short sex;
  private Timestamp createTime;
}
