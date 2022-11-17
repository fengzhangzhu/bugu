package com.living.question.mapper;
import java.util.List;


import com.living.question.dao.Label;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月18日 17:08:17
 */
@Mapper
public interface QuestionLabelDao {

    /**
     * 分页返回标签列表
     * @return
     */
    @Select("SELECT id,content,hot FROM label_q ORDER BY hot DESC")
    List<Label> getLabelList();

    /**
     * 插入新标签
     * @param label 标签名
     */
    @Insert("INSERT INTO label_q (content) VALUES (#{content})")
    @Options(keyProperty = "id",keyColumn = "id",useGeneratedKeys = true)
    void addLabel(Label label);

    /**
     * 根据标签名获取标签
     * @param content
     * @return
     */
    @Select("SELECT * FROM label_q WHERE content = #{content}")
    Label getLabelByContent(String content);

    /**
     * 模糊查询标签名
     * @param content
     * @return
     */
    @Select("SELECT * FROM label_q WHERE content LIKE #{content} LIMIT 20")
    List<Label> fuzzyQueryLabel(String content);

    /**
     * 记录标签的动态
     * @param labels
     * @param questionId
     */
    @Insert("<script>INSERT INTO question_label (question_id,label_id) VALUES <foreach collection = 'list' item='item' separator = ','>(#{questionId},#{item})</foreach></script>")
    void addQuestionLabels(@Param("list") int [] labels,@Param("questionId") int questionId);

    /**
     * 查询指定动态id数组的标签
     * @param questionIds 动态id数组
     * @return
     */
    @Select("<script>SELECT label.id,label.content,question_label.question_id FROM label_q label,question_label WHERE "
            + "question_label.question_id IN (<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>) AND label.id=question_label.label_id</script>")
    List<Label> getLabelsByQuestionIds(@Param("list") int [] questionIds);

    /**
     * 查询指定id动态的标签
     * @param questionId 动态id
     * @return
     */
    @Select("SELECT label.id,label.content FROM label_q label,question_label WHERE question_label.question_id =#{questionId} AND label.id=question_label.label_id")
    List<Label> getLabelsByQuestionId(int questionId);

    /**
     * 未审核标签列表
     * @param page
     * @return
     */
    @Select("SELECT * FROM label_q WHERE is_audit = 0")
    List<Label> unAuditLabelList(int page);

    /**
     * 标记标签已审核
     * @param labelId
     */
    @Update("UPDATE label_q SET is_audit =1 WHERE id = #{id}")
    void passLabel(int labelId);

    /**
     * 删除标签
     * @param labelId
     */
    @Delete("DELETE FROM label_q WHERE id = #{id}")
    void deleteLabel(int labelId);

    /**
     * 删除动态标签
     * @param labelId
     */
    @Delete("DELETE FROM question_label WHERE question_label.label_id = #{id}")
    void deleteQuestionLabel(int labelId);

    /**
     * 增加标签热度
     * @param addHot 增加数值
     * @param ids 标签id数组
     *
     */
    @Update("<script>UPDATE label_q SET hot = hot + #{addHot} WHERE id IN (<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)</script>")
    void addLabelsHot(@Param("addHot") int addHot,@Param("list") int [] ids);

    /**
     * 增加标签热度
     * @param addHot
     * @param labelId
     */
    @Update("UPDATE label_q SET hot = hot + #{addHot} WHERE id = #{labelId}")
    void addLabelHot(@Param("addHot") int addHot,@Param("labelId") int labelId);
}

