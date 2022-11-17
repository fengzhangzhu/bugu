package com.living.activity.domain.helper;

import com.google.gson.Gson;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.OfficeMessage;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Data
public class OfficialMessageHelper {
  private Integer id;
  private String text;
  private List<String> pic;
  private String createTime;

  public OfficialMessageHelper(OfficeMessage officeMessage) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    this.id=officeMessage.getId();
    this.text=officeMessage.getText();
    if(officeMessage.getPic()!=null){
      this.pic= Arrays.stream(new Gson().fromJson(officeMessage.getPic(),String[].class)).map(p-> QiNiuConfig.URL+p).collect(
          Collectors.toList());
    }
    this.createTime=simpleDateFormat.format(officeMessage.getCreateTime());
  }
}
