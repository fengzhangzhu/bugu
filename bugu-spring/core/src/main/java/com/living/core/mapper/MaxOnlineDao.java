package com.living.core.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MaxOnlineDao {

  /**
   * 记录最高在线人数
   * @param maxOnlineSum
   */
  @Insert("INSERT INTO max_online_user (num) VALUES (#{maxOnlineSum})")
  void logMaxOnline(int maxOnlineSum);

  /**
   * 查询最高在线人数
   * @return
   */
  @Select("SELECT MAX(num) FROM max_online_user")
  Integer getMaxOnlineSum();
}
