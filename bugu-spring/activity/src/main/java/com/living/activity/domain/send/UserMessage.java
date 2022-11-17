package com.living.activity.domain.send;

import com.living.core.config.qiniu.QiNiuConfig;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class UserMessage {
  private int id;
  private String content;
  private short type;
  private int fromUserId;
  private Integer time;

  public UserMessage(int id, String content, short type, int fromUserId,Integer time) {
    this.id = id;
    /**
     * 如果消息类型不是文字,头部加上对象存储地址
     */
    if(type!=0){
      this.content= QiNiuConfig.URL+content;
    }else {
      this.content = content;
    }
    this.time=time;
    this.type = type;
    this.fromUserId = fromUserId;
  }
}
