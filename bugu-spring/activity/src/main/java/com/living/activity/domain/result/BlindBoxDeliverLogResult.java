package com.living.activity.domain.result;

import com.living.activity.domain.dao.BlindBox;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class BlindBoxDeliverLogResult {
  private long id;
  private String text;
  private short sex;
  private short isDeleted;
  private short isCollected;
  private String createTime;

  public BlindBoxDeliverLogResult(BlindBox box) {
    id= box.getId();
    text= box.getText();
    sex= box.getSex();
    isDeleted= box.getIsDeleted();
    isCollected= box.getIsCollected();
    createTime=new SimpleDateFormat("yyyy-MM-dd").format(box.getCreateTime());
  }
}
