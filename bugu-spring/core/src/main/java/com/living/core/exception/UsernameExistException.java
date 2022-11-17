package com.living.core.exception;

/**
 * @author lizijian
 */
public class UsernameExistException extends ResourseExistException{

  public UsernameExistException() {
    super("username exist");
  }

}
