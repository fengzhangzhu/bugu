package com.living.activity.domain.result;

import com.google.gson.Gson;
import com.living.activity.domain.dao.Label;
import com.living.activity.domain.dto.SquareActivity;
import com.living.activity.domain.helper.SquareUser;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.helper.QiNiuAddress;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Data
@ApiModel("包含发布者信息的动态信息")
public class SquareActivityResult {
  private int id;
  private String text;
  private List<String> pic;
  private int likeSum;
  private int commentSum;
  private int hot;
  private int viewSum;
  private short isLiked;
  private short isDeleted;
  private short isAnonymity;
  private Short video;
  private List<Label> labels;
  private String updateTime;
  private String createTime;
  private SquareUser publisher;

  public SquareActivityResult(SquareActivity squareActivity) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    this.id= squareActivity.getId();
    this.text= squareActivity.getText();
    if(squareActivity.getPic()!=null){
      this.pic= Arrays.stream(new Gson().fromJson(squareActivity.getPic(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
          Collectors.toList());
    }
    this.isDeleted=squareActivity.getIsDeleted();
    this.isLiked=squareActivity.getIsLiked();
    this.hot=squareActivity.getHot();
    this.likeSum= squareActivity.getLikeSum();
    this.commentSum= squareActivity.getCommentSum();
    this.viewSum= squareActivity.getViewSum();
    this.isAnonymity=squareActivity.getIsAnonymity();
    this.updateTime=simpleDateFormat.format(squareActivity.getUpdateTime());
    this.createTime=simpleDateFormat.format(squareActivity.getCreateTime());
    this.video = squareActivity.getVideo();
    //如果不是匿名动态，设置发布者信息
    if(isAnonymity==0){
      this.publisher=squareActivity.getPublisher();
      if(publisher!=null){
        this.publisher.setAvatar(new QiNiuAddress(publisher.getAvatar()).toString());
      }
    }
  }
}
