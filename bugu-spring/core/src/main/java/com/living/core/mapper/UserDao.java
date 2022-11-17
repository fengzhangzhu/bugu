package com.living.core.mapper;


import com.living.core.domain.dao.User;
import com.living.core.domain.dto.AttentionUser;
import com.living.core.domain.dto.FansUser;
import com.living.core.domain.helper.Publisher;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface UserDao {

  /**
   * 通过openid查找用户
   * @param openid 微信openid
   * @return
   */
  @Select("SELECT * FROM `user` WHERE openid=#{openid} ")
  User getUserByOpenid(String openid);

  /**
   * 通过账号密码查询用户
   * @param username
   * @param password
   * @return
   */
  @Select("SELECT * FROM user WHERE username =#{username}  AND `password` =#{password} ")
  User getUserByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

  /**
   * 通过用户id查找用户
   * @param id
   * @return
   */
  @Select("SELECT * FROM `user` WHERE id=#{id} ")
  User getUserById(int id);

  /**
   * 模糊查询用户名
   * @param username
   * @return
   */
  @Select("SELECT * FROM `user` WHERE username LIKE #{username} LIMIT 5")
  List<User> getUserByUsername(String username);

  /**
   * 插入新用户
   * @param user
   */
  @Insert("INSERT INTO user (openid,username,avatar) VALUES (#{openid},#{username},#{avatar})")
  @Options(keyColumn = "id",keyProperty = "id",useGeneratedKeys = true)
  void addUser(User user);

  /**
   * 修改用户名
   * @param username
   * @param userId
   */
  @Update("UPDATE `user` SET username =#{username} WHERE id =#{userId} ")
  void changeUsername(@Param("username") String username,@Param("userId") int userId);

  /**
   * 增加用户关注总数
   * @param userId
   */
  @Update("UPDATE user SET attention_sum = attention_sum +1 WHERE id = #{userId}")
  void addAttentionSum(int userId);

  /**
   * 减少关注用户数量
   */
  @Update("UPDATE user SET attention_sum = attention_sum -1 WHERE id = #{userId}")
  int subAttentionSum(int userId);

  /**
   * 增加用户被关注总数
   * @param userId
   */
  @Update("UPDATE user SET be_attention_sum = be_attention_sum +1 WHERE id = #{userId}")
  void addBeAttentionSum(int userId);

  /**
   *  减少粉丝数量
   */
  @Update("UPDATE user SET be_attention_sum = be_attention_sum -1 WHERE id = #{userId}")
  int subFansSum(int userId);

  /**
   * 增加访客总数
   * @param userId
   */
  @Update("UPDATE user SET visitor_sum = visitor_sum +1 WHERE id = #{userId}")
  void addVisitorSum(int userId);

  /**
   * 插入访客记录
   * @param userId
   * @param visitorId
   */
  @Insert("INSERT INTO `user_visitor` (user_id,visitor_id) VALUES (#{userId},#{visitorId})")
  void addVisitor(@Param("userId") int userId,@Param("visitorId") int visitorId);

  /**
   * 获取关注用户列表
   * @param userId
   * @return
   */
  @Select("SELECT id,username,avatar,(SELECT COUNT(*) FROM user_attention WHERE user_id =user.id AND attention_user_id = #{userId} LIMIT 1) AS mutual  "
      + "FROM user WHERE id IN (SELECT attention_user_id FROM user_attention WHERE user_id =#{userId})")
  List<AttentionUser> getAttentionList(int userId);

  /**
   * 获取粉丝列表
   * @param userId
   * @return
   */
  @Select("SELECT id,username,avatar,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id = user.id LIMIT 1) "
      + "AS mutual FROM user WHERE id IN (SELECT user_id FROM user_attention WHERE attention_user_id =#{userId})")
  List<FansUser> getFansList(int userId);

  /**
   * 修改头像
   * @param userId
   * @param avatar
   */
  @Update("UPDATE user SET avatar =#{avatar}  WHERE id=#{userId} ")
  void updateAvatar(@Param("userId") int userId,@Param("avatar") String avatar);

  /**
   * 查询用户vip信息
   * @param userId
   * @return
   */
  @Select("SELECT deadline FROM user_vip WHERE user_id = #{userId}")
  VipInfo getVipInfoByUserId(int userId);

  /**
   * 更新vip截止时间
   * @param deadline
   * @param userId
   */
  @Update("UPDATE user_vip SET deadline =#{deadline} WHERE user_id = #{userId}")
  void updateVipDeadline(@Param("deadline") Date deadline,@Param("userId") int userId);


  /**
   * 插入vip信息
   */
  @Insert("INSERT INTO user_vip (user_id,deadline) VALUES (#{userId},#{deadline})")
  void addVipInfo(@Param("userId") int userId,@Param("deadline") Date deadline);

  /**
   * 获取访客信息
   */
  @Select("SELECT uv.visitor_id,COUNT(uv.id) AS visitSum,MAX(uv.create_time) AS lastTime,(SELECT u.avatar FROM `user` u WHERE u.id=uv.visitor_id )  FROM user_visitor uv  INNER JOIN `user` u ON u.id=uv.user_id \n" +
          "          WHERE user_id =#{userId} GROUP BY visitor_id ORDER BY  lastTime DESC LIMIT 10")
  List<Visitor> getVisitorList(int userId);

  /**
   *  插入举报记录
   */
  @Insert("INSERT INTO user_complaint (informer_id,object_id,reason,object_type) VALUES (#{informerId},#{objectId},#{reason},#{objectType})")
  int inform(@Param("informerId") int informerId,@Param("objectId") int objectId,@Param("reason") String reason,@Param("objectType") String objectType);

  /**
   * 获取指定id数组的用户
   * @param ids 用户id数组
   * @return
   */
  @Select("<script>SELECT * FROM user WHERE id IN (<foreach collection='ids' item='item' separator=','>#{item}</foreach>)</script>")
  List<User> getUsersByIds(@Param("ids") int [] ids);

  /**
   * 查找用户头像背景
   * @param userId
   * @return
   */
  @Select("SELECT background FROM user WHERE id = #{userId}")
  String getBackgroundByUserId(int userId);

  /**
   * 修改用户头像
   * @param background
   * @param userId
   */
  @Update("UPDATE user SET background =#{background} WHERE id= #{userId}")
  void updateBackground(@Param("background") String background,@Param("userId") int userId);


  /**
   * 修改用户性别
   * @param sex
   * @param userId
   */
  @Update("UPDATE user SET sex =#{sex} WHERE id= #{userId}")
  void updateSex(@Param("sex") short sex,@Param("userId") int userId);

  /**
   * 查询用户邀请码
   * @param userId 用户id
   * @return
   */
  @Select("SELECT code FROM user_invite_code WHERE user_id = #{userId}")
  String getInviteCodeByUserId(int userId);


  /**
   * 插入用户邀请码
   * @param userId 用户id
   */
  @Insert("INSERT INTO user_invite_code (user_id,`code`) VALUES (#{userId},#{code})")
  void addInviteCode(@Param("userId") int userId,@Param("code") String code);

  /**
   * 使用邀请码查询邀请人id
   * @param inviteCode 邀请码
   * @return 邀请人id
   */
  @Select("SELECT user_id FROM user_invite_code WHERE `code` = #{inviteCode}")
  Integer getUserIdByInviteCode(String inviteCode);

  /**
   * 管理员删除头像审核
   * @param userId
   * @return
   */
  @Delete("DELETE FROM audit_avatar WHERE user_id = #{userId}")
  int deleteAvatarAudit(int userId);

  /**
   * 用户增加头像审核
   * @param userId
   * @param avatar
   * @return
   */
  @Insert("INSERT INTO audit_avatar (user_id,avatar) VALUES (#{userId},#{avatar})")
  int addAvatarAudit(@Param("userId") int userId, @Param("avatar") String avatar);

  @Select("SELECT username,avatar,sex,"+
          "(SELECT COUNT(*) FROM user_vip WHERE user_id =#{userId} AND deadline > NOW()) AS isVip,"+
          "(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = #{userId} AND user_verify.is_passed=1) AS isVerify " +
          "FROM user WHERE id = #{userId}")
  Publisher getPublisherById(int userId);
}
