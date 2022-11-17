package com.living.activity.domain.result;

import com.living.core.domain.dto.UnreadInteractiveMessageDto;
import com.living.core.domain.helper.QiNiuAddress;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.text.SimpleDateFormat;

@Data
public class UnreadInteractiveMessageResult {
  @ApiModelProperty("内容的id")
  private int contentId;
  @ApiModelProperty("内容发布者的id")
  private int userId;
  @ApiModelProperty("内容发布者的用户名")
  private String username;
  @ApiModelProperty("内容发布者的头像")
  private String avatar;
  @ApiModelProperty("互动的类型:COMMENT COMMENT ATTENTION ATTENTION LIKE PUBLISH COLLECT AGREE OPPOSE ANSWER")
  private String type;
  @ApiModelProperty("内容发布者的分组: ACTIVITY  QUESTION ANSWER")
  private String group;
  private String createTime;

  public UnreadInteractiveMessageResult(UnreadInteractiveMessageDto unreadInteractiveMessageDto) {
    contentId=unreadInteractiveMessageDto.getContentId();
    userId= unreadInteractiveMessageDto.getUserId();
    username=unreadInteractiveMessageDto.getUsername();
    avatar=new QiNiuAddress(unreadInteractiveMessageDto.getAvatar()).toString();
    type= unreadInteractiveMessageDto.getType();
    group = unreadInteractiveMessageDto.getGroup();
    createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(unreadInteractiveMessageDto.getCreateTime());
  }
}
