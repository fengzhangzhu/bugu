package com.living.activity.domain.result;

import com.living.activity.domain.dao.AvatarAudit;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class AvatarAuditResult {
  private int id;
  private int userId;
  private String avatar;
  private String createTime;

  public AvatarAuditResult(AvatarAudit avatarAudit) {
    this.id=avatarAudit.getId();
    this.userId=avatarAudit.getUserId();
    this.avatar=new QiNiuAddress(avatarAudit.getAvatar()).toString();
    this.createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(avatarAudit.getCreateTime());
  }
}
