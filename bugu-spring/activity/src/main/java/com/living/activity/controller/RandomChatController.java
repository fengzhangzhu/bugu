package com.living.activity.controller;

import com.living.activity.service.RandomChatService;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lizijian
 */
@RequestMapping("/living/randomChat")
@RestController
@Validated
@Api(tags = "随机匹配聊天模块")
@Slf4j
public class RandomChatController {

  @Autowired
  private RandomChatService randomChatService;


  @PutMapping("/match")
  @ApiOperation(value = "随机匹配聊天",notes = "轮询接口,每三秒访问一次,若匹配成功返回匹配目标id,失败返回null")
  public ApiResult<Integer> randomChat(){
    return ApiResult.success(randomChatService.match());
  }

}
