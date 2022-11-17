package com.living.core.config;

import lombok.Data;

@Data
public class ComplainObjectType {

  public static final String ACTIVITY="activity";

  public static final String CHAT="chat";

  public static final String COMMENT="comment";

  public static final String COMMENT_RESPONSE="commentResponse";

  public static boolean contain(String type){
    return ACTIVITY.equals(type) || CHAT.equals(type) || COMMENT.equals(type) ||COMMENT_RESPONSE.equals(type);
  }
}
