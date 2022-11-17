package com.living.core.domain.result;

import com.github.pagehelper.PageInfo;
import lombok.Data;

/**
 * 分页返回模板
 * @author lizijian
 */
@Data
public class PageResult<T> {
  private int pageSum;
  private long total;
  private int currentPageNum;
  private boolean hasNext;
  private boolean hasPrevious;

  private T list;

  public PageResult(PageInfo<?> pageInfo,T list) {
    this.pageSum=pageInfo.getPages();
    this.total=pageInfo.getTotal();
    this.hasNext =pageInfo.isHasNextPage();
    this.hasPrevious = pageInfo.isHasNextPage();
    this.currentPageNum = pageInfo.getPageNum();
    this.list = list;
  }
}
