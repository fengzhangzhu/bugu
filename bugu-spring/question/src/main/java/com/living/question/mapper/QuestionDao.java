package com.living.question.mapper;

import com.living.question.dao.Label;
import com.living.question.dao.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月18日 16:48:09
 */
@Mapper
public interface QuestionDao {
    /**
     * 发布问题
     * @param question
     */
    @Insert("INSERT INTO question (user_id,title,text,pics,video,is_anonymity) VALUES (#{userId},#{title},#{text},#{pics},#{video},#{isAnonymity})")
    @Options(keyColumn = "id", keyProperty = "id", useGeneratedKeys = true)
    void publish(Question question);

    /**
     * 获取刷新问题id 不返回删除的问题
     *
     * @param userId 当前用户id
     * @return
     */
    @Select("SELECT question.id FROM question " +
            "LEFT JOIN (SELECT question_view.question_id FROM question_view WHERE user_id =#{userId}) AS history " +
            "ON question.id = history.question_id " +
            "WHERE history.question_id IS NULL AND question.is_deleted=0 " +
            "AND question.visibility = 0 ORDER BY question.id DESC LIMIT 10")
    Integer[] getQuestion(int userId);
    /**
     * 获取问题浏览记录,分页
     *
     * @param userId
     * @return
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select("SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar " +
            "FROM question,question_view WHERE question_view.user_id =#{userId} " +
            "AND question_view.question_id = question.id ORDER BY question_view.id DESC")
    List<Question> getQuestionHistory(@Param("userId") int userId);

    @Select("SELECT question.id FROM question " +
            "LEFT JOIN (SELECT question_view.question_id " +
            "FROM question_view WHERE user_id =#{userId}) AS history " +
            "ON question.id = history.question_id " +
            "WHERE history.question_id IS NULL AND question.is_deleted=0 " +
            "ORDER BY question.id DESC LIMIT 10")
    Integer[] getNewQuestion(int userId);

    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select("SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar " +
            "FROM question WHERE is_deleted=0 ORDER BY question.hot DESC")
    List<Question> getHotQuestion(@Param("userId") int userId);
    @Insert("<script>"
            + "INSERT INTO question_view (user_id,question_id) VALUES "
            + "<foreach collection= 'list' item='item' index='index' separator= ',' >"
            + "(#{userId},#{item})"
            + "</foreach>"
            + "</script>")
    void viewQuestion(@Param("list") Integer[] questions, @Param("userId") int userId);

    @Update("<script>"
            + "UPDATE question SET view_sum = view_sum + 1 WHERE id IN " +
            "(<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)" +
            "</script>")
    void updateViewSum(@Param("list") Integer[] questions);
    @Insert("<script>"
            + "INSERT INTO question_view (user_id,question_id) VALUES "
            + "<foreach collection= 'list' item='item' index='index' separator= ',' >"
            + "(#{userId},#{item})"
            + "</foreach>"
            + "</script>")
    void answerQuestion(@Param("list") Integer[] questions, @Param("userId") int userId);

    @Update("<script>"
            + "UPDATE question SET view_sum = view_sum + 1 WHERE id IN " +
            "(<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)" +
            "</script>")
    void updateAnswerSum(@Param("list") int questionId);
    /**
     * 删除问题
     * @param id
     */
    @Delete("UPDATE question SET is_deleted =1 WHERE id = #{id}")
    void delete(int id);

    /**
     * 获取指定id的问题
     * @param questionId
     */

    @Select("SELECT * FROM question WHERE id = #{questionId}")
    Question getQuestionById(int questionId);

    /**
     * 点赞指定问题
     * @param userId
     * @param questionId
     */
    @Insert("INSERT INTO question_like (user_id,question_id) VALUES (#{userId},#{questionId})")
    void like(@Param("userId") int userId, @Param("questionId") int questionId);

    /**
     * 增加指定问题的点赞数
     * @param id
     * @param hot
     */
    @Update("UPDATE question SET like_sum = like_sum + 1 ,hot = hot+ #{hot}  WHERE id= #{id} ")
    void addLikeSum(@Param("id") int id, @Param("hot") int hot);

    /**
     * 取消点赞指定id的问题
     * @param userId
     * @param questionId
     */
    @Delete("DELETE FROM question_like WHERE user_id =#{userId} AND question_id =#{questionId} ")
    int removeLike(@Param("userId") int userId, @Param("questionId") int questionId);

