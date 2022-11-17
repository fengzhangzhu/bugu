<template>
	<view class="page">
		<view class="chat-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">
					聊天历史
				</view>
			</uni-nav-bar>
			<view id="chat-scrollview">
			<!-- 聊天记录列表 -->
				<scroll-view  scroll-y class="chat-scrollview" 
				v-if="historyChats.length>0" 
				@click="onContentClick()"
				:scroll-into-view="scrollInto"
				:style="{
					height:scollerHeight+'px'
				}"
				@scrolltoupper="onScrollToUpper"
				>
					<uni-load-more 
					:status="moreText" 
					:contentText="{contentdown: '下拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多数据了'}"
					></uni-load-more>
					<view v-for="(item,index) in historyChats" :key="item.id" 
					:id="'chat_'+item.id">
						<view v-if="showChatCreatTime(index)" class='chat-creat-time'>
							{{GettimeifferenceOfNow(item.createTime).Detailed}}
						</view>
						<chat-item 
						:avatarUrl="item.my ? myUserInfo.avatar : fromUserInfo.avatar" 
						:chatText="item.content"
						:isMe="item.my"
						:voiceTime="item.time"
						:messageType="item.type"
						@onLongPress="onChatItemLongPress(item)"
						></chat-item>
					</view>
				</scroll-view>
			</view>
		<view class='select-date'
				:style="{
					height:'70px'
				}">
			 <uni-data-picker
			 class="data-picker"
			 placeholder="请选择日期"
			 v-if="datePickerList.length>0"
			 :localdata="datePickerList" 
			 popup-title="请选择日期" 
			 @change="onDatePikcerChange" 
			 @nodeclick="onDatePikcerNodeClick"></uni-data-picker>
		</view>
		<!-- 消息操作弹出层 -->
		<action-sheet ref="chatItemActionPopup" :needHead="true" title="设置消息" :needCancelButton="true">
			<block v-if="selectChatItem.id">
				<action-sheet-item v-if="selectChatItem.type==0" @click="onCopyTextClick" title="复制"></action-sheet-item>
				<action-sheet-item v-if="selectChatItem.type==1" @click="onAddExpressionClick" title="添加到表情"></action-sheet-item>
				<action-sheet-item @click="onDeleteTextClick" title="删除"></action-sheet-item>
			</block>
		</action-sheet>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		GettimeifferenceOfNow,
		GetNumberOfMenit
	} from "@/utils/dateUtils";
	import {
		getMyUserInfo,
	} from "@/common/storageFunctions";
	import {
		getChatRecord,
		getUserMessageList,
	} from "@/utils/messageUtils/storage"
	import {
		getUserinfo
	} from "@/common/requestFunctions";
	import {
		UserInfo,
	} from "@/common/dataClass";
	import {
		REQUEST_SUCCEEDED_CODE,
		ImageFatherPath
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getUserMessageListKey,
		getChatRecordKey,
	} from "@/utils/messageUtils/storageKeys";
	import {
		REFRESH_CHAT_CONTENT
	} from "@/common/globalMsgKeys";
	interface HistoryItem {
	    content: string
	    createTime: string
	    id: number
	    my: boolean
	    type: number,
	    time?: number
	}
	interface ChatHistoryResult {
	    list: HistoryItem[]
	    pageSum: number
	    total: number
	}
	interface HistoryDateItem {
	    month: string,
	    day: string[]
	}
	interface DayItem{
		text:string
		value: string
	}
	interface PickerListItem{
		text:string,
		value:string,
		children:DayItem[]
	}
	export default {
		data() {
			return {
				fromUserInfo: {}, //聊天对象的用户信息
				myUserInfo: {}, //我的用户信息
				historyChats: [] as HistoryItem[],
				scrollInto: '', //页面滑动到指定位置
				page:1,//页号
				haveMoreData:true,//是否有更多数据
				GettimeifferenceOfNow,
				navHeight:0,//顶部导航栏的高度
				contentHeight:0,//整个页面的高度
				selectChatItem:{},//选择的某个聊天消息
				moreText:'more',//加载更多
				datePickerList: [] as PickerListItem[],
				daySelected:'all'//选择的哪一天
				
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#chat-scrollview"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params) {
			let fromUserId = params.fromUserId as number
			let fromUserInfo = await getUserinfo(fromUserId)
			let myUserInfo = await getMyUserInfo() as UserInfo
			this.myUserInfo = myUserInfo
			this.fromUserInfo = fromUserInfo
			this.getAllChatHistory(fromUserId, this.page)
			this.getHistoryDateList(fromUserId)
		},
		computed: {
			fromUsername() {
				if (!this.fromUserInfo.username) {
					return ''
				} else {
					return this.fromUserInfo.username.length > 7 ?
						this.fromUserInfo.username.slice(0, 7) + '...' :
						this.fromUserInfo.username
				}
			},
			scollerHeight(){
				return this.contentHeight - this.navHeight-70
			}
		},
		methods: {
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 滑动到最上部分
			 */
			onScrollToUpper(){
				if (!this.haveMoreData) {
					return
				}
				if (this.fromUserInfo) {
					this.page = this.page + 1
					if(this.daySelected==='all'){
						this.getAllChatHistory(this.fromUserInfo.id, this.page)
					}else{
						this.getHistoryByDate(this.formUserInfo.id,this.daySelected,this.page)
					}
				}
			},
			/**
			 * @description 日期改变时
			 * @param {type} e 
			 */
			onDatePikcerChange(e){
				this.daySelected = e.detail.value[1].value
				this.page =1
				this.getHistoryByDate(this.fromUserInfo.id,this.daySelected,this.page)
	
			},
			/**
			 * @description 点击复制文字消息
			 */
			onCopyTextClick(){
				 uni.setClipboardData({ data: this.selectChatItem.content })
				this.$refs.chatItemActionPopup.close()
			},
			/**
			 * @description 点击添加表情
			 */
			onAddExpressionClick(){
				let fileName = this.selectChatItem.content.replace(ImageFatherPath,'')
				this.addExpression(fileName)
				this.$refs.chatItemActionPopup.close()
			},
			/**
			 * @description 点击删除消息
			 */
			onDeleteTextClick(){
				this.deleteMessage(this.selectChatItem.id)
				this.$refs.chatItemActionPopup.close()
			},
			/**
			 * @description 长按某个消息时
			 * @param {Object} chatItem 某个消息
			 */
			onChatItemLongPress(chatItem){
				this.selectChatItem = chatItem
				this.$refs.chatItemActionPopup.open()
			},
			/**
			 * @description  是否在聊天内容上显示时间
			 * @param {Object} index 第几条
			 */
			showChatCreatTime(index) {
				let historyChats = this.historyChats
				let showtime = false
				if (index == 0) {
					showtime = true
				} else {
					let menit = GetNumberOfMenit(historyChats[index - 1].createTime, historyChats[index].createTime)
					if (menit > 1) {
						showtime = true
					}
				}
				return showtime
			},
			/**
			 * @function 添加表情
			 * @param filename 文件名
			 */
			 async addExpression(filename:string){
				 
				let res = await request({
					data: {
						method: 'POST',
						group: 'message',
						action: 'emoticon/add',
						data: {
							filename: filename,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	
					uni.showToast({
						title:'添加成功',
						icon:'success'
					})
				   uni.$emit(REFRESH_CHAT_CONTENT,{needRefresh:true})
					return true
				} else {
					return false
				}
			},
			/**
			 * @description 删除消息
			 * @param {number} id 消息的id  
			 */
			async deleteMessage(id: number) {
				if (this.historyChats) {
					let historyChats = this.historyChats
					for (let i = historyChats.length - 1; i >= 0; i--) {
						if (historyChats[i].id == id) {
							historyChats.splice(i, 1)
							break
						}
					}
					this.historyChats=historyChats
					let messageGroup = await getChatRecord(this.myUserInfo.id, this.fromUserInfo.id)
					//先清楚本地保存的消息记录
					if(messageGroup){
						let messages = messageGroup.messages
						let deleteIndex= 0
						for (let i = 0; i < messages.length; i++) {
							if (id == messages[i].id) {
								messages.splice(i, 1)
								deleteIndex=i
								break
							}
						}
						messageGroup.messages = messages
						let ChatRecordKey = getChatRecordKey(this.myUserInfo.id, this.fromUserInfo.id)
						uni.setStorage({ key:ChatRecordKey , data: messageGroup })
						//只有删除的是最后一条而且消息记录不为空时才需要更新消息列表
						if(messages.length>0&&deleteIndex==messages.length){
							let userMessageList = await getUserMessageList(this.myUserInfo.id)
							for (let i = 0; i < userMessageList.length; i++) {
								if (userMessageList[i].userId == this.fromUserInfo.id) {
									let userMessageListItem = userMessageList[i]
									userMessageListItem.lastMessage = messages[messages.length-1].content
									userMessageListItem.lastMessageType = messages[messages.length-1].type
									userMessageListItem.lastTime = messages[messages.length-1].createTime
									userMessageListItem.unreadSum = 0
									userMessageList.splice(i, 1)
									userMessageList.push(userMessageListItem)
									break
								}
							}
							let UserMessageListKey = getUserMessageListKey(this.myUserInfo.id)
							uni.setStorage({ key:UserMessageListKey , data: userMessageList })
						}
					}
					
					
					
					let res = await request({
						data: {
							// type:'websocket/bgxq',
							method: 'POST',
							group: 'message',
							action: `${id}/delete`,
							data: {
								id: id
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded' // 默认值
							},
						}
					});
					uni.$emit(REFRESH_CHAT_CONTENT,{needRefresh:true})
				}
			},
			/**
			 * @description 获取所有的聊天记录
			 * @param {number} userId 聊天对象的id
			 * @param {number} page 页号    
			 */
			async getAllChatHistory(userId: number, page: number) {
				this.moreText = "loading"
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: `history`,
						data: {
							page: page,
							userId: userId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code == REQUEST_SUCCEEDED_CODE) {
					let result = res.data.data as ChatHistoryResult
					let chat_historys = res.data.data.list as HistoryItem[]
					if(result.pageSum<=page){
						this.haveMoreData=false
						this.moreText = "noMore"
					}else{
						this.haveMoreData=true
						this.moreText = "more"
						
					}
					let historyChats: HistoryItem[] = []
					if (page > 1) {
						historyChats = this.historyChats
					}
					historyChats = historyChats.reverse().concat(chat_historys)
					this.scrollInto= `chat_${chat_historys[0].id}`
					this.historyChats =	historyChats.reverse()
				}
			},
			/**
			 * @description 按日期获取聊天记录
			 * @param {number} userId 聊天对象的id
			 * @param {string} date 日期 格式为 yyyy-MM-dd
			 * @param {number} page 页号
			 */
			async getHistoryByDate(userId: number, date: string, page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: `history/byDate`,
						data: {
							userId: userId,
							date: date,
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code == REQUEST_SUCCEEDED_CODE) {
					let result = res.data.data as ChatHistoryResult
					let chat_historys = res.data.data.list as HistoryItem[]
					if(result.pageSum<=page){
						this.haveMoreData=false
						this.moreText = "noMore"
					}else{
						this.haveMoreData=true
						this.moreText = "more"
					}
					
					let historyChats: HistoryItem[] = []
					if (page > 1) {
						historyChats = this.historyChats
					}
					historyChats = historyChats.reverse().concat(chat_historys)
					this.scrollInto= `chat_${chat_historys[0].id}`
					this.historyChats =	historyChats.reverse()
				}
			},
			/**
			 * @description 有聊天记录的日期列表
			 * @param {number} userId 聊天对象id
			 */
			async getHistoryDateList(userId: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: `history/dateList`,
						data: {
							userId: userId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code == REQUEST_SUCCEEDED_CODE) {
					let dateList = res.data.data as HistoryDateItem[]
					let datePickerList = [] as PickerListItem[]
					dateList.forEach((item)=>{
						
						let monthData = {
							text:item.month,
							value:item.month,
							children: []  as DayItem[]
							}
						item.day.forEach((item)=>{
							let dayItem = {text:item ,value: item}
							monthData.children.push(dayItem)
						})
						datePickerList.push(
							 monthData
						)
					})
					this.datePickerList = datePickerList
				}
			}
		}
	}
</script>

<style lang="scss">

	.chat-content {
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.chat-scrollview {
		transition: all 200ms;
		overflow-anchor: auto;
	}

	.chat-creat-time {
		text-align: center;
		width: 96%;
		padding: 2%;
		font-size: small;
		color: #d1d1d1;
	}

	.chat-username-content {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;

		.chat-username {
			font-weight: lighter;
		}

		.online-state-text {
			margin-left: 5rpx;
			font-weight: lighter;
			font-size: small;
		}
	}

	.chat-bottom-content {
		background-color: #d0ebe7;

	}
	
	.select-date{
		border-top: 1px solid #F0F0F0;
		background-color: #FFFFFF;
		padding: 0 25vw;
		.data-picker{
			width:50%;
		}
	}


</style>
