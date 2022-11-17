
<template>
	<view :id="`comment_${commentData.id}`" class="comment-content">
		<view @click.stop="onClick()" class="comment-item-content">
			<!-- 头像 -->
			<view class='comment-avatar'>
				<image mode='aspectFill' class='avatar' :src="avatar">
				</image>
			</view>
			<!-- 评论主体 -->
			<view class="comment-info">
				<view class="user-name-option">
					<!-- 用户名 -->
					<view class='username'>
						{{username}}
						<view v-if="!commentData.publisher" class='lead-label'>
							<text class='label-text'>作者</text>
						</view>
					</view>
					
					<!-- 更多按钮 -->
					<view v-if="commentData.isDeleted==0" class='iconfont icon-ellipsis right-edit-item'
						@click.stop="onMoreClick()" :style="{
						fontSize: '25px',
						color: '#cacaca'
					}"></view>
				</view>
				<!-- 评论的内容 -->
				<view class='comment-text'>
					<text v-if="commentData.isDeleted==1" :style="{
					color:'#cecece'}">评论已删除</text>
					<text v-else>
						{{commentText}}
					</text>
				</view>
				<!-- 评论的底部 -->
				<view class='comment-footer'>
					<view class='creat_time'>
						{{publishTime}}
					</view>
					<!-- 其他操作按钮 -->
					<view v-if="commentData.isDeleted==0" class="comment-operation-options-content">
						<!-- 回复按钮 -->
						<view  class='comment-operation-options-item'>
							<view class="iconfont icon-pinglun" />
						</view>
						<!-- 喜欢按钮 -->
						<view  class='comment-operation-options-item' @click.stop="onLikeButtonClick()">
							<view v-if="isLiked" class='iconfont icon-dianzan1'
							:style="{
								color:'#83dbcd'
							}"
							/>
							<view v-else class='iconfont icon-dianzan' />
							<view class="like-sum">{{likeSum}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="reply-content"
		:style="{
			paddingLeft:replyAlign?'0rpx':'90rpx',
			borderTop: showReplyCount?'2px solid #F5F5F5':'none'
		}"
		>
			<!-- 回复数统计 -->
			<view  v-if="showReplyCount" class='reply-count'>回复 {{replyCommentDatas.length}}</view>
			<!-- 评论下的回复 -->
			<view class="comment-comment">
				<reply-item 
				v-for="(item,index) in replyCommentDatas" 
				:replyCommentData="item"
				:isAuthor="authorId == item.fromUserId" :isLead="publisherId == item.fromUserId"
				:key="item.id" @onClick="onReplyClick(item,index)" @onMoreClick="onReplyMoreClick(item,index)">
				</reply-item>
			</view>
			<!-- 查看全部的按钮 -->
			<view v-if="!showAll"
			class="view-all-button"
			>
				<view @click.stop="onShowAllClick">
					查看全部{{replySum}}条回复
				</view>
				<uni-icons customPrefix="customicons" type="right" color="#808080" size="15" />
			</view>
			<view v-if="needShowAll" class='loading-content'>
				<uni-load-more
				:status="havaMoreData?showBottomLoading?'loading':'more':'noMore'" 
				:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多数据了'}"
				iconType="circle"
				></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import textFilter from '@/utils/textFilter';
	import {
		ReplyCommentDataItem,
		RequestResult
	} from '@/common/dataClass';
	import {
		REQUEST_SUCCEEDED_CODE,
		AnonymousAvatar,
		avatar_pic_hendle
	} from '@/common/constants'
	import {
		request
	} from '@/utils/request'
	import {
		GettimeifferenceOfNow
	} from "@/utils/dateUtils"
	import {
		likeAnwserComment,
		cancelLikeAnwserComment
	} from '@/services/answerServices'
	/**
	 * commentItem 评论组件
	 * @description: 单个评论组件
     * @Author: 穆兰
     * @Date: 2022/1/4
     * @LastEditors: 穆兰
     * @LastEditTime: 2022/1/7
	 * @property {String} commentType - 评论的类型 activity-动态，answer-回答，goods-商品
	 * @property {Object} commentData - 评论的数据
	 * @property {Array} replyData - 回复的数据
	 * @property {Boolean} needRefresh - 是否需要刷新
	 * @property {Number} authorId - 评论所属动态作者的Id
	 * @property {Boolean} needShowAll - 是否需要展示全部回复
	 * @property {Boolean} replyAlign - 回复是否与评论对齐
	 * @property {Boolean} showReplyCount - 是否显示回复计数
	 * @event {Function} onCommentClick - 点击评论主体
	 * @event {Function} onCommentMoreClick - 点击评论的更多按钮
	 * @event {Function} onReplyClick - 点击评论下的某个回复
	 * @event {Function} onReplyMoreClick - 点击评论下的某个回复的更多按钮
	 * @event {Function} onShowAllClick - 点击显示更多按钮时
	 */
	export default {
		name: "comment-item",
		props: {
			commentType:{
				type:String,
				default: 'activity'
			},
			commentData: {
				type: Object,
				required: true
			},
			replyData:{
				type:Array,
				default:[]
			},
			needRefresh: {
				type: Boolean,
				default: false
			},
			authorId: {
				type: Number,
				default: 0
			},
			needShowAll: {
				type: Boolean,
				default: false
			},
			replyAlign:{
				type:Boolean,
				default: false
			},
			showReplyCount:{
				type:Boolean,
				default: false
			}
		},
		watch: {
			needRefresh(newVal) {
				console.log("needRefresh",newVal)
				if (newVal) {
					this.refreshReply()
				}

			}
		},
		computed:{
			publishTime(){
				return GettimeifferenceOfNow(this.commentData.createTime).DistanceNow
			},
			avatar(){
				if(this.commentData.publisher&&this.commentData.publisher.id){
					return this.commentData.publisher.avatar+avatar_pic_hendle
				}else{
					return AnonymousAvatar
				}
			},
			username(){
				if(this.commentData.publisher&&this.commentData.publisher.id){
					return this.commentData.publisher.username
				}else{
					return '某只小布咕'
				}
			},
			commentText(){
				return textFilter(this.commentData.content)
			},
			publisherId(){
				return this.commentData.publisher?this.commentData.publisher.id:0
			},
		},
		data() {
			return {
				replyCommentDatas: [] as ReplyCommentDataItem[],
				likeSum: 0,
				isLiked: false,
				showAll: true,
				replySum:0,
				page:1,
				havaMoreData:true,
				showBottomLoading:false
			};
		},
		async created(){
			console.log("this.commentData",this.commentData);
			this.isLiked = this.commentData.isLiked || this.commentData.isLike
			this.likeSum = this.commentData.likeSum
			this.replySum = this.commentData.responseSum
			if(this.needShowAll){
				this.showBottomLoading=true
				this.replyCommentDatas = await this.getCommentReply(this.commentData.id,this.page)
				this.showBottomLoading=false
			}else{
				this.replyCommentDatas=this.replyData
				if(this.replySum>3){
					this.showAll = false
				}else{
					this.showAll = true
				}
			}
		},
		methods: {
			/**
			 * @description 点击主体
			 */
			onClick() {
				this.$emit('onCommentClick')
			},
			/**
			 * @description 点击更多按钮
			 */
			onMoreClick() {
				this.$emit('onCommentMoreClick')
			},
			/**
			 * @description 点击回复的主体
			 * @param {Object} item
			 * @param {Object} index
			 */
			onReplyClick(item, index) {
				this.$emit('onReplyClick',this.commentData, item, index)
			},
			/**
			 * @description 点击回复的更多按钮
			 * @param {Object} item
			 * @param {Object} index
			 */
			async onReplyMoreClick(item, index) {
				
				await this.$emit('onReplyMoreClick',this.commentData, item, index)
				
			},
			/**
			 * @description 点击展示全部的按钮
			 */
			onShowAllClick() {
				this.$emit("onShowAllClick",this.isLiked)
			},
			/**
			 * @description 获取更多回复
			 */
			async getMoreReplys(){
				if(this.havaMoreData){
					this.showBottomLoading=true
					this.page = this.page + 1
					let newDatas = await this.getCommentReply(this.commentData.id,this.page)
					if(newDatas.length>0){
						this.replyCommentDatas = this.replyCommentDatas.concat(newDatas)
					}else{
						this.havaMoreData=false
					}
					this.showBottomLoading=false
				}
			},
			/**
			 * @description 增加一个回复用于用户回复时
			 * @param {ReplyCommentDataItem} replyItem
			 */
			addReplyItem(replyItem:ReplyCommentDataItem){
				this.replyCommentDatas.push(replyItem)
			},
			/**
			 * @description 将指定id的回复设为删除状态 用于用户删除时
			 * @param {number} replyId
			 */
			deleteReplyItem(replyId:number){
				let replyCommentDatas= this.replyCommentDatas
				for(let i=0;i<replyCommentDatas.length;i++){
					if(replyCommentDatas[i].id==replyId){
						replyCommentDatas[i].isDeleted=1
						break
					}
				}
				this.replyCommentDatas=replyCommentDatas
			},
			/**
			 * @description 点击喜欢按钮
			 */
			async onLikeButtonClick() {
				if (!this.isLiked ) {
					this.likeSum = this.likeSum + 1
					this.isLiked = true
					let res = await this.likeThisComment(this.commentData.id)
					if (!res) {
						this.likeSum = this.likeSum - 1
						this.isLiked = false
					}
				} else {
					this.likeSum = this.likeSum - 1
					this.isLiked = false
					let res = await this.CancelikeThisComment(this.commentData.id)
					if (!res) {
						this.likeSum = this.likeSum + 1
						this.isLiked = true
					}
				}
			},
			/**
			 * @description 刷新评论下的回复
			 */
			async refreshReply() {
				this.page=1
				this.havaMoreData=true
				let replyCommentDatas = await this.getCommentReply(this.commentData.id,this.page)
				this.replySum = replyCommentDatas.length
				if (this.replySum <= 3 || this.needShowAll) {
					this.showAll = true
					this.replyCommentDatas = replyCommentDatas
				} else {
					this.showAll = false
					this.replyCommentDatas = replyCommentDatas.splice(0, 3)
				}
			},
			/**
			 * @description 给这个评论点赞
			 * @param {Number} Id 评论的id 
			 */
			async likeThisComment(id: number) {
				let res:any = {} 
				if(this.commentType==='activity'){
					res = await request({
						data: {
							method: 'PUT',
							group: 'activity/comment',
							action: `${id}/like`,
							data: {
								id: id
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						return true
					} else {
						return false
					}
				}else if(this.commentType==='answer'){
					return await likeAnwserComment(id)		
				}
				
			},
			/**
			 * @description 取消这条评论的点赞
			 * @param {Number} Id 评论的id 
			 * @return {ReplyCommentDataItem[]}
			 */
			async CancelikeThisComment(id: number) {
				let res = {} 
				if(this.commentType==='activity'){
					let res = await request({
						data: {
							method: 'DELETE',
							group: 'activity/comment',
							action: `${id}/like/remove`,
							data: {
								id: id
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						console.log(res.data)
						return true
					} else {
						console.log(res)
						return false
					}
				}else if(this.commentType==='answer'){
					return await cancelLikeAnwserComment(id);
				}
				
			},
			/**
			 * @description  获取这条评论的回复
			 * @param {Number} Id 评论的id 
			 * @param {Number} page 回复的页号 
			 */
			async getCommentReply(id: number,page:number) {
				if(this.commentType==='activity'){
					let res = await request({
						data: {
							method: 'GET',
							group: 'activity/comment',
							action: `${id}/responseList`,
							data: {
								id: id,
								pageSize:10,
								startPage:page
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
					
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						return res.data.data as ReplyCommentDataItem[]
					} else {
						return []
					}
				}else if(this.commentType==='answer'){
					
					let res = await request({
						data: {
							method: 'GET',
							group: 'answer/comment',
							action: `comment/${id}/responseList`,
							data: {
								id,
								pageSize:10,
								startPage:page
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
					console.log("getCommentReply",res.data)
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						return res.data.data as ReplyCommentDataItem[]
					} else {
						return []
					}
				}
				
			},

		}
	}
</script>

<style lang="scss">
	.comment-content{
		width: 94%;
		margin: 2rpx 0;
		padding: 3% 3%;
		background-color: #fff;
	}
	.comment-item-content {
		width: 100%;
		height: fit-content;
		display: flex;
		
	}
	.comment-avatar{
		.avatar{
			height: 60rpx;
			width: 60rpx;
			border-radius: 30rpx;
		}
	}
	.comment-info {
		flex-grow: 1;
		margin-left: 20rpx;
		.user-name-option {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.username {
				margin-top: 10rpx;
				flex-grow: 1;
				font-size: small;
				display: flex;
				color: #393939;
			}
		}
		.comment-text{
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #595959;
		}
		.comment-footer {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-right: 20rpx;
			margin-bottom: 10rpx;
			.creat_time {
				flex-grow: 1;
				color: #A0A0A0;
				font-size: smaller;
				letter-spacing: 1rpx;
				font-size: smaller;
			}
			.comment-operation-options-content{
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
				
				.comment-operation-options-item{
					display: flex;
					text-align: center;
					align-items: center;
					justify-content: center;
					margin-left: 40rpx;
					color: #989898;
					.iconfont{
						font-size: 40rpx;
					}
					.like-sum{
						margin-left: 10rpx;
					}
				}
			}
			
		}
	}
	.reply-content{
		background-color: #FFFFFF;
		padding-left: 90rpx;
		 .reply-count{
		        margin:20rpx;
		        padding-top: 10rpx;
		        font-size: small;
		        font-weight: bold;
		        color: #696969;
		    }
	}
	
	.lead-label{
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    text-align: center;
	    margin-left: 10rpx;
	
	    .label-text{
	        padding: 4rpx 8rpx;
	        font-size:20rpx;
	        color: #ffffff;
	        border-radius: 10rpx;
	        height: fit-content;
	        width: fit-content;
	        background-color: #4eccb8;
	    }
	}
	.view-all-button{
		width: fit-content;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 20rpx;
		font-size: 25rpx;
		background-color: #F5F5F5;
		border-radius: 30rpx;
	}
</style>
