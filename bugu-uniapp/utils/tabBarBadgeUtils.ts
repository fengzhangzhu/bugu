import {setGlobalData,getGlobalData,InteractiveType} from "@/common/constants";
import {ALL_UNREAD_MESSAGE_SUM} from "@/common/globalMsgKeys";
import {
	getAndHandOfficialNewsList,
	getAndHandleUserMessageList,
	getAndHandleInteractiveMessageList,
} from "./messageUtils";


/**
 * @description 初始化未读消息
 * @param {number} userId 用户的id
 * 
 */
export async function initUnreadMessageSum(userId:number){
	let unreadSum = 0
	let messageList = await getAndHandleUserMessageList(userId)
	let officialNewsList = await getAndHandOfficialNewsList(userId)
	let messageSum = 0
	messageList.forEach((item) => {
		if (item.unReadSum > 0) {
		  messageSum = messageSum + item.unReadSum
		}
	})
	let officialSum = 0
	officialNewsList.forEach((item) => {
		if (item.unreadSum > 0) {
		  officialSum = officialSum + item.unreadSum
		}
	})
	
	let interactiveSum = await getAndHandleInteractiveMessageList(userId)
	unreadSum = messageSum+officialSum + interactiveSum
	console.log("messageSum",messageSum)
	console.log("officialSum",officialSum)
	console.log("interactiveSum",interactiveSum)
	setGlobalData(ALL_UNREAD_MESSAGE_SUM, unreadSum)
	if (unreadSum > 0) {
		uni.setTabBarBadge({
		  index: 2,
		  text: String(unreadSum)
		})
	} else {
		uni.removeTabBarBadge({
		  index: 2
		})
	}
}
/**
 * @function 设置未读消息的数量并在底部的按钮上显示 
 * @param changeNumber 变化的数量正数为加负数为减 不填时为更新
 */
export function changeUnreadMessageSum(changeNumber: number=0) {
    let unreadSum = 0
    try {
        unreadSum = getGlobalData(ALL_UNREAD_MESSAGE_SUM)
        unreadSum = unreadSum + changeNumber
    } catch {
        if (changeNumber > 0) {
            unreadSum = unreadSum + changeNumber
        }
    }
    setGlobalData(ALL_UNREAD_MESSAGE_SUM, unreadSum)
    if (unreadSum > 0) {
        uni.setTabBarBadge({
            index: 2,
            text: String(unreadSum)
        })
    } else {
        uni.removeTabBarBadge({
            index: 2
        })
    }

}
