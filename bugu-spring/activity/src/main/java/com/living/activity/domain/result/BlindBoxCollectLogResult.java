package com.living.activity.domain.result;

import com.living.activity.domain.dto.BlindBoxCollectLog;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class BlindBoxCollectLogResult {
  private int id;
  private int userId;
  private String text;
  private short sex;
  private String collectTime;

  public BlindBoxCollectLogResult(BlindBoxCollectLog blindBoxCollectLog) {
    id= blindBoxCollectLog.getId();
    userId= blindBoxCollectLog.getUserId();
    text= blindBoxCollectLog.getText();
    sex= blindBoxCollectLog.getSex();
    collectTime=new SimpleDateFormat("yyyy-MM-dd").format(blindBoxCollectLog.getCollectTime());
  }
}
