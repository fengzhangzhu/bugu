package com.living.activity.mapper;


import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dto.SquareActivity;
import org.apache.ibatis.annotations.*;

import java.util.List;


/**
 * @author lizijian
 */
@Mapper
public interface ActivityDao {

  /**
   * 用户发布动态
   */
  @Insert("INSERT INTO activity (user_id,text,pic,is_anonymity,visibility,video) VALUES (#{userId},#{text},#{pic},#{isAnonymity},#{visibility},#{video})")
  @Options(keyColumn = "id", keyProperty = "id", useGeneratedKeys = true)
  void publish(Activity activity);

  /**
   * 获取指定id动态，返回like状态
   *
   * @param id 动态id
   * @return
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
  @Result(property = "publisher.isVip",column = "isVip")})
  @Select("SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar FROM activity WHERE id = #{id}")
  SquareActivity getActivityInfoById(@Param("id") int id, @Param("userId") int userId);

  /**
   * 获取指定id动态
   *
   * @param id
   * @return
   */
  @Select("SELECT * FROM activity WHERE id = #{id}")
  Activity getActivityById(int id);

  /**
   * 获取自己发布的动态,用于查看主页 不返回已删除的动态
   *
   * @param userId 用户id
   * @return
   */
  @Select("SELECT *,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked FROM activity WHERE user_id =#{userId} AND is_deleted = 0 ORDER BY create_time DESC")
  List<Activity> getMyActivity(int userId);

  /**
   * 获取其他用户发布的动态,用于查看主页 不返回已删除的动态,不返回匿名动态,不返回仅自己可见动态
   *
   * @param userId
   * @return
   */
  @Select("SELECT *,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{myId} AND activity_id =activity.id LIMIT 1) AS isLiked FROM activity WHERE user_id =#{userId} AND is_deleted = 0 AND is_anonymity = 0 AND visibility <=1 ORDER BY create_time DESC")
  List<Activity> getUserActivity(@Param("userId") int userId,@Param("myId") int myId);

  /**
   * 获取广场刷新动态id，限制5个 不返回删除的动态,只返回可见性为广场的动态
   *
   * @param userId 当前用户id
   * @return
   */
  @Select("SELECT activity.id FROM activity LEFT JOIN (SELECT activity_view.activity_id FROM activity_view WHERE user_id =#{userId}) AS history ON activity.id = history.activity_id WHERE history.activity_id IS NULL AND activity.is_deleted=0 AND activity.visibility = 0 ORDER BY activity.id DESC LIMIT 5")
  Integer[] getSquareActivity(int userId);

  /**
   * 获取广场动态浏览记录,分页
   *
   * @param userId
   * @return
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
  @Result(property = "publisher.isVip",column = "isVip")})
  @Select(
      "SELECT activity.*," +
              "(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip" +
              ",(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex," +
              "(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify," +
              "(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked," +
              "(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention," +
              "(SELECT username FROM `user` WHERE id = activity.user_id ) AS username," +
              "(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar "
          + "FROM activity,activity_view WHERE activity_view.user_id =#{userId} " +
              "AND activity_view.activity_id = activity.id ORDER BY activity_view.id DESC")
  List<SquareActivity> getSquareActivityHistory(int userId);

  /**
   * 插入用户动态浏览记录
   *
   * @param activitys 动态id数组
   * @param userId    用户id
   */
  @Insert("<script>"
      + "INSERT INTO activity_view (user_id,activity_id) VALUES "
      + "<foreach collection= 'list' item='item' index='index' separator= ',' >"
      + "(#{userId},#{item})"
      + "</foreach>"
      + "</script>")
  void viewActivity(@Param("list") Integer[] activitys, @Param("userId") int userId);
  @Update("<script>"
          + "UPDATE activity SET view_sum = view_sum + 1 WHERE id IN " +
          "(<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)" +
          "</script>")
  void updateActivityViews(@Param("list") Integer[] activities);
  /**
   * 删除指定id动态
   *
   * @param id 动态id
   */
  @Delete("UPDATE activity SET is_deleted =1 WHERE id = #{id}")
  void delete(int id);

