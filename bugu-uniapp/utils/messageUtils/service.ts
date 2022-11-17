import { 
QuestionMessageList,

 UserInfo } from "@/common/dataClass";
import {
	OfficialNewsListItem,
	UserMessageListItem,
	ChatUserInfo,
	InteractiveMessageList,
	InteractiveMessageData,
} from "./model"
import { request } from "@/utils/request";
import { REQUEST_SUCCEEDED_CODE } from "@/common/constants";
/**
 * @description 获取未读的消息列表
 * @returns {Promise<UserMessageListItem[]>}
 */
export async function getUnReadUser():Promise<UserMessageListItem[]> {
	let messageList: UserMessageListItem[] = []
	try {
	  let res = await request({
		data: {
		  method: 'GET',
		  group: 'message',
		  action: 'unRead/user',
		  data: {

		  },
		  header: {
			'content-type': 'application/x-www-form-urlencoded' // 默认值
		  },
		}
	  });

	  if (res.data.code === REQUEST_SUCCEEDED_CODE) {
		messageList = res.data.data as UserMessageListItem[]

	  } else {
		console.log(`getUnReadUser_error:${res.data}`)

	  }
	} catch {

	}
	return messageList
}


/**
 * @function 获取未读的互动信息
 * @returns {Promise<InteractiveMessageData[]>}
 */
export async function getUnReadInteractiveMessage():Promise<InteractiveMessageData[]> {
	let res = await request({
	  data: {
		method: 'GET',
		group: 'message',
		action: 'interactive/unread',
		data: {

		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded' // 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  let unreads = res.data.data as InteractiveMessageData[]
	  return unreads
	} else {
	  return []
	}
  }
  
/**
 * @description 获取未读的官方消息
 * @returns {Promise<OfficialNewsListItem[]>}
 */
export async function getUnReadOfficialNews(): Promise<OfficialNewsListItem[]> {
    let res = await request({
      data: {
        method: 'GET',
        group: 'message',
        action: 'official/unread/list',
        data: {
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
      }
    });
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
      let officialNewsList = res.data.data
      return officialNewsList
    } else {
      return []
    }
}