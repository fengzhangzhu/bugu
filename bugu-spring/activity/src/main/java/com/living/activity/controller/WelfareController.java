package com.living.activity.controller;

import com.living.activity.service.WelfareService;
import com.living.core.exception.NoPermissionException;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/living/welfare")
@RestController
@Validated
@Api(tags = "福利模块")
@Slf4j
public class WelfareController {

  @Autowired
  private WelfareService welfareService;


  //@PutMapping("/vip/oneMonth")
  //@ApiOperation(value = "获取一个月vip会员",notes = "每个用户只可领取一次")
  public ApiResult<?> getOneMonthVip() throws NoPermissionException {
    welfareService.getOneMonthVip();
    return ApiResult.success();
  }

  @ApiOperation(value = "累计发布五条动态领取一个月vip",notes = "不包括已删除的动态")
  @PutMapping("/getByActivitySum")
  public ApiResult<?> getByActivitySum() throws NoPermissionException {
    welfareService.getByActivitySum();
    return ApiResult.success();
  }
}
