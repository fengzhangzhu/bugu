package com.living.core.service;

import com.alibaba.fastjson.JSONObject;
import com.google.gson.Gson;

import com.living.core.config.WeiXinConfig;
import com.living.core.domain.receive.weixin.AccessToken;
import com.living.core.domain.receive.weixin.ContentCheckResponse;
import com.living.core.exception.WeiXinException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * 内容审核服务
 */
@Service
@Slf4j
public class WeiXinCheckService {

  @Autowired
  private Gson gson;

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  protected OfficialMessageService officialMessageService;




  private static volatile String TOKEN;

  private static volatile long TOKEN_EXPIRE_TIME;

  private static final String TOKEN_URL="https://api.weixin.qq.com/cgi-bin/token?grant_type={grant_type}&appid={appid}&secret={secret}";

  private static final String TEXT_URL="https://api.weixin.qq.com/wxa/msg_sec_check?access_token=";




  public String getToken() throws WeiXinException {
    if(TOKEN==null||TOKEN_EXPIRE_TIME<System.currentTimeMillis()){
      synchronized (WeiXinCheckService.class){
        if(TOKEN==null||TOKEN_EXPIRE_TIME<System.currentTimeMillis()){
          log.info("token 已过期,重新获取");
          Map<String,String> data=new HashMap<>(8);
          data.put("grant_type","client_credential");
          data.put("appid", WeiXinConfig.APP_ID);
          data.put("secret",WeiXinConfig.SECRET);
          ResponseEntity<AccessToken> entity = restTemplate.getForEntity(TOKEN_URL, AccessToken.class, data);
          log.info("token response:"+entity.getBody());
          if(entity.getBody()==null){
            throw new WeiXinException();
          }
          WeiXinCheckService.TOKEN=entity.getBody().getAccess_token();
          WeiXinCheckService.TOKEN_EXPIRE_TIME=System.currentTimeMillis()+7000*1000;
          return entity.getBody().getAccess_token();
        }else {
          return TOKEN;
        }
      }
    }else {
      return TOKEN;
    }
  }

  /**
   * 获取微信审核结果
   * @param content
   * @param openId
   * @return
   * @throws WeiXinException
   * @throws IOException
   */
  protected ContentCheckResponse getCheckResult(String content, String openId) throws WeiXinException, IOException {
    CloseableHttpClient httpClient = HttpClientBuilder.create().build();
    HttpPost httpPost = new HttpPost(TEXT_URL+getToken());
    httpPost.setHeader("Content-Type", "application/json;charset=UTF-8");
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("content",content);
    jsonObject.put("version","2");
    jsonObject.put("openid",openId);
    jsonObject.put("scene","3");
    httpPost.setEntity(new StringEntity(jsonObject.toString(),StandardCharsets.UTF_8));
    CloseableHttpResponse response = httpClient.execute(httpPost);
    ContentCheckResponse contentCheckResponse = gson.fromJson(
        EntityUtils.toString(response.getEntity()), ContentCheckResponse.class);
    log.info("contentCheckResponse:"+contentCheckResponse);
    return contentCheckResponse;
  }






}
