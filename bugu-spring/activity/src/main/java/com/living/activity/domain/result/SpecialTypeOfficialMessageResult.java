package com.living.activity.domain.result;

import com.living.core.domain.dto.SpecialTypeOfficialMessage;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class SpecialTypeOfficialMessageResult {
  private String text;
  private String pic;
  private String createTime;

  public SpecialTypeOfficialMessageResult(SpecialTypeOfficialMessage specialTypeOfficialMessage) {
    text= specialTypeOfficialMessage.getText();
    pic=new QiNiuAddress(specialTypeOfficialMessage.getPic()).toString();
    createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(specialTypeOfficialMessage.getCreateTime());
  }
}
