package com.living.question.exception;

import com.living.core.exception.ResourseNotExistException;

/**
 * 动态不存在
 * @author lizijian
 */
public class AnswerNotExistException extends ResourseNotExistException {

  public AnswerNotExistException() {
    super("回答不存在");
  }
}
