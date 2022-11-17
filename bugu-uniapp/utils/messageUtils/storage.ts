import {UserMessageGroup,
		WithDrawMessage,
		NewUserMessage,
		UserMessageListItem,
		InteractiveMessageList,
		InteractiveMessage,
		OfficialNewsData,
		OfficialNewsListItem, 
		AlreadyReadMessage,
		InteractiveMessageData,
		InteractiveMessageSaveType
		} from "./model";
import {
		getInteractiveMessageListKey,
		getUserMessageListKey,
		getChatRecordKey,
		getOfficeNewsListKey,
		getOfficeTypeNewsListKey,
		getQuestionMessageListKey,
		} from "./storageKeys";
import {
	getTime
}  from "../dateUtils";
import {
	USER_MESSAGE
} from "@/common/constants";
import {getUserinfo} from "@/common/requestFunctions";
import { InteractiveType } from "@/common/constants"
export const likeGroup:string[] = [InteractiveType.LIKE,InteractiveType.AGREE]
export const commentGroup:string[] = [InteractiveType.COMMENT,InteractiveType.ANSWER]

/**
 * @function 保存与指定用户的聊天信息
 * @param new_message 新消息
 * @param userId 用户的Id
 */
export async function saveChatRecord(new_message: NewUserMessage, userId: number) {
	let CHAT_RECORD = getChatRecordKey(userId,new_message.data.fromUserId)
	let messagesGroup = await getChatRecord(userId,new_message.data.fromUserId)
   // console.log("messagesGroup:",messagesGroup)
	let messages = messagesGroup.messages
    messages.push({
      content: new_message.data.content,
      type: new_message.data.type,
      id: new_message.data.id,
      createTime: getTime(),
      isMe: false,
      time: new_message.data.time
    })
    messagesGroup.badgeNumber = messagesGroup.badgeNumber + 1//未读消息数加一
    messagesGroup.messages = messages
    uni.setStorage({ key: CHAT_RECORD, data: messagesGroup })
}
/**
 * @function 撤回消息时更新本地消息记录
 * @param with_draw_message 撤回的消息信息
 * @param userId 用户的Id
 */
export async function saveWithDrawChatRecord(with_draw_message: WithDrawMessage, userId: number){
	  let CHAT_RECORD = getChatRecordKey(userId,with_draw_message.data.userId)
	  let messagesGroup = await getChatRecord(userId,with_draw_message.data.userId )
	  let messages = messagesGroup.messages
	  for (let j = messages.length - 1; j >= 0; j--) {
	    if (messages[j].id == with_draw_message.data.messageId) {
	      messages[j] = {
	        id: with_draw_message.data.messageId,
	        type: -1,
	        content: '对方撤回了一条消息',
	        createTime: messages[j].createTime,
	        isMe: false,
	      }
	    }
	  }
	  messagesGroup.messages = messages
	  uni.setStorage({ key: CHAT_RECORD, data: messagesGroup })
	
}
/**
 * @function 保存与指定用户的已读聊天信息
 * @param new_message 已读的消息提示
 * @param userId 用户的Id
 */
export async function saveAlreadyRead(new_message: AlreadyReadMessage, userId: number) {
	let CHAT_RECORD = getChatRecordKey(userId,new_message.data.userId)
	let messagesGroup = await getChatRecord(userId,new_message.data.userId )
	let messages = messagesGroup.messages
	  for (let i = 0; i < messages.length; i++) {
		if (messages[i].isMe) {
		  messages[i].isNotRead = false
		}
	  }
	messagesGroup.messages = messages
	uni.setStorage({ key: CHAT_RECORD, data: messagesGroup })

}
/**
 * @function 获取与指定id用户的聊天记录
 * @param toUserId 指定聊天对象的id
 * @param userId 用户的Id
 * @return {UserMessageGroup} 
 */
