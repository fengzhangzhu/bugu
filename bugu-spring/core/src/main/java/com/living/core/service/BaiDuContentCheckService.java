package com.living.core.service;

import com.baidu.aip.contentcensor.AipContentCensor;

import com.living.core.config.qiniu.QiNiuConfig;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 百度内容审核
 */
@Slf4j
@Service
public class BaiDuContentCheckService {

  protected static final String APP_ID = "26734155";
  protected static final String API_KEY = "YOUR_API_KEY";
  protected static final String SECRET_KEY = "YOUR_SECRET_KEY";

  @Autowired
  protected OfficialMessageService officialMessageService;


  protected static final AipContentCensor client = new AipContentCensor(APP_ID, API_KEY, SECRET_KEY);



  @Async("checkContent")
  public boolean checkVideo(String [] filenames,int activityId,int publisherId){
    for (String filename : filenames) {
      String url= QiNiuConfig.URL+filename;
      JSONObject jsonObject = client.videoCensorUserDefined(filename, url, url, null);
      String conclusion =(String) jsonObject.get("conclusion");
      log.info(jsonObject.toString(2));
      return "不合规".equals(conclusion);
    }
    return true;
  }
}
