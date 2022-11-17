package com.living.core.domain.result;


import com.living.core.domain.dao.User;
import com.living.core.domain.helper.QiNiuAddress;
import com.living.core.util.RedisUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author lizijian
 */
@ApiModel("用户信息")
@Data
public class UserInfoResult {
  private int id;
  private String username;
  private String avatar;
  private String background;
  @ApiModelProperty("被关注总数")
  private int beAttentionSum;
  @ApiModelProperty("访客总数")
  private int visitorSum;
  @ApiModelProperty("关注用户总数")
  private int attentionSum;
  @ApiModelProperty("注册天数")
  private long registerDay;
  @ApiModelProperty(value = "vip信息，为空则代表没有成为过vip")
  private VipInfoResult vip;
  @ApiModelProperty("是否在线")
  private boolean isOnline;
  @ApiModelProperty("是否关注")
  private short isAttention;
  @ApiModelProperty("是否实名认证")
  private short isVerify;
  @ApiModelProperty("性别,0女 1男 null代表没有设置")
  private Short sex;



  public UserInfoResult(User user) {
    this.id= user.getId();
    this.username=user.getUsername();
    this.avatar= new QiNiuAddress(user.getAvatar()).toString();
    if(user.getBackground()!=null){
      this.background=new QiNiuAddress(user.getBackground()).toString();
    }
    this.beAttentionSum= user.getBeAttentionSum();
    this.visitorSum= user.getVisitorSum();
    this.attentionSum= user.getAttentionSum();
    //如果是新注册用户
    if(user.getCreateTime()==null){
      this.registerDay=1;
    }else {
      this.registerDay=(System.currentTimeMillis()-user.getCreateTime().getTime())/(3600*24*1000)+1;
    }
    this.isOnline= RedisUtil.getOnlineState(id);
    this.sex= user.getSex();
  }
}
