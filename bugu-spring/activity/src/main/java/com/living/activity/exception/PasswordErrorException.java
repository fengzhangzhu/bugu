package com.living.activity.exception;

import com.living.core.exception.UsernameOrPasswordErrorException;

public class PasswordErrorException extends UsernameOrPasswordErrorException {

  public PasswordErrorException() {
    super("密码错误");
  }
}
