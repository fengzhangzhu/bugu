package com.living.core.domain.result;



import com.living.core.domain.dao.UserPunish;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class UserPunishResult {
  private String type;
  private String endTime;

  public UserPunishResult(UserPunish punish) {
    type= punish.getType();
    endTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(punish.getEndTime());
  }
}
