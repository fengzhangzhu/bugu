package com.living.activity.mapper;

import org.apache.ibatis.annotations.*;

import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface SignInDao {

  /**
   * 查询用户七天内的签到记录
   * @param userId 用户id
   * @return 签到的时间
   */
  @Select("SELECT create_time FROM user_signin WHERE user_id = #{userId} AND  create_time > #{beginTime} AND is_deleted =0 LIMIT 7")
  List<Timestamp> getSevenDaysSignInLog(@Param("userId") int userId,@Param("beginTime") String beginTime);


  /**
   * 查询用户当天领取签到礼物数
   * @param userId 用户id
   * @param beginTime 当天开始时间
   * @param endTime 当天结束时间
   * @return 0 或 0
   */
  @Select("SELECT COUNT(*) FROM user_signin_gift_log WHERE user_id =#{userId} AND create_time BETWEEN #{beginTime} AND #{endTime} LIMIT 1 ")
  int getGiftToday(@Param("userId") int userId,@Param("beginTime") String beginTime,@Param("endTime") String endTime);

  /**
   * 查询用户今日签到数
   * @return 0 或 1
   */
  @Select("SELECT COUNT(*) FROM user_signin WHERE user_id =#{userId} AND create_time BETWEEN #{todayBegin} AND #{todayEnd} AND is_deleted =0  LIMIT 1 ")
  int getTodaySignInLog(@Param("userId")int userId,@Param("todayBegin")String todayBegin,@Param("todayEnd") String todayEnd);

  /**
   * 插入签到记录
   * @param userId 用户id
   */
  @Insert("INSERT INTO user_signin (user_id) VALUES (#{userId})")
  void addSignLog(int userId);

  /**
   * 插入获取签到礼物记录
   * @param userId
   */
  @Insert("INSERT INTO user_signin_gift_log (user_id) VALUES (#{userId})")
  void addGetGiftLog(int userId);

  /**
   * 标记删除用户签到记录
   * @param userId
   */
  @Update("UPDATE user_signin SET is_deleted =1 WHERE user_id = #{userId}")
  void deleteSignLog(int userId);
}
