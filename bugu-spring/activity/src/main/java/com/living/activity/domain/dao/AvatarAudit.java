package com.living.activity.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

/**
 * <p>
 *     头像审核
 * </p>
 * @author lizijian
 */
@Data
public class AvatarAudit {
  private int id;
  private int userId;
  private String avatar;
  private Timestamp createTime;
}
