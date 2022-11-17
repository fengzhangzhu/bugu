package com.living.core.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class OfficeMessage {
  private Integer id;
  private String text;
  private String pic;
  private String type;
  private Timestamp createTime;

  public static OfficeMessage create(String text,String pic,String type){
    OfficeMessage officeMessage = new OfficeMessage();
    officeMessage.setText(text);
    officeMessage.setPic(pic);
    officeMessage.setType(type);
    return officeMessage;
  }
}
