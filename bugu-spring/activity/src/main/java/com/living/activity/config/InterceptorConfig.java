package com.living.activity.config;

import com.living.activity.interceptor.AdminInterceptor;
import com.living.activity.interceptor.DefendInterceptor;
import com.living.activity.interceptor.RemoveInterceptor;
import com.living.activity.interceptor.UserLoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 拦截器配置
 * @author lizijian
 */
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

  @Value("${spring.profiles.active}")
  private String env;

  @Autowired
  private UserLoginInterceptor userLoginInterceptor;

  @Autowired
  private AdminInterceptor adminInterceptor;

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    //清除threadLocal
    registry.addInterceptor(new RemoveInterceptor()).addPathPatterns("/living/**");
    //判断用户登陆状态
    registry.addInterceptor(userLoginInterceptor).addPathPatterns("/living/**").excludePathPatterns("/living/Manager/**","/living/user/login","/living/user/login/byPassword");
    //判断管理员登陆状态
    registry.addInterceptor(adminInterceptor).addPathPatterns("/living/Manager/**").excludePathPatterns("/living/Manager/login");
    //不是local和test环境的情况下
    if(!"local".equals(env)&&!"test".equals(env)){
      //接口防护拦截器
      registry.addInterceptor(new DefendInterceptor()).addPathPatterns("/living/**");
    }
  }





}
