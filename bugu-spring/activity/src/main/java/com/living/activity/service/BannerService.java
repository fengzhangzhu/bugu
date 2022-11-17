package com.living.activity.service;

import com.living.activity.domain.dao.Banner;
import com.living.activity.domain.result.BannerResult;
import com.living.activity.mapper.BannerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
public class BannerService {

  @Autowired
  private BannerDao bannerDao;

  public List<BannerResult> list() {
    List<Banner> banners = bannerDao.bannerList();
    return banners.stream().map(BannerResult::new).collect(Collectors.toList());
  }

  public void add(String pic) {
    bannerDao.addBanner(pic);
  }

  public void delete(int id){
    bannerDao.deleteBanner(id);
  }
}
