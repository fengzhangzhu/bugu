package com.living.activity.domain.dto;

import com.living.activity.domain.helper.SquareUser;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @author lizijian
 */
@Data
public class SquareActivity {
  private int id;
  private String text;
  private String pic;
  private int hot;
  private int likeSum;
  private int commentSum;
  private int viewSum;
  private short isDeleted;
  private short isLiked;
  private short isAnonymity;
  private short visibility;
  private Short video;
  private Timestamp updateTime;
  private Timestamp createTime;
  private SquareUser publisher;
}
