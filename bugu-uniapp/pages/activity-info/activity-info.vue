<!--
 * @FileDescription: 动态详情页
 * @Author: 穆兰
 * @Date: 2022/1/5
 * @LastEditors: 穆兰
 * @LastEditTime: 2022/1/7
 -->
<template>
	<view class="page">
		<view class="activity-info-content">
			<!-- 标题栏 -->
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">动态详情</view>
			</uni-nav-bar>
			<!-- 主体 -->
			<scroll-view
			class="activity-info-scroll"
			scroll-y="true" 
			refresher-enabled :refresher-triggered="isRefresh"
			@refresherrefresh="onRefresh()" 
			@scrolltolower="onScrollToLower()"
			:scroll-into-view="scrollInto" 
			:style="{
				height: scollerHeight+'px',
				width: '100%',
			  }">
				
				<!-- 如果动态被删除 -->
				<view v-if="isDelete" :style="{
					  marginTop: '45%',
					  width: '100%',
					  textAlign: 'center',
					  color: '#c4c4c4',
					  fontSize: '20px'
					}">
					该动态已被删除
				</view>
				<block v-else>
					<view v-if="article.id">
						<!-- 动态主体 -->
						<activity-item 
						:isMe="isMe" 
						:needShowAll="true"
						 :articleItem="article"
							@onFollowClick="onFollow(article)" 
							@onMoreClick="onActivityPopupMoreClick(article)"
							@onClick="onActivityItemClick()"/>
						<!-- 评论 -->
						<comment-item 
						v-for="(item,index) in commentDatas" 
						:commentData="item.father" 
						:replyData="item.sons"
						:key="item.father.id"
						:authorId="article.isAnonymity?0:article.publisher.id"
						:needRefresh="refreshCommentId == item.father.id" 
						@onCommentClick="onCommentClick(item.father)"
						@onShowAllClick="onShowAllClick(item.father)" 
						@onCommentMoreClick="onCommentMoreClick(item.father)"
						@onReplyClick="onReplyClick" 
						@onReplyMoreClick="onReplyMoreClick"/>
						<view id="comment-item-newest"></view>
						<view class='loading-content'>
							<uni-load-more
							:status="haveMoreData?showBottomLoading?'loading':'more':'noMore'" 
							:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: haveMoreData==false&&commentDatas.length<=0?'还没有评论，快来抢沙发吧~':'没有更多评论了'}"
							iconType="circle"
							/>
						</view>
					</view>
					<view v-else>
						<activity-skeleton/>
					</view>
				</block>
			</scroll-view>
			<!-- 下方的输入框 -->
			<view class="comment-bottom-content">
				<view class="comment-input-content">
					
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
				<view :style="{
				 height:showEmojiPicker?emojiContentHeight + 'px': keyboardHeight + 'px'}">
					<uni-transition class="emoji-picker-content" mode-class="slide-bottom" :show="showEmojiPicker">
					<view>
							<emoji v-show="showEmojiPicker" :contentHeight="emojiContentHeight" @setEmoj="setEmoj"></emoji>
					</view>
					</uni-transition>
				</view>
				
			</view>
		</view>
		<!-- 评论操作弹出层 -->
		<action-sheet ref="commentActionPopup" :needHead="true" title="评论选择" :needCancelButton="true">
			<view v-if="commentMoreSelected.fromUserId">
				<block v-if="myId == commentMoreSelected.fromUserId">
					<action-sheet-item @click="onCommentPopupDeleteClick(commentMoreSelected)" icon="icon-delete" title="删除" />
				</block>
				<block v-else>
					<action-sheet-item @click="onCommentPopupReportClick(commentMoreSelected)" icon="icon-alert" title="举报" />
					<action-sheet-item  v-if="article.publisher&&article.publisher.id == myId" 
					icon="icon-delete"
					title="删除" 
					@click="onCommentPopupDeleteClick(commentMoreSelected)"
					/>
				</block>
			</view>
		</action-sheet>
		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<view v-if="article.id">
				<block v-if="article.isAnonymity">
					<action-sheet-item @click="onActivityPopupReportClick(article)" icon="icon-alert" title="举报" />
				</block>
				<block v-else>
					<block v-if="article.publisher.id == myId">
						<action-sheet-item icon="icon-delete" title="删除" @click="onActivityPopupDeleteClick" />
					</block>
					<block v-else>
						<action-sheet-item v-if="article.publisher.isAttention == 1" icon="icon-quxiaoguanzhu"
							title="取消关注" @click="onCancelFollow(article)" />
						<action-sheet-item v-else icon="icon-guanzhu" title="关注" @click="onFollow(article)" />
						<action-sheet-item icon="icon-message" title="私聊" />
						<action-sheet-item @click="onActivityPopupReportClick(article)" icon="icon-alert" title="举报" />
					</block>
				</block>
			</view>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		CommentDataItem,
		UserInfo,
		ArticleItem,
		PageInfo
	} from "@/common/dataClass";
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {
		getTime
	} from "@/utils/dateUtils";
	
	import {
		deleteMyArticle,
		cancelAttention,
		followUser,
		commentActivity,
		ReplyComments,
		DeleteComments,
		DeleteReply,
	} from "@/common/requestFunctions";
	interface CommentMoreSelected{
		commentId:number,
		replyId:number,
		fromUserId: number,
		isReply: boolean, //是否为评论下的回复
	}
	interface CommentSelected{
		toUsername: string,
		toUserId:number,
		commentId: number
	}
	export default {
		data() {
			return {
				isDelete: false, //动态是否删除
				article: {}, //动态对象
				myId: 0, //我的id
				myUserInfo:{},
				isMe: false, //是否为本人的动态
				commentDatas: [] as CommentDataItem[], //所有评论信息
				page:1,
				haveMoreData:true,
				showBottomLoading:false,//是否处于加载状态
				refreshCommentId: 0, //需要刷新的回复id
				isRefresh: false, //是否下拉刷新
				scrollInto: '', //指定滑动到的id
				isReplyComment: false, //是否回复评论
				inputFocus: false, //input聚焦
				sendText: '', //评论或者回复放入内容
				buttonIsLoading: false, //是否正在发送中
				keyboardHeight: 0, //键盘的高度
				emojiContentHeight:300,//表情选择框的高度
				showEmojiPicker: false, //是否显示表情选择框
				commentSelected: {} as CommentSelected, //选中的评论或回复-用户评论操作
				commentMoreSelected: {} as CommentMoreSelected, //选择的评论或回复-用于更多操作
				contentHeight:0,
				navHeight:0,
				isIOS:false
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
					_this.isIOS = res.system.indexOf('iOS')!=-1
				}
			})
					
			let titleH=uni.createSelectorQuery().select(".activity-info-scroll"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params) {
			uni.onKeyboardHeightChange(async res => {
				if (res.height != 0) {
					this.keyboardHeight = res.height
					this.emojiContentHeight = res.height
					this.showEmojiPicker = false
				} else {
						this.keyboardHeight = 0
				}
			})
			let activityId = params.activityId as number
			this.showBottomLoading = true
			await this.getArticleInfo(activityId)
			if (this.article.publisher) {
				let userInfo = await getMyUserInfo() as UserInfo
				this.myId = userInfo.id
				this.myUserInfo = userInfo
				this.isMe = this.article.publisher.id == userInfo.id
			}
			this.commentDatas = await this.getActivtyComments(activityId,this.page)
			if(this.commentDatas.length<=0){
				this.haveMoreData=false
			}
			this.showBottomLoading = false
		},
		computed:{
			placeholder(){
				
				return this.isReplyComment?`回复${this.commentSelected.toUsername}`:'回复作者'
			},
			scollerHeight(){
				return this.contentHeight - this.navHeight
			}
		},
		
		//#ifdef MP-WEIXIN
		/**
		 * @description 分享
		 */
		onShareAppMessage() {
			let imageUrl =''
			if(this.article.pic.length>0){
				if(this.article.video==1){
					imageUrl=this.article.pic[0]+'?vframe/jpg/offset/0'
				}else{
					imageUrl=this.article.pic[0]
				}
			}
			let username = ''
			if(this.article.isAnonymity==1){
				username="匿名用户"
			}else{
				if(this.article.publisher){
					username = this.article.publisher.username
				}
			}
		    return {
		      title:`${username}发布了一条动态，快来看看ta说了什么` ,
		      path: `/pages/activity-info/activity-info?activityId=${this.article.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl
		    };
		},
		onShareTimeline() {
			let imageUrl =''
			if(this.article.pic.length>0){
				if(this.article.video==1){
					imageUrl=this.article.pic[0]+'?vframe/jpg/offset/0'
				}else{
					imageUrl=this.article.pic[0]
				}
			}
			let username = ''
			if(this.article.isAnonymity==1){
				username="匿名用户"
			}else{
				if(this.article.publisher){
					username = this.article.publisher.username
				}
			}
		    return {
		      title:`${username}发布了一条动态，快来看看ta说了什么` ,
		      path: `/pages/activity-info/activity-info?activityId=${this.article.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl
		    };
		},
		//#endif
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
			 *@description 点击动态的主体
			 */
			onActivityItemClick() {

				if(this.inputFocus){
					this.inputFocus=false
				}else{
					this.inputFocus = true
				}
				this.isReplyComment = false
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
				if (this.sendText.length <= 0) {
				return
				}
				if (this.buttonIsLoading) {
					return
				}
				this.refreshCommentId = 0
				this.buttonIsLoading=true
				this.scrollInto =''
				let res = false
				//评论动态或者回复他人的评论
				if (this.isReplyComment) {
					res = await ReplyComments(this.commentSelected.commentId,
					this.sendText,0,this.commentSelected.toUserId)
				} else {
					res = await  commentActivity(this.article.id,this.sendText, 0)
				}
				this.buttonIsLoading=false
				this.showEmojiPicker = false
				if(res!==-1){
					if(this.isReplyComment){
						this.refreshCommentId = this.commentSelected.commentId
					}else{
						this.scrollInto = `comment-item-newest`
						let myDate = new Date();
						this.commentDatas.push({
							father:{
								content: this.sendText,
								createTime: getTime(),
								id:res,
								isDeleted: 0,
								likeSum: 0,
								isLiked: 0,
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
				this.isRefresh = true
				let activityId = this.article.id
				await this.getArticleInfo(activityId)
				this.page=1
				this.haveMoreData=true
				this.commentDatas = await this.getActivtyComments(activityId,this.page)
				setTimeout(() => {
					this.isRefresh = false
				}, 700)
			},
			/**
			 * @description 上拉时
			 */
			async onScrollToLower(){
				if(this.haveMoreData){
					this.showBottomLoading = true
					let activityId = this.article.id
					this.page=this.page+1
					let newDatas = await this.getActivtyComments(activityId,this.page)
					if(newDatas.length>0){
						this.commentDatas = this.commentDatas.concat(newDatas)
					}else{
						this.haveMoreData=false
					}
					this.showBottomLoading =false
				}
			},
			/**
			 * @description 点击动态上的更多按钮
			 */
			onActivityPopupMoreClick() {
				this.$refs.articleActionPopup.open()
			},
			/**
			 * @description 点击popup的举报按钮
			 * @param {ArticleItem} item
			 */
			onActivityPopupReportClick(item: ArticleItem){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.articleActionPopup.close()
			},
			/**
			 * @description 点击动态popup的删除按钮
			 */
			onActivityPopupDeleteClick() {
				let _this = this
				uni.showModal({
					title: '删除动态',
					content: '你确定要删除这个动态吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteMyArticle(_this.article.id)) {
								_this.isDelete = true
								_this.$refs.articleActionPopup.close()
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
			 * @description 点击popup的举报按钮
			 * @param {CommentMoreSelected} item
			 */
			onCommentPopupReportClick(item){
				if(item.isReply){
					uni.navigateTo({
						url:`/pages/setting/report-user/report-user?objectId=${item.replyId}&objectType=${reportObjectType.commentResponse}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/setting/report-user/report-user?objectId=${item.commentId}&objectType=${reportObjectType.comment}`
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
								deleteRes = await DeleteReply(item.replyId)
								if(deleteRes){
									_this.refreshCommentId=item.commentId
								}
							}else{
								deleteRes = await DeleteComments(item.commentId)
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
			 * @description 点击popup/activity-item的取消关注按钮
			 * @param item 
			 */
			async onCancelFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				uni.showModal({
					title: '取消关注',
					content: `你确定要取消关注${item.publisher.username}`,
					success: async function(res) {
						if (res.confirm) {
							if (item.publisher)
								if (await cancelAttention(item.publisher.id)) {
									_this.article.publisher.isAttention = 0
									_this.$refs.articleActionPopup.close()
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
			 * @description 点击popup/activity-item的关注按钮
			 *  @param item 
			 */
			async onFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				if (await followUser(item.publisher.id)) {
					_this.article.publisher.isAttention = 1
					_this.$refs.articleActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}


			},
			/**
			 * @description 点击单个评论主体
			 * @param {CommentDataItem} item 
			 */
			onCommentClick(item) {
				this.isReplyComment = true
				this.inputFocus = true
				this.commentSelected = {
					toUsername: item.publisher.username,
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
					fromUserId: item.publisher.id,
					isReply: false, //是否为评论下的回复
				}
				this.$refs.commentActionPopup.open()
			},
			/**
			 * @description 点击展示全部的文字
			 * @param {Object} item
			 */
			onShowAllClick(item) {
				uni.navigateTo({
					url: `/pages/activity-info/comment-info?commentData=${JSON.stringify(item)}&authorId=${this.article.publisher ? this.article.publisher.id : 0}`
				})
			},
			/**
			 * @description  点击评论的某个回复
			 * @param {Object} item 单个评论
			 * @param {Object} replyItem 单个回复
			 * @param {Object} index
			 */
			onReplyClick(item, replyItem, index) {
				this.inputFocus = true
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
					fromUserId: replyItem.fromUserId,
					isReply: true, //是否为评论下的回复
				}
				this.$refs.commentActionPopup.open()
			},
			/**
			 * @description 通过id获取动态的详细信息
			 * @param {number} id   
			 */
			async getArticleInfo(id: number) {
				uni.showLoading({
					title: '加载中'
				})
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: `${id}/info`,
						data: {
							id: id
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				uni.hideLoading()
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.article = res.data.data as ArticleItem
				} else if (res.data.code === "A0201") {
					this.isDelete = true
				}
			},
			/**
			 * @description  获取指定id动态的全部评论
			 * @param {number} id 动态的id
			 * @param {number} 评论的页号
			 * @return {CommentDataItem[]}
			 */
			async getActivtyComments(id: number,page:number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: `${id}/commentList`,
						data: {
							id: id,
							father_pageSize:10,
							father_startPage:page,
							son_pageSize:3,
							son_startPage:1
							
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				setTimeout(() => {
					this.isRefresh = false
				}, 700)
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageInfo = res.data.data as PageInfo<CommentDataItem>;
					let commentDates = pageInfo.list;
					this.haveMoreData = pageInfo.hasNext;
					
					return commentDates
				} else {
					return []
				}
			},
		}
	}
</script>

<style lang="scss">
	.activity-info-content {
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.artice-action-conetnt {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.artice-action-icon {
		display: flex;
		width: 60px;
		margin-right: 20px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.artice-action-text {
		flex-grow: 1;
		text-align: left;
		color: #353535;
		font-size: '23px';
	}

	.artice-action-cancel {
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 2%;
		width: 90%;
		padding-top: 20px;
		padding-bottom: 20px;
		background-color: #f1f1f1;
		border-radius: 50px;
		text-align: center;
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
		z-index: 100;
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
			position: relative;
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

</style>
