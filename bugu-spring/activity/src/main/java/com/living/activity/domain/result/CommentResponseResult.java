package com.living.activity.domain.result;

import com.living.activity.domain.dto.CommentResponse;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

/**
 * 评论的回复信息
 * @author lizijian
 */
@Data
public class CommentResponseResult {
  private int id;
  private int fromUserId;
  private String fromUserAvatar;
  private int toUserId;
  private String content;
  private short type;
  private short isDeleted;
  private String fromUsername;
  private String toUsername;

  public CommentResponseResult(CommentResponse commentResponse) {
    id= commentResponse.getId();
    fromUserId=commentResponse.getFromUserId();
    fromUserAvatar= new QiNiuAddress(commentResponse.getFromUserAvatar()).toString();
    toUserId=commentResponse.getToUserId();
    content=commentResponse.getContent();
    type= commentResponse.getType();
    isDeleted= commentResponse.getIsDeleted();
    fromUsername=commentResponse.getFromUsername();
    toUsername=commentResponse.getToUsername();
  }
}
