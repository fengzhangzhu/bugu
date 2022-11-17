package com.living.question.result;


import com.living.core.domain.helper.CommentUser;
import com.living.core.domain.helper.QiNiuAddress;
import com.living.question.dto.AnswerCommentDto;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class AnswerCommentResult {
  private int id;
  private CommentUser publisher;
  private String content;
  private int responseSum;
  private int likeSum;
  private short isLiked;
  private short type;
  private short isDeleted;
  private String createTime;

  public AnswerCommentResult(AnswerCommentDto answerCommentDto) {
    this.id= answerCommentDto.getId();
    this.publisher= answerCommentDto.getPublisher();
    publisher.setAvatar(new QiNiuAddress(publisher.getAvatar()).toString());
    this.content=answerCommentDto.getContent();
    this.responseSum= answerCommentDto.getResponseSum();
    this.type= answerCommentDto.getType();
    this.isDeleted= answerCommentDto.getIsDeleted();
    this.createTime=new SimpleDateFormat("yyyy-MM-dd HH:mm").format(answerCommentDto.getCreateTime());
    this.likeSum= answerCommentDto.getLikeSum();
    this.isLiked= answerCommentDto.getIsLiked();
  }

}