export async function getChatRecord( userId: number,toUserId: number): Promise<UserMessageGroup> {
	let CHAT_RECORD = getChatRecordKey(userId,toUserId)
    let userMessageGroup = uni.getStorageSync(CHAT_RECORD) as UserMessageGroup
	
	if(!userMessageGroup){
		userMessageGroup = {
		fromUserId: toUserId,
		type: USER_MESSAGE,
		badgeNumber: 0,
		messages: [] 
		} 
	}
	return userMessageGroup
}
/**
 * @function 保存并更新消息列表
 * @param new_message 新消息
 * @param userId 用户的Id
 */
export async function saveUserMessageList(new_message: NewUserMessage, userId: number) {
  //缓存的key
  let USER_MESSAGE_LIST =  getUserMessageListKey(userId)
  //获取缓存的聊天列表
  let userMessageList = await getUserMessageList(userId)
  // console.log("userMessageList:",userMessageList)
  // changeUnreadMessageSum(1)
    let have_data = false
    for (let i = 0; i < userMessageList.length; i++) {
      if (new_message.data.fromUserId == userMessageList[i].userId) {
        userMessageList.push({
          avatar: userMessageList[i].avatar,
          lastMessage: new_message.data.content,
          lastMessageType: new_message.data.type,
          lastTime: getTime(),
          online: userMessageList[i].online,
          unReadSum: userMessageList[i].unReadSum + 1,
          userId: userMessageList[i].userId,
          username: userMessageList[i].username,
        })
        userMessageList.splice(i, 1)
        have_data = true
        uni.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList })
        break
      }
    }
    if (!have_data) {
      let userInfo = await getUserinfo(new_message.data.fromUserId)
      if (userInfo) {
        userMessageList.push({
          avatar: userInfo.avatar,
          lastMessage: new_message.data.content,
          lastMessageType: new_message.data.type,
          lastTime: getTime(),
          online: true,
          unReadSum: 1,
          userId: userInfo.id,
          username: userInfo.username,
        })
      }
    } 
	uni.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList })

}

/**
 * @function 保存并更新消息列表(撤回时)
 * @param new_message 新消息
 * @param userId 用户的Id
 */
export async function saveUserMessageListWhenWithDraw(with_draw_message: WithDrawMessage, userId: number){
	let USER_MESSAGE_LIST = getUserMessageListKey(userId)
	let userMessageList = await getUserMessageList(userId)
	let have_data = false
	for (let i = 0; i < userMessageList.length; i++) {
		if (with_draw_message.data.userId == userMessageList[i].userId) {
			userMessageList[i] = {
				avatar: userMessageList[i].avatar,
				lastMessage: '对方撤回了一条消息',
				lastMessageType: -1,
				lastTime: userMessageList[i].lastTime,
				online: userMessageList[i].online,
				unReadSum: userMessageList[i].unReadSum,
				userId: userMessageList[i].userId,
				username: userMessageList[i].username,
			}
		  have_data = true
		  break
		}
	}
	if (!have_data) {
	let userInfo = await getUserinfo(with_draw_message.data.userId)
	if (userInfo) {
	  userMessageList.push({
		avatar: userInfo.avatar,
		lastMessage: '对方撤回了一条消息',
		lastMessageType: -1,
		lastTime: getTime(),
		online: true,
		unReadSum: 0,
		userId: userInfo.id,
		username: userInfo.username,
	  })
	}
	}
	uni.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList })
}

/**
 * @function 删除对话
 * @returns {Promise<UserMessageListItem[]> }
 * @param {number} userId 用户的id
 */
export async function deleteUserMessageItem(userId:number,toUserId: number): Promise<UserMessageListItem[]> {
  let userMessageList = await getUserMessageList(userId)
  let USER_MESSAGE_LIST = getUserMessageListKey(userId)
  for (let i = 0; i < userMessageList.length; i++) {
    if (userMessageList[i].userId == toUserId) {
		let CHAT_RECORD = getChatRecordKey(userId,toUserId)
        uni.setStorage({ key: CHAT_RECORD, data: null })//清除聊天记录
        userMessageList.splice(i, 1)
        break
    }
  }
  uni.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList })//合并完后存储
  return userMessageList
}
/**
 * @function 获取消息列表
 * @param userId 用户的Id
 * @returns {Promise<UserMessageListItem[]>}
 */
