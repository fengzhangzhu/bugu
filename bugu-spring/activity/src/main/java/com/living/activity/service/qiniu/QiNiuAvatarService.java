package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * 七牛云头像服务
 * @author lizijian
 */
@Service
public class QiNiuAvatarService extends QiNiuService {

  private static final String USER_AVATAR_DIRECTORY="user/avatar/";


  private String createAvatarFileName(){
    return USER_AVATAR_DIRECTORY+UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }

  public QiNiuTokenResult getTokenResult() throws Exception {
    String fileName = createAvatarFileName();
    return new QiNiuTokenResult(getUploadToken(fileName),fileName);
  }

}
