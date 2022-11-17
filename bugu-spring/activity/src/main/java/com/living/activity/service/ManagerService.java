package com.living.activity.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.living.activity.domain.dao.Activity;
import com.living.activity.domain.dao.Admin;
import com.living.activity.domain.dao.Label;
import com.living.activity.domain.helper.OfficialMessageHelper;
import com.living.activity.domain.result.*;
import com.living.activity.mapper.ActivityDao;
import com.living.activity.mapper.LabelDao;
import com.living.activity.mapper.ManagerDao;
import com.living.core.config.OfficialMessageType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.dao.OfficeMessage;
import com.living.core.domain.dao.OfficeMessageObject;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.exception.ResourseExistException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.exception.UsernameOrPasswordErrorException;
import com.living.core.mapper.OfficialMessageDao;
import com.living.core.result.ApiResult;
import com.living.core.service.OfficialMessageService;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.JwtUtil;
import com.living.question.dao.Answer;
import com.living.question.dao.Question;
import com.living.question.mapper.AnswerDao;
import com.living.question.mapper.QuestionDao;
import com.qiniu.common.QiniuException;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.model.FileInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class ManagerService {

  @Autowired
  private ManagerDao managerDao;

  @Autowired
  private ActivityDao activityDao;

  @Autowired
  private QuestionDao questionDao;
  @Autowired
  private AnswerDao answerDao;
  @Autowired
  private QiNiuService qiNiuService;

  @Autowired
  private LabelDao labelDao;
  @Autowired
  private OfficialMessageDao officialMessageDao;

  @Autowired
  private OfficialMessageService officialMessageService;

  /**
   * 动态热度自动减少值
   */
  private static int reduceHot;



  /**
   * 获取七牛云指定目录下的文件，不包括文件夹
   */
  public Set<String> getQiNiuFile(String name) {
    Set<String> files = new HashSet<>(1024);
    String prefix = name + "/";
    int limit = 1000;
    String delimiter = "/";
    BucketManager.FileListIterator fileListIterator = QiNiuConfig.bucketManager.createFileListIterator(
        QiNiuConfig.BUCKET, prefix, limit, delimiter);
    while (fileListIterator.hasNext()) {
      FileInfo[] fileInfos = fileListIterator.next();
      if(fileInfos!=null){
        for (FileInfo fileInfo : fileInfos) {
          files.add(fileInfo.key);
        }
      }
    }
    return files;
  }

  public void addDirectory(String name, String father)
      throws ResourseExistException, ResourseNotExistException {
    if (father == null) {
      father = "";
    }
    if (!"".equals(father)) {
      father = managerDao.getDirectoryByName(father);
      if (father == null) {
        throw new ResourseNotExistException("父文件夹不存在");
      }
      name = father + "/" + name;
    }
    if (managerDao.getDirectory(name, father) != null) {
      throw new ResourseExistException("存在同名文件夹");
    }
    managerDao.addDirectory(name, father);
  }

  public DirectoryResult showDirectory(String name) {
    if (name == null) {
      name = "";
    }
    List<String> directorys = managerDao.getSonDirectory(name);
    Set<String> files = new HashSet<>();
    if(!"".equals(name)){
     files = getQiNiuFile(name);
    }
    return new DirectoryResult(QiNiuConfig.URL, directorys, files);
  }

  public QiNiuTokenResult uploadFile(String fileName, String directory)
      throws Exception {
    if (managerDao.getDirectoryByName(directory) == null) {
      throw new ResourseNotExistException("文件夹不存在");
    }
    String fileKey = directory + "/" + fileName;
    String uploadToken = QiNiuConfig.auth.uploadToken(QiNiuConfig.BUCKET, fileKey);
    log.info("uploadToken:" + uploadToken);
    return new QiNiuTokenResult(uploadToken, fileKey);
  }

  public void renameFile(String fromName, String toName) throws QiniuException {
    QiNiuConfig.bucketManager.move(QiNiuConfig.BUCKET, fromName, QiNiuConfig.BUCKET, toName);
  }

  public void deleteFile(String fileName) throws QiniuException {
    QiNiuConfig.bucketManager.delete(QiNiuConfig.BUCKET, fileName);
  }


  public void deleteDirectory(String directory) throws ResourseNotExistException, QiniuException {
    if (managerDao.getDirectoryByName(directory) == null) {
      throw new ResourseNotExistException("文件夹不存在");
    }
    List<String> sonDirectorys = managerDao.getSonDirectory(directory);
    for (String sonDirectory : sonDirectorys) {
      deleteDirectory(sonDirectory);
    }
    managerDao.deleteDirectory(directory);
    Set<String> qiNiuFile = getQiNiuFile(directory);
    for (String fileName : qiNiuFile) {
      deleteFile(fileName);
    }
  }

  public String login(String username, String password) throws UsernameOrPasswordErrorException {
    Admin admin = managerDao.getAdmin(username, password);
    if (admin == null) {
      throw new UsernameOrPasswordErrorException();
    }
    return JwtUtil.createManagerToken(admin.getId(),username, password);
  }

  public PageResult<List<NotAuditActivityResult>> getNotAuditActivity(int page) {
    PageHelper.startPage(page,15);
    List<Activity> notAuditActivity = managerDao.getNotAuditActivity();
    return new PageResult<>(new PageInfo<>(notAuditActivity),notAuditActivity.stream().map(NotAuditActivityResult::new).collect(
        Collectors.toList()));
  }

  public void auditActivity(int id) {
    managerDao.passActivity(id);
  }


  @Transactional(rollbackFor = Exception.class)
  public void deleteActivity(int id, String reason, int userId, String pic)
      throws ResourseNotExistException, QiniuException {
    Activity activity = activityDao.getActivityById(id);
    if(activity==null){
      throw new ResourseNotExistException("动态不存在");
    }
    managerDao.deleteActivity(id);
    officialMessageService.sendOfficialMessage(reason,pic,userId,OfficialMessageType.PUNISH);
    if(activity.getPic()!=null){
      qiNiuService.deleteFile(activity.getPic());
    }
  }

  public OfficialMessageResult getOfficialMessage(int page){
    PageHelper.startPage(page,15);
    List<OfficeMessage> officialMessages = officialMessageDao.getOfficialMessage();
    PageInfo<OfficeMessage> pageInfo = new PageInfo<>(officialMessages);
    return new OfficialMessageResult(pageInfo.getPages(),
        pageInfo.getTotal(),officialMessages.stream().map(
        OfficialMessageHelper::new).collect(Collectors.toList()));
  }

  public List<OfficialMessageDetailResult> getOfficialMessageDetail(int id){
    List<OfficeMessageObject> officeMessageObjectList = officialMessageDao.getOfficialMessageObjectByMessageId(
        id);
    return officeMessageObjectList.stream().map(OfficialMessageDetailResult::new).collect(Collectors.toList());
  }

  public void setActivityHot(int activityId,int hot){
    managerDao.setActivityHot(activityId,hot);
  }

  /**
   * 获取未审核的问题
   */
  public PageResult<List<NotAuditQuestionResult>> getNotAuditQuestion(int page) {
    PageHelper.startPage(page,15);
    List<Question> notAuditQuestion = managerDao.getNotAuditQuestion();
    return new PageResult<>(new PageInfo<>(notAuditQuestion),notAuditQuestion.stream().map(NotAuditQuestionResult::new).collect(
            Collectors.toList()));
  }

  /**
   * 问题通过审核
   */
  public void auditQuestion(int id) {
    managerDao.passQuestion(id);
  }


  /**
   * 删除问题
   */
  @Transactional(rollbackFor = Exception.class)
  public void deleteQuestion(int id, String reason, int userId, String pic)
          throws ResourseNotExistException, QiniuException {
    Question question = questionDao.getQuestionById(id);
    if(question==null){
      throw new ResourseNotExistException("问题不存在");
    }
    managerDao.deleteQuestion(id);
    officialMessageService.sendOfficialMessage(reason,pic,userId,OfficialMessageType.PUNISH);
    if(question.getPics()!=null){
      qiNiuService.deleteFile(question.getPics());
    }
    if(question.getVideo()!=null){
      qiNiuService.deleteFile(question.getVideo());
    }
  }

  /**
   * 获取未审核的问题
   */
  public PageResult<List<NotAuditAnswerResult>> getNotAuditAnswer(int page) {
    PageHelper.startPage(page,15);
    List<Answer> notAuditAnswer = managerDao.getNotAuditAnswer();
    return new PageResult<>(new PageInfo<>(notAuditAnswer),notAuditAnswer.stream().map(NotAuditAnswerResult::new).collect(
            Collectors.toList()));
  }

  /**
   * 问题通过审核
   */
  public void auditAnswer(int id) {
    managerDao.passAnswer(id);
  }


  /**
   * 删除问题
   */
  @Transactional(rollbackFor = Exception.class)
  public void deleteAnswer(int id, String reason, int userId, String pic)
          throws ResourseNotExistException, QiniuException {
    Answer answer = answerDao.getAnswerById(id);
    if(answer==null){
      throw new ResourseNotExistException("回答不存在");
    }
    managerDao.deleteAnswer(id);
    officialMessageService.sendOfficialMessage(reason,pic,userId,OfficialMessageType.PUNISH);
    if(answer.getPic()!=null){
      qiNiuService.deleteFile(answer.getPic());
    }
  }

  /**
   * 更新标签信息
   */
  public void updateLabelInfo(int id,String content,String icon,int hot,short isRecommended){
    Label label = new Label(id,content,icon,hot,isRecommended);
    labelDao.updateLabelInfo(label);
  }
  /**
   * 获取推荐的动态标签
   */
  public List<Label> getRecommendedLabelList() {
    List<Label> labelList = labelDao.getRecommendedLabelList();
    return labelList;
  }
}
