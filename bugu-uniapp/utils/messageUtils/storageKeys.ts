import {
	InteractiveMessageSaveType
}from './model';
/**
 * @description 聊天消息列表
 * @param {number} userId 用户id
 */
export function getUserMessageListKey(userId:number){
	return `user_message_list_${userId}`
}
/**
 * @description 与某个用户的聊天记录
 * @param {number} userId 用户id
 * @param {number} toUserId 聊天对象的id
 */
export function getChatRecordKey(userId:number,toUserId:number){
	return `chat_record_${userId}_${toUserId}`
}
/**
 * @description 互动消息列表
 * @param {number} userId 用户id
 * @param {string} type 互动的类型
 */
export function getInteractiveMessageListKey(userId:number,type:InteractiveMessageSaveType){
	return `interactive_message_list_${userId}_${type}`
}
/**
 * @description 官方消息列表
 * @param {number} userId 用户id
 */
export function getOfficeNewsListKey(userId:number){
	return `offical_news_list_${userId}`
}
/**
 * @description 指定类型的官方消息
 * @param {number} userId 用户id
 * @param {string} type 消息的类型
 */
export function getOfficeTypeNewsListKey(userId:number,type:string){
	return `offical_type_news_${userId}_${type}`
}
/**
 * @description 问题的互动消息
 * @param {number} userId 用户id
 */
/**
 * @description 官方消息列表
 * @param {number} userId 用户id
 */
export function getQuestionMessageListKey(userId:number){
	return `question_message_list_${userId}`
}
