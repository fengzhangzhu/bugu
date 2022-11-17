package com.living.core.exception;

/**
 * @author lizijian
 */
public class NoPermissionException extends Exception{

  public NoPermissionException() {
    super("no permisson");
  }

  public NoPermissionException(String message) {
    super(message);
  }
}
