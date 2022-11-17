package com.living.activity.domain.send;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@AllArgsConstructor
public class WithdrawMessage {
  private int userId;
  private int messageId;
}
