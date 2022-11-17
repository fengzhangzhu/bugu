package com.living.core.domain.send;

import com.google.gson.Gson;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 钉钉webhook消息
 */
@Data
public class DingMessage {
  private String text;
  private List<String> atMobiles;
  private boolean isAtAll;

  public DingMessage(String text) {
    this.text = text;
  }

  public String toJsonString() {
    Map<String, Object> items = new HashMap<>(16);
    items.put("msgtype", "text");

    Map<String, String> textContent = new HashMap<>(16);
    if (StringUtils.isEmpty(text)) {
      throw new IllegalArgumentException("text should not be blank");
    }
    textContent.put("content", text);
    items.put("text", textContent);

    Map<String, Object> atItems = new HashMap<>(16);
    if (atMobiles != null && !atMobiles.isEmpty()) {
      atItems.put("atMobiles", atMobiles);
    }
    if (isAtAll) {
      atItems.put("isAtAll", isAtAll);
    }
    items.put("at", atItems);
    return new Gson().toJson(items);
  }
}
