package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * 七牛云认证服务
 * @author lizijian
 */
@Service
public class QiNiuVerifyService extends QiNiuService {

  private static final String USER_VERIFY_DIRECTORY="user/verify/";


  private String createVerifyFileName(){
    return USER_VERIFY_DIRECTORY+ UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }


  public QiNiuTokenResult getTokenResult() throws Exception {
    String fileName = createVerifyFileName();
    return new QiNiuTokenResult(getUploadToken(fileName),fileName);
  }

}
