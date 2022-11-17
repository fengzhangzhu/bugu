package com.living.activity.util;

import com.living.activity.domain.dao.Admin;

/**
 * 保持当前线程管理员信息
 * @author lizijian
 */
public class ManagerUtil {
  
  private static final ThreadLocal<Admin> MANAGER_THREAD_LOCAL =new ThreadLocal<>();

  public static void setUser(Admin user){
    MANAGER_THREAD_LOCAL.set(user);
  }

  public static int getUserId(){
    Admin admin = MANAGER_THREAD_LOCAL.get();
    if(admin==null){
      return 0;
    }
    return admin.getId();
  }


  public static Admin getUser(){
    return MANAGER_THREAD_LOCAL.get();
  }

  public static void removeUser(){
    MANAGER_THREAD_LOCAL.remove();
  }

}
