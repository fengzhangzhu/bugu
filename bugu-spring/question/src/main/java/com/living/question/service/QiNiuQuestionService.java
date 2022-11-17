package com.living.question.service;

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
public class QiNiuQuestionService extends QiNiuService {

  private static final String USER_QUESTION_DIRECTORY="user/question/";

  private static final String USER_ANSWER_DIRECTORY ="user/answer/";

  private String createQuestionFileName(){
    return USER_QUESTION_DIRECTORY+ UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }

  private String createAnswerFileName(){
    return USER_ANSWER_DIRECTORY+ UserUtil.getUserId()+"-"+ UUID.randomUUID();
  }

  public List<QiNiuTokenResult> getTokenResults(int sum) throws Exception {
    ArrayList<QiNiuTokenResult> qiNiuTokenResults  = new ArrayList<>(sum);
    for (int i = 0; i < sum; i++) {
      String fileName = createQuestionFileName();
      qiNiuTokenResults.add(new QiNiuTokenResult(getUploadToken(fileName),fileName));
    }
    return qiNiuTokenResults;
  }

  public List<QiNiuTokenResult> getAnswerTokenResults(int sum) throws Exception {
    ArrayList<QiNiuTokenResult> qiNiuTokenResults  = new ArrayList<>(sum);
    for (int i = 0; i < sum; i++) {
      String fileName = createAnswerFileName();
      qiNiuTokenResults.add(new QiNiuTokenResult(getUploadToken(fileName),fileName));
    }
    return qiNiuTokenResults;
  }

}
