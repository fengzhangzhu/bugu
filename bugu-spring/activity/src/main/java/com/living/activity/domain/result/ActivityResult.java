package com.living.activity.domain.result;

import com.google.gson.Gson;
import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dao.Label;
import com.living.core.config.qiniu.QiNiuConfig;
import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@ApiModel("不包含发布者信息的动态信息")
@Data
public class ActivityResult {
  private int id;
  private String text;
  private List<String> pic;
  private int likeSum;
  private int commentSum;
  private int viewSum;
  private Short isLiked;
  private short isAnonymity;
  private short visibility;
  private Short video;
  private List<Label> labels;
  private String publishTime;


  public ActivityResult(Activity activity) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    this.id= activity.getId();
    this.text= activity.getText();
    this.pic= Arrays.stream(new Gson().fromJson(activity.getPic(),String[].class)).map(a-> QiNiuConfig.URL+a).collect(
        Collectors.toList());
    this.likeSum= activity.getLikeSum();
    this.isLiked= activity.getIsLiked();
    this.commentSum= activity.getCommentSum();
    this.viewSum= activity.getViewSum();
    this.isAnonymity= activity.getIsAnonymity();
    this.visibility= activity.getVisibility();
    this.video = activity.getVideo();
    this.publishTime=simpleDateFormat.format(activity.getCreateTime());
  }
}
