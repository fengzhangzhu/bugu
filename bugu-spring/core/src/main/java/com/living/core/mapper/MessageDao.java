package com.living.core.mapper;



import com.living.core.domain.dao.Message;
import com.living.core.domain.dto.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface MessageDao {

  /**
   * 插入消息
   *
   * @param message 消息对象
   * @return
   */
  @Insert("INSERT INTO message (content,from_user_id,to_user_id,type,time) VALUES (#{content},#{fromUserId},#{toUserId},#{type},#{time})")
  @Options(keyProperty = "id", keyColumn = "id", useGeneratedKeys = true)
  void addMessage(Message message);

  /**
   * 撤回消息
   * @param id
   */
  @Delete("DELETE FROM message WHERE id = #{id}")
  void deleteMessage(int id);

  /**
   * 插入未读消息
   * @param messageId
   */
  @Insert("INSERT INTO unread_message (message_id) VALUES (#{messageId})")
  void addUnreadMessage(int messageId);

  /**
   * 查询未读消息信息
   *
   * @param userId 当前用户id
   * @return 发送方用户id, 用户名，头像，未读消息数目
   */
  @Select("SELECT (SELECT message.content FROM message WHERE id = MAX(unread_message.message_id)) AS lastMessage,(SELECT message.type FROM message WHERE id = MAX(unread_message.message_id)) AS lastMessageType,from_user_id AS userId,(SELECT username FROM `user` WHERE id = from_user_id) AS username,"
      + "(SELECT avatar FROM `user` WHERE id = from_user_id) AS avatar,COUNT(*) AS unReadSum,MAX(unread_message.create_time) AS lastTime"
      + " FROM message,unread_message WHERE message.id = unread_message.message_id AND to_user_id =#{userId}  GROUP BY from_user_id")
  List<UnReadUser> getUnReadUser(int userId);


  /**
   * 查询指定id用户发送的未读消息
   */
  @Select("SELECT message.id,content,type,message.create_time,message.time FROM unread_message,message WHERE message.from_user_id =#{objectId} AND message.to_user_id =#{myId} AND unread_message.message_id=message.id  ")
  List<UnreadUserMessage> getUnreadMessageByUserId(@Param("objectId") int objectId, @Param("myId") int myId);

  /**
   * 删除指定messageId的未读消息
   * @param messageIds messageId数组
   */
  @Delete("<script>DELETE FROM unread_message WHERE message_id IN (<foreach collection= 'list' item='item' separator=','>#{item}</foreach>)</script>")
  void deleteUnreadMessageByUserId(@Param("list") int [] messageIds);

  /**
   * 查询聊天记录
   *
   * @param objectId
   * @param myId
   * @return
   */
  @Select("SELECT * FROM message WHERE (from_user_id = #{objectId} AND to_user_id = #{myId} AND is_to_deleted =0) OR (from_user_id = #{myId} AND to_user_id =#{objectId} AND is_from_deleted =0) ORDER BY id DESC")
  List<Message> getMessageHistory(@Param("objectId") int objectId, @Param("myId") int myId);

  /**
   * 查找指定日期的聊天记录
   * @param dateBegin
   * @param dateEnd
   * @return
   */
  @Select("SELECT * FROM message WHERE ((from_user_id = #{objectId} AND to_user_id = #{myId} AND is_to_deleted =0) OR (from_user_id = #{myId} AND to_user_id =#{objectId} AND is_from_deleted =0)) AND create_time BETWEEN #{dateBegin} AND #{dateEnd} ORDER BY id DESC")
  List<Message> getMessageHistoryByDate(@Param("dateBegin") String dateBegin,@Param("dateEnd") String dateEnd,@Param("objectId") int objectId, @Param("myId") int myId);

  /**
   * 查询最近三个月存在聊天记录的日期
   * @param objectId 目标用户id
   * @param myId 我的id
   * @return
   */
  @Select("SELECT DISTINCT DATE(create_time) FROM message WHERE ((from_user_id = #{objectId} AND to_user_id = #{myId} AND is_to_deleted =0) OR (from_user_id = #{myId} AND to_user_id =#{objectId} AND is_from_deleted =0)) AND DATE_SUB(CURDATE(),INTERVAL 3 MONTH) <= create_time")
  List<String> getThreeMonthMessageHistory(@Param("objectId") int objectId,@Param("myId") int myId);

  /**
   * 查询最近六个月存在聊天记录的日期
   * @param objectId 目标用户id
   * @param myId 我的id
   * @return
   */
  @Select("SELECT DISTINCT DATE(create_time) FROM message WHERE ((from_user_id = #{objectId} AND to_user_id = #{myId} AND is_to_deleted =0) OR (from_user_id = #{myId} AND to_user_id =#{objectId} AND is_from_deleted =0)) AND DATE_SUB(CURDATE(),INTERVAL 6 MONTH) <= create_time")
  List<String> getSixMonthMessageHistory(@Param("objectId") int objectId,@Param("myId") int myId);

  /**
   * 查询指定id消息
   * @param id
   * @return
   */
  @Select("SELECT * FROM message WHERE id= #{id}")
  Message getMessageById(int id);

  /**
   * 将未读消息标记撤回
   * @param messageId
   */
  @Update("UPDATE unread_message SET is_withdraw =1 WHERE message_id = #{messageId}")
  void withdraw(int messageId);

  /**
   * 删除指定id消息记录,消息是自己发送的
   *
   * @param id
   */
  @Update("UPDATE message SET is_from_deleted =1 WHERE id= #{id}")
  void deleteMyMessageById(int id);

  /**
   * 删除指定id消息记录,消息是对方发送的
   */
  @Update("UPDATE message SET is_to_deleted =1 WHERE id= #{id}")
  void deleteOtherMessageById(int id);


  /**
   * 插入互动消息
   * @param fromUserId
   * @param toUserId
   * @param type
   * @param contentId
   */
  @Insert("INSERT INTO interactive_message (from_user_id,to_user_id,type,content_id,`group`) VALUES (#{fromUserId},#{toUserId},#{type},#{contentId},#{group})")
  void addInteractiveMessage(@Param("fromUserId") int fromUserId,@Param("toUserId") int toUserId,@Param("type") String type,@Param("contentId") int contentId,@Param("group") String group);

  /**
   * 批量插入互动消息
   * @param fromUserId
   * @param toUserIds
   * @param type
   * @param contentId
   */
  @Insert("<script>INSERT INTO interactive_message (from_user_id,to_user_id,type,content_id,`group`) "
      + "VALUES <foreach collection = 'list' item = 'item' separator = ','>(#{fromUserId},#{item},#{type},#{contentId},#{group})</foreach></script>")
  void addInteractiveMessageList(@Param("fromUserId") int fromUserId,@Param("list") List<Integer> toUserIds,@Param("type") String type,@Param("contentId") int contentId,@Param("group") String group);

  /**
   * 获取未读消息的id
   * @param ids 未知状态的消息id
   * @return ids参数中属于未读消息的id
   */
  @Select("<script>SELECT message_id FROM unread_message WHERE message_id IN (<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>)</script>")
  List<Integer> getUnreadMessageIds(@Param("list") Integer [] ids);

  /**
   * 查询指定用户未读互动消息
   * @param userId
   * @return
   */
  @Select("SELECT id,from_user_id AS userId,type,content_id,create_time,`group`,(SELECT username FROM user WHERE id= from_user_id) AS username,(SELECT avatar FROM user WHERE id= from_user_id) AS avatar FROM interactive_message WHERE to_user_id = #{userId}")
  List<UnreadInteractiveMessageDto> getUnreadInteractiveMessage(int userId);

  /**
   * 删除互动消息
   * @param ids
   */
  @Delete("<script>DELETE FROM interactive_message WHERE id IN (<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>)</script>")
  void deleteInteractiveMessage(@Param("list") int [] ids);

  /**
   * 查询用户未读官方消息列表
   * @param userId 用户id
   * @return
   */
  @Select("SELECT official_message.type,COUNT(*) AS unreadSum,(SELECT text FROM official_message temp WHERE temp.id = MAX(official_message.id)) AS lastText,MAX(official_message.create_time) AS lastTime FROM official_message,official_message_object WHERE official_message_object.user_id =#{userId} AND official_message_object.official_message_id = official_message.id AND official_message_object.is_read =0 GROUP BY type")
  List<UnreadOfficialMessage> getUnreadOfficialMessageList(int userId);

  /**
   * 查询用户指定类型未读官方消息
   * @param userId
   * @return
   */
  @Select("SELECT official_message_object.id,official_message.text,official_message.pic,official_message.create_time FROM official_message,official_message_object WHERE official_message_object.user_id =#{userId} AND official_message_object.is_read =0 AND  official_message.id=official_message_object.official_message_id AND official_message.type = #{type}")
  List<SpecialTypeOfficialMessage> getSpecialTypeOfficialMessage(@Param("userId") int userId, @Param("type") String type);

  /***
   * 标记官方消息已读
   * @param ids 官方消息对象表id
   */
  @Update("<script>UPDATE official_message_object SET is_read =1 WHERE id IN (<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)</script>")
  void updateSpecialTypeOfficialMessageState(@Param("list") int []ids);
}
