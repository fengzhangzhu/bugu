package com.living.activity.service;

import com.living.activity.mapper.ActivityDao;
import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.send.DingMessage;
import com.living.core.service.BaiDuContentCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @Author mulan
 * @Date 2022/7/18 22:17
 * @PackageName:com.living.core.service
 * @ClassName: VideoCheckService
 * @Description: TODO
 * @Version 1.0
 */
@Slf4j
@Service
public class VideoCheckService extends BaiDuContentCheckService {
    @Autowired
    private ActivityDao activityDao;
  @Async("checkContent")
  public void checkActivityVideo(String [] filenames,int activityId,int publisherId){
    for (String filename : filenames) {
      String url= QiNiuConfig.URL+filename;
      JSONObject jsonObject = client.videoCensorUserDefined(filename, url, url, null);
      String conclusion =(String) jsonObject.get("conclusion");
      log.info(jsonObject.toString(2));
      if("不合规".equals(conclusion)){
        //删除动态
        activityDao.delete(activityId);
        //给发布者发布官方消息
        officialMessageService.sendOfficialMessage("您的动态含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
        SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+activityId+"号动态视频内容审核未通过"));
        return;
      }
    }
  }
}
