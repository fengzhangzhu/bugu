package com.living.core.domain.helper;


import com.living.core.config.qiniu.QiNiuConfig;
import lombok.Data;

/**
 * 七牛云文件名转化为url
 * @author lizijian
 */
@Data
public class QiNiuAddress {
  private String avatar;

  public QiNiuAddress(String avatar) {
    this.avatar = QiNiuConfig.URL+avatar;
  }

  @Override
  public String toString() {
    return avatar;
  }
}
