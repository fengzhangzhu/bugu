package com.living.activity.controller;

import com.living.activity.service.SocialService;
import com.living.core.websocket.WebSocket;
import com.living.core.domain.result.UserInfoResult;
import com.living.core.exception.ActionErrorException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseExistException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author lizijian
 */
@RequestMapping("/living/social")
@RestController
@Validated
@Api(tags = "社交模块")
@Slf4j
public class SocialController {

  @Autowired
  private SocialService socialService;

  @GetMapping("/onlineSum")
  @ApiOperation("获取在线人数")
  public ApiResult<Integer> getOnlineSum(){
    return ApiResult.success(WebSocket.getOnlineSum());
  }


  @PostMapping("/attention/{userId}")
  @ApiOperation("关注指定id用户")
  public ApiResult<?> attention(@NotNull @PathVariable Integer userId)
      throws ResourseNotExistException, ResourseExistException, ActionErrorException {
    socialService.attention(userId);
    return ApiResult.success();
  }

  @DeleteMapping("/removeAttention/{userId}")
  @ApiOperation("取消关注指定id用户")
  public ApiResult<?> removeAttention(@NotNull @PathVariable Integer userId){
    socialService.removeAttention(userId);
    return ApiResult.success();
  }

  @ApiOperation("使用用户名查找用户")
  @GetMapping("/searchUser")
  public ApiResult<List<UserInfoResult>> searchUser(@NotNull String username) throws ParamErrorException {
    return ApiResult.success(socialService.searchUser(username));
  }



}
