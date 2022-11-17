package com.living.core.domain.result;


import com.living.core.util.AesUtils;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class QiNiuTokenResult {
  String token;
  String fileName;
  public QiNiuTokenResult(String token, String fileName) throws Exception {
    this.token = AesUtils.encrypt(token);
    this.fileName = fileName;
  }
}
