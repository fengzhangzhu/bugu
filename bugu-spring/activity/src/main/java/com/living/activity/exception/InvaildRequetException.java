package com.living.activity.exception;

/**
 * @author lizijian
 */
public class InvaildRequetException extends Exception{

  public InvaildRequetException() {
    super("invaild requet");
  }

  public InvaildRequetException(String message) {
    super(message);
  }
}
