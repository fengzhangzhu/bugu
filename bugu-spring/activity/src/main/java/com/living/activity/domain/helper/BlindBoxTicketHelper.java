package com.living.activity.domain.helper;

import com.living.activity.domain.dao.BlindBoxTicket;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class BlindBoxTicketHelper {
  private long id;
  private short isUsed;
  private String createTime;

  public BlindBoxTicketHelper(BlindBoxTicket blindBoxTicket) {
    id= blindBoxTicket.getId();
    isUsed= blindBoxTicket.getIsUsed();
    createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(blindBoxTicket.getCreateTime());
  }
}
