package com.living.question.result;

import com.google.gson.Gson;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.question.dao.Answer;
import com.living.question.dao.Label;
import com.living.question.dao.Question;
import com.living.question.helper.QuestionUser;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月20日 15:38:55
 */
@ApiModel("问题返回信息")
@Data
public class QuestionResult {
    private int id;
    private String title;
    private String text;
    private List<String> pics;
    private List<String> video;
    private int likeSum;
    private int answerSum;
    private int collectSum;
    private int viewSum;
    private Short isLiked;
    private Short isCollected;
    private short isAnonymity;

    private List<Label> labels;
    private String publishTime;
    private QuestionUser publisher;

    private AnswerResult hotAnswer;
    public QuestionResult(Question question) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.id= question.getId();
        this.title = question.getTitle();
        this.text= question.getText();
        this.pics= Arrays.stream(new Gson().fromJson(question.getPics(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.video= Arrays.stream(new Gson().fromJson(question.getVideo(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.likeSum= question.getLikeSum();
        this.isLiked= question.getIsLiked();
        this.collectSum = question.getCollectSum();
        this.isCollected = question.getIsCollected();
        this.answerSum= question.getAnswerSum();
        this.viewSum= question.getViewSum();
        this.isAnonymity= question.getIsAnonymity();
        this.publishTime= simpleDateFormat.format(question.getCreateTime());
        if(this.isAnonymity==0){
            this.publisher = question.getPublisher();
        }
        this.hotAnswer = question.getHotAnswer();
    }
}
