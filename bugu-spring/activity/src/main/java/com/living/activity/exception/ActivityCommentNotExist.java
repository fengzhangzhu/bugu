package com.living.activity.exception;

import com.living.core.exception.ResourseNotExistException;

/**
 * @author lizijian
 */
public class ActivityCommentNotExist extends ResourseNotExistException {

  public ActivityCommentNotExist() {
    super("动态评论不存在");
  }
}
