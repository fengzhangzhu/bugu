package com.living.core.mapper;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class Visitor {
  private int visitorId;
  private int visitSum;
  private String avatar;
  private Timestamp lastTime;
}
