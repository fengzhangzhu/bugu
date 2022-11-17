package com.living.question.dao;

import com.living.core.domain.helper.Publisher;
import com.living.question.helper.QuestionUser;
import lombok.Data;

import java.sql.Timestamp;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月21日 08:42:57
 */
@Data
public class Answer {
    private int id;
    private int userId;
    private int questionId;
    private String text;
    private String pic;
    private int hot;
    private int agreeSum;
    private int opposeSum;
    private int commentSum;
    private int viewSum;
    private Short isAgreed;
    private Short isOpposed;
    private short isDeleted;
    private short isAnonymity;
    private short isVideo;
    private Timestamp updateTime;
    private Timestamp createTime;
    private Publisher publisher;
    public static Answer publish(int userId, int questionId, String text, String pic, short isAnonymity,short isVideo){
        Answer answer = new Answer();
        answer.setUserId(userId);
        answer.setQuestionId(questionId);
        answer.setText(text);
        answer.setPic(pic);
        answer.setIsAnonymity(isAnonymity);
        answer.setIsVideo(isVideo);
        return answer;
    }
}
