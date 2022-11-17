package com.living.activity.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.living.activity.config.UserPunishType;
import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dao.AvatarAudit;
import com.living.activity.domain.dao.CommentResponse;
import com.living.activity.domain.dao.Label;
import com.living.activity.domain.dto.ActivityComment;
import com.living.activity.domain.result.AvatarAuditResult;
import com.living.core.domain.result.PageResult;
import com.living.activity.domain.result.UnAuditLabelResult;
import com.living.activity.mapper.*;
import com.living.core.config.ComplainObjectType;
import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.UserComplain;
import com.living.core.domain.dao.UserVerify;
import com.living.core.domain.result.UserComplainResult;
import com.living.core.domain.result.UserVerifyResult;
import com.living.core.exception.ActionErrorException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.mapper.UserDao;
import com.living.core.service.OfficialMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 管理员审核服务
 *
 * @author lizijian
 */
@Service
public class AuditService {

  @Autowired
  private AuditDao auditDao;

  @Autowired
  private OfficialMessageService officialMessageService;

  @Autowired
  private UserDao userDao;

  @Autowired
  private PunishDao punishDao;

  @Autowired
  private LabelDao labelDao;

  @Autowired
  private ActivityDao activityDao;

  @Autowired
  private CommentDao commentdao;

  /**
   * 增加用户头像审核（加入之前删除之前的审核）
   *
   * @param userId
   * @param avatar
   */
  public void addAvatarAudit(int userId, String avatar) {
    auditDao.deleteAvatarAudit(userId);
    auditDao.addAvatarAudit(userId, avatar);
  }

  public PageResult<List<AvatarAuditResult>> getAvatarAuditList(int page) {
    PageHelper.startPage(page, 15);
    List<AvatarAudit> avatarList = auditDao.getAvatarList();
    PageInfo<AvatarAudit> pageInfo = new PageInfo<>(avatarList);
    return new PageResult<>(pageInfo, avatarList.stream().map(
        AvatarAuditResult::new).collect(Collectors.toList()));
  }

