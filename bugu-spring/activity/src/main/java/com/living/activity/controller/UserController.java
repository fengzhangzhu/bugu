package com.living.activity.controller;

import com.google.gson.Gson;
import com.living.activity.domain.result.ActivityResult;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.activity.service.ActivityService;
import com.living.activity.service.PunishService;
import com.living.activity.service.qiniu.QiNiuAvatarService;
import com.living.activity.service.qiniu.QiNiuBackgroundService;
import com.living.activity.service.qiniu.QiNiuVerifyService;
import com.living.activity.util.StringUtil;
import com.living.core.config.WeiXinConfig;
import com.living.core.domain.receive.weixin.WinXinResponse;
import com.living.core.domain.result.*;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.core.service.UserService;
import com.qiniu.common.QiniuException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author lizijian
 */
@RequestMapping("/living/user")
@RestController
@Validated
@Api(tags = "用户模块")
@Slf4j
public class UserController {

  @Autowired
  private UserService userService;

  @Autowired
  private ActivityService activityService;

  @Autowired
  private QiNiuAvatarService qiNiuAvatarService;

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private QiNiuBackgroundService qiNiuBackgroundService;

  @Autowired
  private QiNiuVerifyService qiNiuVerifyService;

  @Autowired
  private PunishService punishService;

  @Autowired
  private Gson gson;


  @ApiImplicitParams({@ApiImplicitParam(name = "code",value = "微信code",required = true),
  @ApiImplicitParam(name = "inviteCode",value = "邀请码",required = false)})
  @ApiOperation("登陆")
  @GetMapping("/login")
  public ApiResult<?> login(@NotBlank String code,String inviteCode) {
    ResponseEntity<String> responseEntity = restTemplate.getForEntity(
        "https://api.weixin.qq.com/sns/jscode2session?appid=" +
            WeiXinConfig.APP_ID + "&secret=" + WeiXinConfig.SECRET + "&js_code=" + code
            + "&grant_type=authorization_code", String.class);
    log.info("winxin:" + responseEntity.getBody());
    WinXinResponse winXinResponse = gson.fromJson(responseEntity.getBody(), WinXinResponse.class);
    log.info(winXinResponse.toString());
    if (winXinResponse.getOpenid() == null) {
      return ApiResult.fail(ResultCode.INVALID_PARAM, "code error", "code发送错误,请联系管理员");
    }
    return ApiResult.success(userService.login(winXinResponse.getOpenid(),inviteCode));
  }

  @PostMapping("/login/byPassword")
  @ApiOperation("使用账号密码登陆")
  public ApiResult<?> loginByPassword(@NotBlank String username,@NotBlank String password){
    return userService.loginByPassword(username,password);
  }


  @ApiOperation(value = "查看指定id用户发布的动态", notes = "用于查看主页")
  @GetMapping("/{userId}/activity")
  public ApiResult<PageResult<List<ActivityResult>>> homeActivity(
      @NotNull @PathVariable Integer userId, @RequestParam(defaultValue = "1") int page)
      throws ResourseNotExistException {
    return ApiResult.success(activityService.activity(userId, page));
  }

  @ApiOperation(value = "查看指定id用户信息", notes = "用于查看主页")
  @GetMapping("/{userId}/info")
  public ApiResult<UserInfoResult> info(@NotNull @PathVariable Integer userId)
      throws ResourseNotExistException {
    return ApiResult.success(userService.infoWithVisit(userId));
  }

  @PostMapping("/username/change/{username}")
  @ApiOperation("修改用户名")
  public ApiResult<?> changeUsername(@NotBlank @PathVariable String username)
      throws UsernameExistException {
    if (username.length() > 16) {
      return ApiResult.fail(ResultCode.INVALID_PARAM, "username too long", "昵称太长");
    }
    if(StringUtil.containsEmoji(username)){
      return ApiResult.fail(ResultCode.INVALID_PARAM, "INVALID_PARAM","昵称不能包含表情");
    }
    userService.changeUsername(username);
    return ApiResult.success();
  }

  @ApiOperation("查看指定id用户关注的用户列表")
  @GetMapping("/{userId}/attentionList")
  public ApiResult<List<AttentionUserResult>> attentionList(@NotNull @PathVariable Integer userId) {
    return ApiResult.success(userService.attentionList(userId));
  }

