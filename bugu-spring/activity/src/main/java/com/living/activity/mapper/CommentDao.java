package com.living.activity.mapper;

import com.living.activity.domain.dao.Comment;
import com.living.activity.domain.dao.CommentResponse;
import com.living.activity.domain.dto.ActivityComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface CommentDao {

  /**
   * 增加评论
   */
  @Insert("INSERT INTO activity_comment (user_id,activity_id,content,type) VALUES (#{userId},#{activityId},#{content},#{type})")
  @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
  int addComment(Comment comment);


  /**
   * 查找指定id动态的评论
   */
  @Results({
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar")})
  @Select("SELECT *,(SELECT COUNT(*) FROM comment_like WHERE user_id =#{userId} AND comment_id = activity_comment.id LIMIT 1 ) AS isLiked,(SELECT username FROM user WHERE id= user_id) AS username ,(SELECT avatar FROM user WHERE id = user_id) AS avatar FROM activity_comment WHERE activity_id = #{activityId} ")
  List<ActivityComment> getCommentByActivityId(@Param("activityId") int activityId, @Param("userId") int userId);

  /**
   * 点赞指定id评论
   */
  @Insert("INSERT INTO comment_like (user_id,comment_id) VALUES (#{userId},#{commentId})")
  int likeComment(@Param("userId") int userId,@Param("commentId") int commentId);

  /**
   * 取消点赞指定id评论
   * @param userId
   * @param commentId
   * @return
   */
  @Delete("DELETE FROM comment_like WHERE comment_id =#{commentId} AND user_id =#{userId}")
  int removeLikeComment(@Param("userId") int userId,@Param("commentId") int commentId);

  /**
   * 增加评论喜欢数
   * @param commentId 评论id
   */
  @Update("UPDATE activity_comment SET like_sum = like_sum + 1 WHERE id = #{commentId}")
  int addLikeSum(int commentId);

  /**
   * 减少评论喜欢数
   * @param commentId
   * @return
   */
  @Update("UPDATE activity_comment SET like_sum = like_sum - 1 WHERE id = #{commentId}")
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
  @Select("SELECT *,(SELECT username FROM user WHERE id= user_id) AS username ,(SELECT avatar FROM user WHERE id = user_id) AS avatar FROM activity_comment  WHERE id = #{id}")
  ActivityComment getCommentById(int id);

  /**
   * 删除指定id评论(软删除)
   * @param id
   */
  @Update("UPDATE activity_comment SET is_deleted =1 WHERE id= #{id}")
  void deleteComment(int id);

  /**
   * 删除评论的回复
   * 软删除
   * @param id 评论回复id
   */
  @Update("UPDATE comment_response SET is_deleted =1 WHERE id= #{id}")
  void deleteCommentResponse(int id);


  @Select("SELECT * FROM comment_response WHERE id = #{id}")
  CommentResponse getCommentResponseById(int id);

  /**
   * 回复评论
   * @param commentResponse
   * @return
   */
  @Insert("INSERT INTO comment_response (activity_comment_id,from_user_id,to_user_id,content,type) VALUES (#{activityCommentId},#{fromUserId},#{toUserId},#{content},#{type})")
  @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
  Integer commentResponse(CommentResponse commentResponse);

  /**
   * 查询评论回复列表
   * @param commentId
   */
  @Select("SELECT *,(SELECT username FROM user WHERE id = from_user_id) " +
          "AS fromUsername,(SELECT avatar FROM user WHERE id = from_user_id) " +
          "AS fromUserAvatar," +
          "(SELECT username FROM user WHERE id = to_user_id) AS toUsername FROM comment_response WHERE activity_comment_id = #{commentId}")
  List<com.living.activity.domain.dto.CommentResponse> commentResponseList(int commentId);

  /**
   * 增加评论回复数
   * @param commentId
   */
  @Update("UPDATE activity_comment SET response_sum = response_sum + 1 WHERE id=  #{commentId}")
  void addResponseSum(int commentId);
}
