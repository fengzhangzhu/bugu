package com.living.core.config.qiniu;

import com.qiniu.rtc.RtcRoomManager;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Region;
import com.qiniu.util.Auth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * 七牛云对象存储相关配置
 * @author lizijian
 */
@Component
public class QiNiuConfig {

  /**
   * 默认头像文件夹
   */
  public static final String DEFAULT_AVATAR_DIRECTORY="user/default_avatar/";
  /**
   * 对象存储域名
   */
  public static String URL;
  /**
   * 匿名头像
   */
  public static final String ANONYMOUS_AVATAR ="user/anonymous_avatar/anonymous_avatar.png";
  /**
   * 匿名用户名
   */
  public static final String ANONYMOUS_USERNAME ="某只小布咕";

  public static final String ACCESS_KEY ="YOUR_ACCESS_KEY";
  public static final String SECRET_KEY ="YOUR_SECRET_KEY";
  private static final String rtcAppid="YOUR rtcAppid";
  public static String BUCKET;
  public static final Configuration cfg = new Configuration(Region.region0());
  public static Auth auth;
  public static BucketManager bucketManager;

  public static RtcRoomManager rtcRoomManager;

  @Value("${qiniu.url}")
  public void setURL(String URL) {
    QiNiuConfig.URL = URL;
  }

  @Value("${qiniu.bucket}")
  public void setBUCKET(String BUCKET) {
    QiNiuConfig.BUCKET = BUCKET;
  }

  static {
    auth = Auth.create(ACCESS_KEY, SECRET_KEY);
    bucketManager= new BucketManager(QiNiuConfig.auth, QiNiuConfig.cfg);
    rtcRoomManager = new RtcRoomManager(auth);
  }

  public static String getRoomToken(String roomName,String userId) throws Exception {
    String roomToken = rtcRoomManager.getRoomToken(rtcAppid, roomName, userId,
        System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(1), "user");
    return roomToken;
  }

}
