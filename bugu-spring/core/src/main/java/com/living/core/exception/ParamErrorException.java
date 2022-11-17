package com.living.core.exception;

/**
 * @author lizijian
 */

public class ParamErrorException extends Exception{

  public ParamErrorException() {
    super("param error");
  }

  public ParamErrorException(String message) {
    super(message);
  }
}
