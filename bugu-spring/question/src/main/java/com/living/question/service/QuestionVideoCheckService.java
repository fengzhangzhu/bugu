package com.living.question.service;

import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.send.DingMessage;
import com.living.core.service.BaiDuContentCheckService;
import com.living.core.service.dingtalk.SendDingMessageService;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
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
public class QuestionVideoCheckService extends BaiDuContentCheckService {
    @Autowired
    private QuestionDao questionDao;

    @Autowired
    private AnswerDao answerDao;


    @Async("checkContent")
    public void checkQuestionVideo(String[] filenames, int questionId, int publisherId) {
        for (String filename : filenames) {
            String url = QiNiuConfig.URL + filename;
            JSONObject jsonObject = client.videoCensorUserDefined(filename, url, url, null);
            String conclusion = (String) jsonObject.get("conclusion");
            log.info(jsonObject.toString(2));
            if ("不合规".equals(conclusion)) {
                //删除动态
                questionDao.delete(questionId);
                //给发布者发布官方消息
                officialMessageService.sendOfficialMessage("您发布的问题含有违规内容,已被管理员删除", null, publisherId, OfficialMessageType.PUNISH);
                SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId + "号用户发布的" + questionId + "号问题视频内容审核未通过"));
                return;
            }
        }

    }
    @Async("checkContent")
    public void checkAnswerVideo (String[]filenames,int answerId, int publisherId){
        for (String filename : filenames) {
            String url = QiNiuConfig.URL + filename;
            JSONObject jsonObject = client.videoCensorUserDefined(filename, url, url, null);
            String conclusion = (String) jsonObject.get("conclusion");
            log.info(jsonObject.toString(2));
            if ("不合规".equals(conclusion)) {
                //删除动态
                answerDao.delete(answerId);
                //给发布者发布官方消息
                officialMessageService.sendOfficialMessage("您发布的回答含有违规内容,已被管理员删除", null, publisherId, OfficialMessageType.PUNISH);
                SendDingMessageService.sendContentAuditMessage(new DingMessage(publisherId + "号用户发布的" + answerId + "号回答视频内容审核未通过"));
                return;
            }
        }
    }
}
