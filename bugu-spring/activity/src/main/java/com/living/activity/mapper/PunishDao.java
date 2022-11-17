package com.living.activity.mapper;

import com.living.core.domain.dao.UserPunish;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;

@Mapper
public interface PunishDao {

  /**
   * 增加惩罚记录
   * @param userId 用户id
   * @param type 惩罚类型
   * @param endTime 结束时间
   */
  @Insert("INSERT INTO user_punish (user_id,type,end_time) VALUES (#{userId},#{type},#{endTime})")
  void addPunish(@Param("userId") Integer userId,@Param("type") String type,@Param("endTime") Date endTime);


  /**
   * 查询用户惩罚
   * @param userId 用户id
   * @return 惩罚类型和结束时间，没有则返回null
   */
  @Select("SELECT type,end_time FROM user_punish WHERE user_id = #{userId} AND is_deleted=0 AND end_time > NOW() LIMIT 1")
  UserPunish getUserPunish(int userId);

}
