
import store from '@/store/index';
import {USER_MESSAGE,WITHDRAW,ALREADY_READ,INTERACTIVE,SoketUrl,RingingToneList } from "@/common/constants";
import {TOKEN,NEW_MESSAGE_SOUND,
} from "@/common/storageKeys";
import {changeUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
import {
	SocketResult,NewUserMessage,
	WithDrawMessage,
	AlreadyReadMessage,InteractiveMessage
	} from "./messageUtils/model";
import{
	UserInfo,
} from '@/common/dataClass'
import {
	saveUserMessageList,
	saveChatRecord,saveWithDrawChatRecord,
	saveUserMessageListWhenWithDraw,
	saveAlreadyRead,saveInteractiveMessageItem
} from "./messageUtils/storage";
import {
	getMyUserInfo,
} from '@/common/storageFunctions'

/**
 * @description 进行socket连接
 */
export async function connectSocket() {
  let token = uni.getStorageSync(TOKEN)
  let userInfo = await getMyUserInfo() as UserInfo
  console.log(`${token}`)
  if (token) {
    //建立socket连接，保持在线状态
   let task = uni.connectSocket({
      url: `${SoketUrl}${token}`,
      success: function () {
        console.log('connect success')
      }
    })
	task.onOpen(function () {
	      store.commit('socketStateStore/onSocketConnected',true)
		  // console.log(store.state.socketStateStore.isConnectSocket)
		  setInterval(() => {
		            console.log('onOpen')
		            task.send({ data: '我已经上线' })
		          }, 30000);
	    })
	task.onMessage(async function (msg) {
	  console.log('onMessage: ', msg)
	  let msgData = msg.data as string
	  let socketResult = JSON.parse(msgData) as SocketResult
	  console.log('socketResult.type',socketResult.type)
      if (socketResult.type === USER_MESSAGE) {//类型是消息，包括撤回和普通消息
	  
			let new_message_sound = uni.getStorageSync(NEW_MESSAGE_SOUND)
			if(!new_message_sound){
				new_message_sound = RingingToneList[0]
			}
			const innerAudioContext = uni.createInnerAudioContext()
			innerAudioContext.autoplay = true
			innerAudioContext.src = new_message_sound.url
			let new_message = JSON.parse(msgData) as NewUserMessage
			await saveUserMessageList(new_message,userInfo.id)//保存消息列表
			await saveChatRecord(new_message,userInfo.id)//保存聊天记录
			changeUnreadMessageSum(1)
			onNewMessage(msg.data)
		}else if( socketResult.type === WITHDRAW){
			let new_message = JSON.parse(msgData) as WithDrawMessage
			await saveWithDrawChatRecord(new_message,userInfo.id)//保存聊天记录
			await saveUserMessageListWhenWithDraw(new_message,userInfo.id)
			onNewMessage(msg.data)
		}else if (socketResult.type === ALREADY_READ) {//收到的是已读提醒
			let new_message = JSON.parse(msgData) as AlreadyReadMessage
			await saveAlreadyRead(new_message,userInfo.id)
			onNewMessage(msg.data)
		} else if (socketResult.type === INTERACTIVE) {//收到的是互动消息类型
			changeUnreadMessageSum(1)
			let new_message = JSON.parse(msgData) as InteractiveMessage
			await saveInteractiveMessageItem(new_message,userInfo.id)
			onNewMessage(msg.data)
		}
	})
	task.onError(function () {
	  console.log('onError')
	  uni.closeSocket({
			
		})
	})
	task.onClose(()=>{
	  store.commit('socketStateStore/onSocketConnected',false)
	})
  }
}
function onNewMessage(e) {
   e = JSON.parse(e) as NewUserMessage
   store.commit('messageStore/onNewMessage',e)
   let state = store.state as any
   console.log(state.messageStore.newMessage)
}