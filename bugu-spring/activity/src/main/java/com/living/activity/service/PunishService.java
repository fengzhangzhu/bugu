package com.living.activity.service;

import com.living.activity.mapper.PunishDao;
import com.living.core.domain.dao.UserPunish;
import com.living.core.domain.result.UserPunishResult;
import com.living.core.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PunishService {


  @Autowired
  private PunishDao punishDao;

  public UserPunishResult getPunishType(){
    UserPunish userPunish = punishDao.getUserPunish(UserUtil.getUserId());
    if(userPunish==null){
      return null;
    }
    return new UserPunishResult(userPunish);
  }
}
