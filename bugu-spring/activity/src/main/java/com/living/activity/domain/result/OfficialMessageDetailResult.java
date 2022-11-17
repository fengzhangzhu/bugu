package com.living.activity.domain.result;

import com.living.core.domain.dao.OfficeMessageObject;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class OfficialMessageDetailResult {
  private int id;
  private int userId;
  private int isRead;
  private String updateTime;
  private String createTime;

  public OfficialMessageDetailResult(OfficeMessageObject officeMessageObject) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    this.id=officeMessageObject.getId();
    this.userId=officeMessageObject.getUserId();
    this.isRead=officeMessageObject.getIsRead();
    this.updateTime=simpleDateFormat.format(officeMessageObject.getUpdateTime());
    this.createTime=simpleDateFormat.format(officeMessageObject.getCreateTime());
  }
}
