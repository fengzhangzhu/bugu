package com.living.core.decorate;



import com.living.core.domain.result.UserInfoResult;
import com.living.core.mapper.AttentionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserAttentionDecorate {

  private static AttentionDao attentionDao;

  @Autowired
  public  void setAttentionDao(AttentionDao attentionDao) {
    UserAttentionDecorate.attentionDao = attentionDao;
  }

  /**
   * 如果不是本人信息,增加是否关注字段
   * @param userInfoResult
   */
  public static void decorate(UserInfoResult userInfoResult, int myId){
    if(userInfoResult.getId()!=myId){
      userInfoResult.setIsAttention(attentionDao.getIsAttention(userInfoResult.getId(),myId));
    }
  }
}
