package com.living.activity.service;

import com.living.activity.domain.dto.RandomChatMatchUser;
import com.living.core.domain.dao.User;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
public class RandomChatService {


  private static final ConcurrentLinkedQueue<RandomChatMatchUser> matchUserQueue = new ConcurrentLinkedQueue<>();


  private RandomChatMatchUser getMatchUserById(int userId){
    for (RandomChatMatchUser randomChatMatchUser : matchUserQueue) {
      if (randomChatMatchUser.getUserId() == userId) {
        return randomChatMatchUser;
      }
    }
    return null;
  }

  private Integer findUser(short sex,int myId){
    //如果自己已被匹配到
    RandomChatMatchUser my = getMatchUserById(myId);
    if(my==null){
      return null;
    }
    if(my.getMatchUserId()!=null) {
      //移除自己
      matchUserQueue.remove(my);
      //返回匹配目标id
      log.info(my.getUserId()+"匹配到"+my.getMatchUserId());
      return my.getMatchUserId();
    }
    for (RandomChatMatchUser randomChatMatchUser : matchUserQueue) {
      if(randomChatMatchUser.getLastPingTime()>System.currentTimeMillis()+10){
        matchUserQueue.remove(randomChatMatchUser);
      }else if(sex == randomChatMatchUser.getSex()&&randomChatMatchUser.getMatchUserId()==null){
        //将对方匹配用户设置成自己
        randomChatMatchUser.setMatchUserId(myId);
        //移除自己
        matchUserQueue.remove(my);
        //返回房间号
        log.info(my.getUserId()+"匹配到"+randomChatMatchUser.getUserId());
        return randomChatMatchUser.getUserId();
      }
    }
    return null;
  }

  public synchronized Integer match(){
    User my = UserUtil.getUser();
    RandomChatMatchUser randomChatMatchUser = getMatchUserById(my.getId());
    if(randomChatMatchUser==null){
      matchUserQueue.add(new RandomChatMatchUser(my.getId(),my.getSex()));
    }else {
      randomChatMatchUser.setLastPingTime(System.currentTimeMillis());
    }
    Integer matchUserId = null;
    if(my.getSex()==0){
      matchUserId = findUser((short) 1,my.getId());
    }else {
      matchUserId = findUser((short) 0,my.getId());
    }
    return matchUserId;
  }

}
