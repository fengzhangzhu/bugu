package com.living.core.domain.result;


import com.living.core.domain.dto.FansUser;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class FansUserResult {
  private int id;
  private String username;
  private String avatar;
  private short mutual;
  public FansUserResult(FansUser user) {
    this.id= user.getId();
    this.username=user.getUsername();
    this.avatar=new QiNiuAddress(user.getAvatar()).toString();
    this.mutual=user.getMutual();
  }
}
