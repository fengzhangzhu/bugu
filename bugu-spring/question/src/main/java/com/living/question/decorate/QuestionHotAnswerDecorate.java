package com.living.question.decorate;

import com.living.question.dao.Answer;
import com.living.question.dao.Label;
import com.living.question.result.AnswerResult;
import com.living.question.result.QuestionResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description 问题热门回答装饰类
 * @date 2022年 07月22日 10:58:56
 */
@Component
@Slf4j
public class QuestionHotAnswerDecorate extends AbstractQuestionDecorate{
    @Override
    public void decorate(List<QuestionResult> questionResults) {
        if(questionResults==null||questionResults.size()==0){
            return;
        }
        List<Answer> answers = answerDao.getHotAnswersByQuestionIds(
                questionResults.stream().mapToInt(QuestionResult::getId).toArray());
        log.info(answers.toString());
        List<AnswerResult> answerResults = answers.stream()
                .map(AnswerResult::new)
                .collect(Collectors.toList());
        Map<Integer, AnswerResult> answerMap = answerResults.stream()
                .collect(Collectors.toMap(AnswerResult::getQuestionId,answer->answer));
        for (QuestionResult questionResult : questionResults) {
           AnswerResult answer = answerMap.get(questionResult.getId());
           questionResult.setHotAnswer(answer);
        }
    }
}
