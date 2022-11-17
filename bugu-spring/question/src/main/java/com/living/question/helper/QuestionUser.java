package com.living.question.helper;



import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author mulan
 * @version 1.0
 * @description 问题发布者信息
 * @date 2022年 07月20日 15:47:35
 */
@Data
@ApiModel("发布者信息")
public class QuestionUser {
    private int id;
    private String username;
    private String avatar;
}
