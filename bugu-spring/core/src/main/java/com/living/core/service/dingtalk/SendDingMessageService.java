package com.living.core.service.dingtalk;



import com.living.core.domain.send.DingMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author lizijian
 */
@Slf4j
@Component
public class SendDingMessageService {

  /**
   * 实名认证
   */
  private static final String VERIFY_DING_URL ="https://oapi.dingtalk.com/robot/send?access_token=d832f5c5fc1feb8feaecb114302f66c532a8b3abf98c6780be17d8f4065e5f25";

  /**
   * 内容审核
   */
  private static final String CONTENT_AUDIT="https://oapi.dingtalk.com/robot/send?access_token=c143b98473ca34b75413a5e5988bc7820ee02225e4bdee35cbb31bd7a52b04cc";

  /**
   * 接口异常
   */
  private static final String ERROR_URL="https://oapi.dingtalk.com/robot/send?access_token=87e70442ded9a527d1d06bb889b4c54db6478813be8a178724d6aa3534f08a21";


  private static String environment;

  @Value("${spring.profiles.active}")
  public  void setEnvironment(String environment) {
    SendDingMessageService.environment = environment;
  }

  /**
   * 发送认证通知
   */
  public static void sendVerifyMessage(DingMessage message){
    try {
      message.setText(environment+"-认证通知:"+message.getText());
      HttpClient httpclient = HttpClients.createDefault();
      HttpPost httppost = new HttpPost(VERIFY_DING_URL);
      httppost.addHeader("Content-Type", "application/json; charset=utf-8");
      StringEntity se = new StringEntity(message.toJsonString(), "utf-8");
      httppost.setEntity(se);
      HttpResponse response = httpclient.execute(httppost);
      log.info("DingResponse:" + EntityUtils.toString(response.getEntity()));
    }catch (Exception e){
      log.error("发送钉钉通知失败");
      log.info("errorMessage:"+e.getMessage());
    }
  }

  /**
   * 发送内容审核通知
   */
  public static void sendContentAuditMessage(DingMessage message){
    try {
      message.setText(environment+"-内容审核通知:"+message.getText());
      HttpClient httpclient = HttpClients.createDefault();
      HttpPost httppost = new HttpPost(CONTENT_AUDIT);
      httppost.addHeader("Content-Type", "application/json; charset=utf-8");
      StringEntity se = new StringEntity(message.toJsonString(), "utf-8");
      httppost.setEntity(se);
      HttpResponse response = httpclient.execute(httppost);
      log.info("DingResponse:" + EntityUtils.toString(response.getEntity()));
    }catch (Exception e){
      log.error("发送钉钉通知失败");
      log.info("errorMessage:"+e.getMessage());
    }
  }

  /**
   * 发送异常通知
   */
  public static void sendApiErrorMessage(DingMessage message){
    try {
      message.setText(environment+"-异常通知:"+message.getText());
      HttpClient httpclient = HttpClients.createDefault();
      HttpPost httppost = new HttpPost(ERROR_URL);
      httppost.addHeader("Content-Type", "application/json; charset=utf-8");
      StringEntity se = new StringEntity(message.toJsonString(), "utf-8");
      httppost.setEntity(se);
      HttpResponse response = httpclient.execute(httppost);
      log.info("DingResponse:" + EntityUtils.toString(response.getEntity()));
    }catch (Exception e){
      log.error("发送钉钉通知失败");
      log.info("errorMessage:"+e.getMessage());
    }
  }

}
