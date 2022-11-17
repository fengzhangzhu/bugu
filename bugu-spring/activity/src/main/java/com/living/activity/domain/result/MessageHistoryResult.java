package com.living.activity.domain.result;

import com.living.core.domain.dao.Message;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.util.UserUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
@ApiModel("聊天记录")
public class MessageHistoryResult {
  @ApiModelProperty("消息id")
  private int id;
  @ApiModelProperty("内容")
  private String content;
  @ApiModelProperty("消息类型,0代表文字,1代表图片")
  private short type;
  @ApiModelProperty("是否是自己发送的消息")
  private boolean isMy;
  @ApiModelProperty("发送时间")
  private String createTime;
  @ApiModelProperty("语音类型消息的时长")
  private Integer time;

  public MessageHistoryResult(Message message) {
    this.id= message.getId();
    this.content=message.getContent();
    this.type= message.getType();
    if(type!=0){
      content= QiNiuConfig.URL+content;
    }
    this.time=message.getTime();
    this.isMy=message.getFromUserId()== UserUtil.getUserId();
    this.createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(message.getCreateTime());
  }
}
