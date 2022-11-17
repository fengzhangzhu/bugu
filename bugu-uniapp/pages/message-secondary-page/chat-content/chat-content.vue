<template>
	<view class="page">
		<view class="chat-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">
					<view class='chat-username-content'>
						<text class='chat-username'>{{fromUsername}}</text>
						<view class='online-state' :style="{
								backgroundColor: onLineState ? '#2ee98e' : '#979797',
								width: '10px',
								height: '10px',
								borderRadius: '5px',
								marginLeft: '5px'
							}" />
						<text class='online-state-text'>{{onLineState ? '在线' : '离线'}}</text>
					</view>
				</view>
				</uni-nav-bar>
			<view id="chat-scrollview">
			<!-- 聊天记录列表 -->
				<scroll-view  scroll-y class="chat-scrollview" 
				v-if="messageGroup.messages" 
				@click="onContentClick()"
				:scroll-into-view="scrollInto"
				:style="{
					height:scollerHeight>0?scollerHeight+'px':'80vh'
				}"
				>
				<view v-for="(item,index) in messageGroup.messages" :key="item.id" 
				:id="'chat_'+item.id">
					<view v-if="showChatCreatTime(index)" class='chat-creat-time'>
						{{GettimeifferenceOfNow(item.createTime).Detailed}}
					</view>
					<chat-item 
					:avatarUrl="item.isMe ? myUserInfo.avatar : fromUserInfo.avatar" 
					:chatText="item.content"
					:isMe="item.isMe"
					:voiceTime="item.time"
					 :isNotRead="item.isMe&&item.isNotRead"
					:messageType="item.type"
					@onLongPress="onChatItemLongPress(item)"
					></chat-item>
				</view>
				<!-- 辅助视图，确保每次打开键盘的时候滑到最底部，暂时只想到这个办法，如果有更好的办法请修改 -->
				<view v-if="keyboardHeight != 0||showEmojiPicker" id='show_keyboard'></view>
				<!-- 录制语音时的弹出框 -->
				<uni-popup ref="recordingPopup">
					<view class="recording-popup-content">
						<view class="popup-image">
							<image style="width: 100rpx;height: 100rpx;"
							mode="aspectFill"
							:src="cancelSendVoice ? '/static/svgs/chat-cancel.svg' : '/static/svgs/chat-recording.svg'"
							>
							</image>
						</view>
						<view class="popup-text">
							{{cancelSendVoice ? '松手取消发送' : `正在录音 ${voiceTime}S 上划取消`}}
						</view>
					</view>
				</uni-popup>
			</scroll-view>
			</view>
			<view class='chat-bottom-content' :style="{
					position: 'absolute',
					width: '100%',
					bottom: '0px',
					
				}">
				<!-- 输入框界面 -->
				<view class='chat-input-content'
				:style="{
					minHeight:'80px',
					height:'fit-content',
					marginTop:'10px'
				}">
					<view class='text-send-conent'>
						<!--  语音输入 -->
						<view 
						v-if="sendVoice" 
						class='voice-input' 
						:style="{
									backgroundColor: isRecording ? '#dddddd' : '#FFF'
								}"
						@touchstart="onVoiceButtonTouchStart"
						@touchend="onVoiceButtonTouchEnd"
						@touchmove="onVoiceButtonTouchMove"
						>
							<text>按住 说话</text>
						</view>
						<!-- 文字输入 -->
						<!-- <textarea 
							 
							
							
							:hold-keyboard="true"
							@input="onInput"
							@focus="onInputFocus"
						>
						</textarea> -->
						<input
						v-if="isIOS"
						v-show="!sendVoice&&inputFocus"
						class='chat-input'
						:auto-height="true"
						:maxlength="255"
						:adjust-position="false"
						:show-confirm-bar="false"
						v-model="sendText"
						:focus="inputFocus"
						:hold-keyboard="true"
						@focus="onInputFocus"
						/>
						<textarea
						v-else
						v-show="!sendVoice&&inputFocus"
						class='chat-input'
						:auto-height="true"
						:maxlength="255"
						:adjust-position="false"
						:show-confirm-bar="false"
						v-model="sendText"
						:focus="inputFocus"
						:hold-keyboard="true"
						@focus="onInputFocus"
						/>
						<!-- 曲线救国解决键盘无法收起的问题，发现更好的方法请修改 -->
						<view v-show="!sendVoice&&!inputFocus"
						class='fake-chat-input'
						@click="onInputFocus"
						>
							<text>
								{{sendText}}
							</text>
						</view>
						<!-- 发送按钮 -->
						<view class='send-button-content'
						@click="sendButtonClick()"
						>
							<view class='send-button'>发送</view>
						</view>
					</view>
					<view class='other-send-option'>

						<!--  切换-语言-文字输入  -->
						<view class='option-image-content'
						
						>
							<image @click="onChangeSendTypeClick" v-if="sendVoice" :style="{
										width: '24px',
										height: '24px'
									}" mode='aspectFit' src='/static/svgs/chat-keyboard.svg'></image>
							<image @click="onChangeSendTypeClick" v-else class='send-option-image' mode='aspectFill'
								src='/static/svgs/chat-speech.svg'></image>
						</view>
						<!--  图片选择  -->
						<view class='option-image-content'>
							<image @click="onImageChooseClick" class='send-option-image' mode='aspectFill' src='/static/svgs/chat-photo.svg' />
						</view>
						<!--  照相  -->
						<view class='option-image-content'>
							<image @click="onCameraIconClick" class='send-option-image' mode='aspectFill' src='/static/svgs/chat-camera.svg' />
						</view>
						<!--  表情  -->
						<view class='option-image-content'>
							<image @click="onSmileIconClick" class='send-option-image' mode='aspectFill' src='/static/svgs/smile.svg' />
						</view>
						<!--  聊天记录  -->
						<view class='option-image-content'>
							<image @click="onHistoryIconClick" class='send-option-image' mode='aspectFill' src='/static/svgs/clocks.svg' />
						</view>
					</view>
				</view>
				<!--  表情选择界面  -->
				<view class='emoji-choose-content' :style="{height:showEmojiPicker?emojiContentHeight + 'px': keyboardHeight + 'px'}">
					<view v-show="showEmojiPicker">
						<!-- 切换表情  -->
						<view class='expression-taps' :style="{height: '45px'}">
							<view @click="onExpressionTabClick(0)" class='tap-content' :style="{ backgroundColor:expressionTabPage == 0? '#fff':''}">
								<view class='iconfont icon-smile' :style="{fontSize: '30px',color: '#5e5e5e'}" />
							</view>
							<view @click="onExpressionTabClick(1)" class='tap-content' :style="{ backgroundColor:expressionTabPage == 1? '#fff':''}">
								<view class='iconfont icon-heart' :style="{fontSize: '30px',color: '#5e5e5e'}" />
							</view>
						</view>
						<swiper 
						:current="expressionTabPage" 
						:style="{
						height: emojiContentHeight-45 + 'px',
						backgroundColor: '#fff'}"
						@change="onSwiperChange"
						>
							<!--  默认 -->
							<swiper-item  >
								<emoji :contentHeight="emojiContentHeight-45"
								 @setEmoj="onEmojiItemClick"
								 />
							</swiper-item>
							<!--  自定义表情  -->
							<swiper-item  >
								<custom-expression
								:contentHeight="emojiContentHeight-45"
								ref="customExpression"
								@onItemClick="onCustomExpressionClick"
								/>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			
		<!-- 消息操作弹出层 -->
		<action-sheet ref="chatItemActionPopup" :needHead="true" title="设置消息" :needCancelButton="true">
			<block v-if="selectChatItem.id">
				<action-sheet-item v-if="selectChatItem.type==0" @click="onCopyTextClick" title="复制"></action-sheet-item>
				<action-sheet-item v-if="selectChatItem.type==1" @click="onAddExpressionClick" title="添加到表情"></action-sheet-item>
				<action-sheet-item @click="onDeleteTextClick" title="删除"></action-sheet-item>
				<action-sheet-item v-if="selectChatItem.isMe" @click="onWithdrawTextClick" title="撤回"></action-sheet-item>
			</block>
		</action-sheet>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		GettimeifferenceOfNow,
		GetNumberOfMenit,
		getTime
	} from "@/utils/dateUtils";
	import {
		getMyUserInfo,
	} from "@/common/storageFunctions";
	import {
		getChatRecord,
		getUserMessageList,
	} from "@/utils/messageUtils/storage"
	import {
		GetonlineState,
		getUserinfo
	} from "@/common/requestFunctions";
	import {
		UserInfo,
	} from "@/common/dataClass";
	import {
		MessageItem
	} from '@/utils/messageUtils/model'
	import {
		REQUEST_SUCCEEDED_CODE,
		USER_MESSAGE,
		WITHDRAW,
		ALREADY_READ,
		UploadUrl,
		ImageFatherPath
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getUserMessageListKey,
		getChatRecordKey,
	} from "@/utils/messageUtils/storageKeys";
	import store from '@/store/index';
	import aes from "@/utils/aes/export";
	import {
		REFRESH_CHAT_CONTENT
	} from "@/common/globalMsgKeys";
	import {changeUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
	interface IsBeenReadItem {
		messageId: number,
			unread: boolean
	}
	interface UnReadMessageItem {
		id: number,
			content: string,
			type: number,
			createTime: string
	}
	interface sendMessageResult {
	    messageId: number
	    url: string
	}
	interface FileVoucher {
	    fileName: string,
	    token: string
	}

	export default {
		data() {
			return {
				sendText: '',//发送的文本内容
				inputFocus:false,
				onLineState: false, //在线状态
				fromUserInfo: {}, //聊天对象的用户信息
				myUserInfo: {}, //我的用户信息
				messageGroup: {},
				keyboardHeight: 0, //键盘的高度
				emojiContentHeight:300,//表情选择容器的高度
				showEmojiPicker: false, //显示emoji选择器
				expressionTabPage: 0, //表情的页号
				isRecording: false, //正在录音
				sendVoice: false, //发送语言
				scrollInto: '', //页面滑动到指定位置
				state: store.state as any, //全局状态
				GettimeifferenceOfNow,
				navHeight:0,//顶部导航栏的高度
				contentHeight:0,//整个页面的高度
				recorderManager:uni.getRecorderManager(),//录音
				touchY: 0,//手指触摸的的位置，用于取消发送语音
				cancelSendVoice: false,//如果取消了发送,则录制的语言不发送
				showSendVoiceToast: false,//录制语言的提示
				voiceFile: {},//语音文件
				voiceTime: 0,//语音消息计时
				stopTimer: false,//停止计时
				selectChatItem:{},//选择的某个聊天消息
				isIOS:false
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight,
					_this.isIOS = res.system.indexOf('iOS')!=-1
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#chat-scrollview"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		onShow(){
			let _this = this
			 uni.$once(REFRESH_CHAT_CONTENT,async function(data){
				if(data.needRefresh){
					_this.$refs.customExpression.refresh()
					let beforeMessageGroup = await getChatRecord(_this.myUserInfo.id, _this.fromUserInfo.id)
					_this.messageGroup = beforeMessageGroup
					let messages = _this.messageGroup.messages
					let messagesSize = messages.length
					if (messagesSize > 0) {
						_this.scrollInto = `chat_${messages[messages.length - 1].id}`
						}
				}
			})
		},
		async onLoad(params) {
			this.initRecorderAndKeyboardManager()
			uni.showLoading({
				title: "加载中"
			})
			let fromUserId = params.fromUserId as number
			let myUserInfo = await getMyUserInfo() as UserInfo
			if (!fromUserId || !myUserInfo) {
				return
			}
			this.myUserInfo=myUserInfo
			let beforeMessageGroup = await getChatRecord(myUserInfo.id, fromUserId)
			this.messageGroup = beforeMessageGroup
			let messages = this.messageGroup.messages
			let messagesSize = messages.length
			uni.hideLoading()
			this.onLineState = await GetonlineState(fromUserId)
			this.fromUserInfo = await getUserinfo(fromUserId)
			
			if (messagesSize > 0) {
				
				this.scrollInto = `chat_${messages[messagesSize- 1].id}`
				this.setMessageListUnReadSum(myUserInfo.id,fromUserId)
				//判断最后一条消息的已读未读状态 最后一条消息已读的话之前的消息也一定已读
				if (messages[messagesSize - 1].isMe && messages[messagesSize - 1].isNotRead) {
					let IsBeenRead = await this.getIsBeenRead([messages[messagesSize - 1].id])
					if (!IsBeenRead[0].unread) {
						for (let i = messagesSize - 1; i >= 0; i--) {
							if (messages[i].isMe && messages[i].isNotRead) {
								messages[i].isNotRead = false
							} else {
								break
							}
						}
					}
				}
			}
			
			
			this.messageGroup.messages = await this.messageDataProcessing(messages, fromUserId)
			if(this.messageGroup.messages.length>0){
				this.scrollInto = `chat_${messages[messages.length - 1].id}`
			}
			this.saveNewestMessageGroup()
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
			newMessage() {
				return this.state.messageStore.newMessage
			},
			scollerHeight(){
				let keyboardHeight = this.showEmojiPicker?this.emojiContentHeight:this.keyboardHeight
				return this.contentHeight- keyboardHeight - this.navHeight -110
			}

		},
		watch: {
			newMessage: async function(new_message) {
				if (new_message.type === WITHDRAW) {
					if (new_message.data.userId == this.fromUserInfo.id) {
						if (this.messageGroup) {
							let messages = this.messageGroup.messages
							for (let j = messages.length - 1; j >= 0; j--) {
								if (messages[j].id == new_message.data.messageId) {
									messages[j] = {
										content: '对方撤回了一条消息',
										type: -1,
										id: new_message.data.messageId,
										createTime: messages[j].createTime,
										isMe: false
									}
									break
								}
							}
							this.messageGroup.messages = messages
							this.scrollInto = `chat_${messages[messages.length - 1].id}`
						}
					}
				} else if (new_message.type === USER_MESSAGE) {
					if (new_message.data.fromUserId == this.fromUserInfo.id) {
						this.getUnReadMessage(this.fromUserInfo.id) //通知消息已读
						if (this.messageGroup) {
							let messages = this.messageGroup.messages
							messages.push({
								content: new_message.data.content,
								type: new_message.data.type,
								id: new_message.data.id,
								isMe: false,
								createTime: getTime(),
								time: new_message.data.time
							})
							this.messageGroup.messages = messages
							this.scrollInto = `chat_${messages[messages.length - 1].id}`
						}
					}
				} else if (new_message.type === ALREADY_READ) {
					
					if (new_message.data.userId == this.fromUserInfo.id) {
						if (this.messageGroup) {
							let messages = this.messageGroup.messages
							for (let i = messages.length-1; i >=0 ; i--) {
								//消息全部设为已读
								if (messages[i].isMe && messages[i].isNotRead) {
									messages[i].isNotRead = false
								} else {
									break
								}
							}
							this.messageGroup.messages = messages
						}
					}
				}
				this.saveNewestUserMessage() //更新消息列表
			},
		},
		methods: {
			/**
			 * @description 初始化键盘和录音的一些响应事件
			 */
			initRecorderAndKeyboardManager() {
				uni.onKeyboardHeightChange(async res => {
					if (res.height != 0) {
						this.keyboardHeight = res.height
						this.emojiContentHeight = res.height
						this.showEmojiPicker = false,
						this.scrollInto = 'show_keyboard'
					} else {
							this.keyboardHeight = 0
							this.scrollInto = ''
					}
				})
				
				this.recorderManager.onStop(async (res) => {
					clearInterval()//取消计时
					if (this.cancelSendVoice) {
					} else {
						let time = Math.floor(res.duration / 1000);
						if (time < 1) {
							uni.showToast({
								title: '时间过短',
								icon: 'none'
							})
						} else {
							this.uploadImageOrVoice([res.tempFilePath], 2, time)
						}

					}
					//初始化
					this.touchY= 0,
					this.cancelSendVoice= false
					this.voiceTime= 0
					this.$refs.recordingPopup.close()
					
				})
				this.recorderManager.onFrameRecorded((res) => {
					const { frameBuffer } = res
				})
			},
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
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
			 * @description 点击撤回消息
			 */
			onWithdrawTextClick(){
				this.withdrawMessage(this.selectChatItem.id)
				this.$refs.chatItemActionPopup.close()
			},
			/**
			 * @description 输入文字时
			 */
			onInputFocus(){
				this.inputFocus=true
			},
			/**
			 * @description 点击页面时
			 */
			onContentClick(){
				this.inputFocus=false
				this.showEmojiPicker=false
				uni.hideKeyboard()
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
			 * @description 输入时
			 * @param {Object} e
			 */
			onInput(e){
				this.sendText=e.detail.value
			},
			onVoiceButtonTouchStart(e){
				if (this.myUserInfo.isVerify == 0) {
					uni.showToast({
						title: '只有认证过的用户才可以发送语音消息哦',
						icon: 'none'
					})
					return
				}
				this.touchY=e.changedTouches[0].clientY,
				this.$refs.recordingPopup.open()	
				this.recorderManager.start(this.options)
				this.voiceTimer()
			},
			onVoiceButtonTouchEnd(){
				this.$refs.recordingPopup.close()
				this.recorderManager.stop()
				this.stopTimer= true
			},
			onVoiceButtonTouchMove(e){
				if (this.touchY - e.changedTouches[0].clientY > 50) {
					this.cancelSendVoice = true
				} else {
					this.cancelSendVoice = false
				}
			},
			/**
			 * @description 点击发送按钮时
			 */
			sendButtonClick(){
				if(this.sendVoice){
					
				}else{
					if(this.sendText){
						this.sendMessage(this.fromUserInfo.id,this.sendText)
					}
				}
			},
			/**
			 * @description 切换语音还是文字输入
			 */
			onChangeSendTypeClick(){
				this.sendVoice=!this.sendVoice
				if(this.sendVoice){
					this.inputFocus=false
					this.showEmojiPicker=false
					uni.hideKeyboard()
				}
			},
			/**
			 * @description 点击图片选择
			 */
			onImageChooseClick(){
				let _this = this
				uni.chooseImage({
					count: 9, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFilePaths = res.tempFilePaths
						
						_this.uploadImageOrVoice(tempFilePaths)
					}
				})
			},
			/**
			 * @description 点击拍照图标时
			 */
			onCameraIconClick(){
				let _this = this
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
					success: function (res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFilePaths = res.tempFilePaths
						
						_this.uploadImageOrVoice(tempFilePaths)
					}
				})
			},
			/**
			 * @description 点击笑脸图标时
			 */
			onSmileIconClick(){
				this.showEmojiPicker=!this.showEmojiPicker
				this.scrollInto = 'show_keyboard'
				if(this.showEmojiPicker){
					this.inputFocus=false
					uni.hideKeyboard()
				}
			},
			/**
			 * @description 更换表情的分页
			 * @param {Obeject} e
			 */	
			onSwiperChange(e){
			
				this.expressionTabPage = e.detail.current;
			},
			/**
			 * @description 更换表情的分页
			 * @param {number} page
			 */
			onExpressionTabClick(page){
				this.expressionTabPage = page;
			},
			/**
			 * @description 点击单个emoji表情
			 * @param {string} 单个表情
			 */	
			onEmojiItemClick(item){
				this.sendText = this.sendText+item
			},
			/**
			 * @description 点击单个emoji表情
			 * @param {Object} item 单个表情
			 */	
			onCustomExpressionClick(item){
				 this.sendMessage(this.fromUserInfo.id,item.url.replace(ImageFatherPath,''),1)
			},
			/**
			 * @description 点击历史图标时
			 */
			onHistoryIconClick(){
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-history/chat-history?fromUserId=${this.fromUserInfo.id}`
				})
			},
			/**
			 * @description  是否在聊天内容上显示时间
			 * @param {Object} index 第几条
			 */
			showChatCreatTime(index) {
				let messages = this.messageGroup.messages
				let showtime = false
				if (index == 0) {
					showtime = true
				} else {
					let menit = GetNumberOfMenit(messages[index - 1].createTime, messages[index].createTime)
					if (menit > 1) {
						showtime = true
					}
				}
				return showtime
			},
			/**
			 * @description 语音消息计时器
			 */
			voiceTimer() {
				if (this.voiceTime >= 59) {//大于59秒后结束
					return
				}
				if (this.stopTimer) {//主动停止时结束
					this.stopTimer= false
					
					return
				}
				let _this = this
				setTimeout(function () {
					_this.voiceTime=_this.voiceTime + 1
					_this.voiceTimer()
				}, 1000)
		
			},
			/**
			 * @description 设置消息列表中的未读数
			 * @param {number} userId 用户的id
			 * @param {number} fromUserId 聊天对象的id
			 * @param {number} unReadSum
			 */
			async setMessageListUnReadSum(userId,fromUserId,unReadSum=0){
				//将消息列表对应用户的未读数设为0
				let beforeUserMessageList = await getUserMessageList(userId)
				for (let i = 0; i < beforeUserMessageList.length; i++) {
					if (fromUserId == beforeUserMessageList[i].userId) {
						try{
							changeUnreadMessageSum(-beforeUserMessageList[i].unReadSum)
						}catch{
							
						}
						
						beforeUserMessageList[i].unReadSum =unReadSum //未读消息设为零
						let storageKey = getUserMessageListKey(userId)
						await uni.setStorage({
							key: storageKey,
							data: beforeUserMessageList
						})
						break
					}
				}
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
					this.$refs.customExpression.refresh()
					uni.showToast({
						title:'添加成功',
						icon:'success'
					})
				   
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
				if (this.messageGroup) {
					let messages = this.messageGroup.messages
					for (let i = messages.length - 1; i >= 0; i--) {
						if (messages[i].id == id) {
							messages.splice(i, 1)
							break
						}
					}
					this.messageGroup.messages=messages
					
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
					this.saveNewestMessageGroup()
					this.saveNewestUserMessage()
				}
			},
			/**
			 * @description 撤回消息
			 * @param {number} id 消息的id  
			 */
			async withdrawMessage(id: number) {
				let res = await request({
					data: {
						method: 'POST',
						// type:'websocket/bgxq',
						group: 'message',
						action: `${id}/withdraw`,
						data: {
							id: id
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code == REQUEST_SUCCEEDED_CODE) {
					if (this.messageGroup) {
						let messages = this.messageGroup.messages
						for (let i = messages.length - 1; i >= 0; i--) {
							if (messages[i].id == id) {
								messages[i] = {
									id: id,
									content: '你撤回了一条消息',
									type: -1,
									isMe: true,
									createTime: messages[i].createTime
								}
								break
							}
						}
						this.messageGroup.messages=messages
						this.saveNewestMessageGroup()
						this.saveNewestUserMessage()
					}
				}
			},
			/**
			 * @description 发送消息
			 * @param toUserId {}
			 */
			async sendMessage(toUserId:number,text: string, type: number = 0, voiceLen: number=0) {
				let res = await request({
					data: {
						method: 'POST',
						group: 'message',
						action: 'send',
						data: {
							content: text,
							type,
							toUserId,
							time: voiceLen
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code === '00000') {
					this.sendText=''
					let result = res.data.data as sendMessageResult
					if (this.messageGroup.messages) {
						this.messageGroup.messages.push({
							content: type == 0 ?text:result.url + text ,
							type: type,
							id: result.messageId,
							isMe: true,
							createTime: getTime(),
							isNotRead: true,
							time: voiceLen
						})
							
					} else {
						this.messageGroup={
							fromUserId: toUserId,
							type: '',
							badgeNumber: 0,
							messages: [{
								content: type == 1 ? result.url + text : text,
								type: type,
								isMe: true,
								id: result.messageId,
								createTime: getTime(),
								isNotRead: true,
								time: voiceLen
							}]
						}
					}
					this.scrollInto = `chat_${result.messageId}`
					this.saveNewestUserMessage()
					this.saveNewestMessageGroup()
				}
			},
			/**
			 * @description 获取发送消息的已读未读状态
			 */
			async getIsBeenRead(ids: number[]) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: `unread/check`,
						data: {
							ids: JSON.stringify(ids)
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code == REQUEST_SUCCEEDED_CODE) {
					return res.data.data as IsBeenReadItem[]
				} else {
					return []
				}
			},
			/**
			 * @description 聊天数据处理 排序、去重、获取未读数据
			 * @param {MessageItem []} messages 聊天记录
			 * @param {number} fromUserId 聊天对象的id
			 */
			async messageDataProcessing(messages: MessageItem[], fromUserId: number) {
				let unReadMessage = await this.getUnReadMessage(fromUserId)
				messages = messages.concat(unReadMessage)
				let iDs: number[] = []
				let tempMessages: MessageItem[] = []
				messages.forEach((item) => { //去重
					if (iDs.indexOf(item.id) == -1) {
						iDs.push(item.id)
						tempMessages.push(item)
					}
				})
				tempMessages.sort(function(a, b) { //排序
					let id_a = a.id
					let id_b = b.id
					return id_a >= id_b ? 1 : -1
				})
				return tempMessages
			},
			/**
			 * @function 获取未读消息 
			 * @param userId 聊天对象的用户Id
			 * @returns {Promise<UnReadMessageItem[]>}
			 */
			async getUnReadMessage(userId: number): Promise < UnReadMessageItem[] > {
				let res = await request({
					data: {
						method: 'DELETE',
						group: 'message',
						action: 'unRead/message',
						data: {
							userId: userId,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let unReadMessage = res.data.data as UnReadMessageItem[]
					return unReadMessage
				} else {
					return []
				}
			},
			/**
			 * @description 储存最新的消息组
			 */
			async saveNewestMessageGroup() {
				let storageKey = getChatRecordKey(this.myUserInfo.id, this.fromUserInfo.id)
				uni.setStorage({
					key: storageKey,
					data: this.messageGroup
				}) //保存聊天记录
			},
			/**
			 * @description 储存最新的消息列表 
			 */
			async saveNewestUserMessage(){
				if (this.messageGroup.messages) {
					let userMessageListItems = await getUserMessageList(this.myUserInfo.id)
					let have_data = false
					let lastMessage = this.messageGroup.messages[this.messageGroup.messages.length - 1]
					for (let i = 0; i < userMessageListItems.length; i++) {

						if (userMessageListItems[i].userId === this.fromUserInfo.id) {
							let userMessageListItem = userMessageListItems[i]
							changeUnreadMessageSum(-userMessageListItem.unReadSum)
							userMessageListItem.lastMessage = lastMessage.content
							userMessageListItem.lastMessageType = lastMessage.type
							userMessageListItem.lastTime = lastMessage.createTime
							userMessageListItem.unReadSum = 0
							userMessageListItems.splice(i, 1)
							userMessageListItems.push(userMessageListItem)
							have_data = true
							break
						}
					}
					if (this.fromUserInfo) {
						if (!have_data) {
							userMessageListItems.push({
								avatar: this.fromUserInfo.avatar,
								lastMessage: lastMessage.content,
								lastMessageType: lastMessage.type,
								lastTime: lastMessage.createTime,
								online: this.onLineState,
								unReadSum: 0,
								userId: this.fromUserInfo.id,
								username: this.fromUserInfo.username
							})
						}
					}
					let storageKey = getUserMessageListKey(this.myUserInfo.id)
					uni.setStorage({ key:storageKey , data: userMessageListItems })
				}
			},
			/**
			 * @description 上传图片、语音
			 * @param {string[]} filePath 文件的链接
			 * @param {number} type 类型 1-图片 2-语音
			 * @param {number} voiceLen 类型为语音时需要，语音的时长
			 */
			async uploadImageOrVoice(filePath: string[], type: number = 1, voiceLen?: number) {
				let _this = this
				let uploadImageOrVoices: string[] = []
				let filesNumber = filePath.length
				if (type == 2) {
					if (this.myUserInfo.isVerify == 0) {
						uni.showToast({
							title: '只有认证过的用户才可以发送语音消息哦',
							icon: 'none'
						})
						return
					}
				}
				//没有文件直接取消
				if (filesNumber < 1) {
					return
				}
				//先获取上传凭证
				let FileVouchers: FileVoucher[]
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: 'tokens',
						data: {
							sum: filesNumber
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					},
				})
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					FileVouchers = res.data.data as FileVoucher[]
				} else {
					return
				}
				//保存要上传的文件名
				FileVouchers.forEach((item) => {
					uploadImageOrVoices.push(item.fileName)
				})
				filePath.forEach(async (item, index) => {
					if (type == 1) {
						uni.showLoading({
							title: `正在发送${index + 1}/${filesNumber}`,
						})
					}
		
					await uni.uploadFile({
						url: UploadUrl,
						filePath: item,
						name: 'file',
						formData: {
							'key': FileVouchers[index].fileName,
							'token': aes.decrypt(FileVouchers[index].token)
						},
						success() {
							_this.sendMessage(_this.fromUserInfo.id,FileVouchers[index].fileName, type, voiceLen)
						}
					})
				})
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	.online-state {
		width: 10rpx;
		height: 10rpx;
		border-radius: 5rpx;
		margin-left: 5rpx;
	}

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

	.chat-input-content {
		width: 100%;
	}
	
	.emoji-choose-content {
		transition: all 200ms;
		background-color: #f5f5f5;

		.expression-taps {
			display: flex;

			.tap-content {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 12vw;
				height: 12vw;
				border-radius: 15rpx 15rpx 0 0;
			}
		}
	}

	.text-send-conent {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		overflow: inherit;

		.chat-input {
			z-index: 99;
			position: relative;
			flex: 1;
			padding: 10rpx;
			border-radius: 30rpx;
			background-color: #fff;
			overflow: inherit;
		}
		.fake-chat-input{
			z-index: 99;
			position: relative;
			flex: 1;
			padding: 10rpx;
			border-radius: 30rpx;
			background-color: #fff;
			overflow: inherit;
			height: fit-content;
			min-height: 45rpx;
		}
		.voice-input {
			flex: 1;
			padding: 15rpx;
			border-radius: 30rpx;
			background-color: #fff;
			display: flex;
			text-align: center;
			justify-content: center;
			align-items: center;
		}

		.send-button-content {
			width: 100rpx;
			padding: 10rpx;
			margin-left: 20rpx;
			display: flex;
			border-radius: 30rpx;
			background-color: #4eccb8;
			text-align: center;
			align-items: center;
			justify-content: center;

			.send-button {
				color: #FFF;
				font-weight: bold;
			}
		}
	}

	.send-text-button-content {
		z-index: 100;
		position: absolute;
		width: 100rpx;
		padding: 10rpx;
		top: 0rpx;
		right: 40rpx;
		display: flex;
		border-radius: 30rpx;
		background-color: #cc4e89;
		text-align: center;
		align-items: center;
		justify-content: center;

		.send-button {
			color: #FFF;
			font-weight: bold;
		}
	}

	.other-send-option {
		display: flex;
		padding: 10rpx 20rpx;

		.option-image-content {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.send-option-image {
			width: 50rpx;
			height: 50rpx;
		}
	}
	.recording-popup-content{
		width: 50vw;
		height: 50vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		justify-content: center;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		.popup-text{
			margin-top: 20rpx;
		}
	}
	.expression-swiper-item{
		width: 100vw;
		background-color: #18BC37;
	}
</style>
