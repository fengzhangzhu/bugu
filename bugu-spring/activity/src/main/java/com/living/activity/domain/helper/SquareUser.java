package com.living.activity.domain.helper;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@ApiModel("广场用户信息")
public class SquareUser {
  private int id;
  private String username;
  private String avatar;
  private short isAttention;
  private short isVerify;
  private Short sex;
  private short isVip;
}
