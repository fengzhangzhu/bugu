package com.living.core.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <P>
 *     在需要用户认证的方法上加上此注解即可
 * </P>
 * @author 大忽悠
 * @create 2022/2/10 10:52
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserVerify {
}
