package com.living.question.dto;


import com.living.question.result.AnswerCommentResult;
import com.living.question.result.AnswerCommentResponseResult;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * <p>
 *     VO作用:父评论带指定子评论数量返回
 * </p>
 * @author 大忽悠
 * @create 2022/1/26 21:12
 */
@Builder
@Data
public class AnswerCommentResultWithCommentResponseResult {
    private AnswerCommentResult father;
    private List<AnswerCommentResponseResult> sons;
}
