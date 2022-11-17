package com.living.core.domain.dao;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class ApiErrorLog {
  private String taskId;
  private String path;
  private String request;
  private String errorTask;
  private String errorMessage;
  private int userId;

  public ApiErrorLog(String taskId, String path, String request, String errorTask,
      String errorMessage,int userId) {
    this.taskId = taskId;
    this.path = path;
    this.request = request;
    this.errorTask = errorTask;
    this.errorMessage = errorMessage;
    this.userId=userId;
  }
}
