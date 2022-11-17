package com.living.core.domain.helper;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 07月20日 15:46:27
 */
@Data
@ApiModel("发布者信息")
public class Publisher {
    private int id;
    private String username;
    private String avatar;
    private short isAttention;
    private short isVerify;
    private Short sex;
    private short isVip;
}
