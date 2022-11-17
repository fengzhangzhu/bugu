package com.living.core.domain.send;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@AllArgsConstructor
public class SendMessage<T> {
  private String type;
  private T data;
}
