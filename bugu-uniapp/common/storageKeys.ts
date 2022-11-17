//搜索用户历史
export const SEARCH_USER_HISTORY='search_user_history'
//搜索动态历史
export const SEARCH_ACTIVITY_HISTORY='search_history'
//搜索问题历史
export const SEARCH_QUESTION_HISTORY='search_question_history'
//用户信息
export const USER_INFO='userInfo'
//用户token
export const TOKEN = 'token'
//刷新音效
export const REFRESH_DYNAMIC_SOUND ='refresh_dynamic_sound'
export const NEW_MESSAGE_SOUND = 'new_message_sound'
//邀请码
export const BE_INVITE_CODE = "BeInvitedCode"


/**
 * @description 粉丝数量变化
 * @param {number} userId 用户id
 */
export function getFansNumberChangedKey(userId:number){
	return `${userId}_fansNumberChanged`
}
/**
 * @description 关注数量变化
 * @param {number} userId 用户id
 */
export function getFollowedNumberChangedKey(userId:number){
	return `${userId}_followedNumberChanged`
}
/**
 * @description 访客数量变化
 * @param {number} userId 用户id
 */
export function getViewsNumberChangedKey(userId:number){
	return `${userId}_viewsNumberChanged`
}

