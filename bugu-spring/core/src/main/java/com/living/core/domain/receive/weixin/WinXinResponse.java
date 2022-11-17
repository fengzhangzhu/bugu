package com.living.core.domain.receive.weixin;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class WinXinResponse {
  private String openid;
  private String session_key;
  private String unionid;
  private String errcode;
  private String errmsg;
}
