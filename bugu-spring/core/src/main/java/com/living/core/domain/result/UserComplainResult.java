package com.living.core.domain.result;



import com.living.core.domain.dao.UserComplain;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * 管理系统审核用户举报信息返回
 */
@Data
@ApiModel("用户举报审核信息")
public class UserComplainResult {

  private int id;
  private int informerId;
  private String objectType;
  private int objectId;
  private String reason;
  private String createTime;
  private Integer objectUserId;

  public UserComplainResult(UserComplain userComplain) {
    id = userComplain.getId();
    informerId = userComplain.getInformerId();
    objectType = userComplain.getObjectType();
    objectId = userComplain.getObjectId();
    reason = userComplain.getReason();
    createTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(userComplain.getCreateTime());
  }
}
