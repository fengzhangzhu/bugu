package com.living.activity.domain.result;

import com.living.activity.domain.dao.Banner;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class BannerResult {
  private Integer id;
  private String pic;

  public BannerResult(Banner banner) {
    id=banner.getId();
    pic=new QiNiuAddress(banner.getPic()).toString();
  }
}
