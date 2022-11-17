package com.living.activity.domain.result;

import com.living.activity.domain.helper.OfficialMessageHelper;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * @author lizijian
 */
@Data
@AllArgsConstructor
public class OfficialMessageResult {
  private int pageSum;
  private long total;
  private List<OfficialMessageHelper> messageResultList;
}
