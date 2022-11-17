package com.living.core.domain.receive.weixin;


import com.living.core.domain.receive.weixin.helper.Result;
import lombok.Data;

/**
 * 微信内容审核返回
 */
@Data
public class ContentCheckResponse {
  private String errcode;
  private String errmsg;
  private Result result;
}
