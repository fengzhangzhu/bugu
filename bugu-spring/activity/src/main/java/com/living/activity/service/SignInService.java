package com.living.activity.service;

import com.living.activity.domain.result.SignInInfoResult;
import com.living.activity.mapper.SignInDao;
import com.living.activity.util.DateUtil;
import com.living.core.exception.NoPermissionException;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class SignInService {

  @Autowired
  private SignInDao signInDao;

  @Autowired
  private UserService userService;

  public SignInInfoResult info(){
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    int myId = UserUtil.getUserId();
    int giftToday = signInDao.getGiftToday(myId, DateUtil.todayBegin(), DateUtil.todayEnd());
    //如果今日获取过礼品
    if(giftToday==1){
      return new SignInInfoResult(7,true,true);
    }
    List<Timestamp> sevenDaysSignInLog = signInDao.getSevenDaysSignInLog(UserUtil.getUserId(),
        DateUtil.sevenDaysAgo());
    Map<String, List<Timestamp>> timeMap = sevenDaysSignInLog.stream()
        .collect(Collectors.groupingBy(
            simpleDateFormat::format));
    timeMap.forEach((key,value)->{
      System.out.println(key);
      System.out.println(value.isEmpty());
    });
    int sum=0;
    for (long i = 1L; i <= 7L ; i++) {
      String format = simpleDateFormat.format(
          new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(7L - i)));
      List<Timestamp> timestamps = timeMap.get(format);
      if(timestamps!=null){
        sum++;
      }else if(i!=7L){
        sum=0;
      }
    }
    return new SignInInfoResult(sum,timeMap.get(simpleDateFormat.format(System.currentTimeMillis()))!=null,false);
  }


  @Transactional(rollbackFor = Exception.class)
  public void getGift() throws NoPermissionException {
    SignInInfoResult info = info();
    int myId = UserUtil.getUserId();
    if(info.isGetGiftToday()){
      throw new NoPermissionException("今日已领取");
    }
    if(info.getSignInDays()<7){
      throw new NoPermissionException("签到时间不足");
    }
    signInDao.addGetGiftLog(myId);
    userService.topUpVip(1,myId);
    signInDao.deleteSignLog(myId);
  }

  public void signIn() throws NoPermissionException {
    int myId = UserUtil.getUserId();
    int todaySignInLog = signInDao.getTodaySignInLog(myId, DateUtil.todayBegin(),
        DateUtil.todayEnd());
    if(todaySignInLog>0){
      throw new NoPermissionException("今日已签到");
    }
    signInDao.addSignLog(myId);
  }
}
