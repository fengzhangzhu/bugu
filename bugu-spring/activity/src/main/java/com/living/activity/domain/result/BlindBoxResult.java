package com.living.activity.domain.result;

import com.living.activity.domain.dao.BlindBox;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class BlindBoxResult {
  private long id;
  private long userId;
  private String text;
  private short sex;
  private String createTime;

  public BlindBoxResult(BlindBox box) {
    id= box.getId();
    userId=box.getUserId();
    text= box.getText();
    sex=box.getSex();
    createTime=new SimpleDateFormat("yyyy-MM-dd").format(box.getCreateTime());
  }
}