  /**
   * 喜欢指定id动态
   *
   * @param userId     当前用户id
   * @param activityId 动态id
   */
  @Insert("INSERT INTO activity_like (user_id,activity_id) VALUES (#{userId},#{activityId})")
  void like(@Param("userId") int userId, @Param("activityId") int activityId);

  /**
   * 取消喜欢
   */
  @Delete("DELETE FROM activity_like WHERE user_id =#{userId} AND activity_id =#{activityId} ")
  int removeLike(@Param("userId") int userId, @Param("activityId") int activityId);

  /**
   * 增加动态被喜欢总数
   */
  @Update("UPDATE activity SET like_sum = like_sum + 1 ,hot = hot+ #{hot}  WHERE id= #{id} ")
  void addLikeSum(@Param("id") int id, @Param("hot") int hot);

  /**
   * 减少动态被喜欢总数
   */
  @Update("UPDATE activity SET like_sum = like_sum - 1 ,hot = hot- #{hot}  WHERE id= #{id} ")
  void reduceLikeSum(@Param("id") int id, @Param("hot") int hot);

  /**
   * 查询关注者发布的动态,不包含匿名动态，不包含已删除的动态
   *
   * @param userId
   * @return
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
  @Result(property = "publisher.isVip",column = "isVip")})
  @Select("SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar"
      + " FROM activity INNER JOIN user_attention ON user_attention.attention_user_id = activity.user_id WHERE user_attention.user_id = #{userId} AND is_deleted=0 AND is_anonymity = 0 AND visibility = 0  ORDER BY activity.id DESC")
  List<SquareActivity> getAttentionActivity(int userId);

  /**
   * 查询热门动态
   * @param userId
   * @return
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
      @Result(property = "publisher.isVip",column = "isVip")})
  @Select("SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar "
      + " FROM activity WHERE is_deleted=0  AND visibility = 0  ORDER BY hot DESC")
  List<SquareActivity> getHotActivity(int userId);

  /**
   * 获取热门前十的动态
   * @return 动态id数组
   */
  @Select("SELECT activity.id FROM activity WHERE is_deleted=0  AND visibility = 0  ORDER BY hot DESC LIMIT 10")
  List<Integer> getHotActivityId();

  /**
   * 减少热门动态热度
   */
  @Update("<script>UPDATE activity SET hot = hot -#{reduceHot} WHERE id IN (<foreach collection = 'list' item='item' separator=','>#{item}</foreach>)</script>")
  void reduceHotActivityHot(@Param("list") List<Integer> hotActivityIds,@Param("reduceHot") int reduceHot);

  /**
   * 增加动态的评论数
   *
   * @param activityId
   * @return
   */
  @Update("UPDATE activity SET comment_sum = comment_sum +1,hot = hot+ #{hot} WHERE id= #{activityId}")
  int addCommentSum(@Param("activityId") int activityId, @Param("hot") int hot);


  /**
   * 修改动态可见性
   */
  @Update("UPDATE activity SET visibility =#{visibility} WHERE id =#{activityId} ")
  void changeVisibility(@Param("activityId") int activityId, @Param("visibility") short visibility);

