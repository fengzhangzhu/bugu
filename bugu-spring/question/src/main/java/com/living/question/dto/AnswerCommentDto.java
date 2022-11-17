package com.living.question.dto;

import com.living.core.domain.helper.CommentUser;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class AnswerCommentDto {
  private int id;
  private CommentUser publisher;
  private int answerId;
  private String content;
  private int responseSum;
  private int likeSum;
  private short isLiked;
  private short type;
  private short isDeleted;
  private Timestamp createTime;

}
