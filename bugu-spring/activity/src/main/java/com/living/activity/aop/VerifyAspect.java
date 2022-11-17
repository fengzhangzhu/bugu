package com.living.activity.aop;

import com.living.core.aop.UserVerify;
import com.living.core.domain.dao.User;
import com.living.core.mapper.VerifyDao;
import com.living.core.util.UserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * @author 大忽悠
 * @create 2022/2/21 21:54
 */
@Slf4j
@RequiredArgsConstructor
@Component
@Aspect
public class VerifyAspect {
    private final VerifyDao verifyDao;
    /**
     * 只对controller包下的方法进行处理
     */
    @Pointcut("execution(public * com.living.*.controller.*.*(..))")
    public void point(){};

    /**
     * 判断当前用户是否认证,没有认证执行方法的,抛出异常
     */
    @Around("point()")
    public Object userVerify(ProceedingJoinPoint joinPoint) throws Throwable {
        Method targetMethod = ((MethodSignature) joinPoint.getSignature()).getMethod();
        //判断方法上是否存在@Verify注解
        if(!targetMethod.isAnnotationPresent(UserVerify.class))
        {
            //异常要向上抛出
            return joinPoint.proceed();
        }
        log.info("当前需要用户认证的方法为: {}",targetMethod.getName());
        //用户是否认证
        User user = UserUtil.getUser();
        //查不到
        com.living.core.domain.dao.UserVerify verify = verifyDao.getVerifyByUserId(user.getId());
        if(verify!=null)
        {
            log.info("需要用户认证的方法 {},认证成功!",targetMethod.getName());
            return joinPoint.proceed();
        }
        log.info("需要用户认证的方法 {},认证失败!",targetMethod.getName());
        throw  new IllegalArgumentException("用户未认证,请先认证");
    }
}
