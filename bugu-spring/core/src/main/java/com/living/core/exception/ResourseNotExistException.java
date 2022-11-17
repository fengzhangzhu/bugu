package com.living.core.exception;

public class ResourseNotExistException extends Exception{

  public ResourseNotExistException() {
    super("资源不存在");
  }

  public ResourseNotExistException(String message) {
    super(message);
  }
}