    /**
     * 减少问题点赞总数
     */
    @Update("UPDATE question SET like_sum = like_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceLikeSum(@Param("id") int id, @Param("hot") int hot);
    /**
     * 收藏指定问题
     * @param userId
     * @param questionId
     */
    @Insert("INSERT INTO question_collect (user_id,question_id) VALUES (#{userId},#{questionId})")
    void collect(@Param("userId") int userId, @Param("questionId") int questionId);

    /**
     * 增加指定问题的收藏数
     * @param id
     * @param hot
     */
    @Update("UPDATE question SET collect_sum = collect_sum + 1 ,hot = hot+ #{hot}  WHERE id= #{id} ")
    void addCollectSum(@Param("id") int id, @Param("hot") int hot);

    /**
     * 取消收藏指定id的问题
     * @param userId
     * @param questionId
     * @return
     */
    @Delete("DELETE FROM question_collect WHERE user_id =#{userId} AND question_id =#{questionId} ")
    int removeCollect(@Param("userId") int userId, @Param("questionId") int questionId);

    /**
     * 减少问题收藏总数
     */
    @Update("UPDATE question SET collect_sum = collect_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceCollectSum(@Param("id") int id, @Param("hot") int hot);

    /**
     * 增加指定问题的回答数
     * @param id
     * @param hot
     */
    @Update("UPDATE question SET answer_sum = answer_sum + 1 ,hot = hot+ #{hot}  WHERE id= #{id} ")
    void addAnswerSum(@Param("id") int id, @Param("hot") int hot);



    /**
     * 减少问题回答总数
     */
    @Update("UPDATE question SET answer_sum = answer_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
    void reduceAnswerSum(@Param("id") int id, @Param("hot") int hot);

    /**
     * 获取自己发布的问题,不返回已删除的问题
     *
     * @param userId 用户id
     * @return
     */
    @Select("SELECT *," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked , " +
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isCollected " +
            "FROM question WHERE user_id =#{userId} AND is_deleted = 0 ORDER BY create_time DESC")
    List<Question> getMyQuestion(@Param("userId") int userId);
    /**
     * 获取其他用户发布的问题
     *
     * @param userId
     * @return
     */
    @Select("SELECT *," +
            "(SELECT COUNT(*) FROM question_like " +
            "WHERE user_id = #{myId} AND question_id =question.id LIMIT 1) AS isLiked " +
            "FROM question WHERE user_id =#{userId} AND is_deleted = 0 " +
            "AND is_anonymity = 0 ORDER BY create_time DESC")
    List<Question> getUserQuestion(@Param("userId") int userId,@Param("myId") int myId);

    /**
     * 获取指定id问题详情
     *
     * @param userId
     * @return
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select("SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked," +
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar " +
            "FROM question WHERE question.id = #{questionId} ")
   Question getQuestionDetail(int questionId,int userId);

    /**
     *     返回用户点收藏问题
     * @param uid
     * @return
     */
    @Results({@Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select(" SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = question.user_id AND question_id =question.id LIMIT 1) AS isLiked," +
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = question.user_id AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar " +
            "FROM question,question_collect qc WHERE " +
            "qc.user_id=#{uid}  AND " +
            "qc.question_id = question.id " +
            "ORDER BY qc.create_time DESC")
    List<Question> getUserCollectedQuestion(Integer uid);

    /**
     * 根据回答id列表获取问题详情
     * @param answerIds 回答id数组
     * @return
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select("<script>" +
            "SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar " +
            "FROM question WHERE question.id IN " +
            "(SELECT question_id FROM answer WHERE answer.id IN" +
            "(<foreach collection = 'list' item = 'item' separator = ','>#{item}</foreach>))" +
            "</script>")
    List<Question> getQuestionsByAnswerIds(@Param("list") int [] answerIds,@Param("userId") int userId);

    /**
     * 查找拥有指定id标签的动态,按动态发布时间倒序 不返回is_deleted为1的动态,不返回可见性不为广场可见的动态
     *
     * @param labelId
     * @return 动态列表
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar"),})
    @Select("SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar  " +
            "FROM question,question_label WHERE question_label.label_id =#{labelId} " +
            "AND question.id=question_label.question_id AND question.is_deleted = 0 " +
            "ORDER BY question.create_time DESC")
    List<Question> findQuestionByLabel(@Param("labelId") int labelId, @Param("userId") int myId);

    /**
     * 全文查找包含子文本的问题 不返回已删除的动态
     * @param subText 子文本
     * @return  动态id，最多一百个
     */
    @Results({
            @Result(property = "publisher.username", column = "username"),
            @Result(property = "publisher.id", column = "user_id"),
            @Result(property = "publisher.avatar", column = "avatar")})
    @Select("SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar  " +
            "FROM question WHERE MATCH(title,text) against(#{subText}) AND is_deleted =0 " +
            "UNION SELECT question.*," +
            "(SELECT COUNT(*) FROM question_like WHERE user_id = #{userId} AND question_id = question.id LIMIT 1) AS isLiked,"+
            "(SELECT COUNT(*) FROM question_collect WHERE user_id = #{userId} AND question_id =question.id LIMIT 1) AS isCollected," +
            "(SELECT username FROM `user` WHERE id = question.user_id ) AS username," +
            "(SELECT avatar FROM `user` WHERE id= question.user_id) AS avatar  " +
            "FROM (question INNER JOIN question_label ON question_label.question_id= question.id) " +
            "INNER JOIN label_q ON label_q.id = question_label.label_id WHERE label_q.content = #{subText} AND is_deleted =0")
    List<Question> getFullTextQuery(@Param("subText") String subText,@Param("userId") int userId);

}
