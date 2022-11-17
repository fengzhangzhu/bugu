package com.living.core.util;


import com.living.core.domain.dao.User;

/**
 * 保持当前线程用户信息
 * @author lizijian
 */
public class UserUtil {
  
  private static final ThreadLocal<User> USER_THREAD_LOCAL=new ThreadLocal<>();

  public static void setUser(User user){
    USER_THREAD_LOCAL.set(user);
  }

  public static int getUserId(){
    User user = USER_THREAD_LOCAL.get();
    if(user==null){
      return 0;
    }
    return user.getId();
  }

  public static User getUser(){
    return USER_THREAD_LOCAL.get();
  }

  public static void removeUser(){
    USER_THREAD_LOCAL.remove();
  }

}
