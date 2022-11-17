package com.living.core.exception;


/**
 * @author lizijian
 */
public class UsernameOrPasswordErrorException extends Exception{

  public UsernameOrPasswordErrorException() {
    super("用户名或密码错误");
  }

  public UsernameOrPasswordErrorException(String message) {
    super(message);
  }
}