  /**
   * 查找拥有指定id标签的动态,按动态发布时间倒序 不返回is_deleted为1的动态,不返回可见性不为广场可见的动态
   *
   * @param labelId
   * @return 动态列表
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
  @Result(property = "publisher.isVip",column = "isVip")})
  @Select("SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar  FROM activity,activity_label WHERE activity_label.label_id =#{labelId} AND activity.id=activity_label.activity_id AND activity.is_deleted = 0 AND activity.visibility = 0 ORDER BY activity.create_time DESC")
  List<SquareActivity> findByLabel(@Param("labelId") int labelId, @Param("userId") int myId);


  /**
   * 全文查找包含子文本的动态 不返回已删除的动态，可见性只能为广场可见
   * @param subText 子文本
   * @return  动态id，最多一百个
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
      @Result(property = "publisher.username", column = "username"),
      @Result(property = "publisher.id", column = "user_id"),
      @Result(property = "publisher.avatar", column = "avatar"),
      @Result(property = "publisher.isVerify", column = "isVerify"),
      @Result(property = "publisher.sex", column = "sex"),
      @Result(property = "publisher.isVip",column = "isVip")})
  @Select("SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar FROM (activity INNER JOIN activity_label ON activity_label.activity_id= activity.id) INNER JOIN label ON label.id = activity_label.label_id WHERE MATCH(text) against(#{subText}) AND is_deleted =0 AND visibility =0 UNION " +
          "SELECT activity.*,(SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,(SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,(SELECT COUNT(*) FROM activity_like WHERE user_id = #{userId} AND activity_id =activity.id LIMIT 1) AS isLiked,(SELECT COUNT(*) FROM user_attention WHERE user_id = #{userId} AND attention_user_id =activity.user_id) AS isAttention,(SELECT username FROM `user` WHERE id = activity.user_id ) AS username,(SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar FROM (activity INNER JOIN activity_label ON activity_label.activity_id= activity.id) INNER JOIN label ON label.id = activity_label.label_id WHERE label.content = #{subText} AND is_deleted =0 AND visibility =0")
  List<SquareActivity> getFullTextQueryId(@Param("subText") String subText,@Param("userId") int userId);

  /**
   * 查询用户发布的动态总数,不包括已删除的
   * @param userId
   * @return
   */
  @Select("SELECT COUNT(*) FROM activity WHERE user_id = #{userId} AND is_deleted =0")
  int getActivitySumByUserId(int userId);

  /**
   * <p>
   *     返回用户点赞过的动态
   * </p>
   * @param uid
   * @return
   */
  @Results({@Result(property = "publisher.isAttention", column = "isAttention"),
          @Result(property = "publisher.username", column = "username"),
          @Result(property = "publisher.id", column = "user_id"),
          @Result(property = "publisher.avatar", column = "avatar"),
          @Result(property = "publisher.isVerify", column = "isVerify"),
          @Result(property = "publisher.sex", column = "sex"),
          @Result(property = "publisher.isVip",column = "isVip")})
  @Select(" SELECT activity.*,\n" +
          "               #vip    \n" +
          "              (SELECT COUNT(*) FROM user_vip WHERE user_id = activity.user_id AND deadline > NOW()) AS isVip\n" +
          "               #性别                 \n" +
          "              ,(SELECT sex FROM `user` WHERE id = activity.user_id ) AS sex,\n" +
          "              #认证              \n" +
          "              (SELECT COUNT(*) FROM user_verify WHERE user_verify.user_id = activity.user_id AND user_verify.is_passed=1) AS isVerify,\n" +
          "              #当前用户发布的动态有多少人喜欢              \n" +
          "              (SELECT COUNT(*) FROM activity_like WHERE user_id = activity.user_id AND activity_id =activity.id LIMIT 1) AS isLiked,\n" +
          "              #当前用户有多少人关注              \n" +
          "              (SELECT COUNT(*) FROM user_attention WHERE user_id =activity.user_id AND attention_user_id =activity.user_id) AS isAttention,\n" +
          "              #当前用户名                 \n" +
          "              (SELECT username FROM `user` WHERE id = activity.user_id ) AS username,\n" +
          "              #当前用户的头像               \n" +
          "              (SELECT avatar FROM `user` WHERE id= activity.user_id) AS avatar \n" +
          "          FROM activity,activity_like acl WHERE \n" +
          "           #点赞的用户           \n" +
          "           acl.user_id=#{uid}\n" +
          "              AND \n" +
          "               acl.activity_id=activity.id\n" +
          "              #按照点赞的时候升序                 \n" +
          "              ORDER BY acl.create_time DESC")
  List<SquareActivity> getUserLikeActivity(Integer uid);

}
