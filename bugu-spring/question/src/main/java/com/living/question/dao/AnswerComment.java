package com.living.question.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class AnswerComment {
  private int id;
  private int userId;
  /**
   * 活动id
   */
  private int answerId;
  /**
   * 评论内容
   */
  private String content;
  /**
   * 回复数
   */
  private int responseSum;
  /**
   * 点赞数
   */
  private int likeSum;
  /**
   *
   */
  private short isLiked;
  /**
   *
   */
  private short type;
  private short isDeleted;
  private Timestamp createTime;

  public static AnswerComment create(int userId, int answerId, String content, short type){
    AnswerComment comment = new AnswerComment();
    comment.setUserId(userId);
    comment.setAnswerId(answerId);
    comment.setContent(content);
    comment.setType(type);
    return comment;
  }
}
