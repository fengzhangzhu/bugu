package com.living.activity.domain.result;

import com.google.gson.Gson;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.question.dao.Label;
import com.living.question.dao.Question;
import com.living.question.helper.QuestionUser;
import com.living.question.result.AnswerResult;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description 未审核的问题返回结果
 * @date 2022年 07月31日 09:50:00
 */
@ApiModel("未审核的问题信息")
@Data
public class NotAuditQuestionResult {
    private int id;
    private int userId;
    private String title;
    private String text;
    private List<String> pics;
    private List<String> video;
    private int likeSum;
    private int answerSum;
    private int collectSum;
    private int viewSum;
    private int hot;
    private short isAnonymity;
    private String publishTime;
    public NotAuditQuestionResult(Question question) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.id= question.getId();
        this.userId = question.getUserId();
        this.title = question.getTitle();
        this.text= question.getText();
        this.pics= Arrays.stream(new Gson().fromJson(question.getPics(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.video= Arrays.stream(new Gson().fromJson(question.getVideo(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.likeSum= question.getLikeSum();
        this.collectSum = question.getCollectSum();
        this.answerSum= question.getAnswerSum();
        this.viewSum= question.getViewSum();
        this.hot = question.getHot();
        this.isAnonymity= question.getIsAnonymity();
        this.publishTime= simpleDateFormat.format(question.getCreateTime());
    }
}
