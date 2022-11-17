package com.living.question.mapper;

import com.living.question.dao.Answer;
import com.living.question.dao.Label;
import com.living.question.dao.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author mulan
 * @version 1.0
 * @description 回答模块
 * @date 2022年 07月21日 08:42:09
 */
@Mapper
public interface AnswerDao {
    /**
     * 发布回答
     * @param answer
     */
    @Insert("INSERT INTO answer (user_id,question_id,text,pic,is_anonymity,is_video) VALUES (#{userId},#{questionId},#{text},#{pic},#{isAnonymity},#{isVideo})")
    @Options(keyColumn = "id", keyProperty = "id", useGeneratedKeys = true)
    void publish(Answer answer);

    /**
     * 删除问题
     * @param id
     */
    @Delete("UPDATE answer SET is_deleted =1 WHERE id = #{id}")
    void delete(int id);

    @Results({
            @Result(property = "publisher.isAttention", column = "isAttention"),
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),
            @Result(property = "publisher.isVerify", column = "isVerify"),
            @Result(property = "publisher.sex", column = "sex"),
            @Result(property = "publisher.isVip",column = "isVip"),
    })
    @Select("SELECT answer.*," +
            "(SELECT COUNT(*) FROM user_vip WHERE user_id = answer.user_id AND deadline > NOW()) AS isVip,"+
            "(SELECT sex FROM `user` WHERE id = answer.user_id ) AS sex,"+
            "(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = answer.user_id AND user_verify.is_passed=1) AS isVerify," +
            "(SELECT COUNT(*) FROM answer_agree WHERE user_id = #{userId} AND answer_id = answer.id LIMIT 1) AS isAgreed," +
            "(SELECT COUNT(*) FROM answer_oppose WHERE user_id = #{userId} AND answer_id = answer.id LIMIT 1) AS isOpposed," +
            "(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =answer.user_id) AS isAttention,"+
            "(SELECT username FROM `user` WHERE id = answer.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= answer.user_id) AS avatar " +
            "FROM answer,answer_view WHERE answer_view.user_id =#{userId} " +
            "AND answer_view.answer_id = answer.id "+
            "AND answer.question_id = #{questionId} ORDER BY answer.hot DESC")
    List<Answer> getAnswerHistory(@Param("questionId") int questionId,@Param("userId") int userId);

    @Select("SELECT answer.id FROM (SELECT * FROM answer WHERE answer.question_id = #{questionId}) AS answer " +
            "LEFT JOIN (SELECT answer_view.answer_id " +
            "FROM answer_view WHERE user_id =#{userId}) AS history " +
            "ON answer.id = history.answer_id " +
            "WHERE history.answer_id IS NULL AND answer.is_deleted=0 " +
            "ORDER BY answer.hot DESC LIMIT 10")
    Integer[] getNewAnswer(int questionId, int userId);

    @Select("SELECT * FROM answer WHERE id = #{answerId}")
    Answer getAnswerById(int answerId);
    @Insert("<script>"
            + "INSERT INTO answer_view (user_id,answer_id) VALUES "
            + "<foreach collection= 'list' item='item' index='index' separator= ',' >"
            + "(#{userId},#{item})"
            + "</foreach>"
            + "</script>")
    void viewAnswer(@Param("list") Integer[] answers, @Param("userId") int userId);

    @Update("<script>"
            + "UPDATE answer SET view_sum = view_sum + 1 WHERE id IN " +
            "(<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)" +
            "</script>")
    void updateViewSum(@Param("list") Integer[] answers);
    @Select("SELECT COUNT(*) FROM answer_agree WHERE answer_id = #{answerId} AND user_id = #{userId}")
    int getIsAgreed(@Param("answerId") int answerId, @Param("userId") int userId);
    @Insert("INSERT INTO answer_agree (user_id,answer_id) VALUES (#{userId},#{answerId})")
    void agreeAnswer(@Param("answerId") int answerId, @Param("userId") int userId);

    @Update("UPDATE answer SET agree_sum = agree_sum + 1 ,hot = hot + #{hot} WHERE id = #{answerId}")
    void updateAgreeSum(@Param("answerId") int answerId,@Param("hot") int hot);
    /**
     * 取消赞同指定Id的回答
     */
    @Delete("DELETE FROM answer_agree WHERE user_id =#{userId} AND answer_id =#{answerId} ")
    int removeAgree(@Param("userId") int userId, @Param("answerId") int answerId);

    /**
     * 减少回答赞同总数
     */
    @Update("UPDATE answer SET agree_sum = agree_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceAgreeSum(@Param("id") int id, @Param("hot") int hot);

    @Select("SELECT COUNT(*) FROM answer_agree WHERE answer_id = #{answerId} AND user_id = #{userId}")
    int getIsOpposed(@Param("answerId") int answerId, @Param("userId") int userId);
    @Insert("INSERT INTO answer_oppose (user_id,answer_id) VALUES (#{userId},#{answerId})")
    void opposeAnswer(@Param("answerId") int answerId, @Param("userId") int userId);

    @Update("UPDATE answer SET oppose_sum = oppose_sum + 1,hot = hot + #{hot} WHERE id = #{answerId}")
    void updateOpposeSum(@Param("answerId") int answerId,@Param("hot") int hot);

    /**
     * 取消反对指定Id的回答
     */
    @Delete("DELETE FROM answer_oppose WHERE user_id =#{userId} AND answer_id =#{answerId} ")
    int removeOppose(@Param("userId") int userId, @Param("answerId") int answerId);

    /**
     * 减少回答反对总数
     */
    @Update("UPDATE answer SET oppose_sum = oppose_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceOpposeSum(@Param("id") int id, @Param("hot") int hot);

    /**
     * 增加回答评论总数
     */
    @Update("UPDATE answer SET comment_sum = comment_sum + 1 ,hot = hot + #{hot} WHERE id = #{answerId}")
    void updateCommentSum(@Param("answerId") int answerId,@Param("hot") int hot);

    /**
     * 减少回答评论总数
     */
    @Update("UPDATE answer SET comment_sum = comment_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceCommentSum(@Param("id") int id, @Param("hot") int hot);
    @Results({
            @Result(property = "publisher.isAttention", column = "isAttention"),
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),
            @Result(property = "publisher.isVerify", column = "isVerify"),
            @Result(property = "publisher.sex", column = "sex"),
            @Result(property = "publisher.isVip",column = "isVip"),
    })
    @Select("<script>" +
            "SELECT answer.*," +
            "(SELECT COUNT(*) FROM user_vip WHERE user_id = answer.user_id AND deadline > NOW()) AS isVip,"+
            "(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = answer.user_id AND user_verify.is_passed=1) AS isVerify," +
            "(SELECT sex FROM user WHERE user.id = answer.user_id ) AS sex,"+
            "(SELECT username FROM user WHERE user.id = answer.user_id ) AS username," +
            "(SELECT avatar FROM user WHERE id= answer.user_id) AS avatar " +
            "FROM answer WHERE answer.id " +
            "IN (" +
            "SELECT SUBSTRING_INDEX(GROUP_CONCAT(id ORDER BY hot DESC),',',1) FROM answer WHERE question_id in" +
            "(<foreach collection = 'list' item = 'item' separator = ','>" +
            "#{item}"+
            "</foreach>) AND answer.is_deleted = 0 " +
            "GROUP BY answer.question_id ORDER BY answer.hot )"+
            "</script>"
    )
    List<Answer> getHotAnswersByQuestionIds(@Param("list") int [] questionIds);
    @Select("<script>" +
            "SELECT label.id,label.content,question_label.question_id " +
            "FROM label_q label,question_label WHERE "
            + "question_label.question_id " +
            "IN (<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>) " +
            "AND label.id=question_label.label_id</script>")
    List<Label> getLabelsByQuestionIds(@Param("list") int [] questionIds);

    @Results({
            @Result(property = "publisher.isAttention", column = "isAttention"),
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),
            @Result(property = "publisher.isVerify", column = "isVerify"),
            @Result(property = "publisher.sex", column = "sex"),
            @Result(property = "publisher.isVip",column = "isVip"),
    })
    @Select("SELECT answer.*," +
            "(SELECT COUNT(*) FROM answer_agree WHERE user_id = #{userId} AND answer_id = #{answerId} LIMIT 1) AS isAgreed," +
            "(SELECT COUNT(*) FROM answer_oppose WHERE user_id = #{userId} AND answer_id = #{answerId} LIMIT 1) AS isOpposed," +
            "(SELECT COUNT(*) FROM user_vip WHERE user_id = answer.user_id AND deadline > NOW()) AS isVip,"+
            "(SELECT sex FROM `user` WHERE id = answer.user_id ) AS sex,"+
            "(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = answer.user_id AND user_verify.is_passed=1) AS isVerify," +
            "(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =answer.user_id) AS isAttention,"+
            "(SELECT username FROM `user` WHERE id = answer.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= answer.user_id) AS avatar " +
            "FROM answer WHERE answer.id =#{answerId}")
    Answer getAnswerDetail(@Param("answerId") int answerId,@Param("userId") int userId);
    @Select("SELECT * FROM answer WHERE user_id = #{userId} AND is_deleted = 0")
    List<Answer> getMyAnswer(@Param("userId") int userId);
}
