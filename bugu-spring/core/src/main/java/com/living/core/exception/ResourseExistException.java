package com.living.core.exception;

public class ResourseExistException extends Exception{

  public ResourseExistException() {
    super("资源已存在");
  }

  public ResourseExistException(String message) {
    super(message);
  }
}
