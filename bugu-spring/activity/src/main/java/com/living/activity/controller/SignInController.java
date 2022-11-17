package com.living.activity.controller;

import com.living.activity.domain.result.SignInInfoResult;
import com.living.activity.service.SignInService;
import com.living.core.exception.NoPermissionException;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author lizijian
 */
@RequestMapping("/living/signIn")
@RestController
@Validated
@Api(tags = "签到模块")
@Slf4j
public class SignInController {

  @Autowired
  private SignInService signInService;

  @GetMapping("/info")
  @ApiOperation("签到信息")
  public ApiResult<SignInInfoResult> info(){
    return ApiResult.success(signInService.info());
  }

  @PostMapping("/getGift")
  @ApiOperation("获取签到礼品")
  public ApiResult<?> getGift() throws NoPermissionException {
    signInService.getGift();
    return ApiResult.success();
  }

  @PutMapping("/signIn")
  @ApiOperation("签到")
  public ApiResult<?> signIn() throws NoPermissionException {
    signInService.signIn();
    return ApiResult.success();
  }
}
