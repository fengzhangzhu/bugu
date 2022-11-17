package com.living.activity.controller;

import com.google.gson.Gson;
import com.living.activity.domain.factory.MessageFactory;
import com.living.activity.domain.receive.ReceiveMessage;
import com.living.activity.domain.result.*;
import com.living.core.domain.result.PageResult;
import com.living.core.domain.send.SendMessage;
import com.living.core.domain.send.SendMessageType;
import com.living.activity.domain.send.UserMessage;
import com.living.activity.exception.MissingParamException;
import com.living.activity.service.MessageService;
import com.living.activity.service.qiniu.QiNiuMessageService;
import com.living.core.websocket.WebSocket;
import com.living.core.config.qiniu.QiNiuConfig;
import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.domain.result.UserInfoResult;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ParamErrorException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.result.ApiResult;
import com.living.core.util.RedisUtil;
import com.living.core.util.UserUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.text.ParseException;
import java.util.List;

/**
 * @author lizijian
 */
@RequestMapping("/living/message")
@RestController
@Validated
@Api(tags = "消息模块")
@Slf4j
public class MessageController {

  @Autowired
  private MessageService messageService;

  @Autowired
  private Gson gson;

  @Autowired
  private QiNiuMessageService qiNiuMessageService;


  @ApiOperation(value = "向指定id用户发送消息",notes = "返回消息的id")
  @PostMapping("/send")
  public ApiResult<SendMessageResult> sendMessage(@Validated ReceiveMessage receiveMessage)
      throws MissingParamException, NoPermissionException {
    int messageId = messageService.sendMessage(
        MessageFactory.getMessage(receiveMessage.getContent(), UserUtil.getUserId(),
            receiveMessage.getToUserId(), receiveMessage.getType(), receiveMessage.getTime()));
      boolean success = WebSocket.sendMessage(receiveMessage.getToUserId(),
          new SendMessage<>(SendMessageType.USER_MESSAGE.getName(),
              new UserMessage(messageId, receiveMessage.getContent(),
                  receiveMessage.getType(), UserUtil.getUserId(), receiveMessage.getTime())));
      //如果未成功发送消息,消息存储至未读消息表
      if(!success){
        messageService.saveUnreadMessage(messageId);
      }
    return ApiResult.success(new SendMessageResult(messageId, QiNiuConfig.URL));
  }


  @GetMapping("/unRead/user")
  @ApiOperation(value = "未读消息列表",notes = "发送方用户列表")
  public ApiResult<List<UnReadUserResult>> unReadUser(){
    return ApiResult.success(messageService.getUnReadUser());
  }

  @ApiOperation("获取指定id用户发送的未读消息")
  @DeleteMapping("/unRead/message")
  public ApiResult<List<UnreadMessageResult>> getUnreadMessage(@NotNull Integer userId){
    return ApiResult.success(messageService.getUnreadMessage(userId));
  }

  @GetMapping("/history")
  @ApiOperation("获取与指定id用户的聊天记录")
  public ApiResult<PageResult<List<MessageHistoryResult>>> messageHistory(@NotNull @Min(1) Integer userId, @RequestParam(defaultValue = "1") int page){
    return ApiResult.success(messageService.messageHistory(userId,page));
  }

  @ApiImplicitParam(name = "date",value = "格式为yyyy-MM-dd",required = true)
  @GetMapping("/history/byDate")
  @ApiOperation("按日期查看聊天记录")
  public ApiResult<PageResult<List<MessageHistoryResult>>> messageHistoryGroupByDate(@NotBlank String date,@NotNull @Min(1) Integer userId,@RequestParam(defaultValue = "1") int page)
      throws ParamErrorException {
    return ApiResult.success(messageService.messageHistoryByDate(date,userId,page));
  }

  @GetMapping("/history/dateList")
  @ApiOperation(value = "聊天记录日期列表",notes = "会员返回最近6个月,非会员返回最近3个月")
  public ApiResult<List<MessageHistoryDateResult>> messageHistoryDateList(@NotNull @Min(1) Integer userId)
      throws ParseException {
    return ApiResult.success(messageService.messageHistoryDateList(userId));
  }

  @ApiOperation(value = "删除指定id聊天记录",notes = "删除自己的,对方的记录还存在")
  @PostMapping("/{id}/delete")
  public ApiResult<?> delete(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException {
    messageService.delete(id);
    return ApiResult.success();
  }

  @GetMapping("/onlineState")
  @ApiOperation("获取指定id用户在线状态")
  public ApiResult<?> getOnlineState(@NotNull Integer userId){
    return ApiResult.success(RedisUtil.getOnlineState(userId));
  }


  @PostMapping("/{id}/withdraw")
  @ApiOperation("撤回指定id的消息")
  public ApiResult<?> withdraw(@NotNull @PathVariable Integer id)
      throws ResourseNotExistException, NoPermissionException {
    messageService.withdraw(id);
    return ApiResult.success();
  }


  @ApiOperation(value = "获取消息列表用户信息")
  @GetMapping("/users/info")
  public ApiResult<List<UserInfoResult>> getUsersInfo(@NotBlank String userIds){
    return ApiResult.success(messageService.getUsersInfo(gson.fromJson(userIds,int [].class)));
  }

  @GetMapping("/tokens")
  @ApiOperation("获取七牛云消息上传凭证")
  public ApiResult<List<QiNiuTokenResult>> getTokens(@RequestParam(defaultValue = "1") int sum) throws Exception {
    return ApiResult.success(qiNiuMessageService.getTokenResults(sum));
  }

  @GetMapping("/unread/check")
  @ApiOperation("检查指定id数组消息的已读状态")
  public ApiResult<List<MessageStateResult>> checkUnread(@NotBlank String ids){
    return ApiResult.success(messageService.checkUnread(ids));
  }

  @GetMapping("/interactive/unread")
  @ApiOperation("获取未读互动消息")
  public ApiResult<List<UnreadInteractiveMessageResult>> getUnreadInteractiveMessage(){
    return ApiResult.success(messageService.getUnreadInteractiveMessage());
  }

  @GetMapping("/official/unread/list")
  @ApiOperation("未读官方消息列表")
  public ApiResult<List<UnreadOfficialMessageResult>> unreadOfficialMessageList(){
    return ApiResult.success(messageService.unreadOfficialMessageList());
  }

  @GetMapping("/official/unread/special")
  @ApiOperation("指定类型官方未读消息")
  public ApiResult<List<SpecialTypeOfficialMessageResult>> specialTypeOfficialMessage(@NotBlank String type){
    return ApiResult.success(messageService.specialTypeOfficialMessage(type));
  }

  @PostMapping("/emoticon/add")
  @ApiOperation("存表情包")
  public ApiResult<?> saveEmoticon(@NotNull String filename){
    messageService.saveEmoticon(filename);
    return ApiResult.success();
  }

  @GetMapping("/emoticon/list")
  @ApiOperation("表情包列表")
  public ApiResult<PageResult<List<EmoticonResult>>> emotionsList(@RequestParam(defaultValue = "1") int page){
    return ApiResult.success(messageService.emotionsList(page));
  }

  @DeleteMapping("/emoticon/delete")
  @ApiOperation("删除表情包")
  public ApiResult<?> deleteEmoticon(@NotNull Integer id){
    messageService.deleteEmoticon(id);
    return ApiResult.success();
  }

}
