package com.living.activity.service;

import com.living.activity.mapper.ApiLogDao;
import com.living.core.domain.dao.ApiErrorLog;
import com.living.core.domain.dao.ApiResultLog;
import com.living.core.util.LogUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * @author lizijian
 */

@Service
@Slf4j
public class ApiLogService {
    @Autowired
    private ApiLogDao apiLogDao;


    @Async("ApiLog")
    public void insertApiResult(ApiResultLog apiResultLog, String taskId) {
        LogUtil.setTaskId(taskId);
        Long begin = System.nanoTime();
        apiLogDao.insertApiResultLog(apiResultLog);
        Long end = System.nanoTime();
        log.info(LogUtil.getMessage("insert api_result_log to db spend time:" + TimeUnit.NANOSECONDS.toMillis(end - begin)));
        LogUtil.removeTaskId();
    }

    @Async("ApiLog")
    public void insertApiError(ApiErrorLog apiErrorLog, String taskId){
        LogUtil.setTaskId(taskId);
        Long begin = System.nanoTime();
        apiLogDao.insertApiErrorLog(apiErrorLog);
        Long end = System.nanoTime();
        log.info(LogUtil.getMessage("insert api_error_log to db spend time:" + TimeUnit.NANOSECONDS.toMillis(end - begin)));
        LogUtil.removeTaskId();
    }


}

