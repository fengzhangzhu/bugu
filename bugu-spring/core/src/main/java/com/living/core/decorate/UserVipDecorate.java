package com.living.core.decorate;


import com.living.core.domain.result.UserInfoResult;
import com.living.core.domain.result.VipInfoResult;
import com.living.core.mapper.UserDao;
import com.living.core.mapper.VipInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserVipDecorate {


  private static UserDao userDao;

  @Autowired
  public void setUserDao(UserDao userDao) {
    UserVipDecorate.userDao = userDao;
  }

  /**
   * 增加vip信息
   * @param userInfoResult
   */
  public static void decorate(UserInfoResult userInfoResult){
    VipInfo vipInfo = userDao.getVipInfoByUserId(userInfoResult.getId());
    if(vipInfo!=null){
      userInfoResult.setVip(new VipInfoResult(vipInfo));
    }
  }

}
