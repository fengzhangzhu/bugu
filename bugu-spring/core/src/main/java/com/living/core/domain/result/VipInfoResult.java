package com.living.core.domain.result;


import com.living.core.mapper.VipInfo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
@ApiModel("用户vip信息")
public class VipInfoResult {
  @ApiModelProperty("截止日期")
  private String deadline;
  @ApiModelProperty(value = "剩余天数，如果是负数则为过期天数")
  private long remainDays;

  public VipInfoResult(VipInfo vipInfo) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    this.deadline=simpleDateFormat.format(vipInfo.getDeadline());
    long now=System.currentTimeMillis();
    long deadline=vipInfo.getDeadline().getTime();
    if(now<deadline){
      this.remainDays=(deadline-now)/(3600*24*1000)+1;
    }else {
      this.remainDays=(deadline-now)/(3600*24*1000)-1;
    }
  }
}
