package com.living.question.controller;

import com.aliyuncs.exceptions.ClientException;
import com.google.gson.Gson;
import com.living.core.aop.UserVerify;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.exception.WeiXinException;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.question.result.AnswerResult;
import com.living.question.result.MyAnswerResult;
import com.living.question.result.QuestionResult;
import com.living.question.service.AnswerService;
import com.living.question.service.QiNiuQuestionService;
import com.qiniu.common.QiniuException;
import io.swagger.annotations.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月21日 08:42:34
 */
@RequestMapping("/living/answer")
@RestController
@Validated
@Api(tags = "回答模块")
@Slf4j
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @Autowired
    private Gson gson;

    @Autowired
    private QiNiuQuestionService qiNiuQuestionService;

    private final int TEXT_MAX_LENGTH = 2000;



    @UserVerify
    @ApiImplicitParams({
            @ApiImplicitParam(name = "questionId", value = "问题的id", required = true, paramType = "query"),
            @ApiImplicitParam(name = "text", value = "文字", required = false, paramType = "query"),
            @ApiImplicitParam(name = "pic", value = "图片/视频地址,json格式字符串数组", required = false, paramType = "query"),
            @ApiImplicitParam(name = "isAnonymity", value = "1代表匿名，默认0", required = false, defaultValue = "0"),
            @ApiImplicitParam(name = "isVideo",value = "1代表视频,默认为0",required = false)
    })
    @PostMapping("/publish")
    @ApiOperation("回答问题")
    public ApiResult<?> publish(int questionId, String text, String pic,
                                @RequestParam(defaultValue = "0") short isAnonymity,
                                @RequestParam(defaultValue = "0") short isVideo
                                )
            throws ParamErrorException, WeiXinException, IOException, ClientException, NoPermissionException {

        if (pic != null) {
            gson.fromJson(pic, String[].class);
        }

        if (text != null && text.length() > TEXT_MAX_LENGTH) {
            return ApiResult.fail(ResultCode.INVALID_PARAM, "text too long", "字数太长啦");
        }
        answerService.publish(questionId,text, pic,isAnonymity, isVideo);
        return ApiResult.success();
    }
    @GetMapping("/publish/getToken")
    @ApiOperation(value = "获取七牛云回答图片上传凭证", notes = "在发布包含图片的问题前调用")
    public ApiResult<List<QiNiuTokenResult>> getQiNiuActivityToken(
            @RequestParam(defaultValue = "1") int sum)
            throws Exception {
        return ApiResult.success(qiNiuQuestionService.getAnswerTokenResults(sum));
    }
    @GetMapping("/all")
    @ApiOperation(value = "获取指定问题的回答", notes = "每次最多获取10个")
    public ApiResult<PageResult<List<AnswerResult>>> getAllAnswer(
            @RequestParam @ApiParam(value = "问题的Id",required = true) int questionId,
            @RequestParam(defaultValue = "1") int page) {
        return ApiResult.success(answerService.getAllAnswer(questionId,page));
    }

    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("获取指定id回答的详细信息")
    @GetMapping("/{id}/detail")
    public ApiResult<AnswerResult> getQuestionDetail(@NotNull @PathVariable Integer id) throws Exception {
        return answerService.getAnswerDetail(id);
    }
    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("删除指定id回答")
    @DeleteMapping("/{id}/delete")
    public ApiResult<?> delete(@NotNull @PathVariable Integer id)
            throws ResourseNotExistException, NoPermissionException, QiniuException {
        answerService.delete(id);
        return ApiResult.success();
    }
    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("赞同指定id的回答")
    @PostMapping("/{id}/agree")
    public ApiResult<?> agree(@NotNull @PathVariable Integer id) throws Exception {
        answerService.agree(id);
        return ApiResult.success();
    }

    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("取消赞同指定id的回答")
    @DeleteMapping("/{id}/agree/remove")
    public ApiResult<?> removeCollect(@NotNull @PathVariable Integer id) {
        answerService.removeAgree(id);
        return ApiResult.success();
    }
    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("反对指定id的回答")
    @PostMapping("/{id}/oppose")
    public ApiResult<?> oppose(@NotNull @PathVariable Integer id) throws Exception {
        answerService.oppose(id);
        return ApiResult.success();
    }

    @ApiImplicitParam(name = "id", value = "回答id", required = true, paramType = "path")
    @ApiOperation("取消反对指定id的回答")
    @DeleteMapping("/{id}/oppose/remove")
    public ApiResult<?> removeOppose(@NotNull @PathVariable Integer id) {
        answerService.removeOppose(id);
        return ApiResult.success();
    }
    @ApiOperation(value = "获取我的回答", notes = "用于查看我的回答")
    @GetMapping("/my/publish")
    public ApiResult<PageResult<List<MyAnswerResult>>> myPublishAnswer(
            @RequestParam(defaultValue = "1") int page) {
        return ApiResult.success(answerService.getMyAnswer(page));
    }
}
