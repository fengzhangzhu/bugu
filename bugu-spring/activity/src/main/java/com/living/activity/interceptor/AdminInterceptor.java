package com.living.activity.interceptor;

import com.auth0.jwt.interfaces.Claim;
import com.living.activity.domain.dao.Admin;
import com.living.activity.exception.MissingParamException;
import com.living.activity.mapper.ManagerDao;
import com.living.activity.util.ManagerUtil;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * @author lizijian
 */
@Component
public class AdminInterceptor extends HandlerInterceptorAdapter {

  @Autowired
  private ManagerDao managerDao;

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    String token = request.getHeader("token");
    if(token==null){
      throw new MissingParamException("miss token");
    }
    Map<String, Claim> claimMap = JwtUtil.verify(token);
    Admin admin = managerDao.getAdmin(claimMap.get("username").asString(),
        claimMap.get("password").asString());
    if(admin==null){
      throw new ResourseNotExistException("管理员不存在");
    }
    ManagerUtil.setUser(admin);
    return true;
  }

}
