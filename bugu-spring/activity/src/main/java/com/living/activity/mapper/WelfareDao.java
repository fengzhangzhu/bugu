package com.living.activity.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WelfareDao {

  /**
   * 获取用户vip免费获取记录
   * @param userId 用户id
   * @return 用户id
   */
  @Select("SELECT user_id FROM vip_get_log WHERE user_id = #{userId}")
  Integer getVipGetLogByUserId(int userId);

  /**
   * 插入vip领取记录
   * @param userId
   */
  @Insert("INSERT INTO vip_get_log (user_id) VALUES (#{userId})")
  void addVipGetLog(int userId);

  /**
   * 查询用户领取动态总数奖励记录
   * @param userId 用户id
   * @return 存在则返回用户id，不存在返回null
   */
  @Select("SELECT user_id FROM user_activity_sum_gift_log WHERE user_id = #{userId}")
  Integer getActivitySumGiftLog(int userId);

  /**
   * 插入获取动态总数奖励记录
   * @param userId
   */
  @Insert("INSERT INTO user_activity_sum_gift_log (user_id) VALUES (#{userId})")
  void addGetActivitySumGistLog(int userId);

}