  @GetMapping("/{userId}/fansList")
  @ApiOperation("查看指定id用户的粉丝列表")
  public ApiResult<List<FansUserResult>> fansList(@NotNull @PathVariable Integer userId) {
    return ApiResult.success(userService.fansList(userId));
  }


  @ApiOperation("获取上传头像凭证")
  @GetMapping("/avatar/token")
  public ApiResult<QiNiuTokenResult> getAvatarToken() throws Exception {
    return ApiResult.success(qiNiuAvatarService.getTokenResult());
  }

  @ApiOperation("获取用户背景上传凭证")
  @GetMapping("/background/token")
  public ApiResult<QiNiuTokenResult> getBackgroundToken() throws Exception {
    return ApiResult.success(qiNiuBackgroundService.getTokenResult());
  }

  @ApiOperation("获取认证图片上传凭证")
  @GetMapping("/verify/token")
  public ApiResult<QiNiuTokenResult> getVerifyToken() throws Exception {
    return ApiResult.success(qiNiuVerifyService.getTokenResult());
  }

  @PutMapping("/verify/submit")
  @ApiOperation("提交实名认证请求")
  public ApiResult<?> verifyRequest(@NotBlank String verifyPic)
      throws ActionErrorException {
    userService.verifyRequest(verifyPic);
    return ApiResult.success();
  }

  @PostMapping("/avatar/change")
  @ApiOperation("更换头像")
  public ApiResult<?> changeAvatar(@NotBlank String fileName) throws QiniuException {
    userService.changeAvatar(fileName);
    return ApiResult.success();
  }

  @GetMapping("/visitor/list")
  @ApiOperation("查看访客列表")
  public ApiResult<List<VisitorResult>> getVisitorList() {
    return ApiResult.success(userService.getVisitorList());
  }

  @GetMapping("/visitor/{visitorId}/unlock")
  @ApiOperation("解锁访客")
  public ApiResult<UserInfoResult> unlockVisitor(@NotNull @PathVariable Integer visitorId)
      throws ResourseNotExistException, NoPermissionException {
    return ApiResult.success(userService.unlockVisitor(visitorId));
  }


  @ApiImplicitParams({
      @ApiImplicitParam(name = "objectId", value = "举报目标的id,举报动态就是动态id,举报评论就是评论id", required = true),
      @ApiImplicitParam(name = "objectType", value = "举报目标的类型,动态为activity,评论为comment,私聊为chat,评论的回复是commentResponse", required = true),
      @ApiImplicitParam(name = "reason", value = "举报原因，长度限制50字内", required = true)})
  @PostMapping("/inform")
  @ApiOperation(value = "用户举报")
  public ApiResult<?> inform(@NotNull @Min(1) Integer objectId, @NotBlank String reason,
      @NotBlank String objectType)
      throws ParamErrorException {
    if (reason.length() > 50) {
      return ApiResult.fail(ResultCode.INVALID_PARAM, "reason too long", "原因太长了,请限制在50字内");
    }
    userService.inform(objectId, reason, objectType);
    return ApiResult.success();
  }

  @PostMapping("/background/update")
  @ApiOperation(value = "修改背景", notes = "vip功能")
  public ApiResult<?> changeBackground(@NotBlank String background)
      throws QiniuException, NoPermissionException {
    userService.changeBackground(background);
    return ApiResult.success();
  }

  @PostMapping("/sex/update")
  @ApiOperation("修改性别")
  public ApiResult<?> updateSex(@NotNull Short sex) throws ActionErrorException, ParamErrorException {
    userService.updateSex(sex);
    return ApiResult.success();
  }

  @GetMapping("/{id}/vipInfo")
  @ApiOperation(value = "查看vip信息",notes = "没有获得过vip则返回null")
  public ApiResult<VipInfoResult> getVipInfo(@NotNull @PathVariable("id") Integer userId){
    return ApiResult.success(userService.getVipInfo(userId));
  }

  @GetMapping("/punishInfo")
  @ApiOperation(value = "查看惩罚信息",notes = "返回惩罚类型,目前没有惩罚则返回null,目前拥有的惩罚类型(1.mute-禁言)(2.banAccount-封号)")
  public ApiResult<UserPunishResult> getPunishInfo(){
    return ApiResult.success(punishService.getPunishType());
  }

  @GetMapping("/invite")
  @ApiOperation("邀请用户注册")
  public ApiResult<String> invite(){
    return ApiResult.success(userService.invite());
  }

}
