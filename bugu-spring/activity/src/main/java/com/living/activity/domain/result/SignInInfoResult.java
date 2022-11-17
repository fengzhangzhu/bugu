package com.living.activity.domain.result;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@ApiModel("签到信息")
@AllArgsConstructor
public class SignInInfoResult {

  @ApiModelProperty("连续签到天数")
  private int signInDays;
  @ApiModelProperty("今日是否签到")
  private boolean signInToday;
  @ApiModelProperty("今日是否获取礼物")
  private boolean getGiftToday;

}
