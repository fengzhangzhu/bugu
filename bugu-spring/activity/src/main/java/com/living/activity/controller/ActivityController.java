package com.living.activity.controller;

import com.aliyuncs.exceptions.ClientException;
import com.google.gson.Gson;
import com.living.core.aop.UserVerify;
import com.living.activity.domain.dao.Label;
import com.living.activity.domain.dto.ActivityCommentResultWithCommentResponseResult;
import com.living.activity.domain.result.*;
import com.living.activity.exception.ActivityCommentNotExist;
import com.living.activity.exception.ActivityNotExistException;
import com.living.activity.service.ActivityService;
import com.living.activity.service.qiniu.QiNiuActivityCommentService;
import com.living.activity.service.qiniu.QiNiuActivityService;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.qiniu.common.QiniuException;
import io.swagger.annotations.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author lizijian
 */
@RequestMapping("/living/activity")
@RestController
@Validated
@Api(tags = "动态模块")
@Slf4j
public class ActivityController {

  private static final int TEXT_MAX_LENGTH = 500;

  @Autowired
  private ActivityService activityService;

  @Autowired
  private QiNiuActivityService qiNiuActivityService;

  @Autowired
  private QiNiuActivityCommentService qiNiuActivityCommentService;


  @Autowired
  private Gson gson;


  @UserVerify
  @ApiImplicitParams({
      @ApiImplicitParam(name = "text", value = "文字", required = false, paramType = "query"),
      @ApiImplicitParam(name = "pic", value = "图片地址,json格式字符串数组", required = false, paramType = "query"),
      @ApiImplicitParam(name = "isAnonymity", value = "1代表匿名，默认0", required = false, defaultValue = "0"),
      @ApiImplicitParam(name = "visibility", value = "可见性,0广场可见,1主页可见,2自己可见", defaultValue = "0"),
      @ApiImplicitParam(name = "labelIds", value = "标签id数组,json格式", required = false),
      @ApiImplicitParam(name = "video",value = "1代表视频,默认为0",required = false)
  })
  @PostMapping("/publish")
  @ApiOperation("发布动态")
  public ApiResult<?> publish(String text, String pic,
      @RequestParam(defaultValue = "0") short isAnonymity,
      @RequestParam(defaultValue = "0") short visibility, String labelIds,@RequestParam(defaultValue = "0") short video)
      throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {
    if (text == null && pic == null) {
      return ApiResult.fail(ResultCode.MISSING_PARAM, "miss param", "缺少参数");
    }
    if (pic != null) {
      gson.fromJson(pic, String[].class);
    }
    if (text != null && text.length() > TEXT_MAX_LENGTH) {
      return ApiResult.fail(ResultCode.INVALID_PARAM, "text too long", "字数太长啦");
    }
    activityService.publish(text, pic, isAnonymity, visibility, labelIds,video);
    return ApiResult.success();
  }


  @GetMapping("/publish/getToken")
  @ApiOperation(value = "获取七牛云动态上传凭证", notes = "在发布包含图片的动态前调用")
  public ApiResult<List<QiNiuTokenResult>> getQiNiuActivityToken(
      @RequestParam(defaultValue = "1") int sum)
      throws Exception {
    return ApiResult.success(qiNiuActivityService.getTokenResults(sum));
  }

  @GetMapping("/comment/getToken")
  @ApiOperation(value = "获取七牛云评论上传凭证", notes = "在评论图片前调用")
  public ApiResult<List<QiNiuTokenResult>> getQiNiuActivityCommentToken(
      @RequestParam(defaultValue = "1") int sum)
      throws Exception {
    return ApiResult.success(qiNiuActivityCommentService.getTokenResults(sum));
  }


