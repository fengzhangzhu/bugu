package com.living.activity.controller;

import com.living.activity.service.NightPhoneService;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.result.ApiResult;
import com.living.core.util.UserUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

@RequestMapping("/living/nightPhone")
@RestController
@Validated
@Api(tags = "晚安电话模块")
@Slf4j
public class NightPhoneController {

  @Autowired
  private NightPhoneService nightPhoneService;


  @CrossOrigin
  @GetMapping("/token")
  @ApiOperation("获取进房token")
  public ApiResult<String> getToken(@NotNull String roomName) throws Exception {
    return ApiResult.success(QiNiuConfig.getRoomToken(roomName,"id"+UserUtil.getUserId()));
  }

  @CrossOrigin
  @PutMapping("/match")
  @ApiOperation(value = "随机匹配",notes = "轮询接口,每3s访问一次,若没有匹配到则返回空,若匹配到返回进房token")
  public ApiResult<String> match() throws Exception {
    return ApiResult.success(nightPhoneService.match());
  }

}
