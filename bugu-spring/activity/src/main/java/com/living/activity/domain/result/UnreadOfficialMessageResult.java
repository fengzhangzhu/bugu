package com.living.activity.domain.result;

import com.living.core.domain.dto.UnreadOfficialMessage;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * 官方消息列表显示消息
 */
@Data
public class UnreadOfficialMessageResult {
  private String type;
  private int unreadSum;
  private String lastText;
  private String lastTime;

  public UnreadOfficialMessageResult(UnreadOfficialMessage unreadOfficialMessage) {
    type= unreadOfficialMessage.getType();
    unreadSum=unreadOfficialMessage.getUnreadSum();
    lastText= unreadOfficialMessage.getLastText();
    lastTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(unreadOfficialMessage.getLastTime());
  }
}
