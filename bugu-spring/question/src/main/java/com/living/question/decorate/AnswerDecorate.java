package com.living.question.decorate;

import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.User;
import com.living.core.domain.helper.Publisher;
import com.living.core.mapper.UserDao;
import com.living.core.util.UserUtil;
import com.living.question.dao.Answer;
import com.living.question.dao.Question;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import com.living.question.mapper.QuestionLabelDao;
import com.living.question.result.AnswerResult;
import com.living.question.result.MyAnswerResult;
import com.living.question.result.QuestionResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author mulan
 * @version 1.0
 * @description 获取回答时使用的装饰类
 * @date 2022年 07月24日 10:56:01
 */
@Component
public class AnswerDecorate {
    @Autowired
    private QuestionDao questionDao;

    @Autowired
    private UserDao userDao;
    public void decorateFatherQuestion(List<MyAnswerResult> myAnswerResults) {
        if( myAnswerResults==null||myAnswerResults.size()==0){
            return;
        }
        List<Question> questions = questionDao.getQuestionsByAnswerIds(
                myAnswerResults.stream().mapToInt(MyAnswerResult::getId).toArray(),UserUtil.getUserId());
        List<QuestionResult> questionResults = questions.stream()
                .map(QuestionResult::new)
                .collect(Collectors.toList());
        Map<Integer, QuestionResult> questionMap = questionResults.stream()
                .collect(Collectors.toMap(QuestionResult::getId,questionResult->questionResult));
        for (MyAnswerResult myAnswerResult: myAnswerResults) {
            QuestionResult questionResult = questionMap.get(myAnswerResult.getQuestionId());
            myAnswerResult.setQuestion(questionResult);
        }
    }
    public void decorateMyUserInfo(List<MyAnswerResult> myAnswerResults) {
        if( myAnswerResults==null||myAnswerResults.size()==0){
            return;
        }
        User myInfo = UserUtil.getUser();
        Publisher publisher = userDao.getPublisherById(myInfo.getId());
        publisher.setAvatar(QiNiuConfig.URL+publisher.getAvatar());
        for (MyAnswerResult myAnswerResult: myAnswerResults) {
            myAnswerResult.setPublisher(publisher);
        }
    }
}
