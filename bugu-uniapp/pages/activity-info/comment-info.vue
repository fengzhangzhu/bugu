<template>
	<view class="page">
		<view class="comment-info-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">评论详情</view>
			</uni-nav-bar>
			<scroll-view
			id="comment-info-scroll"
			scroll-y="true"
			:scroll-into-view="scrollInto" 
			:style="{
			        height: scollerHeight+'px',
			        width: '100%'}"
			@scrolltolower="onScrollToLower()"		>
			<block v-if="commentData.id">
				<comment-item
				:commentType="commentType"
				ref="commentItem"
				:commentData="commentData"
				:authorId="authorId"
				:needRefresh="needRefresh" 
				:needShowAll="true"
				:replyAlign="true"
				:showReplyCount="true"
				@onCommentClick="onCommentClick(commentData)"
				@onCommentMoreClick="onCommentMoreClick(commentData)"
				@onReplyClick="onReplyClick" 
				@onReplyMoreClick="onReplyMoreClick"
				>
				</comment-item>
				</block>
				<view id="reply-newest" class="reply-newest"></view>
			</scroll-view>
			<!-- 下方的输入框 -->
				<view  class="comment-bottom-content">
					<view class="comment-input-content"
					:style="{
						minHieght:'70px'
					}"
					>
						<!-- 输入框 -->
						<!-- <textarea 
						
						class="comment-input" 
						:auto-height="true" 
						:adjust-position="false"
						:show-confirm-bar="false"
						:placeholder="`回复${commentSelected.toUsername}`"
						:focus="inputFocus"
						:value="sendText" 
						@input="onCommentTextareaInput" 
						@focus="onCommentTextareaFocus"
						@blur="onCommentTextareaBlur"
							>
						</textarea> -->
						
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
						<view class="send-button-content" @click="onSendButtonClick()">
							<view class="send-button">
								{{buttonIsLoading?'发送中':'发送'}}
							</view>
						</view>
					</view>
					<view :style="{
					 height:showEmojiPicker?emojiContentHeight + 'px': keyboardHeight + 'px'}">
						
						<uni-transition class="emoji-picker-content" mode-class="slide-bottom" :show="showEmojiPicker">
							<view  :style="{
							 height: showEmojiPicker?emojiContentHeight + 'px': keyboardHeight + 'px'}">
									<emoji v-show="showEmojiPicker" :contentHeight="keyboardHeight" @setEmoj="setEmoj"></emoji>
							</view>
						</uni-transition>
					</view>
				</view>
			
			<!-- 评论操作弹出层 -->
			<action-sheet ref="commentActionPopup" :needHead="true" title="评论选择" :needCancelButton="true">
				<block v-if="commentMoreSelected.fromUserId">
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
				</block>
			</action-sheet>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		UserInfo
	} from "@/common/dataClass";
	import {CommentDataItem} from "@/common/dataClass";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {
		ReplyComments,
		DeleteComments,
		DeleteReply,
	} from "@/common/requestFunctions";
	import {
		ReplyAnswerComments,
		deleteAnswerCommentReply,
		deleteAnswerComment,
		likeAnwserComment
	} from '@/services/answerServices';
	import {reportObjectType} from "@/common/constants"
	
	  // @FileDescription: 评论详情页
	  // @Author: 穆兰
	  // @Date: 2022/1/5
	  // @LastEditors: 穆兰
	  // @LastEditTime: 2022/1/7
	 
	export default {
		data() {
			return {
				commentType:'activity',
				myUserInfo:{},
				scrollInto:'',//滚动到指定位置
				commentData:{},//评论的数据
				authorId:-1,//动态作者的id
				needRefresh:false,//是否需要刷新
				commentSelected:{},//选择的评论或回复
				commentMoreSelected:{},//点击更多按钮选择的评论或回复
				buttonIsLoading:false,//发送按钮是否处于等待状态
				sendText:'',//发送的文字
				showEmojiPicker:false,//是否显示表情选择框
				inputFocus:false,//是否聚焦
				myId:0,//我的id
				keyboardHeight: 0, //键盘的高度
				emojiContentHeight:300,//表情选择容器的高度
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
					
			let titleH=uni.createSelectorQuery().select("#comment-info-scroll"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params){
			uni.onKeyboardHeightChange(async res => {
				if (res.height != 0) {
					this.keyboardHeight = res.height
					this.emojiContentHeight = res.height
					this.showEmojiPicker = false
				} else {
						this.keyboardHeight = 0
				}
			})
			let commentDataStr = params.commentData
			this.authorId = Number(params.authorId)
			let commentType =params.commentType
			if(commentType){
				this.commentType=commentType
			}
			if (commentDataStr) {
				this.commentData = JSON.parse(commentDataStr) as CommentDataItem
				let userInfo = await getMyUserInfo() as UserInfo
				this.myId = userInfo.id
				this.myUserInfo = userInfo
				this.commentSelected = {
					commentId: this.commentData.id,
					toUsername: this.commentData.publisher.username,
					toUserId:0,
				}
				
			}
		},
		computed:{
			placeholder(){
				
				return this.commentSelected.toUsername?`回复${this.commentSelected.toUsername}`:''
			},
			scollerHeight(){
				return this.contentHeight - this.navHeight
			}
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
				this.inputFocus = false
			},
			/**
			 *@description 点击输入框旁的emoji图标 
			 */
			onEmojiIconClick() {
				this.showEmojiPicker = !this.showEmojiPicker
			},
			/**
			 * @description 滑到最底部时
			 */
			onScrollToLower(){
				this.$refs.commentItem.getMoreReplys()
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
				this.needRefresh=false
				this.buttonIsLoading=true
				this.scrollInto =''
				let res  = {}
				if(this.commentType==='index'){
					res = await ReplyComments(this.commentSelected.commentId,this.sendText,0,this.commentSelected.toUserId)
				}else if(this.commentType==='answer'){
					res = await ReplyAnswerComments(this.commentSelected.commentId,this.sendText,0,this.commentSelected.toUserId)
				}
				
				this.buttonIsLoading = false
				this.showEmojiPicker = false
				if(res!=-1){
					let myDate = new Date();
					this.$refs.commentItem.addReplyItem({
						content: this.sendText,
						fromUserId: this.myUserInfo.id,
						fromUsername:  this.myUserInfo.username,
						id: res,
						isDeleted: 0,
						toUserId: this.commentSelected.toUserId,
						toUsername:this.commentSelected.toUsername,
						type: 0,
						fromUserAvatar: this.myUserInfo.avatar
					})
					this.sendText = ''
					setTimeout(()=>{
						this.scrollInto = "reply-newest"
					},1000)
					
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
			 * @description 点击单个评论主体
			 * @param {CommentDataItem} item 
			 */
			onCommentClick(item) {
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
			onReplyClick(item, replyItem) {
				this.inputFocus = true
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
							_this.needRefresh=false
							if(item.isReply){
								if(_this.commentType==='index'){
									deleteRes = await DeleteReply(item.replyId)
								}else if(_this.commentType==='answer'){
									deleteRes = await deleteAnswerCommentReply(_this.commentData.id,item.replyId)
								}
								if(deleteRes){
									_this.$refs.commentItem.deleteReplyItem(item.replyId)
								}
							}else{
								if(_this.commentType==='index'){
									deleteRes = await DeleteComments(item.commentId)
								}else if(_this.commentType==='answer'){
									deleteRes = await deleteAnswerComment(item.commentId)
								}
								if(deleteRes){
									_this.commentData.isDeleted = true
								}
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
			
		}
	}
</script>

<style lang="scss">
	.comment-info-content{
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
	.comment-is-deleted{
		height: 83vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: large;
		color: #6D6D6D;
	}
	.reply-newest{
		height: 150rpx;
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
		margin: 2%;
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
</style>
