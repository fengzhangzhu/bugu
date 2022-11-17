export interface RequestResult{
	code:string
	data:any
	errorMsg:string
	userMsg:string
}


//发布者
export interface Publisher {
    avatar: string
    id: number
    username: string
    isAttention: number
    sex?: number
    isVerify: number
    isVip:number
	beAttentionSum?:number
}
//单个标签
export interface LabelItem {
    id: number,
    content: string,
    hot:number
}
//单个动态
export interface ArticleItem {
    isAnonymity: number
    commentSum: number
    createTime: string
    id: number
    isLiked: number
    likeSum: number
    pic: string[]
    publisher?: Publisher
    text: string
    updateTime: string
    viewSum: number
    labels: LabelItem[]
    video:number

}
//获取我发布的-单个动态
export interface MyArticleItem {
    isAnonymity: number
    commentSum: number
    id: number
    likeSum: number
    pic: string[]
    text: string
    publishTime: string
    viewSum: number
    isLiked: number
    labels: LabelItem[]
    visibility: number
    video:number
}
//获取我发布的动态结果
export interface MyArticleResult {
    list: MyArticleItem[]
    pageSum: number
    total: number
}
//根据id获取用户信息
export interface UserInfo {
    attentionSum: number
    visitorSum: number
    beAttentionSum: number
    avatar: string
    id: number
    registerDay: number
    username: string
    isAttention: number
    background: string
    isVerify: number
    sex?: number
    vip?: {
        deadline: string,
        remainDays: number,
    },
}

//评论数据
export interface CommentDataItem {
	father:{
		content: string,
		createTime: string,
		id: number,
		isDeleted: number,
		likeSum: number,
		isLiked: number,
		publisher: {
		    id: number,
		    username: string,
		    avatar: string
		},
		responseSum: number,
		type: number,
	},
	sons:ReplyCommentDataItem[]
   
}
//评论的回复数据
export interface ReplyCommentDataItem {
    content: string
    fromUserId: number
    fromUsername: string
    id: number
    isDeleted: number
    toUserId: number
    toUsername: string
    type: number
    fromUserAvatar: string
}

//时间差
export interface timeDifference {
    DistanceNow: string,
    Detailed: string,
    MinuteDifference: number,
    HourDifference: number,
}
//单个铃声
export interface RingingToneItem {
    value: number,
    label: string,
    url: string
}
//单个盲盒
export interface BoxInfo {
	time: string,
	id: number,
	sex: number,
	text: string,
	userId: number,
	isCollected: number
	isDeleted: number
}
//page-tabs的单个标签
export interface TabLabelItem{
	title:string,
	badge?:number
}
//分页返回时的分页信息
export interface PageInfo<T>{
	currentPageNum: number
	hasNext: boolean
	hasPrevious: boolean
	totalNum: number
	totalPages: number
	list:T[]
}
//单个问题数据
export interface QuestionDataItem{
	id:number
	title:string
	text:string
	video:string[]
	isAnonymity:number			
	isCollected:number		
	isLiked	:number	
	labels:LabelItem[]
	likeSum:number
	answerSum:number
	collectSum:number
	viewSum:number
	pics:string[]
	publishTime:string
	publisher?:{		
		avatar:string
		id:number
		username:string
	}
	hotAnswer?:AnswerDataItem
}
//单个回答
export interface AnswerDataItem {
	id:number
	questionId:number
	text:string	
	pic:string[]
	agreeSum:number
	opposeSum:number
	commentSum:number
	viewSum:number
	isAgreed:number
	isAnonymity:number
	isOpposed:number
	isVideo:number
	isMe?:number
	publishTime:string
	publisher:Publisher
}
/**
 * 问题模块的通知消息
 */
export interface QuestionMessageItem{
	createTime: string
	eventId: number
	fromUserAvatar: string
	fromUserId:  number
	fromUserName: string
	issueId: number
	toUserId: number
	type: string
}
/**
 * 问题模块的通知消息列表
 */
export interface QuestionMessageList{
	unreadSum:number,
	data:QuestionDataItem[]
}
export interface MyAnswerDataItem extends AnswerDataItem{
	question:QuestionDataItem
}