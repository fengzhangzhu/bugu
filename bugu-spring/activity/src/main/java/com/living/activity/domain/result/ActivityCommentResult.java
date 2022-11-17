package com.living.activity.domain.result;

import com.living.activity.domain.dto.ActivityComment;
import com.living.core.domain.helper.CommentUser;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class ActivityCommentResult {
  private int id;
  private CommentUser publisher;
  private String content;
  private int responseSum;
  private int likeSum;
  private short isLiked;
  private short type;
  private short isDeleted;
  private String createTime;

  public ActivityCommentResult(ActivityComment activityComment) {
    this.id= activityComment.getId();
    this.publisher= activityComment.getPublisher();
    publisher.setAvatar(new QiNiuAddress(publisher.getAvatar()).toString());
    this.content=activityComment.getContent();
    this.responseSum= activityComment.getResponseSum();
    this.type= activityComment.getType();
    this.isDeleted= activityComment.getIsDeleted();
    this.createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(activityComment.getCreateTime());
    this.likeSum= activityComment.getLikeSum();
    this.isLiked=activityComment.getIsLiked();
  }

}
