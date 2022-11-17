package com.living.activity.controller;

import com.living.activity.domain.result.BannerResult;
import com.living.activity.service.BannerService;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author lizijian
 */

@RequestMapping("/living/banner")
@RestController
@Validated
@Api(tags = "轮播图模块")
@Slf4j
public class BannerController {

  @Autowired
  private BannerService bannerService;

  @GetMapping("/list")
  @ApiOperation("轮播图列表")
  public ApiResult<List<BannerResult>> list() {
    return ApiResult.success(bannerService.list());
  }

}
