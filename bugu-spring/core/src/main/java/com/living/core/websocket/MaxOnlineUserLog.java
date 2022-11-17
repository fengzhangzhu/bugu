package com.living.core.websocket;


import com.living.core.mapper.MaxOnlineDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;

@Component
public class MaxOnlineUserLog {

  @Autowired
  private MaxOnlineDao maxOnlineDao;

  @PreDestroy
  public void logMaxOnlineUserSum(){
    maxOnlineDao.logMaxOnline(WebSocket.maxNum);
  }
}
