export type InteractiveMessageSaveType = 'LIKE'|'COMMENT'|'ATTENTION'|'PUBLISH'
//socket消息
export interface SocketResult {
    type: string,
    data: string
}
//新用户消息格式(服务器)
export interface NewUserMessage {
    type: string,
    data: {
        content: string,
        type: number,
        fromUserId: number,
        id: number,
        time?: number//消息时长只有语音消息需要
    }
}
export interface WithDrawMessage{
	type: string,
	data: {
	    userId: number,
	    messageId: number,
	}
}
//聊天对象的用户消息
export interface ChatUserInfo {
    attentionSum: number,
    avatar: string,
    beAttentionSum: number,
    id: number,
    online: boolean,
    registerDay: number,
    username: string,
    isVerify: number,
    sex?: number
    vip?: {
        deadline: string,
        remainDays: number,
    },
    visitorSum: number,
}
//新消息格式(服务器)
export interface AlreadyReadMessage {
    type: string,
    data: {
        userId: number
    }
}
//消息格式
export interface MessageInfo {
    img: string,
    title: string,
    time: string,
    text: string
}
//消息保存(本地保存)消息内容
export interface MessageItem  {
    content: string,
    type: number,
    id: number,
    isMe?: boolean,
    createTime: string,
    isNotRead?: boolean,//是否为未读
    time?: number//消息的时长只有语音消息有
}
//单个消息组(本地保存)
export interface UserMessageGroup {
    fromUserId: number,
    badgeNumber: number,
    type: string,
    messages: MessageItem []
}
//聊天对象列表（单个）
export interface UserMessageListItem {
    avatar: string
    lastMessage: string
    lastMessageType: number
    lastTime: string
    online: boolean
    unReadSum: number
    userId: number
    username: string
}
//互动消息
export interface InteractiveMessageData {
    contentId: number,
    userId: number,
    username: string,
    avatar: string,
    type: string,
	group: string,
    createTime: string
}
//互动消息列表
export interface InteractiveMessageList{
    unreadSum:number,
    data:InteractiveMessageData[]
}
export interface InteractiveMessage {
    type: string,
    data: InteractiveMessageData
}
//官方消息列表（项）
export interface OfficialNewsListItem {
    lastText: string
    lastTime: string
    type: string
    unreadSum: number
}
//官方消息
export interface OfficialNewsData {
    createTime: string
    pic: string
    text: string
}