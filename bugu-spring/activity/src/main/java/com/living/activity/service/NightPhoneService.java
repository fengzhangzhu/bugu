package com.living.activity.service;

import com.living.activity.domain.dto.NightPhoneMatchUser;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.User;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
public class NightPhoneService {


  private static final ConcurrentLinkedQueue<NightPhoneMatchUser> matchUserQueue = new ConcurrentLinkedQueue<>();


  private NightPhoneMatchUser getMatchUserById(int userId){
    for (NightPhoneMatchUser nightPhoneMatchUser : matchUserQueue) {
      if (nightPhoneMatchUser.getUserId() == userId) {
        return nightPhoneMatchUser;
      }
    }
    return null;
  }

  private String findUser(short sex,int myId){
    //如果自己已被匹配到
    NightPhoneMatchUser my = getMatchUserById(myId);
    if(my==null){
      return null;
    }
    if(my.getMatchUserId()!=null) {
      //移除自己
      matchUserQueue.remove(my);
      //返回匹配目标id
      log.info(my.getUserId()+"匹配到"+my.getMatchUserId()+"房间号-"+my.getRoomId());
      return my.getRoomId();
    }
    for (NightPhoneMatchUser nightPhoneMatchUser : matchUserQueue) {
      if(nightPhoneMatchUser.getLastPingTime()>System.currentTimeMillis()+10){
        matchUserQueue.remove(nightPhoneMatchUser);
      }else if(sex == nightPhoneMatchUser.getSex()&&nightPhoneMatchUser.getMatchUserId()==null){
        //将对方匹配用户设置成自己
        nightPhoneMatchUser.setMatchUserId(myId);
        String roomId = UUID.randomUUID().toString();
        nightPhoneMatchUser.setRoomId(roomId);
        //移除自己
        matchUserQueue.remove(my);
        //返回房间号
        log.info(my.getUserId()+"匹配到"+nightPhoneMatchUser.getUserId()+"房间号-"+roomId);
        System.out.println();
        return roomId;
        }
      }
    return null;
  }

  public synchronized String match() throws Exception {
    User my = UserUtil.getUser();
    NightPhoneMatchUser nightPhoneMatchUser = getMatchUserById(my.getId());
    if(nightPhoneMatchUser==null){
      matchUserQueue.add(new NightPhoneMatchUser(my.getId(),my.getSex()));
    }else {
      nightPhoneMatchUser.setLastPingTime(System.currentTimeMillis());
    }
    String roomId = null;
    if(my.getSex()==0){
      roomId = findUser((short) 1,my.getId());
    }else {
      roomId = findUser((short) 0,my.getId());
    }
    if(roomId==null){
      return null;
    }
    return QiNiuConfig.getRoomToken(roomId,"id"+my.getId());
  }

//  public static void main(String[] args) {
//    NightPhoneService nightPhoneService = new NightPhoneService();
//    for(int i=1;i<=100;i++){
//      int finalI = i;
//      new Thread(()->{
//        while (true){
//          User user = new User("", "", "");
//          user.setId(finalI);
//          if(finalI%2==0){
//            user.setSex((short)0);
//          }else {
//            user.setSex((short)1);
//          }
//          String match = nightPhoneService.match(user);
//          if(match!=null){
//            break;
//          }
//          try {
//            Thread.sleep(5000);
//          } catch (InterruptedException e) {
//            e.printStackTrace();
//          }
//        }
//      }).start();
//    }
//    try {
//      Thread.sleep(6000);
//    } catch (InterruptedException e) {
//      e.printStackTrace();
//    }
//    System.out.println(matchUserQueue.size());
//  }


}
