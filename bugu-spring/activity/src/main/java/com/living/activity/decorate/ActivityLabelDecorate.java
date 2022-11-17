package com.living.activity.decorate;

import com.living.activity.domain.dao.Label;
import com.living.activity.domain.result.ActivityResult;
import com.living.activity.domain.result.SquareActivityResult;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 动态标签装饰类
 * @author lizijian
 */
@Component
public class ActivityLabelDecorate extends AbstractActivityDecorate {

  /**
   * 为动态增加标签
   * @param
   */
  @Override
  public void decorate(List<ActivityResult> activityResults) {
    if(activityResults==null||activityResults.size()==0){
      return;
    }
    List<Label> labels = labelDao.getLabelsByActivityIds(
        activityResults.stream().mapToInt(ActivityResult::getId).toArray());
    Map<Integer, List<Label>> labelMap = labels.stream()
        .collect(Collectors.groupingBy(Label::getActivityId));
    for (ActivityResult activityResult : activityResults) {
      List<Label> labelList = labelMap.get(activityResult.getId());
      activityResult.setLabels(labelList==null?new ArrayList<>():labelList);
    }
  }

  /**
   * 广场动态增加标签
   * @param squareActivityResults
   */
  @Override
  public void decorate(Collection<SquareActivityResult> squareActivityResults) {
    if(squareActivityResults==null||squareActivityResults.size()==0){
      return;
    }
    List<Label> labels = labelDao.getLabelsByActivityIds(
        squareActivityResults.stream().mapToInt(SquareActivityResult::getId).toArray());
    Map<Integer, List<Label>> labelMap = labels.stream()
        .collect(Collectors.groupingBy(Label::getActivityId));
    for (SquareActivityResult squareActivityResult : squareActivityResults) {
      List<Label> labelList = labelMap.get(squareActivityResult.getId());
      squareActivityResult.setLabels(labelList==null?new ArrayList<>():labelList);
    }
  }
}
