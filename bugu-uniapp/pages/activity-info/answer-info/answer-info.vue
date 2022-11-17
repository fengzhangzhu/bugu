<template>
	<view class="page answer-info-content">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">回答详情</view>
		</uni-nav-bar>
		<scroll-view id="answer-info-scroll"
		scroll-y="true" 
		refresher-enabled 
		:refresher-triggered="isRefresh"
		@refresherrefresh="onRefresh()" 
		@scrolltolower="onScrollToLower()"
		:scroll-into-view="scrollInto" 
		:style="{
			height: scollerHeight+'px',
			width: '100%',
		  }" >
			<view class="question-content" >
				<text>{{questionTitle}}</text>
			</view>
			<view v-if="!answerData.id">
				<activity-skeleton></activity-skeleton>
			</view>
			<view v-else class="answer-content"
			@click="onAnswerClick"
			>
				<!-- 头部 -->
					<view class="answer-header">
						<!-- 头像 -->
						<view class="answer-header-avatar">
							<image  class="answer-user-avatar" :mode="'aspectFill'"
								:src="answerAvatar"
								@click.stop="onAvatarClick()"
								></image>
							<view v-if="answerUser.isVip&&answerUser.isVip.remainDays>0" class="vip-logo">
								<image :src="'../../../static/svgs/vip-logo.svg'" :mode="'aspectFit'" :style="{
											width: '15px',
											height: '15px'
										}"></image>
							</view>
						</view>
						<!-- 用户名和发布时间 -->
						<view class="answer-header-name-and-time">
							<view class="answer-header-name">
								<view class="answer-header-username">
									{{answerUsername}}
									<!-- 是否实名认证-->
									<view v-if="answerUser.isVerify"
										class="iconfont icon-shimingrenzheng_shimingrenzheng" :style="{
												fontSize: '15px',
												color: '#3bd8bf',
												marginLeft: '5px'
											}"></view>
									<view v-if="answerUser.sex != undefined"
										:class="answerUser.sex == 0 ? 'iconfont icon-nvxing' : 'iconfont icon-nanxing'"
										:style="{
												fontSize: '15px',
												color: answerUser.sex == 0 ? '#e86591' : '#528cea',
												marginLeft: '5px'
											}" />
								</view>
							</view>
							<!-- 发布时间  -->
							<view class="answer-header-time">
								<view class="creat-time">{{ publishTime }}</view>
							</view>
						</view>
						<!-- 操作按钮 -->
						<view class="answer-header-button">
							<!-- 关注/私聊按钮 -->
							<view v-if="!answerData.isAnony">
								<view v-if="!isMe">
									<view @click.stop="onFollow()" class="follow-button" v-if="answerUser.isAttention == 0 ">关注
									</view>
									<view @click.stop="onChatClick()" class="chat-button" v-else>
										<view class="iconfont icon-message" :style="{
													fontSize: '32rpx',
													color: '#FFF'
												}" />
									</view>
								</view>
							</view>
							<!-- 更多按钮 -->
							<view class="answer-more"
							@click.stop="onMoreClick()"
							>
								<view class="iconfont icon-gengduo-c" :style="{
											fontSize: '50rpx',
											color: '#afafaf'
										}"></view>
							</view>
						</view>
					
					</view>
					<!-- 内容体 -->
					<view class="answer-body">
						<!-- 文字部分  -->
						<view class="answer-body-text">
							<text>{{answerData.text}}</text>
						</view>
						<!-- 图片和视频部分 -->
						<view v-if="answerData.pic.length>0" class="answer-body-images"
							:style="{ width:  '100%' }">
							<!-- 视频 -->
							<view v-if="answerData.isVideo===1">
								
								<view @click.stop="onVideoClick" v-for="item in answerData.pic" :key="item" class="video-content">
									<image v-show="!playVideo" style="width: 100%;height: 55vw;background-color: #000000;" :lazy-load="true" mode="aspectFit" :src="item+'?vframe/jpg/offset/0'" ></image>
									<video v-show="playVideo" style="width: 100%;height: 55vw;background-color: #000000;" :src="item" :id="`video_${answerId}`" initial-time="0"
										@fullscreenchange="onFullscreenChange"
										controls
										></video>
									<view v-show="!playVideo" class="play-icon-content">
										<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="100" />
									</view>
								</view>
							</view>
							<!-- 图片 -->
							<view v-else>
								<view :key="index" :class="'answer-body-image'"
									v-for="(item, index) in answerData.pic"
									@click.stop="onImageClick(item)"
									>
									<image :lazy-load="true" :mode="'aspectFill'" :src="item"
										class="image-item" />
								</view>
							</view>
						</view>
					</view>
					<!-- 底部 -->
					<view class="answer-footer">
						<view class="answer-footer-agree">
							<view v-if="answerData.isAgreed" class="cancel-button" @click.stop="onAgreeButtonClick" >
								<view class="iconfont icon-agree"/>
								<view class="button-text">已赞同 {{ answerData.agreeSum }}</view>
							</view>
							<view v-else-if="answerData.isOpposed" class="cancel-button" @click.stop="onOpposeButtonClick">
								<view class="iconfont icon-oppose"/>
								<view class="button-text">已反对</view>
							</view>
							<!-- 赞同/反对按钮 -->
							<view v-else class="agree-button-group">
								<view class="agree" @click.stop="onAgreeButtonClick">
									<view class="iconfont icon-agree"/>
									<view class="agree-sum">赞同 {{ answerData.agreeSum }}</view>
								</view>
								<view class="dividing-line"/>
								<view class="oppose" @click.stop="onOpposeButtonClick">
									<view class="iconfont icon-oppose"/>
								</view>
							</view>
						</view>
						<!-- 喜欢按钮 -->
						<view class="answer-footer-item">
							
							<button size="mini" plain @click.stop="onShareClick()" open-type="share" class="share-button">
								<view class="iconfont icon-fenxiang" :style="{ fontSize: '25px', color: '#b8b8b8' }">
								</view>	
							</button>
						</view>
						<!-- 评论按钮 -->
						<view class="answer-footer-item">
							<view class="iconfont icon-pinglun" :style="{ fontSize: '25px', color: '#b8b8b8' }" />
							{{ answerData.commentSum }}
						</view>
				</view>
			</view>
			<!-- 评论 -->
			<comment-item 
			commentType="answer"
			v-for="(item,index) in commentDatas" 
			:commentData="item.father" 
			:replyData="item.sons"
			:key="item.father.id"
			:authorId="answerData.isAnonymity?0:answerUser.id"
			:needRefresh="refreshCommentId == item.father.id" 
			@onCommentClick="onCommentClick(item.father)"
			@onShowAllClick="onShowAllClick(item.father)" 
			@onCommentMoreClick="onCommentMoreClick(item.father)"
			@onReplyClick="onReplyClick" 
			@onReplyMoreClick="onReplyMoreClick">
			</comment-item>
			<view id="comment-item-newest"></view>
			<view class='loading-content'>
				<uni-load-more
				:status="haveMoreData?showBottomLoading?'loading':'more':'noMore'" 
				:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: haveMoreData==false&&commentDatas.length<=0?'还没有评论，快来抢沙发吧~':'没有更多评论了'}"
				iconType="circle"
				></uni-load-more>
			</view>
		</scroll-view>
		<!-- 下方的输入框 -->
		<view class="comment-bottom-content">
			<view class="comment-input-content">
				<!-- 输入框 -->
				<textarea v-if="isIOS" class="comment-input"
				  v-model="sendText"
				  :show-confirm-bar="false"
				  :auto-height="true"
				  :adjust-position="false" 
				  :placeholder="placeholder"
				  :focus="inputFocus"
				  @focus="onCommentTextareaFocus"
				  @blur="onCommentTextareaBlur"
				  />
				<input v-else class="comment-input"
				    v-model="sendText"
				    :show-confirm-bar="false"
				    :auto-height="true"
				    :adjust-position="false" 
				    :placeholder="placeholder"
				    :focus="inputFocus"
				    @focus="onCommentTextareaFocus"
				    @blur="onCommentTextareaBlur"
				    />
				<!-- 表情图标 -->
				<view class="option-image-content">
					<image class="send-option-image" mode="aspectFill" src="../../static/svgs/smile.svg"
						@click="onEmojiIconClick()">
					</image>
				</view>
				<!-- 发送按钮 -->
				<view class="send-button-content"  @click="onSendButtonClick()">
					<view class="send-button">
						{{buttonIsLoading?'发送中':'发送'}}
					</view>
				</view>
			</view>
			<!-- 加载提示 -->
			<view :style="{
			 height:showEmojiPicker?emojiContentHeight + 'px': keyboardHeight + 'px'}">
				<uni-transition class="emoji-picker-content" mode-class="slide-bottom" :show="showEmojiPicker">
				<view>
						<emoji v-show="showEmojiPicker" :contentHeight="emojiContentHeight" @setEmoj="setEmoj"></emoji>
				</view>
				</uni-transition>
			</view>
		</view>
		<!-- 回答操作弹出层 -->
		<action-sheet ref="answerActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<block v-if="answerData.id">
				<block v-if="answerData.isAnonymity">
					<action-sheet-item @click="onPopupReportClick()" icon="icon-alert" title="举报" />
				</block>
				<block v-else>
					<block v-if="answerUser.id == myId">
						<action-sheet-item icon="icon-delete" title="删除" @click="onPopupDeleteClick"/>
					</block>
					<block v-else>
						<action-sheet-item v-if="answerUser.isAttention == 1"
						icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelFollow()"/>
						<action-sheet-item v-else icon="icon-guanzhu" title="关注" @click="onFollow()"/>
						<action-sheet-item @click="onChatClick()" icon="icon-message" title="私聊"/>
						<action-sheet-item @click="onPopupReportUserClick()" icon="icon-alert" title="举报"/>
					</block>
				</block>
			</block>
		</action-sheet>
		<!-- 评论操作弹出层 -->
		<action-sheet ref="commentActionPopup" :needHead="true" title="评论选择" :needCancelButton="true">
			<block v-if="commentMoreSelected.fromUserId">
				<block v-if="myId == commentMoreSelected.fromUserId">
					<action-sheet-item @click="onCommentPopupDeleteClick(commentMoreSelected)" icon="icon-delete" title="删除" />
				</block>
				<block v-else>
					<action-sheet-item @click="onCommentPopupReportClick(commentMoreSelected)" icon="icon-alert" title="举报" />
					<action-sheet-item  v-if="answerUser.id == myId" 
					icon="icon-delete"
					title="删除" 
					@click="onCommentPopupDeleteClick(commentMoreSelected)"
					/>
				</block>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts" >
	import {
		followUser,
		cancelAttention,
	} from '@/common/requestFunctions';
	import {
		PageInfo
	} from '@/common/dataClass'
	import {
		commentAnswer,
		ReplyAnswerComments,
		deleteAnswerCommentReply,
		deleteAnswerComment,
		likeAnwserComment,
		cancelLikeAnwserComment
	} from '@/services/answerServices'
	import {deleteAnswer,agreeAnswer,cancelAgreeAnswer,opposeAnswer,cancelOpposeAnswer} from '@/services/answerServices';
	import {
		reportObjectType,
		AnonymousAvatar,
		avatar_pic_hendle
	} from '@/common/constants';
	import {
		request
	} from '@/utils/request';
	import {
		REQUEST_SUCCEEDED_CODE
	} from '@/common/constants';
	import {
		GettimeifferenceOfNow,
		getTime
	} from "@/utils/dateUtils";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {CommentDataItem,AnswerDataItem,Publisher,UserInfo,PageInfo} from "@/common/dataClass";

	
	
	/**
	 * answerInfo  回答详情
	 * @description 回答详情
	 * @Author: 穆兰
	 * @Date: 2021/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/20
	 */
	export default {
		data() {
			return {
				AnonymousAvatar,//匿名头像
				questionTitle:'',//问题标题
				questionId:0,//问题id
				answerId:0,//回答ID
				answerData:{} as AnswerDataItem,//回答数据
				answerUser:{} as Publisher,//答主信息
				isMe:false,
				isDelete:false,
				playVideo:false,
				videoContext:{},//video组件对象实例
				isRefresh:false,
				scrollInto:'',
				contentHeight:0,
				navHeight:0,
				myUserInfo:{},
				commentDatas: [] as CommentDataItem[], //所有评论信息
				page:1,
				haveMoreData:true,
				keyboardHeight: 0, //键盘的高度
				emojiContentHeight:300,//表情选择框的高度
				showEmojiPicker: false, //是否显示表情选择框
				showBottomLoading:false,//是否处于加载状态
				refreshCommentId: 0, //需要刷新的回复id
				isReplyComment: false, //是否回复评论
				inputFocus: false, //input聚焦
				sendText: '', //评论或者回复放入内容
				buttonIsLoading: false, //是否正在发送中
				commentSelected: {} , //选中的评论或回复-用户评论操作
				commentMoreSelected: {} , //选择的评论或回复-用于更多操作
				isIOS:false
			}
		},
		//#ifdef MP-WEIXIN
		/**
		 * @description 分享
		 */
		onShareAppMessage() {
			let imageUrl =''
			if(this.answerData.videoPaths){
				imageUrl=this.answerData.videoPaths[0]+'?vframe/jpg/offset/0'
				
			}else if(this.answerData.imgPaths){
				imageUrl=this.answerData.imgPaths[0]
			}
			let username = ''
			if(this.answerData.isAnony==1){
				username="匿名用户"
			}else{
				if(this.answerUser.username){
					username = this.answerUser.username
				}
			}
			
			let questionTitle=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionTitle)))
			let questionId=this.questionId
		    return {
		      title:`${username}回答了一个问题，快来看看ta说了什么` ,
		      path: `/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.issueComment.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl
		    };
		},
		onShareTimeline() {
			let imageUrl =''
			if(this.answerData.videoPaths){
				imageUrl=this.answerData.videoPaths[0]+'?vframe/jpg/offset/0'
				
			}else if(this.answerData.imgPaths){
				imageUrl=this.answerData.imgPaths[0]
			}
			let username = ''
			if(this.answerData.isAnony==1){
				username="匿名用户"
			}else{
				if(this.answerUser.username){
					username = this.answerUser.username
				}
			}
			let questionTitle=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionTitle)))
			let questionId=this.questionId
			return {
			  title:`${username}回答了一个问题，快来看看ta说了什么` ,
			  path: `/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.issueComment.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
			  imageUrl
			};
		},
		//#endif
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
					_this.isIOS = res.system.indexOf('iOS')!=-1
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#answer-info-scroll"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params) {
			//键盘高度改变时
			uni.onKeyboardHeightChange(async res => {
				if (res.height != 0) {
					this.keyboardHeight = res.height
					this.emojiContentHeight = res.height
					this.showEmojiPicker = false
				} else {
						this.keyboardHeight = 0
				}
			})
			this.answerId = params.answerId
			try{
				this.questionTitle =JSON.parse(JSON.parse(decodeURIComponent(params.questionTitle)))
			}catch{
				
			}
			
			
			
			await this.getAnswerInfo(this.answerId)
			if (this.answerUser.id) {
				let userInfo = await getMyUserInfo() as UserInfo
				this.myId = userInfo.id
				this.myUserInfo = userInfo
				this.isMe = this.answerUser.id == userInfo.id
			}
			try{
				this.questionId = params.questionId
			}catch{
				this.questionId = this.answerData.questionId
			}
			this.getQuetionsInfo(this.questionId)
			this.showBottomLoading=true
			this.getAnswerComments(this.answerId,this.page)
			this.showBottomLoading=false
		},
		computed:{
			// 输入框的提示
			placeholder(){
				
				return this.isReplyComment?`回复${this.commentSelected.toUsername}`:'回复作者'
			},
			scollerHeight(){
				return this.contentHeight - this.navHeight
			},
			publishTime(){
				if(!this.answerData.createTime){
					return ''
				}else{
					
					return GettimeifferenceOfNow(this.answerData.createTime).DistanceNow
				}
			},
			answerAvatar(){
				if(!this.answerData){
					return ''
				}else{
					if(this.answerData.isAnonymity==1){
						return AnonymousAvatar
					}else{
						if(this.answerUser.id){
							return this.answerUser.avatar+avatar_pic_hendle
						}else{
							return ''
						}
						
					}
				}
			},
			answerUsername(){
				if(!this.answerData){
					return ''
				}else{
					if(this.answerData.isAnonymity===1){
						return '某只小布咕'
					}else{
						if(this.answerUser.id){
							return this.answerUser.username.length<7?this.answerUser.username:this.answerUser.username.slice(0,7)+'...'
						}else{
							return ''
						}
						
					}
				}
			},
		},
		methods: {
			/**
			 *@description 点击返回按钮 
			 */
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 点击头像时
			 */
			onAvatarClick(){
				if(this.answerData.isAnony == 0&&!this.isMe){
					uni.navigateTo({
						url:`/pages/user-home-page/user-home-page?userId=${this.answerUser.id}`
					})
				}
			},
			/**
			 * @description 点击回答上的更多按钮
			 */
			onMoreClick() {
				this.$refs.answerActionPopup.open()
			},
			/**
			 * @description 点击popup的举报按钮
			 */
			onPopupReportClick(){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.answerActionPopup.close()
			},
			
			/**
			 * @description 点击popup的删除按钮
			 */
			onPopupDeleteClick() {
				let _this = this
				uni.showModal({
					title: '删除答案',
					content: '你确定要删除这个答案吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteAnswer(_this.answerData.id)) {
								_this.$refs.answerActionPopup.close()
								_this.isDelete = false
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}
						}
					}
				})
			},
			/**
			 * @description 点击popup/answer的关注按钮
			 */
			async onFollow() {
				if (!this.answerUser.id) {
					return
				}
				let _this = this
				if (await followUser(this.answerUser.id)) {
					this.answerUser.isAttention=1
					_this.$refs.answerActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}
			},
			/**
			 * @description 点击popup的取消关注按钮
			 */
			async onCancelFollow() {
				if (!this.answerUser.id) {
					return
				}
				let _this = this
				uni.showModal({
					title: '取消关注',
					content: `你确定要取消关注${_this.answerUser.username}`,
					success: async function(res) {
						if (res.confirm) {
							if (_this.answerUser.id)
								if (await cancelAttention(_this.answerUser.id)) {
									_this.answerUser.isAttention=0
									_this.$refs.answerActionPopup.close()
									uni.showToast({
										title: '取消关注',
										icon: 'success'
									})
								}
						}
					}
				})
			},
			/**
			 * @description 点击popup私聊按钮
			 */
			async onChatClick(){
				if(this.answerUser.id)
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.answerUser.id}`
				})
			},
			/**
			 * @description 点击图片
			 * @param {string} item 图片的URL
			 */
			onImageClick(item){
				 uni.previewImage({ urls: this.answerData.pic, current: item })
			},
			/**
			 *@description 输入时
			 *@param {Object} e
			 */
			onCommentTextareaInput(e) {
				this.sendText = e.detail.value
			},
			/**
			 *@description 聚焦时 
			 */
			onCommentTextareaFocus() {
				this.inputFocus = true
			},
			/**
			 *@description 失去焦点时
			 */
			onCommentTextareaBlur(){
				setTimeout(()=>{
					
					this.inputFocus = false
				},100)
				
			},
			/**
			 *@description 点击输入框旁的emoji图标 
			 */
			onEmojiIconClick() {
				this.showEmojiPicker = !this.showEmojiPicker
			},
			/**
			 *@description 点击输入框旁的发送按钮
			 */
			async onSendButtonClick() {
				if(!this.questionId||!this.answerId){
					return
				}
				if (this.sendText.length <= 0) {
				return
				}
				if (this.buttonIsLoading) {
					return
				}
				this.refreshCommentId = 0
				this.buttonIsLoading=true
				this.scrollInto =''
				let res: number|boolean = false
				//评论回答或者回复他人的评论
				if (this.isReplyComment) {
					res = await ReplyAnswerComments(this.commentSelected.commentId,
					this.sendText,0,this.commentSelected.toUserId)
				} else {
					res = await commentAnswer(this.answerId,this.sendText, 0)
				}
				this.buttonIsLoading=false
				this.showEmojiPicker = false
				if(res!==-1){
					if(this.isReplyComment){
						this.refreshCommentId = this.commentSelected.commentId
					}else{
						this.scrollInto = `comment-item-newest`
						let myDate = new Date();
						if(this.isMe&&this.answerData.isAnony==1){
							this.commentDatas.push({
								father:{
									content: this.sendText,
									createTime: getTime(),
									id:res,
									isDeleted: 0,
									likeSum: 0,
									isLiked: 0,
									fromUserId: 0,
									publisher: null,
									responseSum: 0,
									type: 0,
								},
								sons:[]
							})
						}else{
							this.commentDatas.push({
								father:{
									content: this.sendText,
									createTime: getTime(),
									id:res,
									isDeleted: 0,
									likeSum: 0,
									isLiked: 0,
									fromUserId: this.myUserInfo.id,
									publisher: {
									    id: this.myUserInfo.id,
									    username: this.myUserInfo.username,
									    avatar: this.myUserInfo.avatar
									},
									responseSum: 0,
									type: 0,
								},
								sons:[]
							})
						}
						
					}
					this.sendText = ''
					
				}
				 
			},
			/**
			 * @description 点击单个表情
			 * @param {string} item 表情
			 * @param {number} index 表情的序号
			 */
			setEmoj(item) {
				this.sendText = this.sendText + item
			},
			/**
			 * @description 下拉刷新时
			 */
			async onRefresh() {
				if(!this.answerId){
					return
				}
				this.isRefresh = true
				await this.getAnswerInfo(this.answerId)
				this.page=1
				this.haveMoreData=true
				this.getAnswerComments(this.answerId,this.page)
			},
			/**
			 * @description 上拉时
			 */
			async onScrollToLower(){
				if(this.answerId)
					if(this.haveMoreData){
						this.showBottomLoading = true
						this.page=this.page+1
						let newDatas = await this.getAnswerComments(this.answerId,this.page)
						if(newDatas.length>0){
							this.commentDatas = this.commentDatas.concat(newDatas)
						}else{
							this.haveMoreData=false
						}
						this.showBottomLoading =false
					}
			},
			/**
			 *@description 点击回答的主体
			 */
			onAnswerClick() {
			
				if(this.inputFocus){
					this.inputFocus=false
				}else{
					this.inputFocus = true
				}
				this.isReplyComment = false
			},
			/**
			 * @description 点击评论popup的举报按钮
			 * @param {object} item {commentId: item.id,replyId:0,fromUserId: item.publisher.id,isReply: false, //是否为评论下的回复}
			 */
			onCommentPopupReportClick(item){
				if(item.isReply){
					uni.navigateTo({
						url:`/pages/setting/report-user/report-user?objectId=${item.replyId}&objectType=${reportObjectType.answerCommentResponse}&modular=question`
					})
					
				}else{
					uni.navigateTo({
						url:`/pages/setting/report-user/report-user?objectId=${item.commentId}&objectType=${reportObjectType.answerComment}&modular=question`
					})
				}
				this.$refs.commentActionPopup.close()
			},
			/**
			 * @description 点击评论popup的删除按钮
			 * @param {object} item {commentId: item.id,replyId:0,fromUserId: item.publisher.id,isReply: false, //是否为评论下的回复}
			 */
			onCommentPopupDeleteClick(item){
				let _this = this
				uni.showModal({
					title:"删除评论",
					content:"你确定删除这条评论吗？",
					success: async function(res) {
						if (res.confirm) {
							let deleteRes = false
							_this.refreshCommentId=0
							if(item.isReply){
								deleteRes = await deleteAnswerCommentReply(_this.answerData.id,item.replyId)
								if(deleteRes){
									_this.refreshCommentId=item.commentId
								}
							}else{
								deleteRes = await deleteAnswerComment(item.commentId)
								let commentDatas = _this.commentDatas
								for(let i =0;i<commentDatas.length;i++){
									if(commentDatas[i].father.id==item.commentId){
										commentDatas[i].father.isDeleted=1
										break;
									}
								}
								_this.commentDatas=commentDatas
							}
							if(deleteRes){
								uni.showToast({
									title:"删除成功"
								})
								_this.$refs.commentActionPopup.close()
							}
						}
					}
				})
				
			},
			/**
			 * @description 点击单个评论主体
			 * @param {CommentDataItem} item 
			 */
			onCommentClick(item) {
				this.isReplyComment = true
				this.inputFocus = true
				this.commentSelected = {
					toUsername:item.publisher.username?item.publisher.username:'某只小布咕',
					toUserId:0,
					commentId: item.id
				}
			},
			/**
			 * @description 点击单个评论的更多按钮
			 * @param {Object} item
			 */
			onCommentMoreClick(item) {
				this.commentMoreSelected = {
					commentId: item.id,
					replyId:0,
					fromUserId: item.publisher?item.publisher.id:-1,
					isReply: false, //是否为评论下的回复
				}
				this.$refs.commentActionPopup.open()
			},
			/**
			 * @description 点击展示全部的文字
			 * @param {Object} item
			 */
			onShowAllClick(item:CommentDataItem) {
				uni.navigateTo({
					url: `/pages/activity-info/comment-info?commentData=${JSON.stringify(item)}&authorId=${this.answerUser ? this.answerUser.id : 0}&commentType=answer`
				})
			},
			/**
			 * @description  点击评论的某个回复
			 * @param {Object} item 单个评论
			 * @param {Object} replyItem 单个回复
			 * @param {Object} index
			 */
			onReplyClick(item, replyItem, index) {
				this.isReplyComment = true
				this.commentSelected = {
					commentId: item.id,
					replyId:replyItem.id,
					toUsername: replyItem.fromUsername,
					toUserId: replyItem.fromUserId==0?-1:replyItem.fromUserId,
				}
			},
			/**
			 * @description  点击评论的某个回复的更多按钮
			 * @param {Object} item
			 * @param {Object} index
			 */
			onReplyMoreClick(item, replyItem) {
				this.commentMoreSelected = {
					commentId: item.id,
					replyId: replyItem.id,
					fromUserId: replyItem.fromUserId==0?-1:replyItem.fromUserId,
					isReply: true, //是否为评论下的回复
				}
				this.$refs.commentActionPopup.open()
			},
			/**
			 *@description 点击反对按钮 
			 */
			async onOpposeButtonClick(){
				
				if(this.answerData.isOpposed===1){
					this.answerData.isOpposed=0
					this.answerData.opposeSum = this.answerData.opposeSum-1
					if (!await cancelOpposeAnswer(this.answerData.id)) {
						this.answerData.isOpposed=1
						this.answerData.opposeSum = this.answerData.opposeSum+1
						uni.showToast({
							title: '取消失败',
							icon: 'error'
						})
					}
				}else{
					this.answerData.isOpposed=1
					this.answerData.opposeSum = this.answerData.opposeSum+1
					if (!await opposeAnswer(this.answerData.id)) {
						this.answerData.isOpposed=0
						this.answerData.opposeSum = this.answerData.opposeSum-1
						uni.showToast({
							title: '反对失败',
							icon: 'error'
						})
					}
				}
			},
			/**
			 *@description 点击赞同按钮 
			 */
			async onAgreeButtonClick(){
				
				if(this.answerData.isAgreed===1){
					this.answerData.isAgreed=0
					this.answerData.agreeSum = this.answerData.agreeSum-1
					if (!await cancelAgreeAnswer(this.answerData.id)) {
						this.answerData.isAgreed=1
						this.answerData.agreeSum = this.answerData.agreeSum+1
						uni.showToast({
							title: '取消失败',
							icon: 'error'
						})
					}
				}else{
					this.answerData.isAgreed = 1
					this.answerData.agreeSum = this.answerData.agreeSum+1
					if (!await agreeAnswer(this.answerData.id)) {
						this.answerData.isAgreed= 0
						this.answerData.agreeSum = this.answerData.agreeSum-1
						uni.showToast({
							title: '赞同失败',
							icon: 'error'
						})
					}
				}
			},
			/**
			 * @description 获取问题的详情
			 * @param {Object} id 问题的id
			 */
			async getQuetionsInfo(id){
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: `${id}/detail`,
						data: {

						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
				
						},
					}
				});
				if(res.data.code===REQUEST_SUCCEEDED_CODE){
					this.questionTitle = res.data.data.title
				}
			},
			/**
			 * @description  获取回答详情
			 * @param {number} id  回答的id
			 */
			async getAnswerInfo(id){
				let res = await request({
					data: {
						method: 'GET',
						group: 'answer',
						action: `${id}/detail`,
						data: {
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
				
						},
					}
				});
				if(res.data.code===REQUEST_SUCCEEDED_CODE){
					this.answerData = res.data.data as AnswerDataItem
					this.isMe = this.answerData.isMe === 1
					if(!this.answerData.isAnonymity){
						this.answerUser = this.answerData.publisher
					}
				}
			},
			/**
			 * @description  获取指定id回答的全部评论
			 * @param {number} id 回答的id
			 * @param {number} 评论的页号
			 * @return {CommentDataItem[]}
			 */
			async getAnswerComments(id: number,page:number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'answer/comment',
						action: `${id}/commentList`,
						data: {
							id: id,
							father_pageSize:10,
							father_startPage:page,
							son_startPage:1,
							son_pageSize:3
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				setTimeout(() => {
					this.isRefresh = false
					this.showBottomLoading=false
				}, 700)
				
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageInfo = res.data.data as PageInfo<CommentDataItem>;
					let commentDatas = pageInfo.list;
					this.haveMoreData = pageInfo.hasNext;
					if (page === 1) {
						this.commentDatas = commentDatas
						this.scrollInto = ''
					} else {
						let allCommentDatas = this.commentDatas.concat(commentDatas)
						this.commentDatas = allCommentDatas
					}
					return commentDatas
				} else {
					return []
				}
			},
		},
	}
</script>

<style lang="scss">
	.answer-info-content{
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
	.question-content{
		width: 94%;
		background-color: #FFFFFF;
		color: #000000;
		font-size: larger;
		font-weight: bold;
		padding: 3%;
	}
	.answer-content {
		padding: 3%;
		margin: 3% 0rpx;
		background-color: white;
	}
	
	.answer-header {
		display: flex;
		flex-direction: row;
		align-items: center;
	
	
	}
	
	.answer-header-avatar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	
		.answer-user-avatar {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background-color: #3bd8bf;
		}
	
		.vip-logo {
			position: absolute;
			height: fit-content;
			width: fit-content;
			bottom: -7rpx;
			right: -7rpx;
		}
	}
	
	.answer-header-name-and-time {
		flex-grow: 1;
		margin-left: 3%;
		font-size: medium;
		display: flex;
		flex-direction: column;
	}
	
	.answer-header-name {
		display: flex;
		align-items: center;
		justify-content: center;
	
		.answer-header-username {
			flex-grow: 1;
			display: flex;
			align-items: center;
			font-size: small;
			text-align: left;
			color: #555555;
		}
	
	}
	
	.answer-header-time {
		display: flex;
		align-items: center;
		justify-content: center;
	
		.creat-time {
			font-size: small;
			color: #cacaca;
			flex-grow: 1;
		}
	
		.vip-logo {}
	
	}
	
	.answer-header-button {
		display: flex;
		align-items: center;
		justify-content: center;
	
		.follow-button {
			background-color: #83dbcd;
			border: 3rpx solid #83dbcd;
			color: #fff;
			margin-right: 2%;
			border-radius: 30rpx;
			font-size: 24rpx;
			padding: 2rpx 0rpx;
			text-align: center;
			width: 100rpx;
			font-weight: bold;
		}
	
		.chat-button {
			margin-right: 2%;
			border-radius: 30rpx;
			background-color: #83dbcd;
			border: 3rpx solid #83dbcd;
			padding: 2rpx 0rpx;
			width: 100rpx;
			display: flex;
			text-align: center;
			align-items: center;
			justify-content: center;
		}
	}
	.answer-body{
		margin-top: 20rpx;
	}
	.answer-tag-content {
		width: 100vw;
		display: flex;
		flex-wrap: wrap;
		.answer-body-tag {
			margin: 2% 0;
			margin-right: 2%;
			background-color: #cffafa;
			width: fit-content;
			color: #296f63;
			padding: 6rpx 15rpx;
			border-radius: 20rpx;
			font-size: small;
		}
	}
	
	
	.answer-body-text {
		margin: 2% 0;
		color: #343434;
	}
	
	.more-text {
		color: #15dceb;
		font-size: medium;
	}
	
	.answer-body-images {
		border-radius: 10rpx;
		overflow: hidden;
		line-height: 0rpx;
	}
	.video-content{
		position: relative;
		.play-icon-content{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50px);
			// transform: translateY(50px);
		}
	}
	.image-item {
		background-color: #cfcfcf;
	}
	.answer-body-image {
		display: inline-block;
		margin-top: 10rpx;
		overflow: hidden;
		border-radius: 10rpx;
		width: 100%;
		max-height: 800rpx;
		.image-item {
			width: 100%;
			min-height: 45vw;
		}
	}
	.answer-footer {
		width: 100%;
		display: flex;
		flex-direction: row;
		color: #7F7F7F;
		letter-spacing: 4rpx;
		margin-top: 4%;
	}
	
	.answer-footer-item {
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
	}
	.answer-footer-agree{
		flex: 1;
		display: flex;
		align-items: center;
		.cancel-button{
			width: fit-content;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #4eccb8;
			border-radius: 40rpx;
			padding: 10rpx 15rpx;
			font-size: small;
			color: #fff;
			.button-text{
				flex: 1;
				margin: 0 10rpx;
			}
		}
	}
	.agree-button-group{
		width: fit-content;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #c4fffe;
		border-radius: 40rpx;
		padding: 10rpx 15rpx;
		font-size: small;
		.agree{
			display: flex;
			justify-content: center;
			align-items: center;
			color: #41ab99;
			.agree-sum{
				flex: 1;
				margin: 0 10rpx;
			}
		}
		.dividing-line{
			height: 35rpx;
			width: 1rpx;
			border-radius: 1rpx;
			background-color:#41ab99 ;
		}
		.oppose{
			display: flex;
			justify-content: center;
			align-items: center;
			color: #41ab99;
			margin: 0 10rpx;
		}
	}
	.share-button{
		background-color: #FFFFFF;
		border: none !important;
		padding: 0px !important;
		border-radius: 0;
		line-height: normal !important;
	}
	
	.chat-image {
		width: 70%;
	}
	.answer-footer-like{
		background-color: #15dceb;
	}
	.is-answer {
		animation: wobble-ver-left 0.8s both;
		
	}
	.loading-content{
		margin-bottom: 150rpx;
	}
	.comment-bottom-content {
		background-color: #d0ebe7;
		position: absolute;
		width: 100%;
		bottom: 0px;
		transition: all 200ms;
	}
	
	.comment-input-content {
		width: 96%;
		margin:2%;
		min-height: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	
		.comment-input {
			flex: 1;
			padding: 10rpx;
			border-radius: 30rpx;
			background-color: #fff;
		}
	
		.send-button-content {
			width: 100rpx;
			padding: 10rpx;
			margin-left: 15rpx;
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
	
		.option-image-content {
			margin-left: 15rpx;
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
	
	/* 点赞动画效果 */
	@keyframes scaleDraw {
		0% {
			transform: scale(1);
			/*开始为原始大小*/
		}
	
		25% {
			transform: scale(1.1);
			/*放大1.1倍*/
		}
	
		50% {
			transform: scale(1);
		}
	
		75% {
			transform: scale(1.1);
		}
	}
	@keyframes wobble-ver-left {
	  0%{
		  
	  }
	 
	  15% {
	            transform: translateY(-15rpx) rotate(-6deg);
	
				
	  }
	  30% {
	            transform: translateY(8rpx) rotate(6deg);
	  }
	  45% {
	            transform: translateY(-8rpx) rotate(-3.6deg);
				
	  }
	  60% {
	            transform: translateY(5rpx) rotate(2.4deg);
	
	  }
	  75% {
	            transform: translateY(-3rpx) rotate(-1.2deg);
	  }
	  100% {
	            transform: translateY(0) rotate(0);
	            transform-origin: 50% 50%;
	  }
	}
</style>
