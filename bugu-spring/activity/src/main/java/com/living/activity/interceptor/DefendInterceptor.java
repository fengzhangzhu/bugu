package com.living.activity.interceptor;

import com.living.activity.exception.InvaildRequetException;
import com.living.core.util.LogUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author lizijian
 */
@Slf4j
public class DefendInterceptor extends HandlerInterceptorAdapter {

  private static final String SECRET_KEY ="YOUR_SECRET_KEY";

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    if("OPTIONS".equals(request.getMethod())){
      response.setStatus(HttpServletResponse.SC_OK);
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Access-Control-Allow-Headers", "*");
      response.setHeader("Access-Control-Allow-Methods","*");
      return true;
    }
    String timestamp = request.getHeader("t");
    String sign = request.getHeader("s");
    String random = request.getHeader("r");
    if(timestamp==null||sign==null||random==null){
      throw new InvaildRequetException();
    }

    if(!sign.equals(DigestUtils.md5Hex(timestamp+random+SECRET_KEY))){
      throw new InvaildRequetException();
    }
    if(System.currentTimeMillis()-Long.parseLong(timestamp)>60000){
      throw new InvaildRequetException("请求超时");
    }

    log.info(LogUtil.getMessage(request.getHeader("x-forwarded-for")));
    return true;
  }

  public static void main(String[] args) {
    String timestamp=String.valueOf(System.currentTimeMillis()+100000000);
    String random="123456";
    String sign=DigestUtils.md5Hex(timestamp+random+SECRET_KEY);
    System.out.println(timestamp);
    System.out.println(random);
    System.out.println(sign);
  }

}
