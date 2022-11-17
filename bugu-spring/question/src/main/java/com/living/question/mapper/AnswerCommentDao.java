package com.living.question.mapper;

import com.living.question.dao.AnswerComment;
import com.living.question.dao.AnswerCommentResponse;
import com.living.question.dto.AnswerCommentDto;
import com.living.question.dto.AnswerCommentResponseDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author mulan
 * @version 1.0
 * @description 答案评论Mapper
 * @date 2022年 07月25日 15:26:53
 */
@Mapper
public interface AnswerCommentDao {
    /**
     * 增加评论
     */
    @Insert("INSERT INTO answer_comment (user_id,answer_id,content,type) VALUES (#{userId},#{answerId},#{content},#{type})")
    @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
    int addComment(AnswerComment comment);


    /**
     * 查找指定id答案的评论
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar")})
    @Select("SELECT *," +
            "(SELECT COUNT(*) FROM answer_comment_like WHERE user_id =#{userId} AND comment_id = answer_comment.id LIMIT 1 ) AS isLiked," +
            "(SELECT username FROM user WHERE id= user_id) AS username ," +
            "(SELECT avatar FROM user WHERE id = user_id) AS avatar " +
            "FROM answer_comment WHERE answer_id = #{answerId} ")
    List<AnswerCommentDto> getCommentByAnswerId(@Param("answerId") int answerId, @Param("userId") int userId);

    /**
     * 点赞指定id评论
     */
    @Insert("INSERT INTO answer_comment_like (user_id,comment_id) VALUES (#{userId},#{commentId})")
    int likeComment(@Param("userId") int userId,@Param("commentId") int commentId);

    /**
     * 取消点赞指定id评论
     * @param userId
     * @param commentId
     * @return
     */
    @Delete("DELETE FROM answer_comment_like WHERE comment_id =#{commentId} AND user_id =#{userId}")
    int removeLikeComment(@Param("userId") int userId,@Param("commentId") int commentId);

    /**
     * 增加评论喜欢数
     * @param commentId 评论id
     */
    @Update("UPDATE answer_comment SET like_sum = like_sum + 1 WHERE id = #{commentId}")
    int addLikeSum(int commentId);

    /**
     * 减少评论喜欢数
     * @param commentId
     * @return
     */
    @Update("UPDATE answer_comment SET like_sum = like_sum - 1 WHERE id = #{commentId}")
    int subLikeSum(int commentId);

    /**
     * 查找指定id评论
     * @param id
     * @return
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar")})
    @Select("SELECT *," +
            "(SELECT username FROM user WHERE id= user_id) AS username ," +
            "(SELECT avatar FROM user WHERE id = user_id) AS avatar " +
            "FROM answer_comment  WHERE id = #{id}")
    AnswerCommentDto getCommentById(int id);

    /**
     * 删除指定id评论(软删除)
     * @param id
     */
    @Update("UPDATE answer_comment SET is_deleted =1 WHERE id= #{id}")
    void deleteComment(int id);

    /**
     * 删除评论的回复
     * 软删除
     * @param id 评论回复id
     */
    @Update("UPDATE answer_comment_response SET is_deleted =1 WHERE id= #{id}")
    void deleteCommentResponse(int id);


    @Select("SELECT * FROM answer_comment_response WHERE id = #{id}")
    AnswerCommentResponse getCommentResponseById(int id);

    /**
     * 回复评论
     * @param commentResponse
     * @return
     */
    @Insert("INSERT INTO answer_comment_response (answer_comment_id,from_user_id,to_user_id,content,type) VALUES (#{answerCommentId},#{fromUserId},#{toUserId},#{content},#{type})")
    @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
    Integer commentResponse(AnswerCommentResponse commentResponse);

    /**
     * 查询评论回复列表
     * @param commentId
     */
    @Select("SELECT *,(SELECT username FROM user WHERE id = from_user_id) AS fromUsername," +
            "(SELECT avatar FROM user WHERE id = from_user_id) AS fromUserAvatar," +
            "(SELECT username FROM user WHERE id = to_user_id) AS toUsername " +
            "FROM answer_comment_response WHERE answer_comment_id = #{commentId}")
    List<AnswerCommentResponseDto> commentResponseList(int commentId);

    /**
     * 增加评论回复数
     * @param commentId
     */
    @Update("UPDATE answer_comment SET response_sum = response_sum + 1 WHERE id=  #{commentId}")
    void addResponseSum(int commentId);
}
