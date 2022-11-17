package com.living.activity.domain.result;

import com.living.activity.domain.dto.Emoticon;
import com.living.core.domain.helper.QiNiuAddress;
import lombok.Data;

@Data
public class EmoticonResult {
  private Long id;
  private String url;

  public EmoticonResult(Emoticon emoticon) {
    id= emoticon.getId();
    url = new QiNiuAddress(emoticon.getFilename()).toString();
  }
}
