package com.living.activity.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class BlindBoxTicket {
  private long id;
  private long userId;
  private short isUsed;
  private Timestamp createTime;
}
