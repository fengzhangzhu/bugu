package com.living.core.domain.result;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@AllArgsConstructor
public class UserLoginResult {
  private String token;
  private UserInfoResult userInfo;
}