export async function getUserMessageList(userId: number): Promise<UserMessageListItem[]> {
	let USER_MESSAGE_LIST = getUserMessageListKey(userId)
    let userMessageList = uni.getStorageSync(USER_MESSAGE_LIST)
	if(!userMessageList){
		userMessageList = []
	}
	return userMessageList
}

/**
 * @function 保存单个互动消息
 * @param new_message 新的互动消息
 * @param userId 用户的Id
 */
export async function saveInteractiveMessageItem(new_message: InteractiveMessage, userId: number) {
  console.log('new_message',new_message)
  let INTERACTIVE_MESSAGE_LIST
  let interactiveList
  if(likeGroup.includes(new_message.data.type)){
	INTERACTIVE_MESSAGE_LIST  = getInteractiveMessageListKey(userId,'LIKE')
	interactiveList  = await getInteractiveMessageList(userId,'LIKE')
	  
  }else if(commentGroup.includes(new_message.data.type)){
	INTERACTIVE_MESSAGE_LIST  = getInteractiveMessageListKey(userId,'COMMENT')
	interactiveList  = await getInteractiveMessageList(userId,'COMMENT')
  }else if(new_message.data.type===InteractiveType.PUBLISH){
	INTERACTIVE_MESSAGE_LIST  = getInteractiveMessageListKey(userId,'PUBLISH')
	interactiveList  = await getInteractiveMessageList(userId,'PUBLISH')
  }else if(new_message.data.type === InteractiveType.ATTENTION){
	INTERACTIVE_MESSAGE_LIST  = getInteractiveMessageListKey(userId,'ATTENTION')
	interactiveList  = await getInteractiveMessageList(userId,'ATTENTION')
  }
  new_message.data.createTime = getTime()
  interactiveList.data.push(new_message.data)
  interactiveList.unreadSum = interactiveList.unreadSum+1
  uni.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data: interactiveList })
}
/**
 * @function 保存新的互动消息列表
 * @param new_message 新的互动消息
 * @param userId 用户的Id
 * @param type
 */
export async function saveInteractiveMessageList(
	messages: InteractiveMessageData[], 
	userId: number,
	type:InteractiveMessageSaveType) {
	if(messages.length<1){
		return
	}
	let INTERACTIVE_MESSAGE_LIKE = getInteractiveMessageListKey(userId,type)
	let interactiveList = await getInteractiveMessageList(userId,type)
	interactiveList.data=messages.concat(interactiveList.data)
	interactiveList.unreadSum = interactiveList.unreadSum+messages.length
	uni.setStorage({ key: INTERACTIVE_MESSAGE_LIKE, data: interactiveList })
}
/**
 * @description 互动消息已读
 * @param userId 用户的Id
 * @param type 互动消息的类型
 */
export async function interactiveMessageALLRead( userId: number,type:InteractiveMessageSaveType) {
  let INTERACTIVE_MESSAGE_LIST = getInteractiveMessageListKey(userId,type)
  let interactiveList = await getInteractiveMessageList(userId,type)
  interactiveList.unreadSum = 0
  uni.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data: interactiveList })
}
/**
 * @description 删除所有互动消息
 * @param {number} userId 用户id
 * @param {string} type 消息的类型
 */
export async function deleteAllInteractiveMessage(userId: number,type:InteractiveMessageSaveType){
	let INTERACTIVE_MESSAGE_LIST = getInteractiveMessageListKey(userId,type)
	uni.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data:null })
}
/**
 * @function 获取互动消息列表
 * @param userId 用户的Id
 * @param {string} type 消息的类型
 * @returns {Promise<InteractiveMessageList>}
 */
