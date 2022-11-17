package com.living.core.mapper;


import com.living.core.domain.dao.OfficeMessage;
import com.living.core.domain.dao.OfficeMessageObject;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OfficialMessageDao {

  /**
   * 插入官方消息
   * @param
   */
  @Insert("INSERT INTO official_message (text,pic,type) VALUES (#{text},#{pic},#{type})")
  @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
  void addOfficeMessage(OfficeMessage officeMessage);

  /**
   * 插入官方消息发布对象
   * @param officeMessageId
   * @param userId
   */
  @Insert("INSERT INTO official_message_object (official_message_id,user_id) VALUES (#{officeMessageId},#{userId})")
  void addOfficeMessageObject(@Param("officeMessageId") int officeMessageId,@Param("userId") int userId);

  /**
   * 获取官方消息
   * @return
   */
  @Select("SELECT * FROM official_message")
  List<OfficeMessage> getOfficialMessage();

  /**
   * 获取指定官方消息详情
   * @param id 官方消息id
   * @return
   */
  @Select("SELECT * FROM official_message_object WHERE official_message_id = #{id}")
  List<OfficeMessageObject> getOfficialMessageObjectByMessageId(int id);
}
