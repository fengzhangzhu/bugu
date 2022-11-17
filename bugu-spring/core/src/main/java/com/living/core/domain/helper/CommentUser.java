package com.living.core.domain.helper;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author lizijian
 */
@Data
@ApiModel("评论动态用户信息")
public class CommentUser {
  private int id;
  private String username;
  private String avatar;
}
