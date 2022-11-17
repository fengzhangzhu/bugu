package com.living.activity.exception;

/**
 * @author lizijian
 */
public class MissingParamException extends Exception{

  public MissingParamException() {
    super("missing param");
  }

  public MissingParamException(String message) {
    super(message);
  }
}
