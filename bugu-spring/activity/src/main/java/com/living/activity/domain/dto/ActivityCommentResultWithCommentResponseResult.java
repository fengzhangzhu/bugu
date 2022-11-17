package com.living.activity.domain.dto;

import com.living.activity.domain.result.ActivityCommentResult;
import com.living.activity.domain.result.CommentResponseResult;
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
public class ActivityCommentResultWithCommentResponseResult  {
    private ActivityCommentResult father;
    private List<CommentResponseResult> sons;
}
