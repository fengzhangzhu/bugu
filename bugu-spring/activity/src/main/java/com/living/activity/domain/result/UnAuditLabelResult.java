package com.living.activity.domain.result;

import com.living.activity.domain.dao.Label;
import lombok.Data;

/**
 * 管理系统未审核标签
 */
@Data
public class UnAuditLabelResult {
  private int id;
  private String content;


  public UnAuditLabelResult(Label label) {
    id= label.getId();
    content= label.getContent();
  }
}
