package com.living.core.mapper;



import com.living.core.domain.dao.UserVerify;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface VerifyDao {

  /**
   * 插入实名认证请求
   * @param stuId 学号
   * @param pic 认证图片名
   */
  @Insert("INSERT INTO user_verify (pic,user_id) VALUES (#{pic},#{userId})")
  void addVerifyRequest(@Param("pic") String pic,@Param("userId") int userId);


  /**
   * 插入实名认证，使用教务认证，不需要审核
   * @param stuId 学号
   * @param pic 认证图片名
   */
  @Insert("INSERT INTO user_verify (stuId,user_id,sex,is_passed) VALUES (#{stuId},#{userId},#{sex},#{isPassed})")
  void addVerify(@Param("stuId") String stuId,@Param("userId") int userId,@Param("sex") short sex,@Param("isPassed") short isPassed);

  /**
   * 查询指定学号认证请求
   * @param stuId
   * @return
   */
  @Select("SELECT * FROM user_verify WHERE stuId = #{stuId}")
  UserVerify getVerifyByStuId(String stuId);

  /**
   * 查询指定id用户认证请求
   * @param userId
   * @return
   */
  @Select("SELECT * FROM user_verify WHERE user_id = #{userId} AND is_passed=1")
  UserVerify getVerifyByUserId(int userId);






}
