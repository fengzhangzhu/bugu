package com.living.core.domain.result;


import com.living.core.domain.dto.AttentionUser;
import com.living.core.domain.helper.QiNiuAddress;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@ApiModel("关注用户列表")
public class AttentionUserResult {
  private int id;
  private String username;
  private String avatar;
  @ApiModelProperty("相互关注")
  private short mutual;
  public AttentionUserResult(AttentionUser user) {
    this.id= user.getId();
    this.username=user.getUsername();
    this.avatar=new QiNiuAddress(user.getAvatar()).toString();
    this.mutual= user.getMutual();
  }
}
