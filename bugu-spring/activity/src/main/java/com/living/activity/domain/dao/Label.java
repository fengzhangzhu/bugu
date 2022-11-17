package com.living.activity.domain.dao;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class Label {
  private int id;
  private int activityId;
  private int hot;
  private String icon;
  private String content;
  private short isRecommended;
  public Label(int id,String content,String icon,int hot,short isRecommended){
    this.id = id;
    this.content = content;
    this.icon = icon;
    this.hot = hot;
    this.isRecommended = isRecommended;
  }
  public Label(){}
}
