package com.living.core.domain.result;



import com.living.core.domain.helper.QiNiuAddress;
import com.living.core.mapper.Visitor;
import lombok.Data;

import java.text.SimpleDateFormat;

/**
 * @author lizijian
 */
@Data
public class VisitorResult {
  private int visitorId;
  private int visitSum;
  private String avatar;
  private String lastTime;

  public VisitorResult(Visitor visitor) {
    this.visitorId=visitor.getVisitorId();
    this.visitSum=visitor.getVisitSum();
    this.avatar=new QiNiuAddress(visitor.getAvatar()).toString();
    this.lastTime=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(visitor.getLastTime());
  }
}
