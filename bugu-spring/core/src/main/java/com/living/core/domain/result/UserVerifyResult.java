package com.living.core.domain.result;



import com.living.core.domain.dao.UserVerify;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * 管理员审核用户实名认证列表返回
 */
@Data
public class UserVerifyResult {
  private int id;
  private short sex;
  private int userId;
  private String stuId;
  private String pic;
  private String createTime;

  public UserVerifyResult(UserVerify userVerify) {
    id= userVerify.getId();
    sex= userVerify.getSex();
    stuId= userVerify.getStuId();
    userId = userVerify.getUserId();
    pic=new QiNiuAddress(userVerify.getPic()).toString();
    createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(userVerify.getCreateTime());
  }
}
