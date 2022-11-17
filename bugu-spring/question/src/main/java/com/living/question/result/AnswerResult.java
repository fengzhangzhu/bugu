package com.living.question.result;

import com.google.gson.Gson;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.helper.Publisher;
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
 * @description 回答返回信息
 * @date 2022年 07月21日 08:43:24
 */
@ApiModel("回答返回信息")
@Data
public class AnswerResult {
    private int id;
    private int questionId;
    private String text;
    private List<String> pic;
    private int agreeSum;
    private int opposeSum;
    private int viewSum;
    private int commentSum;
    private Short isAgreed;
    private Short isOpposed;
    private short isAnonymity;
    private short isVideo;
    private short isMe;
    private String publishTime;
    private Publisher publisher;

    public AnswerResult(Answer answer) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.id= answer.getId();
        this.questionId = answer.getQuestionId();
        this.text= answer.getText();
        this.pic= Arrays.stream(new Gson().fromJson(answer.getPic(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
                Collectors.toList());
        this.agreeSum= answer.getAgreeSum();
        this.opposeSum= answer.getOpposeSum();
        this.commentSum = answer.getCommentSum();
        this.viewSum = answer.getViewSum();
        this.isAnonymity= answer.getIsAnonymity();
        this.isVideo = answer.getIsVideo();
        this.isAgreed = answer.getIsAgreed();
        this.isOpposed = answer.getIsOpposed();
        this.publishTime=simpleDateFormat.format(answer.getCreateTime());
        if(this.isAnonymity==0){
            this.publisher = answer.getPublisher();
            this.publisher.setAvatar(QiNiuConfig.URL+this.publisher.getAvatar());
        }
    }
}
