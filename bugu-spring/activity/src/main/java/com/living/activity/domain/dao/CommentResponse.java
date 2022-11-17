package com.living.activity.domain.dao;


import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class CommentResponse {
  private int id;
  private int activityCommentId;
  private int fromUserId;
  private int toUserId;
  private String content;
  private short type;
  private short isDeleted;
  private java.sql.Timestamp createTime;

  public static CommentResponse create(int activityCommentId,int fromUserId,int toUserId,String content,short type){
    CommentResponse commentResponse = new CommentResponse();
    commentResponse.setActivityCommentId(activityCommentId);
    commentResponse.setFromUserId(fromUserId);
    commentResponse.setToUserId(toUserId);
    commentResponse.setContent(content);
    commentResponse.setType(type);
    return commentResponse;
  }
}