export async function getInteractiveMessageList(userId: number,type:InteractiveMessageSaveType): Promise<InteractiveMessageList> {
    let INTERACTIVE_MESSAGE_LIST = getInteractiveMessageListKey(userId,type)
	let interactiveList = uni.getStorageSync(INTERACTIVE_MESSAGE_LIST) as InteractiveMessageList
    if(!interactiveList||!interactiveList.data){
		interactiveList = {
			unreadSum:0,
			data:[]
		}
	}
	return interactiveList
}
/**
 * @function 获取官方消息列表
 * @param userId 用户的Id
 * @returns {Promise<OfficialNewsListItem[]>}
 */
export async function getOfficalList(userId: number): Promise<OfficialNewsListItem[]> {
	let OFFICE_NEWS_LIST = getOfficeNewsListKey(userId)
    let officalList = uni.getStorageSync(OFFICE_NEWS_LIST) as OfficialNewsListItem[]
    if(!officalList){
		officalList=[]
	}
	return officalList
}

/**
 * @function 清空问题消息列表
 * @param userId 用户的Id
 */
export async function deleteQuestionMessageList(userId: number) {
	let QUESTION_MESSAGE_LIST = getQuestionMessageListKey(userId)
	uni.removeStorageSync(QUESTION_MESSAGE_LIST)
    
}

/**
 * @description 删除指定类型的官方消息
 * @param {number} userId 用户的id
 * @param {string} type 指定的类型
 * @return {Promise<OfficialNewsListItem[]>}
 */
export async function deleteOfficalNewsItem(userId:number,type:string):Promise<OfficialNewsListItem[]>{
	let officalList = await getOfficalList(userId)
	let OFFICE_NEWS_LIST = getOfficeNewsListKey(userId)
	for (let i = 0; i < officalList.length; i++) {
	  if (officalList[i].type === type) {
		let OFFICE_TYPE_NEWS = getOfficeTypeNewsListKey(userId,type)
	      uni.setStorage({ key:OFFICE_TYPE_NEWS, data: null })//清除记录
	      officalList.splice(i, 1)
	      break
	  }
	}
	uni.setStorage({ key: OFFICE_NEWS_LIST, data: officalList })//合并完后存储
	return officalList
}

/**
 * @function 获取指定类型官方消息
 * @param type 类型
 * @param userId 用户的Id
 * @returns {OfficialNewsData[]}
 */
export async function getTypeOfficalNews( userId: number,type: string): Promise<OfficialNewsData[]> {
    let OFFICE_TYPE_NEWS = getOfficeTypeNewsListKey(userId,type)
    let officalNews = uni.getStorageSync(OFFICE_TYPE_NEWS) as OfficialNewsData[]
    if(!officalNews){
		officalNews=[]
	}
	return officalNews
  
}

/**
 * @function 删除所有聊天记录和消息列表
 * @param userId 用户的Id
 */                                                                                            
export async function deleteMessageRecord(userId: number) {
	
	let INTERACTIVE_MESSAGE_LIKE=getInteractiveMessageListKey(userId,'LIKE')
	uni.setStorage({ key: INTERACTIVE_MESSAGE_LIKE, data: null })//删除互动消息
	let INTERACTIVE_MESSAGE_COMMENT=getInteractiveMessageListKey(userId,'COMMENT')
	uni.setStorage({ key: INTERACTIVE_MESSAGE_COMMENT, data: null })//删除互动消息
	let USER_MESSAGE_LIST = getUserMessageListKey(userId)
	
	let userMessageList = await getUserMessageList(userId)
	userMessageList.forEach((item) => {
		let CHAT_RECORD = getChatRecordKey(userId,item.userId)
		uni.setStorage({ key: CHAT_RECORD, data: null })//清除聊天记录
	})
	uni.setStorage({ key: USER_MESSAGE_LIST, data: null })//清除消息列表
}

