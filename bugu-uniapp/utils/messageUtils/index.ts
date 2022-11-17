import {
	getUnReadUser,
	getUnReadInteractiveMessage,
	getUnReadOfficialNews
} from "./service";
import {
	likeGroup,
	commentGroup,
	getUserMessageList,
	getInteractiveMessageList,
	saveInteractiveMessageList,
	getOfficalList
} from "./storage";
import{
	getUserMessageListKey,
	getInteractiveMessageListKey,
	getOfficeNewsListKey
} from './storageKeys';
import {UserMessageGroup,
		WithDrawMessage,
		NewUserMessage,
		UserMessageListItem,
		InteractiveMessageList,
		InteractiveMessage,
		OfficialNewsData,
		OfficialNewsListItem, 
		AlreadyReadMessage
		} from "./model";
import {
	updateUserInfo
} from '@/common/requestFunctions';
import {
	InteractiveMessageData
} from './model';
import{
	InteractiveType
} from '@/common/constants';
/**
 * @function 获取并处理消息列表
 * @param userId 用户的id
 * @returns {Promise<UserMessageListItem[]>}
 */
export async function getAndHandleUserMessageList(userId: number): Promise<UserMessageListItem[]> {
  //未读消息列表
  let unReadList = await getUnReadUser()
  console.log("unReadList",unReadList)
  //聊天用户id列表,用于获取最新信息
  let chatUsersId: number[] = []
  //聊天用户列表
  let userMessageList: UserMessageListItem[] = []
  //获取缓存的聊天信息
  let beforeUsermessageList = await getUserMessageList(userId)
  beforeUsermessageList.forEach((item) => {
	let hava_data = false
	//先判断是否有未读消息，如果有了就不加入
	for (let i = 0; i < unReadList.length; i++) {
	  if (unReadList[i].userId == item.userId) {
		hava_data = true 
		break
	  }
	}
	if (!hava_data) {
	  chatUsersId.push(item.userId)
	  userMessageList.push(item)
	}
  })
  //获取最新的用户信息(头像和用户名)，循环遍历并加入
  let userInfos = await updateUserInfo(chatUsersId)
  for (let i = 0; i < userInfos.length; i++) {
	//一般来说是按照顺序一一对应的，如果不是则循环遍历一下
	if (userInfos[i].id == userMessageList[i].userId) {
	  userMessageList[i].avatar = userInfos[i].avatar
	  userMessageList[i].username = userInfos[i].username
	  userMessageList[i].online = userInfos[i].online
	} else {
	  for (let j = 0; j < userMessageList.length; j++) {
		if (userInfos[i].id == userMessageList[j].userId) {
		  userMessageList[j].avatar = userInfos[i].avatar
		  userMessageList[j].username = userInfos[i].username
		  userMessageList[j].online = userInfos[i].online
		  break
		}
	  }
	}
  }
  userMessageList = userMessageList.concat(unReadList)//将两个列表合在一起
  console.log("userMessageList",userMessageList)
  let storageKey = getUserMessageListKey(userId)
  uni.setStorage({ key: storageKey, data: userMessageList })//合并完后存储
  return userMessageList
}


/**
 * @function 获取并处理互动消息
 * @param userId 用户的Id
 * @returns {Promise<number>}
 */
export async function getAndHandleInteractiveMessageList(userId: number): Promise<number> {
  let unreadSum = 0
  let unreads = await getUnReadInteractiveMessage()
  console.log("unreads",unreads)
  // 保存之前的未读消息总数
  
  let likeMessages: InteractiveMessageData[] = []
  let commentMessages: InteractiveMessageData[] = []
  let attentionMessages: InteractiveMessageData[] = []
  let publishMessages: InteractiveMessageData[] = []
  for(let item of unreads){
	  if(likeGroup.includes(item.type)){
		  likeMessages.push(item)
	  }else if(commentGroup.includes(item.type)){
		  commentMessages.push(item)
	  }else if(item.type === InteractiveType.ATTENTION){
		  attentionMessages.push(item)
	  }else if(item.type === InteractiveType.PUBLISH){
		  publishMessages.push(item)
	  }
  }
  saveInteractiveMessageList(likeMessages,userId,'LIKE');
  saveInteractiveMessageList(commentMessages,userId,'COMMENT');
  saveInteractiveMessageList(attentionMessages,userId,'ATTENTION');
  saveInteractiveMessageList(publishMessages,userId,'PUBLISH');
  unreadSum = likeMessages.length+commentMessages.length+attentionMessages.length+publishMessages.length
  return unreadSum
}


/**
 * @function 获取并处理官方消息
 * @param userId 用户的Id
 * @returns {Promise<OfficialNewsListItem[]>}
 */
export async function getAndHandOfficialNewsList(userId: number): Promise<OfficialNewsListItem[]> {
  //未读消息列表
  let unReadNewsList = await getUnReadOfficialNews()
  let beforeOfficialNewsList = await getOfficalList(userId)
  let officialNewsList: OfficialNewsListItem[] = []
  beforeOfficialNewsList.forEach((item, index) => {
    let hava_data = false
    //先判断是否有未读消息，如果有了就不加入
    for (let i = 0; i < unReadNewsList.length; i++) {
      if (unReadNewsList[i].type == item.type) {
        hava_data = true
        break
      }
    }
    if (!hava_data) {
      officialNewsList.push(item)
    }
  })
  let OFFICE_NEWS_LIST = getOfficeNewsListKey(userId)
  officialNewsList = officialNewsList.concat(unReadNewsList)
  await uni.setStorage({
    key: OFFICE_NEWS_LIST,
    data: officialNewsList
  })
  return officialNewsList
}