  public void passAvatarAudit(int userId) {
    auditDao.deleteAvatarAudit(userId);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteAvatarAudit(int userId, String reason) {
    auditDao.deleteAvatarAudit(userId);
    //重置用户头像
    Random random = new Random();
    int i = random.nextInt(10) + 1;
    String avatar = QiNiuConfig.DEFAULT_AVATAR_DIRECTORY + i + ".jpg";
    userDao.updateAvatar(userId, avatar);
    //发送官方消息
    officialMessageService.sendOfficialMessage("您的头像已被管理员删除,原因:" + reason, null, userId,
        OfficialMessageType.PUNISH);
  }

  public PageResult<List<UserVerifyResult>> verifyRequestList(int page) {
    PageHelper.startPage(page, 15);
    List<UserVerify> userVerifies = auditDao.getVerifyRequestList();
    return new PageResult<>(new PageInfo<>(userVerifies),
        userVerifies.stream().map(UserVerifyResult::new).collect(
            Collectors.toList()));
  }

  @Transactional(rollbackFor = Exception.class)
  public void passVerifyRequest(int id,String stuId,Short sex)
      throws ResourseNotExistException, ActionErrorException {
    UserVerify userVerify = auditDao.getUserVerifyById(id);
    if(userVerify==null) {
      throw new ResourseNotExistException("实名认证请求不存在");
    }
    try{
      auditDao.passVerifyRequest(id,sex,stuId);
    }catch (DuplicateKeyException e){
      throw new ActionErrorException("学号重复");
    }
    if(sex!=null){
      userDao.updateSex(sex, userVerify.getUserId());
    }
  }

  public void deleteVerifyRequest(int id, String reason) throws ResourseNotExistException {
    UserVerify userVerify = auditDao.getUserVerifyById(id);
    if (userVerify == null) {
      throw new ResourseNotExistException("实名认证请求不存在");
    }
    auditDao.deleteVerifyRequest(id);
    //给用户发送实名认证请求被删除的通知
    officialMessageService.sendOfficialMessage("您的实名认证请求未通过,原因:" + reason, null,
        userVerify.getUserId(), OfficialMessageType.NORMAL);
  }

  public PageResult<List<UserComplainResult>> userComplaintList(int page) {
    PageHelper.startPage(page, 5);
    List<UserComplain> userComplainList = auditDao.getUserComplainList();
    List<UserComplainResult> complainResults = userComplainList.stream().map(UserComplainResult::new)
        .collect(
            Collectors.toList());
    complainResults.forEach(a->{
      String objectType = a.getObjectType();
      if(ComplainObjectType.ACTIVITY.equals(objectType)){
        Activity activity = activityDao.getActivityById(a.getObjectId());
        if(activity!=null){
          a.setObjectUserId(activity.getUserId());
        }
      }
      if(ComplainObjectType.COMMENT.equals(objectType)){
        ActivityComment activityComment = commentdao.getCommentById(a.getObjectId());
        if(activityComment!=null){
          a.setObjectUserId(activityComment.getPublisher().getId());
        }
      }
      if(ComplainObjectType.CHAT.equals(objectType)){
        a.setObjectUserId(a.getObjectId());
      }
      if(ComplainObjectType.COMMENT_RESPONSE.equals(objectType)){
        CommentResponse commentResponse = commentdao.getCommentResponseById(a.getObjectId());
        if(commentResponse!=null){
          a.setObjectUserId(commentResponse.getFromUserId());
        }
      }
    });
    return new PageResult<>(new PageInfo<>(userComplainList),complainResults);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteUserComplaint(Integer userComplaintId,String reason)
      throws ResourseNotExistException {
    UserComplain userComplain = auditDao.getUserComplainById(userComplaintId);
    if(userComplain==null){
      throw new ResourseNotExistException("用户举报不存在");
    }
    auditDao.deleteUserComplainById(userComplaintId);
    officialMessageService.sendOfficialMessage("您的举报没有通过,原因:"+reason,null,userComplain.getInformerId(),OfficialMessageType.NORMAL);
  }

  @Transactional(rollbackFor = Exception.class)
  public void punish(Integer userId,Integer informerId,String type,Integer days,String reason,Integer userComplaintId) throws ParamErrorException {
    if(!UserPunishType.contain(type)){
      throw new ParamErrorException("type参数错误");
    }
    punishDao.addPunish(userId,type,new Date(System.currentTimeMillis()+ TimeUnit.DAYS.toMillis(days)));
    //如果存在举报者id,给举报者发送官方消息
    if(informerId!=null){
      officialMessageService.sendOfficialMessage("您的举报已被管理员审核,感谢您对美化布咕环境做出的贡献",null,informerId,OfficialMessageType.NORMAL);
    }
    //如果存在用户举报id,删除用户举报
    if(userComplaintId!=null){
      auditDao.deleteUserComplainById(userComplaintId);
    }
    //给被处罚者发送官方消息
    officialMessageService.sendOfficialMessage(reason,null,userId,OfficialMessageType.PUNISH);
  }


  public PageResult<List<UnAuditLabelResult>> unAuditLabelList(int page){
    PageHelper.startPage(page,15);
    List<Label> unAuditLabelList = labelDao.unAuditLabelList(page);
    return new PageResult<>(new PageInfo<>(unAuditLabelList),unAuditLabelList.stream().map(UnAuditLabelResult::new).collect(Collectors.toList()));
  }

  public void passLabel(int labelId){
    labelDao.passLabel(labelId);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteLabel(int labelId){
    labelDao.deleteLabel(labelId);
    labelDao.deleteActivityLabel(labelId);
  }

  /**
   * 获取未审核的问题标签
   */
  public PageResult<List<UnAuditLabelResult>> unAuditQuestionLabelList(int page){
    PageHelper.startPage(page,15);
    List<Label> unAuditLabelList = labelDao.unAuditQuestionLabelList(page);
    return new PageResult<>(new PageInfo<>(unAuditLabelList),unAuditLabelList.stream().map(UnAuditLabelResult::new).collect(Collectors.toList()));
  }

  /**
   * 通过问题标签
   */
  public void passQuestionLabel(int labelId){
    labelDao.passQuestionLabel(labelId);
  }

  /**
   * 删除问题标签
   */
  @Transactional(rollbackFor = Exception.class)
  public void deleteQuestionLabel(int labelId){
    labelDao.deleteQuestionLabel(labelId);
    labelDao.deleteLabelOfQuestion(labelId);
  }

}
