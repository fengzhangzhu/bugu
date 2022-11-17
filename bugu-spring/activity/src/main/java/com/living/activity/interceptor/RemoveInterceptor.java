package com.living.activity.interceptor;

import com.living.activity.util.ManagerUtil;
import com.living.core.util.LogUtil;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author lizijian
 */
@Component
public class RemoveInterceptor implements HandlerInterceptor {
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        LogUtil.removeTaskId();
        LogUtil.removeTime();
        UserUtil.removeUser();
        ManagerUtil.removeUser();
    }
}

