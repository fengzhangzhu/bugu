package com.living.core.domain.dto;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class FansUser {
  private int id;
  private String username;
  private String avatar;
  private short mutual;
}
