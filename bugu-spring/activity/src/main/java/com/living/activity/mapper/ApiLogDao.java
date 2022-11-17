package com.living.activity.mapper;

import com.living.core.domain.dao.ApiErrorLog;
import com.living.core.domain.dao.ApiResultLog;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author hongjinhui
 */
@Mapper
public interface ApiLogDao {

    /**
     * 插入api返回结果日志
     * @param apiResultLog
     */
    @Insert("INSERT INTO api_result_log(task_id, path, request, result, time) VALUES(#{taskId}, #{path}, #{request}, #{result}, #{time})")
    void insertApiResultLog(ApiResultLog apiResultLog);


    /**
     * 插入api错误日志
     * @param apiErrorLog
     */
    @Insert("INSERT INTO api_error_log (task_id,path,request,error_task,error_message) VALUES (#{taskId},#{path},#{request},#{errorTask},#{errorMessage})")
    void insertApiErrorLog(ApiErrorLog apiErrorLog);
}