  @ApiImplicitParam(name = "id", value = "动态id", required = true, paramType = "path")
  @ApiOperation("删除指定id动态")
  @DeleteMapping("/{id}/delete")
  public ApiResult<?> delete(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException, QiniuException {
    activityService.delete(id);
    return ApiResult.success();
  }

  @ApiImplicitParam(name = "id", value = "动态id", required = true, paramType = "path")
  @ApiOperation("点赞指定id动态")
  @PostMapping("/{id}/like")
  public ApiResult<?> like(@NotNull @PathVariable Integer id) throws Exception {
    activityService.like(id);
    return ApiResult.success();
  }


  @ApiOperation("取消点赞指定id动态")
  @PostMapping("/{id}/like/remove")
  public ApiResult<?> removeLike(@NotNull @PathVariable Integer id) {
    activityService.removeLike(id);
    return ApiResult.success();
  }

  @ApiOperation("查看指定id动态信息")
  @GetMapping("/{id}/info")
  public ApiResult<SquareActivityResult> activityInfo(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException {
    return ApiResult.success(activityService.activityInfo(id));
  }


  @GetMapping("/square")
  @ApiOperation(value = "获取广场动态", notes = "每次最多获取5个")
  public ApiResult<PageResult<List<SquareActivityResult>>> getSquareActivity(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.getSquareActivity(page));
  }

  @GetMapping("/hot")
  @ApiOperation(value = "热门动态", notes = "返回热度前十的动态")
  public ApiResult<PageResult<List<SquareActivityResult>>> hotActivity(
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.hotActivity(page));
  }

  @UserVerify
  @PostMapping("/{id}/comment")
  @ApiOperation("评论动态")
  public ApiResult<Integer> comment(@NotNull @Min(1) @PathVariable Integer id, @NotBlank String content,
      @NotNull @Min(0) Short type)
      throws ActivityNotExistException, WeiXinException, IOException {
    Integer remarkID = activityService.comment(id, content, type);
    return ApiResult.success(remarkID);
  }


  @GetMapping("/attention")
  @ApiOperation("关注用户动态")
  public ApiResult<PageResult<List<SquareActivityResult>>> attentionActivity(
      @RequestParam(defaultValue = "1", required = false) int page) {
    return ApiResult.success(activityService.attentionActivity(page));
  }

  /**
   * <p>
   *     需要加上分页
   * </p>
   */
  @Transactional
  @GetMapping("/{id}/commentList")
  @ApiOperation("获取指定id动态评论")
  public ApiResult<PageResult<List<ActivityCommentResultWithCommentResponseResult>>> getCommentList(@NotNull @PathVariable Integer id, @RequestParam Integer father_startPage,
                                                                                        @RequestParam Integer father_pageSize
          , @RequestParam Integer son_startPage, @RequestParam Integer son_pageSize)
          throws ActivityNotExistException, ActivityCommentNotExist {

    return ApiResult.success(activityService.getCommentList(id,father_startPage,father_pageSize,son_startPage,son_pageSize));
  }

  @UserVerify
  @PostMapping("/comment/{id}/response")
  @ApiImplicitParam(name = "toUserId", value = "对象id,如果是回复动态的评论,该值为0", defaultValue = "0", required = false)
  @ApiOperation(value = "在指定id动态评论下回复", notes = "可以回复动态的评论，也可以回复评论的评论,id是动态评论的id")
  public ApiResult<?> commentResponse(@NotNull @PathVariable Integer id, @NotBlank String content,
                                      @NotNull @Min(0) Short type, @RequestParam(defaultValue = "0") int toUserId)
      throws ResourseNotExistException, WeiXinException, IOException {
    Integer remarkId = activityService.commentResponse(id, content, type, toUserId);
    return ApiResult.success(remarkId);
  }

  @PutMapping("/comment/{id}/like")
  @ApiOperation("点赞指定id评论")
  public ApiResult<Integer> likeComment(@NotNull @PathVariable Integer id) throws ActionErrorException {
    activityService.likeComment(id);
    return ApiResult.success(1);
  }

