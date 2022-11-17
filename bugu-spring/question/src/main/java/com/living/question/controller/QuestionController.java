package com.living.question.controller;

import com.aliyuncs.exceptions.ClientException;
import com.google.gson.Gson;

import com.living.core.aop.UserVerify;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.exception.*;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.question.dao.Label;
import com.living.question.dao.Question;
import com.living.question.result.QuestionResult;
import com.living.question.service.QiNiuQuestionService;
import com.living.question.service.QuestionService;
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
@RequestMapping("/living/question")
@RestController
@Validated
@Api(tags = "提问模块")
@Slf4j
public class QuestionController {

  private static final int TEXT_MAX_LENGTH = 1000;

  private static final int TITLE_MAX_LENGTH = 200;
  @Autowired
  private QuestionService questionService;

  @Autowired
  private QiNiuQuestionService qiNiuQuestionService;


  @Autowired
  private Gson gson;


  @UserVerify
  @ApiImplicitParams({
      @ApiImplicitParam(name = "title", value = "标题", required = true, paramType = "query"),
      @ApiImplicitParam(name = "text", value = "文字", required = false, paramType = "query"),
      @ApiImplicitParam(name = "pics", value = "图片地址,json格式字符串数组", required = false, paramType = "query"),
      @ApiImplicitParam(name = "video",value = "视频地址,json格式字符串数组",required = false,paramType = "query"),
      @ApiImplicitParam(name = "isAnonymity", value = "1代表匿名，默认0", required = false, defaultValue = "0"),
      @ApiImplicitParam(name = "labelIds", value = "标签id数组,json格式", required = false),
  })
  @PostMapping("/publish")
  @ApiOperation("发布问题")
  public ApiResult<?> publish(String title,String text, String pics,String video,
      @RequestParam(defaultValue = "0") short isAnonymity, String labelIds)
      throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {
    if (title == null) {
      return ApiResult.fail(ResultCode.MISSING_PARAM, "miss param", "缺少参数");
    }
    if(title.length()>TITLE_MAX_LENGTH){
      return ApiResult.fail(ResultCode.INVALID_PARAM, "title too long", "标题字数太长啦");
    }
    if (pics != null) {
      gson.fromJson(pics, String[].class);
    }
    if (video != null){
      gson.fromJson(video, String[].class);
    }
    if (text != null && text.length() > TEXT_MAX_LENGTH) {
      return ApiResult.fail(ResultCode.INVALID_PARAM, "text too long", "字数太长啦");
    }
    questionService.publish(title,text, pics,video,isAnonymity, labelIds);
    return ApiResult.success();
  }


  @GetMapping("/publish/getToken")
  @ApiOperation(value = "获取七牛云问题图片上传凭证", notes = "在发布包含图片的问题前调用")
  public ApiResult<List<QiNiuTokenResult>> getQiNiuActivityToken(
      @RequestParam(defaultValue = "1") int sum)
      throws Exception {
    return ApiResult.success(qiNiuQuestionService.getTokenResults(sum));
  }

  @GetMapping("/label/list")
  @ApiOperation(value = "获取问题是标签列表", notes = "分页")
  public ApiResult<PageResult<List<Label>>> labelList(@RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(questionService.labelList(page));
  }


  @PutMapping("/label/add")
  @ApiOperation("增加标签")
  public ApiResult<Integer> addLabel(@NotBlank String content) {
    return ApiResult.success(questionService.addLabel(content));
  }

  @GetMapping("/label/query")
  @ApiOperation("模糊查询标签名")
  public ApiResult<List<Label>> fuzzyQueryLabel(@NotBlank String content) {
    return ApiResult.success(questionService.fuzzyQueryLabel(content));
  }
  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("删除指定id问题")
  @DeleteMapping("/{id}/delete")
  public ApiResult<?> delete(@NotNull @PathVariable Integer id)
          throws ResourseNotExistException, NoPermissionException, QiniuException {
    questionService.delete(id);
    return ApiResult.success();
  }

  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("点赞指定id问题")
  @PostMapping("/{id}/like")
  public ApiResult<?> like(@NotNull @PathVariable Integer id) throws Exception {
    questionService.like(id);
    return ApiResult.success();
  }
  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("取消点赞指定id问题")
  @PostMapping("/{id}/like/remove")
  public ApiResult<?> removeLike(@NotNull @PathVariable Integer id) {
    questionService.removeLike(id);
    return ApiResult.success();
  }

  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("收藏指定id问题")
  @PostMapping("/{id}/collect")
  public ApiResult<?> collect(@NotNull @PathVariable Integer id) throws Exception {
    questionService.collect(id);
    return ApiResult.success();
  }

  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("取消收藏指定id问题")
  @PostMapping("/{id}/collect/remove")
  public ApiResult<?> removeCollect(@NotNull @PathVariable Integer id) {
    questionService.removeCollect(id);
    return ApiResult.success();
  }

  @GetMapping("/all")
  @ApiOperation(value = "获取所有问题", notes = "每次最多获取10个")
  public ApiResult<PageResult<List<QuestionResult>>> getAllQuestion(
          @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(questionService.getAllQuestion(page));
  }
  @GetMapping("/hot")
  @ApiOperation(value = "获取热门问题", notes = "每次最多获取10个")
  public ApiResult<PageResult<List<QuestionResult>>> getHotQuestion(
          @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(questionService.getHotQuestion(page));
  }
  @ApiImplicitParam(name = "id", value = "问题id", required = true, paramType = "path")
  @ApiOperation("获取指定id问题详细信息")
  @GetMapping("/{id}/detail")
  public ApiResult<QuestionResult> getQuestionDetail(@NotNull @PathVariable Integer id) throws Exception {
    return questionService.getQuestionDetail(id);
  }

  @ApiOperation(value = "获取我发布的问题", notes = "用于查看我发布的问题")
  @GetMapping("/my/published")
  public ApiResult<PageResult<List<QuestionResult>>> myQuestion(
          @RequestParam(defaultValue = "1") int page)
          throws ResourseNotExistException {
    return ApiResult.success(questionService.getMyQuestion( page));
  }
  @ApiOperation(value = "获取我收藏的问题", notes = "用于查看我收藏的问题")
  @GetMapping("/my/collected")
  public ApiResult<PageResult<List<QuestionResult>>> myCollectedQuestion(
          @RequestParam(defaultValue = "1") int page)
          throws ResourseNotExistException {
    return ApiResult.success(questionService.getMyCollectedQuestion( page));
  }

  @GetMapping("/groupByLabel")
  @ApiOperation("返回拥有指定标签的问题")
  public ApiResult<PageResult<List<QuestionResult>>> groupByLabel(@NotNull Integer labelId,
                                                                  @RequestParam(defaultValue = "1") int page) {
    return ApiResult.success(questionService.groupByLabel(labelId, page));
  }


  @ApiImplicitParam(name = "subText", value = "子文本,最少两个字符", required = true)
  @GetMapping("/fullTextQuery")
  @ApiOperation("全文查询问题")
  public ApiResult<?> fullTextQuery(@NotBlank String subText,
                                    @RequestParam(defaultValue = "1") int page)
          throws ParamErrorException {
    return ApiResult.success(questionService.fullTextQuery(subText, page));
  }
}
