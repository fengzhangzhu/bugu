package com.living.activity.controller;

import com.living.activity.domain.dao.Label;
import com.living.activity.domain.result.*;
import com.living.activity.service.*;
import com.living.activity.service.qiniu.QiNiuManagerService;
import com.living.core.domain.result.PageResult;
import com.living.core.websocket.WebSocket;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.domain.result.UserComplainResult;
import com.living.core.domain.result.UserVerifyResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.qiniu.common.QiniuException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * @author lizijian
 */
@RequestMapping("/living/Manager")
@RestController
@Validated
@Api(tags = "管理模块")
public class ManagerController {

  @Autowired
  private ManagerService managerService;


  @Autowired
  private AuditService auditService;


  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private BannerService bannerService;

  @Value("${bgxq_log_url}")
  private String logUrl;

  @Autowired
  private ActivityService activityService;


  @Resource(name = "reduceHot")
  private ScheduledExecutorService reduceHotSchedule;

  @Autowired
  private ReduceHotService reduceHotService;

  @Autowired
  private QiNiuManagerService qiNiuManagerService;

  @ApiOperation("新建目录")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "name", value = "新建目录的名称", required = true, paramType = "query"),
      @ApiImplicitParam(name = "father", value = "父目录,可以为空，如果为空则是新建首页目录", required = false, paramType = "query")})
  @PostMapping("/directory/new")
  public ApiResult<?> newDirectory(@NotBlank String name, String father)
      throws ResourseExistException, ResourseNotExistException {
    managerService.addDirectory(name, father);
    return ApiResult.success();
  }

  @ApiOperation("显示指定目录的子目录和文件")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "name", value = "指定目录(为空则显示根目录)", required = false, paramType = "query")})
  @GetMapping("/directory/show")
  public ApiResult<DirectoryResult> showDirectory(String name) {
    return ApiResult.success(managerService.showDirectory(name));
  }

  @ApiOperation("向指定文件夹上传文件,获取七牛云上传凭证")
  @PostMapping("/file/upload")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "fileName", value = "文件名", required = true, paramType = "query"),
      @ApiImplicitParam(name = "directory", value = "文件夹名", required = true, paramType = "query")})
  public ApiResult<QiNiuTokenResult> uploadFile(@NotBlank String fileName,
                                                @NotBlank String directory)
      throws Exception {
    return ApiResult.success(managerService.uploadFile(fileName, directory));
  }

  @ApiOperation("修改文件名")
  @PostMapping("/file/rename")
  public ApiResult<?> renameFile(@NotBlank String fromName, @NotBlank String toName)
      throws QiniuException {
    managerService.renameFile(fromName, toName);
    return ApiResult.success();
  }

  @ApiOperation("删除文件")
  @PostMapping("/file/delete")
  public ApiResult<?> deleteFile(@NotBlank String fileName) throws QiniuException {
    managerService.deleteFile(fileName);
    return ApiResult.success();
  }

  @ApiOperation(value = "删除文件夹", notes = "文件夹里的文件以及子文件夹也会删除")
  @PostMapping("/directory/delete")
  public ApiResult<?> deleteDirectory(@NotBlank String directory)
      throws ResourseNotExistException, QiniuException {
    managerService.deleteDirectory(directory);
    return ApiResult.success();
  }

  @ApiOperation("管理员登陆")
  @GetMapping("/login")
  public ApiResult<?> login(@NotBlank String username, @NotBlank String password)
      throws UsernameOrPasswordErrorException {
    return ApiResult.success(managerService.login(username, password));
  }

  @GetMapping("/audit/getNotAudit")
  @ApiOperation("获取未审核的动态")
  public ApiResult<PageResult<List<NotAuditActivityResult>>> getNotAuditActivity(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(managerService.getNotAuditActivity(page));
  }

  @PostMapping("/audit/pass/{id}")
  @ApiOperation("审核通过动态")
  public ApiResult<?> auditActivity(@NotNull @PathVariable Integer id) {
    managerService.auditActivity(id);
    return ApiResult.success();
  }


  @PostMapping("/audit/delete/{id}")
  @ApiOperation(value = "删除动态", notes = "同时发送官方消息提示用户")
  public ApiResult<?> deleteActivity(@NotBlank String reason, @NotNull @PathVariable Integer id,
      @NotNull Integer userId, String pic)
      throws ResourseNotExistException, QiniuException {
    managerService.deleteActivity(id, reason, userId, pic);
    return ApiResult.success();
  }

  @GetMapping("/audit/getNotAuditQuestion")
  @ApiOperation("获取未审核的问题")
  public ApiResult<PageResult<List<NotAuditQuestionResult>>> getNotAuditQuestion(
          @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(managerService.getNotAuditQuestion(page));
  }

  @PostMapping("/audit/question/pass/{id}")
  @ApiOperation("审核通过问题")
  public ApiResult<?> auditQuestion(@NotNull @PathVariable Integer id) {
    managerService.auditQuestion(id);
    return ApiResult.success();
  }


  @PostMapping("/audit/question/delete/{id}")
  @ApiOperation(value = "删除问题", notes = "同时发送官方消息提示用户")
  public ApiResult<?> deleteQuestion(@NotBlank String reason, @NotNull @PathVariable Integer id,
                                     @NotNull Integer userId, String pic)
          throws ResourseNotExistException, QiniuException {
    managerService.deleteQuestion(id, reason, userId, pic);
    return ApiResult.success();
  }

  @GetMapping("/audit/getNotAuditAnswer")
  @ApiOperation("获取未审核的回答")
  public ApiResult<PageResult<List<NotAuditAnswerResult>>> getNotAuditAnswer(
          @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(managerService.getNotAuditAnswer(page));
  }

  @PostMapping("/audit/answer/pass/{id}")
  @ApiOperation("审核通过回答")
  public ApiResult<?> auditAnswer(@NotNull @PathVariable Integer id) {
    managerService.auditAnswer(id);
    return ApiResult.success();
  }


  @PostMapping("/audit/answer/delete/{id}")
  @ApiOperation(value = "删除回答", notes = "同时发送官方消息提示用户")
  public ApiResult<?> deleteAnswer(@NotBlank String reason, @NotNull @PathVariable Integer id,
                                     @NotNull Integer userId, String pic)
          throws ResourseNotExistException, QiniuException {
    managerService.deleteAnswer(id, reason, userId, pic);
    return ApiResult.success();
  }
  @GetMapping("/monitor/online")
  @ApiOperation("获取在线统计")
  public ApiResult<OnlineSumResult> getOnlineSum() {
    return ApiResult.success(new OnlineSumResult(0, WebSocket.getOnlineSum()));
  }

  @GetMapping("/officialMessage/list")
  @ApiOperation(value = "查看官方发布的消息", notes = "分页返回,page默认是1")
  public ApiResult<OfficialMessageResult> getOfficialMessage(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(managerService.getOfficialMessage(page));
  }


  @GetMapping("/officialMessage/{id}/detail")
  @ApiOperation("查看指定id官方消息的详细信息")
  public ApiResult<List<OfficialMessageDetailResult>> getOfficialMessageDetail(
      @NotNull @PathVariable Integer id) {
    return ApiResult.success(managerService.getOfficialMessageDetail(id));
  }


  @ApiOperation(value = "查看api调用日志", notes = "不分组")
  @GetMapping("/log/result/list")
  public String getApiResultLog(@RequestParam(defaultValue = "1") int page) {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/result/list?page=" + page, String.class);
    return entity.getBody();
  }


  @ApiOperation(value = "查看api错误日志", notes = "不分组")
  @GetMapping("/log/error/list")
  public String getApiErrorLog(@RequestParam(defaultValue = "1") int page) {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/error/list?page=" + page, String.class);
    return entity.getBody();
  }


  @GetMapping("/log/result/group")
  @ApiOperation("查看api返回日志分组")
  public String getResultLogGroup() {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/result/group", String.class);
    return entity.getBody();
  }


  @GetMapping("/log/error/group")
  @ApiOperation("查看api错误日志分组")
  public String getErrorLogGroup() {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/error/group", String.class);
    return entity.getBody();
  }

  @GetMapping("/log/result/group/list")
  @ApiOperation("查看指定分组api返回日志")
  public String getResultLogs(@NotBlank String path, @RequestParam(defaultValue = "1") int page) {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/result/group/list?path=" + path + "&page=" + page, String.class);
    return entity.getBody();
  }

  @GetMapping("/log/error/group/list")
  @ApiOperation("查看指定分组错误日志")
  public String getErrorLogs(@NotBlank String path, @RequestParam(defaultValue = "1") int page) {
    ResponseEntity<String> entity = restTemplate.getForEntity(
        logUrl + "bgxq/log/error/group/list?path=" + path + "&page=" + page, String.class);
    return entity.getBody();
  }

  @GetMapping("/audit/avatar/list")
  @ApiOperation("获取未审核的用户头像")
  public ApiResult<PageResult<List<AvatarAuditResult>>> getNotAuditAvatar(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(auditService.getAvatarAuditList(page));
  }

  @DeleteMapping("/audit/avatar/pass")
  @ApiOperation("通过头像审核")
  public ApiResult<?> passAvatarAudit(@NotNull Integer userId) {
    auditService.passAvatarAudit(userId);
    return ApiResult.success();
  }

  @DeleteMapping("/audit/avatar/delete")
  @ApiOperation("删除头像审核")
  public ApiResult<?> deleteAvatarAudit(@NotNull Integer userId, @NotBlank String reason) {
    auditService.deleteAvatarAudit(userId, reason);
    return ApiResult.success();
  }

  @GetMapping("/verifyRequest/list")
  @ApiOperation("获取实名认证申请列表")
  public ApiResult<PageResult<List<UserVerifyResult>>> verifyRequestList(@RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(auditService.verifyRequestList(page));
  }

  @ApiOperation("通过实名认证请求")
  @PostMapping("/verifyRequest/{id}/pass")
  public ApiResult<?> passVerifyRequest(@NotNull @PathVariable("id") Integer verifyRequestId,@NotNull String stuId,Short sex)
      throws ResourseNotExistException, ActionErrorException {
    auditService.passVerifyRequest(verifyRequestId,stuId,sex);
    return ApiResult.success();
  }

  @DeleteMapping("/verifyRequest/{id}/delete")
  @ApiOperation("删除实名认证请求")
  public ApiResult<?> deleteVerifyRequest(@NotNull @PathVariable("id") Integer verifyRequestId,
      @NotBlank String reason)
      throws ResourseNotExistException {
    auditService.deleteVerifyRequest(verifyRequestId, reason);
    return ApiResult.success();
  }

  @GetMapping("/userComplain/list")
  @ApiOperation("用户举报列表")
  public ApiResult<PageResult<List<UserComplainResult>>> userComplaintList(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(auditService.userComplaintList(page));
  }

  @DeleteMapping("userComplain/{id}/delete")
  @ApiOperation("删除用户举报")
  public ApiResult<?> deleteUserComplaint(@NotNull @PathVariable("id") Integer userComplaintId,@NotNull String reason)
      throws ResourseNotExistException {
    auditService.deleteUserComplaint(userComplaintId,reason);
    return ApiResult.success();
  }

  @ApiImplicitParams({@ApiImplicitParam(name = "userId", value = "处罚用户id", required = true),
      @ApiImplicitParam(name = "informerId", value = "举报者id,在用户举报列表处罚用户时加上这个参数,如果存在此参数,系统会给举报者发送举报成功的官方消息"),
      @ApiImplicitParam(name = "type", value = "处罚类型", required = true),
      @ApiImplicitParam(name = "days", value = "处罚天数", required = true),
      @ApiImplicitParam(name = "reason", value = "原因,包括处罚类型和处罚时长", required = true),
      @ApiImplicitParam(name = "userComplainId", value = "用户举报id", required = false)})
  @PostMapping("/punish")
  @ApiOperation("处罚用户")
  public ApiResult<?> punish(@NotNull Integer userId, Integer informerId, @NotBlank String type,
      @NotNull Integer days, @NotBlank String reason, Integer userComplainId)
      throws ParamErrorException {
    auditService.punish(userId, informerId, type, days, reason, userComplainId);
    return ApiResult.success();
  }

  @GetMapping("/label/getToken")
  @ApiOperation(value = "获取七牛云标签上传凭证")
  public ApiResult<QiNiuTokenResult> getQiNiuLabelToken()
          throws Exception {
    return ApiResult.success(qiNiuManagerService.getLabelIconTokenResults());
  }
  @GetMapping("/label/list")
  @ApiOperation(value = "获取动态标签列表", notes = "分页")
  public ApiResult<PageResult<List<Label>>> labelList(@RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.labelList(page));
  }
  @GetMapping("/label/recommended/list")
  @ApiOperation(value = "获取推荐的动态标签列表", notes = "最多20个不分页")
  public ApiResult<List<Label>> labelRecommendedList() {
    return ApiResult.success(managerService.getRecommendedLabelList());
  }
  @PostMapping("/label/update")
  @ApiOperation(value = "更新标签信息")
  public ApiResult<?> updateLabelInfo(int id,String content,String icon,int hot,short isRecommended) {
    managerService.updateLabelInfo(id,content,icon,hot,isRecommended);
    return ApiResult.success();
  }
  @GetMapping("/label/search")
  @ApiOperation(value = "模糊查询标签")
  public ApiResult<List<Label>> searchLabel(String content) {
    return ApiResult.success(activityService.fuzzyQueryLabel(content));
  }
  @GetMapping("/audit/label/list")
  @ApiOperation("未审核动态标签列表")
  public ApiResult<PageResult<List<UnAuditLabelResult>>> unAuditLabelList(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(auditService.unAuditLabelList(page));
  }


  @ApiOperation("动态标签审核通过")
  @PostMapping("/audit/label/{id}/pass")
  public ApiResult<?> passLabel(@NotNull @PathVariable("id") Integer labelId) {
    auditService.passLabel(labelId);
    return ApiResult.success();
  }


  @DeleteMapping("/audit/label/{id}/delete")
  @ApiOperation("删除动态标签")
  public ApiResult<?> deleteLabel(@NotNull @PathVariable("id") Integer labelId) {
    auditService.deleteLabel(labelId);
    return ApiResult.success();
  }

  @GetMapping("/audit/question/label/list")
  @ApiOperation("未审核问题标签列表")
  public ApiResult<PageResult<List<UnAuditLabelResult>>> unAuditQuestionLabelList(
          @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(auditService.unAuditQuestionLabelList(page));
  }


  @ApiOperation("问题标签审核通过")
  @PostMapping("/audit/question/label/{id}/pass")
  public ApiResult<?> passQuestionLabel(@NotNull @PathVariable("id") Integer labelId) {
    auditService.passQuestionLabel(labelId);
    return ApiResult.success();
  }


  @DeleteMapping("/audit/question/label/{id}/delete")
  @ApiOperation("删除问题标签")
  public ApiResult<?> deleteQuestionLabel(@NotNull @PathVariable("id") Integer labelId) {
    auditService.deleteQuestionLabel(labelId);
    return ApiResult.success();
  }
  @ApiOperation("打开盲盒功能")
  @PostMapping("/blindBoxControl")
  public ApiResult<?> openBlindBox(@RequestParam(defaultValue = "1") short open) {
    BlindBoxOpenControl.setOpen(open == 1);
    return ApiResult.success();
  }

  @ApiOperation("查看盲盒功能是否开放")
  @GetMapping("/blindBoxOpenState")
  public ApiResult<?> blindBoxOpenState() {
    return ApiResult.success(BlindBoxOpenControl.isOpen());
  }

  @PostMapping("/banner/add")
  @ApiOperation("增加banner图")
  public ApiResult<?> addBanner(@NotBlank String pic) {
    bannerService.add(pic);
    return ApiResult.success();
  }

  @DeleteMapping("banner/delete")
  @ApiOperation("删除banner图")
  public ApiResult<?> deleteBanner(@NotNull Integer id) {
    bannerService.delete(id);
    return ApiResult.success();
  }

  @GetMapping("/banner/list")
  @ApiOperation("banner图列表")
  public ApiResult<List<BannerResult>> bannerList() {
    return ApiResult.success(bannerService.list());
  }

  @GetMapping("/hotActivityList")
  @ApiOperation(value = "热门动态列表")
  public ApiResult<PageResult<List<SquareActivityResult>>> hotActivity(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.hotActivity(page));
  }

  @PutMapping("/activity/{id}/hot/reset")
  @ApiOperation("设置动态热度")
  public ApiResult<?> setActivityHot(@NotNull @PathVariable("id") Integer activityId,@NotNull Integer hot) {
    managerService.setActivityHot(activityId,hot);
    return ApiResult.success();
  }

  @PutMapping("/autoReduceHot/open")
  @ApiOperation("打开自动降低热度")
  public ApiResult<?> openAutoReduceHot(){
    reduceHotSchedule = Executors.newSingleThreadScheduledExecutor();
    reduceHotSchedule.scheduleAtFixedRate(()->{
      reduceHotService.reduceHot();
    },0,1, TimeUnit.HOURS);
    return ApiResult.success();
  }

  @PutMapping("/autoReduceHot/close")
  @ApiOperation("关闭自动降低热度")
  public ApiResult<?> closeAutoReduceHot(){
    reduceHotSchedule.shutdown();
    return ApiResult.success();
  }

  @GetMapping("/autoReduceHot/state")
  @ApiOperation("查看自动降低热度开启状态")
  public ApiResult<Boolean> autoReduceHotState(){
    return ApiResult.success(!reduceHotSchedule.isShutdown());
  }

  @PutMapping("/autoReduceHot/setHot")
  @ApiOperation("设置自动减少热度的热度值")
  public ApiResult<?> setReduceHot(@NotNull Integer hot){
    ReduceHotService.setHot(hot);
    return ApiResult.success();
  }

  @GetMapping("/autoReduceHot/getHot")
  @ApiOperation("查看自动减少热度的热度值")
  public ApiResult<Integer> getReduceHot(){
    return ApiResult.success(ReduceHotService.getHot());
  }


  @ApiOperation("匿名开关状态")
  @GetMapping("/anonymity/state")
  public ApiResult<?> anonymityState(){
    return ApiResult.success(AnonymityControl.isOpen());
  }

  @ApiOperation("打开匿名")
  @PutMapping("/anonymity/open")
  public ApiResult<?> openAnonymity(){
    AnonymityControl.setOpen(true);
    return ApiResult.success();
  }

  @ApiOperation("关闭匿名")
  @PutMapping("/anonymity/close")
  public ApiResult<?> closeAnonymity(){
    AnonymityControl.setOpen(false);
    return ApiResult.success();
  }


}
