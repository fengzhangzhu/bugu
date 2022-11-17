package com.living.activity.domain.dao;

import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class Activity {
  private int id;
  private int userId;
  private String text;
  private String pic;
  private int hot;
  private int likeSum;
  private int commentSum;
  private int viewSum;
  private Short isLiked;
  private short isDelete;
  private short isAnonymity;
  private short visibility;
  private short video;
  private Timestamp updateTime;
  private Timestamp createTime;

  public static Activity publish(String text, String pic,int userId,short isAnonymity,short visibility,short video){
    Activity activity = new Activity();
    activity.setText(text);
    activity.setUserId(userId);
    activity.setPic(pic);
    activity.setIsAnonymity(isAnonymity);
    activity.setVisibility(visibility);
    activity.setVideo(video);
    return activity;
  }
}
