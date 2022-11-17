package com.living.activity.mapper;

import com.living.activity.domain.dto.Emoticon;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EmoticonDao {

  /**
   * 插入表情包
   * @param filename 文件名
   * @param userId 用户id
   */
  @Insert("INSERT INTO emoticon (filename,user_id) VALUES (#{filename},#{userId})")
  void addEmoticon(@Param("filename") String filename,@Param("userId") int userId);

  /**
   * 查询用户表情包列表
   * @param userId
   * @return
   */
  @Select("SELECT id,filename FROM emoticon WHERE user_id = #{userId} AND is_deleted = 0 ORDER BY id DESC")
  List<Emoticon> emoticonList(int userId);

  /**
   * 删除表情包,软删除
   * @param id
   */
  @Update("UPDATE emoticon SET is_deleted =1 WHERE id = #{id}")
  void deleteEmoticon(int id);
}
