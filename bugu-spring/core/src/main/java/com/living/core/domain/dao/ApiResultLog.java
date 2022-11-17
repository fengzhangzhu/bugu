package com.living.core.domain.dao;

import lombok.Data;

/**
 * @author hongjinhui
 */
@Data
public class ApiResultLog {
    private int userId;
    private String taskId;
    private String path;
    private String request;
    private String result;
    private Long time;
}

