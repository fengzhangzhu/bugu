package com.living.core.websocket;

import com.google.gson.Gson;
import com.living.core.domain.send.SendMessage;
import com.living.core.config.redis.RedisKey;
import com.living.core.util.JwtUtil;
import com.living.core.util.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author lizijian
 */
@ServerEndpoint(value = "/webSocketServer/{token}")
@Component
@Slf4j
public class WebSocket {

  private static final ConcurrentHashMap<Integer, Session> USERID_SESSION=new ConcurrentHashMap<>(216);


  private static final ConcurrentHashMap<Session,Integer> SESSION_USERID=new ConcurrentHashMap<>(216);


  private static final AtomicInteger onlineSum=new AtomicInteger(0);

  /**
   * 最大同时在线人数
   */
  public static volatile int maxNum = 0;

  public static int getOnlineSum(){
    return onlineSum.get();
  }

  /**
   * 连接建立成功调用的方法
   */
  @OnOpen
  public void onOpen(Session session, @PathParam("token") String token) throws Exception {
    long begin = System.nanoTime();
    int userId = JwtUtil.verify(token).get("id").asInt();
    log.info("userId=" + userId);
    if(USERID_SESSION.get(userId)!=null){
      throw new Exception("不能重复连接");
    }
    USERID_SESSION.put(userId,session);
    SESSION_USERID.put(session,userId);
    log.info("online.size=" + onlineSum.incrementAndGet());
    int nowSum = onlineSum.get();
    if(nowSum>maxNum){
      maxNum = nowSum;
    }
    try{
      RedisUtil.stringRedisTemplate.opsForValue().set(RedisKey.ONLINE+userId,"",2,TimeUnit.MINUTES);
    }catch (Exception e){
      e.printStackTrace();
    }
    long end = System.nanoTime();
    long time = end-begin;
    log.info("连接建立时间:"+TimeUnit.NANOSECONDS.toMillis(time));
  }

  /**
   * 连接关闭调用的方法
   */
  @OnClose
  public void onClose(Session session) {
    long begin = System.nanoTime();
    Integer userId = SESSION_USERID.get(session);
    USERID_SESSION.remove(userId);
    SESSION_USERID.remove(session);
    log.info("有连接关闭，当前连接数为：{}", onlineSum.decrementAndGet());
    long end = System.nanoTime();
    long time = end-begin;
    log.info("连接关闭时间:"+TimeUnit.NANOSECONDS.toMillis(time));
  }

  /**
   * 收到客户端消息后调用的方法
   *
   * @param message 客户端发送过来的消息
   */
  @OnMessage
  public void onMessage(String message, Session session) {
    log.info("来自客户端的消息：{}", message);
    RedisUtil.stringRedisTemplate.opsForValue().set(RedisKey.ONLINE+getUserIdBySession(session),"",2,TimeUnit.MINUTES);
  }

  /**
   * 出现错误
   *
   * @param session
   * @param error
   */
  @OnError
  public void onError(Session session, Throwable error) {
    log.error(error.getClass().getName());
    log.error(error.getLocalizedMessage());
    log.error("发生错误：{}，Session ID： {}", error.getMessage(), session.getId());
    log.error(Arrays.toString(error.getStackTrace()));
  }

  private int getUserIdBySession(Session session){
    Integer userId = SESSION_USERID.get(session);
    log.info("getUserIdBySession.userid:"+userId);
    return userId;
  }


  public static boolean sendMessage(int toUserId, SendMessage<?> sendMessage){
    Session session = getSessionByUserId(toUserId);
    if(session==null){
      return false;
    }
    try{
      session.getBasicRemote()
          .sendText(new Gson().toJson(sendMessage));
    }catch (IOException e){
      log.error("消息发送失败");
      log.error(e.getMessage());
      return false;
    }
    return true;
  }

  public static Session getSessionByUserId(int userId){
    Session session = USERID_SESSION.get(userId);
    if(session!=null){
      log.info(userId+"号用户在线");
      return session;
    }
    log.info(userId+"号用户不在线");
    return null;
  }
}
