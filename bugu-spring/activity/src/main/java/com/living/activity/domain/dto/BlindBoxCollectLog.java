package com.living.activity.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class BlindBoxCollectLog {
  private int id;
  private int userId;
  private String text;
  private short sex;
  private Timestamp collectTime;
}
