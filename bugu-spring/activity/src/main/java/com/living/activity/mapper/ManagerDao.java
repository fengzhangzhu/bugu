package com.living.activity.mapper;

import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dao.Admin;
import com.living.activity.domain.dao.Label;
import com.living.question.dao.Answer;
import com.living.question.dao.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ManagerDao {

  /**
   * 获取指定父文件夹下的指定名称的文件夹,用于判断文件夹重名
   * @param name
   * @param father
   * @return
   */
  @Select("SELECT name FROM manager_directory WHERE name = #{name} AND father = #{father}")
  String getDirectory(@Param("name") String name,@Param("father") String father);

  /**
   * 获取指定名称的文件夹名,用于判断文件夹是否存在
   * @param name
   * @return
   */
  @Select("SELECT name FROM manager_directory WHERE name = #{name}")
  String getDirectoryByName(String name);

  /**
   * 在指定父文件夹下新建指定名称的文件夹
   * @param name
   * @param father
   */
  @Insert("INSERT INTO manager_directory (name,father) VALUES (#{name},#{father})")
  void addDirectory(@Param("name") String name,@Param("father") String father);


  /**
   * 获取指定名称文件夹下面的所有文件夹
   */
  @Select("SELECT `name` FROM manager_directory WHERE father = #{directory}")
  List<String> getSonDirectory(String directory);

  /**
   * 删除指定名称文件夹
   * @param directory
   */
  @Delete("DELETE FROM manager_directory WHERE `name` = #{directory}")
  void deleteDirectory(String directory);

  /**
   * 查找系统管理员,用户管理员登陆
   * @param username 账号
   * @param password 密码
   * @return
   */
  @Select("SELECT * FROM admin WHERE username =#{username} AND password = #{password}")
  Admin getAdmin(@Param("username") String username, @Param("password") String password);

  /**
   * 获取未审核的动态
   * @return
   */
  @Select("SELECT * FROM activity WHERE is_audited = 0 ORDER BY id DESC")
  List<Activity> getNotAuditActivity();

  /**
   * 审核通过动态
   * @param id
   */
  @Update("UPDATE activity SET is_audited = 1 WHERE id = #{id}")
  void passActivity(int id);

  /**
   * 删除指定id动态
   * @param id
   */
  @Update("UPDATE activity SET is_deleted =1 , is_audited =1  WHERE id =#{id}")
  void deleteActivity(int id);

  /**
   * 设置动态热度
   * @param activityId
   */
  @Update("UPDATE activity SET hot =#{hot} WHERE id =#{id} ")
  void setActivityHot(@Param("id") int activityId,@Param("hot") int hot);

  /**
   * 获取未审核的问题
   * @return
   */
  @Select("SELECT * FROM question WHERE is_audited = 0 ORDER BY id DESC")
  List<Question> getNotAuditQuestion();

  /**
   * 审核通过问题
   * @param id
   */
  @Update("UPDATE question SET is_audited = 1 WHERE id = #{id}")
  void passQuestion(int id);

  /**
   * 删除指定id问题
   * @param id
   */
  @Update("UPDATE question SET is_deleted =1 , is_audited =1  WHERE id =#{id}")
  void deleteQuestion(int id);

  /**
   * 获取未审核的问题
   * @return
   */
  @Select("SELECT * FROM answer WHERE is_audited = 0 ORDER BY id DESC")
  List<Answer> getNotAuditAnswer();

  /**
   * 审核通过问题
   * @param id
   */
  @Update("UPDATE answer SET is_audited = 1 WHERE id = #{id}")
  void passAnswer(int id);

  /**
   * 删除指定id问题
   * @param id
   */
  @Update("UPDATE answer SET is_deleted =1 , is_audited =1  WHERE id =#{id}")
  void deleteAnswer(int id);


}
