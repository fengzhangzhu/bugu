package com.living.activity.mapper;

import com.living.activity.domain.dao.Banner;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author lizijian
 */
@Mapper
public interface BannerDao {

  /**
   * banner图列表
   * @return
   */
  @Select("SELECT * FROM banner")
  List<Banner> bannerList();

  /**
   * 插入banner图
   * @param banner
   */
  @Insert("INSERT INTO banner (pic) VALUES (#{banner})")
  void addBanner(String banner);

  /**
   * 删除banner图
   * @param id
   */
  @Delete("DELETE FROM banner WHERE id = #{id}")
  void deleteBanner(int id);


}
