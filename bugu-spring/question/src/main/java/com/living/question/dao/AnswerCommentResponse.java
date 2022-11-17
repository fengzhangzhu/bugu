package com.living.question.dao;


import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class AnswerCommentResponse {
  private int id;
  private int answerCommentId;
  private int fromUserId;
  private int toUserId;
  private String content;
  private short type;
  private short isDeleted;
  private java.sql.Timestamp createTime;

  public static AnswerCommentResponse create(int answerCommentId, int fromUserId, int toUserId, String content, short type){
    AnswerCommentResponse commentResponse = new AnswerCommentResponse();
    commentResponse.setAnswerCommentId(answerCommentId);
    commentResponse.setFromUserId(fromUserId);
    commentResponse.setToUserId(toUserId);
    commentResponse.setContent(content);
    commentResponse.setType(type);
    return commentResponse;
  }
}
