package com.living.question.decorate;


import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionLabelDao;
import com.living.question.result.QuestionResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public abstract class AbstractQuestionDecorate {


  @Autowired
  protected QuestionLabelDao labelDao;

  @Autowired
  protected AnswerDao answerDao;

  protected abstract void decorate(List<QuestionResult> questionResult);


}
