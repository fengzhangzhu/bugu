package com.living.activity.service;

import com.living.activity.mapper.ActivityDao;
import com.living.activity.mapper.WelfareDao;
import com.living.core.exception.NoPermissionException;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WelfareService {


  @Autowired
  private WelfareDao welfareDao;

  @Autowired
  private ActivityDao activityDao;

  @Autowired
  private UserService userService;

  @Transactional(rollbackFor = Exception.class)
  public void getOneMonthVip() throws NoPermissionException {
    int myId = UserUtil.getUserId();
    Integer userId = welfareDao.getVipGetLogByUserId(myId);
    if (userId != null) {
      throw new NoPermissionException("您已领取过,不可再领取");
    }
    userService.topUpVip(1,myId);
    welfareDao.addVipGetLog(myId);
  }

  @Transactional(rollbackFor = Exception.class)
  public void getByActivitySum() throws NoPermissionException {
    int myId = UserUtil.getUserId();
    Integer giftLog = welfareDao.getActivitySumGiftLog(myId);
    if(giftLog!=null){
      throw new NoPermissionException("您已领取过");
    }
    int activitySum = activityDao.getActivitySumByUserId(myId);
    if(activitySum<5){
      throw new NoPermissionException("发布的动态不足5条");
    }
    welfareDao.addGetActivitySumGistLog(myId);
    userService.topUpVip(1,myId);
  }
}
