package com.living.activity.domain.receive;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * @author lizijian
 */
@Data
@ApiModel("发送消息服务端接收参数")
public class ReceiveMessage {
  @ApiModelProperty("内容(长度小于255)")
  @NotBlank @Length(max = 255)
  private String content;
  @ApiModelProperty("目标用户id")
  @NotNull @Min(1)
  private Integer toUserId;
  @ApiModelProperty("消息类型,0代表文字类型,1代表图片类型,2代表语音类型")
  @NotNull @Min(0)
  private Short type;
  @ApiModelProperty("语音消息时长,如果消息类型不为语音,该字段为空")
  private Integer time;
}
