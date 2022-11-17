package com.living.question.dao;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class Label {
  private int id;
  private int questionId;
  private int hot;
  private String content;
}
