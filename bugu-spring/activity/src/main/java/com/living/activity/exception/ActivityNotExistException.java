package com.living.activity.exception;

import com.living.core.exception.ResourseNotExistException;

/**
 * 动态不存在
 * @author lizijian
 */
public class ActivityNotExistException extends ResourseNotExistException {

  public ActivityNotExistException() {
    super("动态不存在");
  }
}
