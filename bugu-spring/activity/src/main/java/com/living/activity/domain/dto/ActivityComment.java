package com.living.activity.domain.dto;

import com.living.core.domain.helper.CommentUser;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class ActivityComment {
  private int id;
  private CommentUser publisher;
  private int activityId;
  private String content;
  private int responseSum;
  private int likeSum;
  private short isLiked;
  private short type;
  private short isDeleted;
  private Timestamp createTime;

}
