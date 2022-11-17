package com.living.activity.controller;

import com.living.activity.exception.PasswordErrorException;
import com.living.activity.service.VerifyService;
import com.living.core.exception.ActionErrorException;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotBlank;
import java.io.IOException;

/**
 * @author lizijian
 */
@RequestMapping("/living/verify")
@RestController
@Validated
@Api(tags = "认证模块")
@Slf4j
public class VerifyController {

  @Autowired
  private VerifyService verifyService;


  @PostMapping("/login")
  @ApiOperation("登陆湖工大教务处")
  public ApiResult<?> login(@NotBlank String username,@NotBlank String password)
      throws ActionErrorException, PasswordErrorException, IOException {
    return verifyService.verify(username, password);
  }
}
