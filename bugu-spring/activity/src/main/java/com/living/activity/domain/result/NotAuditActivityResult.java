package com.living.activity.domain.result;

import com.google.gson.Gson;
import com.living.activity.domain.dao.Activity;
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
@ApiModel("未审核的动态信息")
@Data
public class NotAuditActivityResult {
  private int id;
  private int userId;
  private String text;
  private List<String> pic;
  private int hot;
  private int likeSum;
  private int commentSum;
  private int viewSum;
  private Short isDelete;
  private Short video;
  private String updateTime;
  private String createTime;

  public NotAuditActivityResult(Activity activity) {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    this.id=activity.getId();
    this.userId= activity.getUserId();
    this.text=activity.getText();
    if(activity.getPic()!=null){
      this.pic = Arrays.stream(new Gson().fromJson(activity.getPic(), String[].class))
          .map(a -> QiNiuConfig.URL + a).collect(
              Collectors.toList());
    }
    this.hot=activity.getHot();
    this.video = activity.getVideo();
    this.likeSum= activity.getLikeSum();
    this.commentSum= activity.getCommentSum();
    this.viewSum= activity.getViewSum();
    this.isDelete= activity.getIsDelete();
    this.updateTime=simpleDateFormat.format(activity.getUpdateTime());
    this.createTime= simpleDateFormat.format(activity.getCreateTime());
  }
}
