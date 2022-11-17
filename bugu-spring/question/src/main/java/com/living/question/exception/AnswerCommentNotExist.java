package com.living.question.exception;

import com.living.core.exception.ResourseNotExistException;

/**
 * @author lizijian
 */
public class AnswerCommentNotExist extends ResourseNotExistException {

  public AnswerCommentNotExist() {
    super("回答评论不存在");
  }
}
