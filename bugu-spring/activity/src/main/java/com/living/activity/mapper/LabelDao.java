package com.living.activity.mapper;

import com.living.activity.domain.dao.Label;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface LabelDao {

  /**
   * 分页返回标签列表
   * @return
   */
  @Select("SELECT * FROM label ORDER BY hot DESC")
  List<Label> getLabelList();

  /**
   * 插入新标签
   * @param label 标签名
   */
  @Insert("INSERT INTO label (content) VALUES (#{content})")
  @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
  void addLabel(Label label);

  /**
   * 根据标签名获取标签
   * @param content
   * @return
   */
  @Select("SELECT * FROM label WHERE content = #{content}")
  Label getLabelByContent(String content);

  /**
   * 模糊查询标签名
   * @param content
   * @return
   */
  @Select("SELECT * FROM label WHERE content LIKE #{content} LIMIT 20")
  List<Label> fuzzyQueryLabel(String content);

  /**
   * 记录标签的动态
   * @param labels
   * @param activityId
   */
  @Insert("<script>INSERT INTO activity_label (activity_id,label_id) VALUES <foreach collection = 'list' item='item' separator = ','>(#{activityId},#{item})</foreach></script>")
  void addActivityLabels(@Param("list") int [] labels,@Param("activityId") int activityId);

  /**
   * 查询指定动态id数组的标签
   * @param activityIds 动态id数组
   * @return
   */
  @Select("<script>SELECT label.id,label.content,activity_label.activity_id FROM label,activity_label WHERE "
      + "activity_label.activity_id IN (<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>) AND label.id=activity_label.label_id</script>")
  List<Label> getLabelsByActivityIds(@Param("list") int [] activityIds);

  /**
   * 查询指定id动态的标签
   * @param activityId 动态id
   * @return
   */
  @Select("SELECT label.id,label.content FROM label,activity_label WHERE activity_label.activity_id =#{activityId} AND label.id=activity_label.label_id")
  List<Label> getLabelsByActivityId(int activityId);

  /**
   * 未审核标签列表
   * @param page
   * @return
   */
  @Select("SELECT * FROM label WHERE is_audit = 0")
  List<Label> unAuditLabelList(int page);

  /**
   * 标记标签已审核
   * @param labelId
   */
  @Update("UPDATE label SET is_audit =1 WHERE id = #{id}")
  void passLabel(int labelId);

  /**
   * 删除标签
   * @param labelId
   */
  @Delete("DELETE FROM label WHERE id = #{id}")
  void deleteLabel(int labelId);

  /**
   * 删除动态标签
   * @param labelId
   */
  @Delete("DELETE FROM activity_label WHERE activity_label.label_id = #{id}")
  void deleteActivityLabel(int labelId);

  /**
   * 增加标签热度
   * @param addHot 增加数值
   * @param ids 标签id数组
   *
   */
  @Update("<script>UPDATE label SET hot = hot + #{addHot} WHERE id IN (<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)</script>")
  void addLabelsHot(@Param("addHot") int addHot,@Param("list") int [] ids);

  /**
   * 增加标签热度
   * @param addHot
   * @param labelId
   */
  @Update("UPDATE label SET hot = hot + #{addHot} WHERE id = #{labelId}")
  void addLabelHot(@Param("addHot") int addHot,@Param("labelId") int labelId);

  /**
   * 未审核标签列表
   * @param page
   * @return
   */
  @Select("SELECT * FROM label_q WHERE is_audit = 0")
  List<Label> unAuditQuestionLabelList(int page);

  /**
   * 标记问题标签已审核
   * @param labelId
   */
  @Update("UPDATE label_q SET is_audit =1 WHERE id = #{id}")
  void passQuestionLabel(int labelId);

  /**
   * 删除问题标签
   * @param labelId
   */
  @Delete("DELETE FROM label_q WHERE id = #{id}")
  void deleteQuestionLabel(int labelId);
  /**
   * 删除问题的标签
   * @param labelId
   */
  @Delete("DELETE FROM question_label WHERE question_label.label_id = #{id}")
  void deleteLabelOfQuestion(int labelId);

  /**
   * 获取推荐动态的标签
   */
  @Select("SELECT * FROM label WHERE is_recommended = 1 ORDER BY hot DESC LIMIT 20")
  List<Label> getRecommendedLabelList();

  /**
   * 修改标签的信息
   */
  @Update("UPDATE label SET content = #{content},hot = #{hot}, icon=#{icon},is_recommended=#{isRecommended} WHERE id = #{id}")
  void updateLabelInfo(Label label);
}
