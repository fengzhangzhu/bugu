package com.living.activity.domain.result;

import com.google.gson.Gson;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.helper.Publisher;
import com.living.question.dao.Answer;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description 未审核的回答返回结果
 * @date 2022年 07月31日 09:50:26
 */
@ApiModel("未审核的回答信息")
@Data
public class NotAuditAnswerResult {
    private int id;
    private int userId;
    private int questionId;
    private String text;
    private List<String> pic;
    private int agreeSum;
    private int opposeSum;
    private int viewSum;
    private int commentSum;
    private int hot;
    private short isAnonymity;
    private short isVideo;
    private String publishTime;

    public NotAuditAnswerResult(Answer answer) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.id= answer.getId();
        this.userId = answer.getUserId();
        this.questionId = answer.getQuestionId();
        this.text= answer.getText();
        this.pic= Arrays.stream(new Gson().fromJson(answer.getPic(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.agreeSum= answer.getAgreeSum();
        this.opposeSum= answer.getOpposeSum();
        this.commentSum = answer.getCommentSum();
        this.viewSum = answer.getViewSum();
        this.hot = answer.getHot();
        this.isAnonymity= answer.getIsAnonymity();
        this.isVideo = answer.getIsVideo();
        this.publishTime=simpleDateFormat.format(answer.getCreateTime());
    }
}
