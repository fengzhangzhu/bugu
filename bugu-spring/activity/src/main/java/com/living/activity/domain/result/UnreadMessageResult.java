package com.living.activity.domain.result;

import com.living.core.domain.dto.UnreadUserMessage;
import com.living.core.config.qiniu.QiNiuConfig;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
@ApiModel("未读消息")
public class UnreadMessageResult {
  @ApiModelProperty("消息id")
  private int id;
  @ApiModelProperty("内容")
  private String content;
  @ApiModelProperty("消息类型,0代表文字,1代表图片,2代表语音")
  private short type;
  @ApiModelProperty("语音消息时长")
  private Integer time;
  @ApiModelProperty("发送时间")
  private String createTime;

  public UnreadMessageResult(UnreadUserMessage unreadUserMessage) {
    id= unreadUserMessage.getId();
    type= unreadUserMessage.getType();
    if(type!=0){
      content= QiNiuConfig.URL+ unreadUserMessage.getContent();
    }else {
      content= unreadUserMessage.getContent();
    }
    time= unreadUserMessage.getTime();
    createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(unreadUserMessage.getCreateTime());
  }
}
