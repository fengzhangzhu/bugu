package com.living.activity.controller;

import com.living.activity.domain.dto.BoxInfo;
import com.living.activity.domain.result.*;
import com.living.activity.service.BlindBoxService;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.result.ApiResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@RequestMapping("/living/blindBox")
@RestController
@Validated
@Api(tags = "盲盒模块")
@Slf4j
public class BlindBoxController {

  @Autowired
  private BlindBoxService blindBoxService;


  @PutMapping("/deliver")
  @ApiOperation(value = "投送盲盒",notes = "每天只可投送一次盲盒,投送盲盒后可获得一次收取盲盒的机会,每周最多获取2次机会")
  public ApiResult<?> deliver(@NotBlank String text,@NotNull Short sex)
      throws NoPermissionException {
    blindBoxService.deliver(text,sex);
    return ApiResult.success();
  }


  @ApiImplicitParam(name = "sex",value = "0收取女盒,1收取男盒,每天可获取一次盲盒",required = true)
  @GetMapping("/collect")
  @ApiOperation("获取盲盒")
  public ApiResult<BlindBoxResult> collectBox(@NotNull Short sex)
      throws NoPermissionException, ResourseNotExistException {
    return ApiResult.success(blindBoxService.collectBox(sex));
  }

  @GetMapping("/ticket/list")
  @ApiOperation("查看盲盒券列表")
  public ApiResult<PageResult<BlindBoxTicketResult>> collectTicketList(@RequestParam(defaultValue = "1") int page){
    return ApiResult.success(blindBoxService.collectTicketList(page));
  }

  @GetMapping("/collect/log")
  @ApiOperation("盲盒收取记录")
  public ApiResult<PageResult<List<BlindBoxCollectLogResult>>> collectLog(@RequestParam(defaultValue = "1") int page){
    return ApiResult.success(blindBoxService.collectLog(page));
  }


  @GetMapping("/deliver/log")
  @ApiOperation("盲盒投递记录")
  public ApiResult<PageResult<List<BlindBoxDeliverLogResult>>> deliverLog(@RequestParam(defaultValue = "1") int page){
    return ApiResult.success(blindBoxService.deliverLog(page));
  }

  @DeleteMapping("/{id}/delete")
  @ApiOperation(value = "删除盲盒")
  public ApiResult<?> deleteBox(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException {
    blindBoxService.deleteBox(id);
    return ApiResult.success();
  }

  @GetMapping("/info")
  @ApiOperation(value = "盲盒信息",notes = "目前用于查看剩余盲盒数量")
  public ApiResult<BoxInfo> info(){
    return ApiResult.success(blindBoxService.info());
  }


  @GetMapping("/isOpen")
  @ApiOperation("查询盲盒是否开放")
  public ApiResult<Boolean> isOpen(){
    return ApiResult.success(BlindBoxOpenControl.isOpen());
  }

}
