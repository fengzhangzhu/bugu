package com.living.core.service;


import com.living.core.config.ComplainObjectType;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.decorate.UserAttentionDecorate;
import com.living.core.decorate.UserVerifyDecorate;
import com.living.core.decorate.UserVipDecorate;
import com.living.core.domain.dao.User;
import com.living.core.domain.dao.UserVerify;
import com.living.core.domain.dto.AttentionUser;
import com.living.core.domain.dto.FansUser;
import com.living.core.domain.result.*;
import com.living.core.domain.send.DingMessage;
import com.living.core.exception.*;
import com.living.core.mapper.UserDao;
import com.living.core.mapper.VerifyDao;
import com.living.core.mapper.VipInfo;
import com.living.core.mapper.Visitor;
import com.living.core.result.ApiResult;
import com.living.core.result.ResultCode;
import com.living.core.service.dingtalk.SendDingMessageService;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.JwtUtil;
import com.living.core.util.RandomUtil;
import com.living.core.util.UserUtil;
import com.qiniu.common.QiniuException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class UserService {

  @Autowired
  private UserDao userDao;

  @Autowired
  private QiNiuService qiNiuService;

//  @Autowired
//  private AuditService auditService;

  @Autowired
  private VerifyDao verifyDao;

  private static final ExecutorService userInfoExecutor = new ThreadPoolExecutor(2,Integer.MAX_VALUE,60L,TimeUnit.SECONDS,new SynchronousQueue<>());

  /**
   * todo 将用户信息装饰查询操作改为并发
   * @param user
   * @return
   */
  public UserInfoResult userToUserInfoResult(User user){
    UserInfoResult userInfoResult = new UserInfoResult(user);
    Future<?> future = userInfoExecutor.submit(() -> {
      UserVipDecorate.decorate(userInfoResult);
    });
    int myId = UserUtil.getUserId();
    Future<?> future1 = userInfoExecutor.submit(() -> {
      UserAttentionDecorate.decorate(userInfoResult,myId);
    });
    Future<?> future2 = userInfoExecutor.submit(() -> {
      UserVerifyDecorate.decorate(userInfoResult);
    });
    try{
      future.get();
      future1.get();
      future2.get();
    }catch (Exception e){
      log.error("异步查询用户信息出现错误");
      log.error(e.getMessage());
      SendDingMessageService.sendApiErrorMessage(new DingMessage("异步查询用户信息出现错误"));
    }
//    UserVipDecorate.decorate(userInfoResult);
//    UserAttentionDecorate.decorate(userInfoResult);
//    UserVerifyDecorate.decorate(userInfoResult);
    return userInfoResult;
  }

  public UserLoginResult login(String openid, String inviteCode){
    User user = userDao.getUserByOpenid(openid);
    if(user!=null){
      return new UserLoginResult(JwtUtil.createUserToken(user.getId()),userToUserInfoResult(user));
    }
    Random random = new Random();
    int i = random.nextInt(10)+1;
    String avatar= QiNiuConfig.DEFAULT_AVATAR_DIRECTORY+i+".jpg";
    String username= RandomUtil.getStringRandom(16);
    user = new User(openid, username, avatar);
    userDao.addUser(user);
    String token = JwtUtil.createUserToken(user.getId());
    //给邀请者送一个月vip
    if(inviteCode!=null){
      Integer invitor = userDao.getUserIdByInviteCode(inviteCode);
      if(invitor!=null){
        topUpVipByDay(5,invitor);
      }
    }
    return new UserLoginResult(token,userToUserInfoResult(user));
  }

  public ApiResult<UserLoginResult> loginByPassword(String username, String password){
    User user = userDao.getUserByUsernameAndPassword(username, password);
    if(user==null){
      return ApiResult.fail(ResultCode.USERNAME_OR_PASSWORD_WRONG,"USERNAME_OR_PASSWORD_WRONG","用户名或密码错误");
    }
    return ApiResult.success(new UserLoginResult(JwtUtil.createUserToken(user.getId()),userToUserInfoResult(user)));
  }

  public void changeUsername(String username) throws UsernameExistException {

    try{
      userDao.changeUsername(username, UserUtil.getUserId());
    }catch (DuplicateKeyException e){
      throw new UsernameExistException();
    }

  }

  /**
   * 访问用户,记录访客同时增加目标用户访客总数
   * @param objectId 目标用户id
   */
  public void visitUser(int objectId,int visitorId){
    userDao.addVisitor(objectId,visitorId);
    userDao.addVisitorSum(objectId);
  }

  /**
   * 查看用户信息,留下访客记录
   * @param userId
   * @return
   * @throws ResourseNotExistException
   */
  public UserInfoResult infoWithVisit(int userId) throws ResourseNotExistException {
    User user = userDao.getUserById(userId);
    if(user==null){
      throw new ResourseNotExistException("用户不存在");
    }
    //todo 访问用户改为异步
    int myId = UserUtil.getUserId();
    if(userId!=myId){
      userInfoExecutor.submit(()->{visitUser(userId,myId);});
    }
//    visitUser(userId);
    return userToUserInfoResult(user);
  }

  /**
   * 查看用户信息
   * @param userId
   * @return
   * @throws ResourseNotExistException
   */
  public UserInfoResult info(int userId) throws ResourseNotExistException {
    User user = userDao.getUserById(userId);
    if(user==null){
      throw new ResourseNotExistException("用户不存在");
    }
    return userToUserInfoResult(user);
  }


  public List<AttentionUserResult> attentionList(int userId){
    List<AttentionUser> attentionList = userDao.getAttentionList(userId);
    return attentionList.stream().map(AttentionUserResult::new).collect(Collectors.toList());
  }

  public List<FansUserResult> fansList(int userId){
    List<FansUser> fansList = userDao.getFansList(userId);
    return fansList.stream().map(FansUserResult::new).collect(Collectors.toList());
  }


  public void changeAvatar(String avatar) throws QiniuException {
    User user = userDao.getUserById(UserUtil.getUserId());
    String userAvatar = user.getAvatar();
    userDao.updateAvatar(UserUtil.getUserId(),avatar);
    addAvatarAudit(UserUtil.getUserId(),avatar);
    if(!userAvatar.contains("default")){
      qiNiuService.deleteFile(userAvatar);
    }
  }
  public void addAvatarAudit(int userId, String avatar) {
    userDao.deleteAvatarAudit(userId);
    userDao.addAvatarAudit(userId, avatar);
  }

  public List<VisitorResult> getVisitorList(){
    List<Visitor> visitorList = userDao.getVisitorList(UserUtil.getUserId());
    return visitorList.stream().map(VisitorResult::new).collect(Collectors.toList());
  }

  public void inform(int objectId,String reason,String objectType) throws ParamErrorException {
    if(!ComplainObjectType.contain(objectType)){
      throw new ParamErrorException("objectType参数错误");
    }
    userDao.inform(UserUtil.getUserId(),objectId,reason,objectType);
  }

  public VipInfo checkVip(int userId) throws NoPermissionException {
    VipInfo vipInfo = userDao.getVipInfoByUserId(userId);
    if(vipInfo==null){
      throw new NoPermissionException("请充值vip后使用该功能");
    }
    if(vipInfo.getDeadline().getTime()<System.currentTimeMillis()){
      throw new NoPermissionException("vip已过期,请充值后使用该功能");
    }
    return vipInfo;
  }

  /**
   * 检查实名认证
   */
  public void checkVerify(int userId) throws NoPermissionException {
    UserVerify verify = verifyDao.getVerifyByUserId(userId);
    if(verify==null||verify.getIsPassed()==0){
      throw new NoPermissionException("请先实名认证");
    }
  }

  public void changeBackground(String background) throws QiniuException, NoPermissionException {
    int userId = UserUtil.getUserId();
    checkVip(userId);
    String lastBackground = userDao.getBackgroundByUserId(userId);
    userDao.updateBackground(background,userId);
    if(lastBackground!=null){
      qiNiuService.deleteFile(lastBackground);
    }
  }

  public UserInfoResult unlockVisitor(int visitorId)
      throws NoPermissionException, ResourseNotExistException {
    checkVip(UserUtil.getUserId());
    return info(visitorId);
  }


  public void verifyRequest(String pic) throws ActionErrorException {
    int myId = UserUtil.getUserId();
    UserVerify verifyByUserId = verifyDao.getVerifyByUserId(myId);
    if(verifyByUserId!=null&&verifyByUserId.getIsPassed()==0){
      throw new ActionErrorException("您的实名认证正在审核中");
    }
    if(verifyByUserId!=null&&verifyByUserId.getIsPassed()==1){
      throw new ActionErrorException("您已通过实名认证");
    }
    verifyDao.addVerifyRequest(pic,myId);
    SendDingMessageService.sendVerifyMessage(new DingMessage(myId+"号用户申请实名认证"));
  }


  public void updateSex(short sex) throws ActionErrorException, ParamErrorException {
    if(sex!=0&&sex!=1){
      throw new ParamErrorException("sex参数错误");
    }
    User user = UserUtil.getUser();
    if(user.getSex()!=null){
      throw new ActionErrorException("您已设置过性别,不可再修改");
    }
    userDao.updateSex(sex, user.getId());
  }

  /**
   * 充值vip
   * @param months 充值时长
   */
  public void topUpVip(int months,int userId){
    VipInfo vipInfo = userDao.getVipInfoByUserId(userId);
    long now=System.currentTimeMillis();
    long addTime = TimeUnit.DAYS.toMillis(months * 30L);
    //获得过vip
    if(vipInfo!=null){
      if(vipInfo.getDeadline().getTime()>now){
        now=vipInfo.getDeadline().getTime();
      }
      //更新vip截止时间
      userDao.updateVipDeadline(new Date(now+ addTime),userId);
    } else {
      //插入vip信息
      userDao.addVipInfo(userId,new Date(now+addTime));
    }
  }

  public void topUpVipByDay(int days,int userId){
    VipInfo vipInfo = userDao.getVipInfoByUserId(userId);
    long now=System.currentTimeMillis();
    long addTime = TimeUnit.DAYS.toMillis(days);
    //获得过vip
    if(vipInfo!=null){
      if(vipInfo.getDeadline().getTime()>now){
        now=vipInfo.getDeadline().getTime();
      }
      //更新vip截止时间
      userDao.updateVipDeadline(new Date(now+ addTime),userId);
    } else {
      //插入vip信息
      userDao.addVipInfo(userId,new Date(now+addTime));
    }
  }


  public VipInfoResult getVipInfo(int userId){
    VipInfo vipInfo = userDao.getVipInfoByUserId(userId);
    if(vipInfo==null){
      return null;
    }
    return new VipInfoResult(vipInfo);
  }

  public String invite(){
    int userId = UserUtil.getUserId();
    String code = userDao.getInviteCodeByUserId(userId);
    if(code!=null){
      return code;
    }
    code = UUID.randomUUID().toString().replaceAll("-", "");
    userDao.addInviteCode(userId,code);
    return code;
  }

}
