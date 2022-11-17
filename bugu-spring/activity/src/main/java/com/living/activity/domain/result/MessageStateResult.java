package com.living.activity.domain.result;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@ApiModel("消息已读未读状态")
public class MessageStateResult {
  private int messageId;
  @ApiModelProperty("ture代表未读")
  private boolean unread;
}
