package com.living.question.controller;

import com.github.pagehelper.PageInfo;
import com.living.core.aop.UserVerify;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.ActionErrorException;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.exception.WeiXinException;
import com.living.core.result.ApiResult;
import com.living.question.dto.AnswerCommentResultWithCommentResponseResult;
import com.living.question.exception.AnswerCommentNotExist;
import com.living.question.exception.AnswerNotExistException;
import com.living.question.result.AnswerCommentResponseResult;
import com.living.question.result.AnswerCommentResult;
import com.living.question.service.AnswerCommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
 * @author mulan
 * @version 1.0
 * @description 答案评论controller
 * @date 2022年 07月25日 15:28:11
 */
@RequestMapping("/living/answer/comment")
@RestController
@Validated
@Api(tags = "回答评论模块")
@Slf4j
public class AnswerCommentController {
    @Autowired
    private AnswerCommentService answerCommentService;

    @UserVerify
    @PostMapping("/{id}")
    @ApiOperation(value = "评论回答",notes = "成功后返回评论的id")
    public ApiResult<Integer> comment(@NotNull @Min(1) @PathVariable Integer id,
                                      @NotBlank @ApiParam(required = true,value = "评论的文字") String content,
                                      @NotNull @Min(0) Short type)
            throws AnswerNotExistException, WeiXinException, IOException {
        Integer remarkID = answerCommentService.comment(id, content, type);
        return ApiResult.success(remarkID);
    }
    @Transactional
    @GetMapping("/{id}/commentList")
    @ApiOperation("获取指定id回答评论")
    public ApiResult<PageResult<List<AnswerCommentResultWithCommentResponseResult>>> getCommentList(@NotNull @PathVariable Integer id, @RequestParam Integer father_startPage,
                                                                                                    @RequestParam Integer father_pageSize
            , @RequestParam Integer son_startPage, @RequestParam Integer son_pageSize)
            throws AnswerNotExistException, AnswerCommentNotExist {
        return ApiResult.success(answerCommentService.getCommentList(id, father_startPage, father_pageSize,son_startPage,son_pageSize));
    }
    @PutMapping("/comment/{id}/detail")
    @ApiOperation("获取指定id评论的详细信息")
    public ApiResult<AnswerCommentResult> getCommentDetail(@NotNull @PathVariable Integer id) throws  AnswerNotExistException {
        return ApiResult.success(answerCommentService.getCommentDetail(id));
    }

    @UserVerify
    @PostMapping("/comment/{id}/response")
    @ApiImplicitParam(name = "toUserId", value = "对象id,如果是回复回答的评论,该值为0", defaultValue = "0", required = false)
    @ApiOperation(value = "在指定id回答评论下回复", notes = "可以回复回答的评论，也可以回复评论的回复,id是回答评论的id")
    public ApiResult<?> commentResponse(@NotNull @PathVariable Integer id, @NotBlank String content,
                                        @NotNull @Min(0) Short type, @RequestParam(defaultValue = "0") int toUserId)
            throws ResourseNotExistException, WeiXinException, IOException {
        Integer remarkId = answerCommentService.commentResponse(id, content, type, toUserId);
        return ApiResult.success(remarkId);
    }

    @PutMapping("/comment/{id}/like")
    @ApiOperation("点赞指定id评论")
    public ApiResult<Integer> likeComment(@NotNull @PathVariable Integer id) throws ActionErrorException {
        answerCommentService.likeComment(id);
        return ApiResult.success(1);
    }

    @DeleteMapping("/comment/{id}/like/remove")
    @ApiOperation("取消点赞指定id评论")
    public ApiResult<?> removeLikeComment(@NotNull @PathVariable Integer id) {
        answerCommentService.removeLikeComment(id);
        return ApiResult.success();
    }

    @DeleteMapping("/comment/{id}/delete")
    @ApiOperation("删除评论")
    public ApiResult<?> deleteComment(@NotNull @PathVariable Integer id)
            throws ResourseNotExistException, NoPermissionException {
        answerCommentService.deleteComment(id);
        return ApiResult.success();
    }

    @DeleteMapping("/comment/response/{id}/delete")
    @ApiOperation("删除评论的回复")
    public ApiResult<?> deleteCommentResponse(@NotNull @PathVariable Integer id)
            throws ResourseNotExistException, NoPermissionException {
        answerCommentService.deleteCommentResponse(id);
        return ApiResult.success();
    }

    @GetMapping("/comment/{id}/responseList")
    @ApiOperation(value = "查看指定id动态评论的回复列表", notes = "id是动态评论的id")
    public ApiResult<List<AnswerCommentResponseResult>> commentResponseList(
            @NotNull @PathVariable Integer id,@RequestParam Integer startPage,@RequestParam Integer pageSize)
            throws AnswerNotExistException,AnswerCommentNotExist {
        return ApiResult.success(answerCommentService.commentResponseList(id,startPage,pageSize));
    }

}
