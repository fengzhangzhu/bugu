package com.living.activity.service;

import com.aliyuncs.exceptions.ClientException;
import com.living.activity.mapper.ActivityDao;
import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.send.DingMessage;
import com.living.core.service.ALiCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @Author mulan
 * @Date 2022/7/18 22:35
 * @PackageName:com.living.activity.service
 * @ClassName: PicCheckService
 * @Description: TODO
 * @Version 1.0
 */
@Service
@Slf4j
public class PicCheckService extends ALiCheckService {
    @Autowired
    private ActivityDao activityDao;
    /**
     * 异步审核动态图片
     * @param picNames 图片名数组
     * @throws ClientException
     */
    @Async("checkContent")
    public void checkActivityPic(String [] picNames,int activityId,int publisherId) throws ClientException {
        for (String picName : picNames) {
            boolean isPass = getCheckResult(QiNiuConfig.URL+picName);
            if(!isPass){
                //删除动态
                activityDao.delete(activityId);
                //给发布者发布官方消息
                officialMessageService.sendOfficialMessage("您的动态含有违规内容,已被管理员删除",null,publisherId, OfficialMessageType.PUNISH);
                SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId+"号用户发布的"+activityId+"号动态图片内容审核未通过"));
                return;
            }
        }
    }
}
