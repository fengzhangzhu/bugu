package com.living.activity.mapper;

import com.living.activity.domain.dao.BlindBox;
import com.living.activity.domain.dao.BlindBoxTicket;
import com.living.activity.domain.dto.BlindBoxCollectLog;
import com.living.activity.domain.dto.BoxInfo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BlindBoxDao {


  /**
   * 查找指定id用户当天投送的盲盒
   * @param userId 用户id
   * @return 存在返回盲盒id，不存在返回null
   */
  @Select("SELECT id FROM blind_box WHERE user_id = #{userId} AND blind_box.create_time BETWEEN CONCAT(CURDATE(),' 00:00:00') AND CONCAT(CURDATE(),' 23:59:59')")
  Integer getTodayBox(int userId);


  /**
   * 插入盲盒
   * @param userId
   * @param text
   * @param sex
   */
  @Insert("INSERT INTO blind_box (user_id,text,sex) VALUES (#{userId},#{text},#{sex})")
  void putBox(@Param("userId") int userId,@Param("text") String text,@Param("sex") short sex);


  /**
   * 查找用户本周获取的抽取盲盒机会次数
   * @param userId 用户id
   * @return 0次返回null,否则返回次数
   */
  @Select("SELECT COUNT(*) FROM blind_box_ticket  WHERE user_id =#{userId} AND YEARWEEK(CURDATE(),1) = YEARWEEK(create_time,1)")
  Integer getBoxCollectChanceWeekSum(int userId);

  /**
   * 增加盲盒抽取机会
   * @param userId
   */
  @Insert("INSERT INTO blind_box_ticket (user_id) VALUES (#{userId})")
  void addBoxCollectChance(int userId);


  /**
   * 获取指定性别的盲盒id
   * 不返回已收取和已删除的
   * @param sex
   * @return id数组
   */
  @Select("SELECT id FROM blind_box WHERE is_collected =0 AND sex = #{sex} AND is_deleted=0")
  List<Integer> getBoxIds(int sex);

  /**
   * 获取指定id盲盒
   * @param id
   * @return
   */
  @Select("SELECT * FROM blind_box WHERE id = #{id}")
  BlindBox getBoxById(int id);

  /**
   * 查找用户今日获取盲盒的记录
   * @param userId 用户id
   * @return 今日获取过返回获取记录id，今日未获取返回null
   */
  @Select("SELECT id FROM blind_box_collect_log WHERE user_id =#{userId} AND TO_DAYS(create_time) = TO_DAYS(NOW())")
  Integer getBoxTodayCollectLog(int userId);

  /**
   * 减少用户获取盲盒机会数
   * @param userId 用户id
   * @return 减少成功返回1,若用户无机会或者其他原因导致失败返回0;
   */
  @Update("UPDATE blind_box_ticket SET is_used =1 WHERE user_id = #{userId} AND is_used = 0 LIMIT 1 ")
  int subBoxCollectChance(int userId);

  /**
   * 标记盲盒已被收取
   * @param boxId 盲盒id
   */
  @Update("UPDATE blind_box SET is_collected =1 WHERE id = #{boxId}")
  void markCollect(int boxId);

  /**
   * 插入盲盒收取记录
   * @param userId 用户id
   * @param boxId 盲盒id
   */
  @Insert("INSERT INTO blind_box_collect_log (user_id,blind_box_id) VALUES (#{userId},#{boxId})")
  void addBoxCollectLog(@Param("userId") int userId,@Param("boxId") int boxId);

  /**
   * 获取盲盒券列表
   * @param userId 用户id
   * @return
   */
  @Select("SELECT * FROM blind_box_ticket WHERE user_id = #{userId} ORDER BY id DESC")
  List<BlindBoxTicket> getTicketList(int userId);

  /**
   * 获取用户可用的盲盒券总数
   * @param userId
   * @return
   */
  @Select("SELECT COUNT(*) FROM blind_box_ticket WHERE user_id =#{userId} AND is_used =0 ")
  int getAvailableTicketSum(int userId);


  /**
   * 查找用户盲盒收集记录
   * @param userId 用户id
   * @return
   */
  @Select("SELECT blind_box_collect_log.id,blind_box.user_id,blind_box.text,blind_box.sex,blind_box_collect_log.create_time AS collectTime FROM blind_box_collect_log,blind_box WHERE blind_box_collect_log.user_id =#{userId} AND blind_box_collect_log.blind_box_id = blind_box.id ORDER BY blind_box_collect_log.id DESC")
  List<BlindBoxCollectLog> getCollectLog(int userId);

  /**
   * 查找用户盲盒投递记录
   * @param userId 用户id
   * @return
   */
  @Select("SELECT * FROM blind_box WHERE user_id =#{userId} ORDER BY id DESC")
  List<BlindBox> getDeliverLog(int userId);


  /**
   * 删除盲盒
   * 软删除
   * @param boxId
   */
  @Update("UPDATE blind_box SET is_deleted =1 WHERE id= #{boxId}")
  void deleteBox(int boxId);


  /**
   * 获取剩余盲盒信息
   *
   *
   * @return 剩余男盒女盒数量
   */
  @Select("SELECT (SELECT COUNT(*) FROM blind_box WHERE sex =0 AND is_collected =0 AND is_deleted = 0) AS femaleBoxSum,(SELECT COUNT(*) FROM blind_box WHERE sex =1 AND is_collected =0 AND is_deleted = 0) AS maleBoxSum")
  BoxInfo getInfo();


}
