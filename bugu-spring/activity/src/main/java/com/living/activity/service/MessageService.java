package com.living.activity.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import com.living.core.domain.dao.Message;
import com.living.activity.domain.dto.*;
import com.living.activity.domain.result.*;
import com.living.activity.domain.send.AlreadyReadMessage;
import com.living.core.domain.dto.*;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.send.SendMessage;
import com.living.core.domain.send.SendMessageType;
import com.living.activity.domain.send.WithdrawMessage;
import com.living.activity.exception.MissingParamException;
import com.living.activity.mapper.EmoticonDao;
import com.living.core.mapper.MessageDao;
import com.living.core.websocket.WebSocket;
import com.living.core.domain.dao.User;
import com.living.core.domain.dao.UserVerify;
import com.living.core.domain.result.UserInfoResult;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.mapper.UserDao;
import com.living.core.mapper.VerifyDao;
import com.living.core.mapper.VipInfo;
import com.living.core.util.RedisUtil;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class MessageService {

  @Autowired
  private MessageDao messageDao;

  @Autowired
  private UserDao userDao;

  @Autowired
  private Gson gson;

  @Autowired
  private VerifyDao verifyDao;

  @Autowired
  private EmoticonDao emoticonDao;

  public int sendMessage(Message message) throws MissingParamException, NoPermissionException {
    if(message.getType()==2){
      /**
       * 如果消息类型是语音,时间字段不存在
       */
      if(message.getTime()==null){
        throw new MissingParamException("缺少time参数");
      }
      /**
       * 如果消息类型是语音,用户未实名认证
       */
      UserVerify userVerify = verifyDao.getVerifyByUserId(UserUtil.getUserId());
      if(userVerify==null||userVerify.getIsPassed()==0){
        throw new NoPermissionException("未实名认证,不可发送语音消息");
      }
    }
    messageDao.addMessage(message);
    return message.getId();
  }

  public void saveUnreadMessage(int messageId){
    messageDao.addUnreadMessage(messageId);
  }

  public List<UnReadUserResult> getUnReadUser(){
    List<UnReadUser> unReadUser = messageDao.getUnReadUser(UserUtil.getUserId());
    List<UnReadUserResult> unReadUserResults = unReadUser.stream().map(UnReadUserResult::new)
        .collect(Collectors.toList());
    unReadUserResults.forEach(a->{
      a.setOnline(RedisUtil.getOnlineState(a.getUserId()));
    });
    return unReadUserResults;
  }

  @Transactional(rollbackFor = Exception.class)
  public List<UnreadMessageResult> getUnreadMessage(int userId){
    List<UnreadUserMessage> unreadUserMessages = messageDao.getUnreadMessageByUserId(userId,
        UserUtil.getUserId());
    if(unreadUserMessages.size()>0){
      messageDao.deleteUnreadMessageByUserId(
          unreadUserMessages.stream().mapToInt(UnreadUserMessage::getId).toArray());
    }
    //给消息发送方发送已读提醒
    WebSocket.sendMessage(userId,new SendMessage<>(SendMessageType.ALREADY_READ.getName(),new AlreadyReadMessage(UserUtil.getUserId())));
    return unreadUserMessages.stream().map(UnreadMessageResult::new).collect(Collectors.toList());
  }

  public PageResult<List<MessageHistoryResult>> messageHistory(int userId, int page){
    PageHelper.startPage(page,20);
    List<Message> messageHistory = messageDao.getMessageHistory(userId, UserUtil.getUserId());
    PageInfo<Message> pageInfo = new PageInfo<>(messageHistory);
    return new PageResult<>(pageInfo,messageHistory.stream().map(
        MessageHistoryResult::new).collect(
        Collectors.toList()));
  }

  public PageResult<List<MessageHistoryResult>> messageHistoryByDate(String date,int objectId,int page) throws ParamErrorException {
    try {
      new SimpleDateFormat("yyyy-MM-dd").parse(date);
    } catch (ParseException e) {
      throw new ParamErrorException("date参数格式错误");
    }
    String dateStart=date+" 00:00:00";
    String dateEnd=date+" 23:59:59";
    PageHelper.startPage(page,20);
    List<Message> messageHistory = messageDao.getMessageHistoryByDate(dateStart, dateEnd,
        objectId, UserUtil.getUserId());
    PageInfo<Message> pageInfo = new PageInfo<>(messageHistory);
    return new PageResult<>(pageInfo,messageHistory.stream().map(MessageHistoryResult::new).collect(
        Collectors.toList()));
  }

  public List<MessageHistoryDateResult> messageHistoryDateList(int objectId) throws ParseException {
    int myId = UserUtil.getUserId();
    VipInfo vipInfo = userDao.getVipInfoByUserId(myId);
    /**
     * 不是会员返回最近三个月，会员返回最近6个月
     */
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM");
    Map<String, List<String>> groupMap = new HashMap<>(16);
    List<String> messageDays=null;
    if(vipInfo==null||vipInfo.getDeadline().getTime()<System.currentTimeMillis()){
      messageDays = messageDao.getThreeMonthMessageHistory(objectId,
          myId);
    }else {
      messageDays = messageDao.getSixMonthMessageHistory(objectId, myId);
    }
    for (String s : messageDays) {
      String month = simpleDateFormat.format(simpleDateFormat.parse(s));
      List<String> dayList = groupMap.get(month);
      if(dayList==null){
        dayList=new ArrayList<>();
        dayList.add(s);
        groupMap.put(month,dayList);
      }else {
        dayList.add(s);
        groupMap.put(month,dayList);
      }
    }
    ArrayList<MessageHistoryDateResult> historyDateResults=new ArrayList<>(6);
    groupMap.forEach((key,value)->{
      historyDateResults.add(new MessageHistoryDateResult(key,value));
    });
    return historyDateResults;
  }

  public void delete(int id) throws ResourseNotExistException, NoPermissionException {
    Message message = messageDao.getMessageById(id);
    if(message==null){
      throw new ResourseNotExistException("聊天记录不存在");
    }
    //是自己发送的消息
    if(message.getFromUserId()==UserUtil.getUserId()){
      messageDao.deleteMyMessageById(id);
    }
    //是对方发送的消息
    else if(message.getToUserId()==UserUtil.getUserId()){
      messageDao.deleteOtherMessageById(id);
    }else {
      throw new NoPermissionException("没有权限删除");
    }
  }

  public void withdraw(int id) throws ResourseNotExistException, NoPermissionException {
    Message message = messageDao.getMessageById(id);
    if(message==null){
      throw new ResourseNotExistException("聊天记录不存在");
    }
    if(message.getFromUserId()!=UserUtil.getUserId()){
      throw new NoPermissionException("不可撤回该消息");
    }
    WebSocket.sendMessage(message.getToUserId(),new SendMessage<>(SendMessageType.WITHDRAW.getName(),new WithdrawMessage(UserUtil.getUserId(),id)));
    messageDao.withdraw(id);
    messageDao.deleteMessage(id);
  }

  public List<UserInfoResult> getUsersInfo(int [] userIds){
    List<User> users = userDao.getUsersByIds(userIds);
    return users.stream().map(UserInfoResult::new).collect(Collectors.toList());
  }

  public List<MessageStateResult> checkUnread(String ids){
    Integer[] messageIds = gson.fromJson(ids, Integer[].class);
    List<Integer> unreadMessageIds = messageDao.getUnreadMessageIds(messageIds);
    return Arrays.stream(messageIds).map(a->{boolean isUnread= unreadMessageIds.contains(a);
      return new MessageStateResult(a,isUnread);
    }).collect(Collectors.toList());
  }

  @Transactional(rollbackFor = Exception.class)
  public List<UnreadInteractiveMessageResult> getUnreadInteractiveMessage(){
    List<UnreadInteractiveMessageDto> unreadInteractiveMessage = messageDao.getUnreadInteractiveMessage(
        UserUtil.getUserId());
    int[] ids = unreadInteractiveMessage.stream().mapToInt(UnreadInteractiveMessageDto::getId).toArray();
    if(ids.length>0){
      messageDao.deleteInteractiveMessage(ids);
    }
    return unreadInteractiveMessage.stream().map(UnreadInteractiveMessageResult::new).collect(
        Collectors.toList());
  }

  public List<UnreadOfficialMessageResult> unreadOfficialMessageList(){
    List<UnreadOfficialMessage> unreadOfficialMessageList = messageDao.getUnreadOfficialMessageList(
        UserUtil.getUserId());
    return unreadOfficialMessageList.stream().map(UnreadOfficialMessageResult::new).collect(Collectors.toList());
  }

  @Transactional(rollbackFor = Exception.class)
  public List<SpecialTypeOfficialMessageResult> specialTypeOfficialMessage(String type){
    List<SpecialTypeOfficialMessage> specialTypeOfficialMessage = messageDao.getSpecialTypeOfficialMessage(
        UserUtil.getUserId(), type);
    int[] ids = specialTypeOfficialMessage.stream().mapToInt(SpecialTypeOfficialMessage::getId)
        .toArray();
    if(ids.length>0){
      messageDao.updateSpecialTypeOfficialMessageState(ids);
    }
    return specialTypeOfficialMessage.stream().map(SpecialTypeOfficialMessageResult::new).collect(Collectors.toList());
  }

  public void saveEmoticon(String filename){
    emoticonDao.addEmoticon(filename,UserUtil.getUserId());
  }

  public PageResult<List<EmoticonResult>> emotionsList(int page){
    PageHelper.startPage(page,20);
    List<Emoticon> emoticons = emoticonDao.emoticonList(UserUtil.getUserId());
    return new PageResult<>(new PageInfo<>(emoticons),emoticons.stream().map(EmoticonResult::new).collect(
        Collectors.toList()));
  }

  public void deleteEmoticon(int id){
    emoticonDao.deleteEmoticon(id);
  }

}