  @DeleteMapping("/comment/{id}/like/remove")
  @ApiOperation("取消点赞指定id评论")
  public ApiResult<?> removeLikeComment(@NotNull @PathVariable Integer id) {
    activityService.removeLikeComment(id);
    return ApiResult.success();
  }

  @DeleteMapping("/comment/{id}/delete")
  @ApiOperation("删除评论")
  public ApiResult<?> deleteComment(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException {
    activityService.deleteComment(id);
    return ApiResult.success();
  }

  @DeleteMapping("/comment/response/{id}/delete")
  @ApiOperation("删除评论的回复")
  public ApiResult<?> deleteCommentResponse(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException {
    activityService.deleteCommentResponse(id);
    return ApiResult.success();
  }

  @GetMapping("/comment/{id}/responseList")
  @ApiOperation(value = "查看指定id动态评论的回复列表", notes = "id是动态评论的id")
  public ApiResult<List<CommentResponseResult>> commentResponseList(
      @NotNull @PathVariable Integer id,@RequestParam Integer startPage,@RequestParam Integer pageSize)
      throws ActivityNotExistException, ActivityCommentNotExist {
    return ApiResult.success(activityService.commentResponseList(id,startPage,pageSize));
  }


  @GetMapping("/label/list")
  @ApiOperation(value = "获取动态标签列表", notes = "分页")
  public ApiResult<PageResult<List<Label>>> labelList(@RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.labelList(page));
  }
  @GetMapping("/label/recommended")
  @ApiOperation(value = "获取推荐的动态标签列表")
  public ApiResult<List<RecommendedLabelResult>> getRecommendedLabelList() {
    return activityService.getRecommendedLabelList();
  }

  @PutMapping("/label/add")
  @ApiOperation("增加标签")
  public ApiResult<Integer> addLabel(@NotBlank String content) {
    return ApiResult.success(activityService.addLabel(content));
  }


  @GetMapping("/label/query")
  @ApiOperation("模糊查询标签名")
  public ApiResult<List<Label>> fuzzyQueryLabel(@NotBlank String content) {
    return ApiResult.success(activityService.fuzzyQueryLabel(content));
  }

  @PostMapping("/{id}/visibility/change")
  @ApiOperation("修改动态可见性")
  public ApiResult<?> changeVisibility(@NotNull @PathVariable Integer id, @NotNull Short visibility)
      throws ResourseNotExistException, ParamErrorException, NoPermissionException {
    activityService.changeVisibility(id, visibility);
    return ApiResult.success();
  }

  @GetMapping("/groupByLabel")
  @ApiOperation("返回拥有指定标签的动态")
  public ApiResult<PageResult<List<SquareActivityResult>>> groupByLabel(@NotNull Integer labelId,
      @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(activityService.groupByLabel(labelId, page));
  }


  @ApiImplicitParam(name = "subText", value = "子文本,最少两个字符", required = true)
  @GetMapping("/fullTextQuery")
  @ApiOperation("全文查询动态")
  public ApiResult<?> fullTextQuery(@NotBlank String subText,
      @RequestParam(defaultValue = "1") int page)
      throws ParamErrorException {
    return ApiResult.success(activityService.fullTextQuery(subText, page));
  }

  @ApiOperation("匿名开关状态")
  @GetMapping("/anonymity/state")
  public ApiResult<?> anonymityState(){
    return ApiResult.success(AnonymityControl.isOpen());
  }

  @ApiOperation("返回用户点赞过的动态")
  @GetMapping("/uLikeActivity")
  public ApiResult<List<SquareActivityResult>> getUserLikeActivity(@ApiParam("用户id") @RequestParam Integer uid,
                                                 @ApiParam("起始查询页")@RequestParam Integer startPage,
                                                 @ApiParam("条数")@RequestParam Integer pageSize) {
    return ApiResult.success(activityService.getUserLikeActivity(uid,startPage,pageSize));
  }
}
