package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * 七牛云用户背景服务
 * @author lizijian
 */
@Service
public class QiNiuBackgroundService extends QiNiuService {

  private static final String USER_BACKGROUND_DIRECTORY="user/background/";


  private String createBackgroundFileName(){
    return USER_BACKGROUND_DIRECTORY+UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }

  public QiNiuTokenResult getTokenResult() throws Exception {
    String fileName = createBackgroundFileName();
    return new QiNiuTokenResult(getUploadToken(fileName),fileName);
  }

}
