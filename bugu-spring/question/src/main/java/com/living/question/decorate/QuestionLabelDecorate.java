package com.living.question.decorate;


import com.living.question.dao.Label;
import com.living.question.result.QuestionResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 问题标签装饰类
 * @author lizijian
 */
@Component
@Slf4j
public class QuestionLabelDecorate extends AbstractQuestionDecorate {

  /**
   * 为动态增加标签
   * @param
   */
  @Override
  public void decorate(List<QuestionResult> questionResults) {
    if(questionResults==null||questionResults.size()==0){
      return;
    }
    List<Label> labels = labelDao.getLabelsByQuestionIds(
        questionResults.stream().mapToInt(QuestionResult::getId).toArray());
    Map<Integer, List<Label>> labelMap = labels.stream()
        .collect(Collectors.groupingBy(Label::getQuestionId));
    for (QuestionResult activityResult : questionResults) {
      List<Label> labelList = labelMap.get(activityResult.getId());
      activityResult.setLabels(labelList==null?new ArrayList<>():labelList);
    }
  }


}
