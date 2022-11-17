package com.living.activity.service;

import com.living.core.domain.dao.User;
import com.living.core.domain.result.UserInfoResult;
import com.living.core.exception.ActionErrorException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseExistException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.mapper.AttentionDao;
import com.living.core.mapper.UserDao;
import com.living.core.service.UserService;
import com.living.core.util.UserUtil;
import com.living.core.service.InteractiveMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class SocialService {

  @Autowired
  private AttentionDao attentionDao;

  @Autowired
  private InteractiveMessageService interactiveMessageService;

  @Autowired
  private UserDao userDao;

  @Autowired
  private UserService userService;

  @Transactional(rollbackFor = Exception.class)
  public void attention(int attentionUserId)
      throws ResourseNotExistException, ResourseExistException, ActionErrorException {
    User my = UserUtil.getUser();
    if(attentionUserId==my.getId()){
      throw new ActionErrorException("不能关注自己");
    }
    if(userDao.getUserById(attentionUserId)==null){
      throw new ResourseNotExistException("用户不存在");
    }
    try{
      attentionDao.attention(my.getId(), attentionUserId);
      userDao.addAttentionSum(my.getId());
      userDao.addBeAttentionSum(attentionUserId);
    }catch (DuplicateKeyException e){
      throw new ResourseExistException("关注过此用户");
    }
    interactiveMessageService.attention(my,attentionUserId);
  }

  @Transactional(rollbackFor = Exception.class)
  public void removeAttention(int objectId){
    int i = attentionDao.removeAttention(UserUtil.getUserId(), objectId);
    if(i>0){
      userDao.subAttentionSum(UserUtil.getUserId());
      userDao.subFansSum(objectId);
    }
  }

  public List<UserInfoResult> searchUser(String username) throws ParamErrorException {
    if(username.contains("%")){
      throw new ParamErrorException("不能包含百分号");
    }
    char[] chars = username.toCharArray();
    StringBuilder usernameBuilder = new StringBuilder();
    for (char aChar : chars) {
      usernameBuilder.append(aChar);
      usernameBuilder.append("%");
    }
    username = usernameBuilder.toString();
    List<User> users = userDao.getUserByUsername(username);
    return users.stream().map(userService::userToUserInfoResult).collect(Collectors.toList());
  }


}
