package com.living.activity.domain.result;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@AllArgsConstructor
public class SendMessageResult {
  private int messageId;
  private String url;
}
