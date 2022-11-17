package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 七牛云动态服务
 * @author lizijian
 */
@Service
public class QiNiuActivityService extends QiNiuService {

  private static final String USER_ACTIVITY_DIRECTORY="user/activity/";


  private String createActivityFileName(){
    return USER_ACTIVITY_DIRECTORY+ UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }


  public List<QiNiuTokenResult> getTokenResults(int sum) throws Exception {
    ArrayList<QiNiuTokenResult> qiNiuTokenResults  = new ArrayList<>(sum);
    for (int i = 0; i < sum; i++) {
      String fileName = createActivityFileName();
      qiNiuTokenResults.add(new QiNiuTokenResult(getUploadToken(fileName),fileName));
    }
    return qiNiuTokenResults;
  }

}
