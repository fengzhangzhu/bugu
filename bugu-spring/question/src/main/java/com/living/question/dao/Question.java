package com.living.question.dao;

import com.living.question.helper.QuestionUser;
import com.living.question.result.AnswerResult;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月18日 16:49:36
 */
@Data
public class Question {
    private int id;
    private int userId;
    private String title;
    private String text;
    private String pics;
    private String video;
    private int hot;
    private int likeSum;
    private int answerSum;
    private int viewSum;
    private int collectSum;
    private Short isLiked;
    private Short isCollected;
    private short isDeleted;
    private short isAnonymity;
    private Timestamp updateTime;
    private Timestamp createTime;
    private QuestionUser publisher;
    private AnswerResult hotAnswer;
    public static Question publish(String title, String text, String pics, String video, int userId, short isAnonymity){
        Question question = new Question();
        question.setTitle(title);
        question.setText(text);
        question.setUserId(userId);
        question.setPics(pics);
        question.setVideo(video);
        question.setIsAnonymity(isAnonymity);
        return question;
    }
}
