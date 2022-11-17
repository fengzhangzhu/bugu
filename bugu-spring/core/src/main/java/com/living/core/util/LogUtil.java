package com.living.core.util;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 日志工具类
 * @author lizijian
 */
public class LogUtil {

    private static final ThreadLocal<String> TASK_ID = new ThreadLocal<>();

    private static final ThreadLocal<Long> TASK_TIME = new ThreadLocal<>();


    public static String getTaskId() {
        if (TASK_ID.get() == null) {
            TASK_ID.set(UUID.randomUUID().toString());
        }
        return TASK_ID.get();
    }

    public static Long getTime(){
        long endTime = System.nanoTime();
        Long beginTime = TASK_TIME.get();
        return TimeUnit.NANOSECONDS.toMillis(endTime-beginTime);
    }

    public static void setTaskId(String taskId){
        TASK_ID.set(taskId);
    }

    public static void setTime(){
        TASK_TIME.set(System.nanoTime());
    }

    public static void removeTaskId() {
        TASK_ID.remove();
    }
    public static void removeTime(){
        TASK_TIME.remove();
    }

    public static String getMessage(String message){
        return "["+getTaskId()+"]:"+message;
    }
}
