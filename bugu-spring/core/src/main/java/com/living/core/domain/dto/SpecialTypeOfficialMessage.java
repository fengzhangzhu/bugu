package com.living.core.domain.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class SpecialTypeOfficialMessage {
  private int id;
  private String text;
  private String pic;
  private Timestamp createTime;
}
