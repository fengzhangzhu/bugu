package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 七牛云消息服务
 * @author lizijian
 */
@Service
public class QiNiuMessageService extends QiNiuService {

  private static final String USER_MESSAGE_DIRECTORY ="user/message/";


  private String createMessageFileName(){
    return USER_MESSAGE_DIRECTORY + UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }


  public List<QiNiuTokenResult> getTokenResults(int sum) throws Exception {
    ArrayList<QiNiuTokenResult> qiNiuTokenResults  = new ArrayList<>(sum);
    for (int i = 0; i < sum; i++) {
      String fileName = createMessageFileName();
      qiNiuTokenResults.add(new QiNiuTokenResult(getUploadToken(fileName),fileName));
    }
    return qiNiuTokenResults;
  }

}
