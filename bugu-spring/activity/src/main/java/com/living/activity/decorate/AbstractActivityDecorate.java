package com.living.activity.decorate;

import com.living.activity.domain.result.ActivityResult;
import com.living.activity.domain.result.SquareActivityResult;
import com.living.activity.mapper.LabelDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
public abstract class AbstractActivityDecorate {


  @Autowired
  protected LabelDao labelDao;


  protected abstract void decorate(List<ActivityResult> activityResult);

  protected abstract void decorate(Collection<SquareActivityResult> squareActivityResult);
}
