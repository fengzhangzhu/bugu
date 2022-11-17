package com.living.activity.interceptor;

import com.auth0.jwt.interfaces.Claim;
import com.living.activity.exception.MissingParamException;
import com.living.core.domain.dao.User;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.mapper.UserDao;
import com.living.core.util.JwtUtil;
import com.living.core.util.LogUtil;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 用户登陆状态拦截器
 * @author lizijian
 */
@Component
@Slf4j
public class UserLoginInterceptor extends HandlerInterceptorAdapter {

  @Autowired
  private UserDao userDao;

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
    String token = request.getHeader("token");
    log.info(LogUtil.getMessage("token:"+token));
    if(token==null){
      throw new MissingParamException("miss token");
    }
    Map<String, Claim> claimMap = JwtUtil.verify(token);
    Integer id = claimMap.get("id").asInt();
    User user = userDao.getUserById(id);
    if(user==null){
      throw new ResourseNotExistException("用户不存在");
    }
    UserUtil.setUser(user);
    return true;
  }

}
