package com.living.activity.mapper;

import com.living.activity.domain.dao.AvatarAudit;
import com.living.core.domain.dao.UserComplain;
import com.living.core.domain.dao.UserVerify;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface AuditDao {

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

  /**
   * 获取未审核的用户头像列表
   * @return
   */
  @Select("SELECT * FROM audit_avatar")
  List<AvatarAudit> getAvatarList();

  /**
   * 获取用户实名认证申请列表
   * @return
   */
  @Select("SELECT * FROM user_verify WHERE is_passed =0")
  List<UserVerify> getVerifyRequestList();


  /**
   * 标记实名认证请求为认证通过
   * @param id
   */
  @Update("UPDATE user_verify SET is_passed =1,sex = #{sex},stuId = #{stuId} WHERE id = #{id}")
  void passVerifyRequest(@Param("id") int id,@Param("sex") Short sex,@Param("stuId") String stuId);


  /**
   * 删除实名认证请求
   * @param id
   */
  @Delete("DELETE FROM user_verify WHERE id = #{id}")
  void deleteVerifyRequest(int id);

  /**
   * 获取指定id实名认证请求
   * @param id
   * @return
   */
  @Select("SELECT * FROM user_verify WHERE id =#{id}")
  UserVerify getUserVerifyById(int id);

  /**
   * 获取用户举报列表
   * @return
   */
  @Select("SELECT * FROM user_complaint WHERE is_deleted =0")
  List<UserComplain> getUserComplainList();

  /**
   * 查询指定id用户举报
   * @param id
   * @return
   */
  @Select("SELECT * FROM user_complaint WHERE id = #{id}")
  UserComplain getUserComplainById(int id);

  /**
   * 标记用户举报为删除状态
   * @param id
   */
  @Update("UPDATE user_complaint SET is_deleted = 1 WHERE id = #{id}")
  void deleteUserComplainById(int id);




}
