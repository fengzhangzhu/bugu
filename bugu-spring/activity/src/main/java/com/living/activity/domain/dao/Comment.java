package com.living.activity.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Comment {
  private int id;
  private int userId;
  /**
   * 活动id
   */
  private int activityId;
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

  public static Comment create(int userId,int activityId,String content,short type){
    Comment comment = new Comment();
    comment.setUserId(userId);
    comment.setActivityId(activityId);
    comment.setContent(content);
    comment.setType(type);
    return comment;
  }
}
