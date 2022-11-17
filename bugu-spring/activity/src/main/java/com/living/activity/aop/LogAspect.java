package com.living.activity.aop;


import com.living.core.domain.dao.ApiErrorLog;
import com.living.core.domain.dao.ApiResultLog;
import com.living.core.domain.dao.User;
import com.living.core.netty.LogClient;
import com.living.core.util.LogUtil;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 用户接口调用日志切面
 * @author lizijian
 */
@Component
@Aspect
@Slf4j
public class LogAspect {

  private final String POINT_CUT = "execution(public * com.living.*.controller.*.*(..)) &&" +
          " !execution(* com.living.*.controller.ExceptionController.*(..))"
      + " && !execution(* com.living.*.controller.ManagerController.*(..))";

  @Autowired
  private LogClient logClient;


  @Value("${spring.profiles.active}")
  private String env;


  @Pointcut(POINT_CUT)
  public void pointCut() {
  }

  @Around("pointCut()")
  public Object recordLog(ProceedingJoinPoint joinPoint) throws Throwable {
    ApiResultLog apiResultLog = new ApiResultLog();
    // 获取参数值
    Object[] args = joinPoint.getArgs();
    // 获取参数名
    Signature signature = joinPoint.getSignature();
    MethodSignature methodSignature = (MethodSignature) signature;
    String[] parameterNames = methodSignature.getParameterNames();
    StringBuilder request = new StringBuilder();
    request.append(" [");
    for (int i = 0; i < args.length; i++) {
      request.append(parameterNames[i]);
      request.append(" = ");
      request.append(args[i]);
      request.append(" , ");
    }
    request.append(" ]");
    apiResultLog.setTaskId(LogUtil.getTaskId());
    String classPath = methodSignature.getMethod().getDeclaringClass().getName();
    classPath = classPath.substring(classPath.lastIndexOf('.') + 1);
    String path=classPath + "-" + methodSignature.getMethod().getName();
    apiResultLog.setPath(path);
    apiResultLog.setRequest(request.toString());
    apiResultLog.setUserId(UserUtil.getUserId());
    User user = UserUtil.getUser();
    String username="";
    if(user!=null){
      username = user.getUsername();
    }
    log.info("[{}] classInfo: {} ,userId:{},username:{},args:{}", apiResultLog.getTaskId(), apiResultLog.getPath(),apiResultLog.getUserId(),username,
        apiResultLog.getRequest());
    //设置接口调用开始时间
    LogUtil.setTime();

    // 获取结果
    Object result = null;
    try {
      result = joinPoint.proceed();
      log.info(LogUtil.getMessage("result:" + result));
      apiResultLog.setResult("" + result);
      log.info(LogUtil.getMessage("time:" + LogUtil.getTime()));
      //接口调用耗时
      apiResultLog.setTime(LogUtil.getTime());
    } catch (Throwable throwable) {
      //异步发送日志
      if("dev".equals(env)||"pro".equals(env)){
        logClient.send(new ApiErrorLog(LogUtil.getTaskId(),path, request.toString(),
            null,throwable.getMessage(),UserUtil.getUserId()));
      }
      throw throwable;
    }
    //异步发送日志
    if("dev".equals(env)||"pro".equals(env)) {
      logClient.send(apiResultLog);
    }
    return result;
  }

}
