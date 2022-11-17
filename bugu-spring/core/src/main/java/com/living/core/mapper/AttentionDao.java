package com.living.core.mapper;

import org.apache.ibatis.annotations.*;

/**
 * @author lizijian
 */
@Mapper
public interface AttentionDao {

  /**
   * 关注指定id用户
   * @param userId
   * @param attentionUserId
   */
  @Insert("INSERT INTO user_attention (user_id,user_attention.attention_user_id) VALUES (#{userId},#{attentionUserId})")
  void attention(@Param("userId") int userId,@Param("attentionUserId") int attentionUserId);

  /**
   * 取消关注
   * @param userId
   * @param objectId
   * @return
   */
  @Delete("DELETE FROM user_attention WHERE user_id =#{userId} AND attention_user_id =#{objectId} ")
  int removeAttention(@Param("userId") int userId,@Param("objectId") int objectId);

  /**
   * 查询是否关注指定id用户
   * @param objectId
   * @param myId
   * @return 0代表未关注,1代表已关注
   */
  @Select("SELECT COUNT(*) FROM user_attention WHERE user_id =#{myId} AND attention_user_id =#{objectId} ")
  short getIsAttention(@Param("objectId") int objectId,@Param("myId") int myId);
}
