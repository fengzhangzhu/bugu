package com.living.core.decorate;



import com.living.core.domain.dao.UserVerify;
import com.living.core.domain.result.UserInfoResult;
import com.living.core.mapper.VerifyDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserVerifyDecorate {


  private static VerifyDao verifyDao;

  @Autowired
  public  void setVerifyDao(VerifyDao verifyDao) {
    UserVerifyDecorate.verifyDao = verifyDao;
  }

  public static void decorate(UserInfoResult userInfoResult){
    UserVerify userVerify = verifyDao.getVerifyByUserId(userInfoResult.getId());
    if(userVerify!=null&&userVerify.getIsPassed()==1){
      userInfoResult.setIsVerify((short) 1);
    }
  }
}
