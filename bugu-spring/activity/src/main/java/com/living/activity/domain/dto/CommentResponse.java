package com.living.activity.domain.dto;

import lombok.Data;

/**
 * 评论的回复信息
 * @author lizijian
 */
@Data
public class CommentResponse {
  private int id;
  private int fromUserId;
  private String fromUserAvatar;
  private int toUserId;
  private String content;
  private short type;
  private short isDeleted;
  private String fromUsername;
  private String toUsername;
}
