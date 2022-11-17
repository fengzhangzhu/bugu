package com.living.core.util;



import com.living.core.config.redis.RedisKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * @author lizijian
 */
@Component
public class RedisUtil {


  public static RedisTemplate<String,String> stringRedisTemplate;

  @Autowired
  public void setStringRedisTemplate(
      StringRedisTemplate stringRedisTemplate) {
    RedisUtil.stringRedisTemplate = stringRedisTemplate;
  }

  /**
   * 获取指定id用户在线状态
   * @param userId
   * @return
   */
  public static boolean getOnlineState(int userId){
    return stringRedisTemplate.opsForValue().get(RedisKey.ONLINE+userId)!=null;
  }
}
