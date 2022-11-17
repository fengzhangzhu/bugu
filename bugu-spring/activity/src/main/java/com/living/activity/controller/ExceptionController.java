package com.living.activity.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.google.gson.JsonSyntaxException;
import com.living.activity.exception.InvaildRequetException;
import com.living.activity.exception.MissingParamException;
import com.living.activity.exception.PasswordErrorException;
import com.living.core.domain.send.DingMessage;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.core.service.dingtalk.SendDingMessageService;
import com.living.core.util.LogUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.ConstraintViolationException;
import java.util.Arrays;


/**
 * @author lizijian
 */
@ApiIgnore
@RestControllerAdvice
@Slf4j
public class ExceptionController {
    /**
     * 参数错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ConstraintViolationException.class)
    public ApiResult<?> constraintViolationException(ConstraintViolationException e){
        log.warn("[{}] constraintViolationException.msg:{}", LogUtil.getTaskId(),e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_PARAM, "invalid param", "无效参数",e.getMessage());
    }

    /**
     * 捕捉其他全部异常
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiResult<?> exception(Exception e) {
        log.error("[{}] exception.msg:{}", LogUtil.getTaskId(), e.getMessage());
        log.error("stack:"+Arrays.toString(e.getStackTrace()));
        SendDingMessageService.sendApiErrorMessage(new DingMessage(e.getMessage()));
        return ApiResult.fail(ResultCode.INTERNAL_SERVER_ERROR, "internal server error", "服务器内部错误",e.getMessage());
    }

    /**
     * 教务系统密码错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(UsernameOrPasswordErrorException.class)
    public ApiResult<?> usernameOrPasswordErrorException(UsernameOrPasswordErrorException e) {
        log.error("[{}] usernameOrPasswordErrorException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        if(e.getClass()==PasswordErrorException.class){
            return ApiResult.fail(ResultCode.PASSWORD_WRONG, "password wrong", "密码错误",e.getMessage());
        }
        return ApiResult.fail(ResultCode.PASSWORD_WRONG, "username or password wrong", "用户名或密码错误",e.getMessage());
    }


    /**
     * 参数格式错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ApiResult<?> methodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("[{}] MethodArgumentTypeMismatchException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_PARAM, "invalid param", "无效参数",e.getMessage());
    }

    /**
     * json参数格式错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(JsonSyntaxException.class)
    public ApiResult<?> jsonSyntaxException(JsonSyntaxException e) {
        log.error("[{}] jsonSyntaxException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_PARAM, "invalid param", "无效参数",e.getMessage());
    }

    /**
     * 资源不存在
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ResourseNotExistException.class)
    public ApiResult<?> resourseNotExistException(ResourseNotExistException e) {
        log.error("[{}] ResourseNotExistException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.RESOURCE_NOT_EXIST, "ResourseNotExist", e.getMessage());
    }

    /**
     * 资源已存在
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ResourseExistException.class)
    public ApiResult<?> resourseExistException(ResourseExistException e) {
        log.error("[{}] ResourseNotExistException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.RESOURCE_EXIST, "ResourseExist", e.getMessage());
    }


    /**
     * 缺少参数
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(MissingParamException.class)
    public ApiResult<?> missingParamException(MissingParamException e) {
        log.error("[{}] missingParamException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.MISSING_PARAM, "missingParam", "缺少参数",e.getMessage());
    }
    /**
     * 缺少参数
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(InvaildRequetException.class)
    public ApiResult<?> invaildRequetException(InvaildRequetException e) {
        log.error("[{}] InvaildRequetException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_REQUEST, "InvaildRequet", "非法请求",e.getMessage());
    }

    /**
     * 没有权限
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(NoPermissionException.class)
    public ApiResult<?> noPermissionException(NoPermissionException e) {
        log.error("[{}] NoPermissionException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.NO_PERMISSION, "no permisson", e.getMessage());
    }

    /**
     * 行为错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ActionErrorException.class)
    public ApiResult<?> actionErrorException(ActionErrorException e) {
        log.error("[{}] ActionErrorException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.WRONG_ACTION, "action error", e.getMessage());
    }

    /**
     * 参数错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ParamErrorException.class)
    public ApiResult<?> paramErrorException(ParamErrorException e) {
        log.error("[{}] ParamErrorException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_PARAM, "param error", e.getMessage());
    }

    /**
     * 微信api 错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(WeiXinException.class)
    public ApiResult<?> weiXinException(WeiXinException e) {
        log.error("[{}] WeiXinException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        return ApiResult.fail(ResultCode.INVALID_PARAM, "weiXin api error", "微信平台错误");
    }
    /**
     * jwt错误
     * @param e 异常
     * @return ApiResult
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(JWTVerificationException.class)
    public ApiResult<?> jwtVerificationException(JWTVerificationException e) {
        log.error("[{}] jWTVerificationException.msg:{}", LogUtil.getTaskId(), e.getMessage());
        if(e.getClass()==SignatureVerificationException.class){
            return ApiResult.fail(ResultCode.TOKEN_ERROR, "jwt error", "token无效,请重新登陆",e.getMessage());
        }
        if(e.getClass() == TokenExpiredException.class){
            return ApiResult.fail(ResultCode.TOKEN_ERROR, "jwt time expire", "token超时,请重新登陆",e.getMessage());
        }
        return ApiResult.fail(ResultCode.TOKEN_ERROR, "jwt error", "token错误",e.getMessage());
    }
}
