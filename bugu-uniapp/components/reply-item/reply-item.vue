
<template>
	<view :id="`reply_${replyCommentData.id}`">
		<view class="reply-comment-item-content" 
		@click.stop="onClick()">
			<!-- 头像 -->
			<view class='reply-comment-avatar'>
				<image :style="{
					width: '25px',
					height: '25px',
					borderRadius: '12.5px'
				}" :src="avatar" mode='aspectFill'></image>
			</view>
			<!-- 评论主体 -->
			<view class='reply-comment-info'>
				<view class='reply-user-name-option'>
					<view class='reply-username'>
						<view class='reply-username-text-content'>
							<text class='reply-username-text'> 
							{{username}}</text>
						</view>
						<!-- 身份标 -->
						<view v-if="isAuthor" class='lead-label'>
							<text class='label-text'>作者</text>
						</view>
						<view v-else-if="isLead" class='lead-label'>
							<text class='label-text'>层主</text>
						</view>
						
					
					</view>
					<!-- 更多按钮 -->
					<view v-if="replyCommentData.isDeleted!=1" class='iconfont icon-ellipsis right-edit-item' :style="{
						fontSize: '25px',
						color: '#cacaca'
					}" @click.stop="onMoreClick()">
					</view>
				</view>
				<!-- 评论的文字内容 -->
				<view class='reply-comment-text'>
					<text v-if="replyCommentData.isDeleted==1" :style="{
		                            color:'#a7a7a7'
		                        }">评论已删除</text>
					<text v-else>
						<text v-if="replyCommentData.toUserId != 0">
							回复@<text style="color: #33a68f;">
								{{replyCommentData.toUserId==-1?'某只小布咕':replyCommentData.toUsername}}
							</text>:
						</text>{{replyText}}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		AnonymousAvatar,
		avatar_pic_hendle
	} from '@/common/constants';
	import textFilter from '@/utils/textFilter';
	/**
	 * replyItem 评论的回复组件
	 * @description: 单个回复组件
	 * @Author: 穆兰
	 * @Date: 2022/1/5
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {Object} [replyCommentData] - 回复的数据
	 * @property {Boolean} [isAuthor] - 是否为动态的作者
	 * @property {Boolean} [isLead] - 是是否为评论的作者
	 * @event {Function} onClick - 点击回复主体
	 * @event {Function} onMoreClick - 点击更多按钮
	 */
	export default {
		name: "reply-item",
		props: {
			replyCommentData: {
				type: Object,
				required: true
			},
			isAuthor: {
				type: Boolean,
				default: false
			},
			isLead: {
				type: Boolean,
				default: false
			},
			commentType:{
				type:String,
				default: 'activity'
			},
		},
		data() {
			return {

			};
		},
		computed:{
			replyText(){
				return  textFilter(this.replyCommentData.content)
			},
			avatar(){
				
				return this.replyCommentData.fromUserAvatar?this.replyCommentData.fromUserAvatar+avatar_pic_hendle:AnonymousAvatar
			},
			username(){
				return this.replyCommentData.fromUsername?this.replyCommentData.fromUsername:'某只小布咕'
			}
		},
		methods: {
			/**
			 * @description  点击回复主体
			 */
			onClick() {
				if(this.replyCommentData.isDeleted!=1){
					this.$emit("onClick")
				}
				
			},
			/**
			 *@description 点击更多按钮 
			 */
			onMoreClick() {
				this.$emit("onMoreClick")
			}
		}
	}
</script>

<style lang="scss">
	.reply-comment-item-content {
		border-top: 1rpx solid #F5F5F5;
		width: 96%;
		margin: 2rpx 0;
		padding: 10rpx 1%;
		height: fit-content;
		display: flex;
		background-color: #fff;
	}

	.reply-comment-info {
		flex-grow: 1;
		margin-left: 10rpx;
	}

	.reply-user-name-option {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		.right-edit-item {
			margin-left: 10rpx;
		}
	}

	.reply-comment-text {
		margin-top: 10rpx;
		font-size: small;
	}

	.reply-username {
		color: #707070;
		flex: 1;
		display: flex;
		align-items: center;
		text-align: center;
	}

	.reply-username-text-content {
		display: flex;
		align-items: center;
		text-align: center;

	}

	.reply-username-text {
		font-size: smaller;
		color: #000000;
		height: fit-content;
		width: fit-content;
	}

	.right-triangle {
		font-size: 17rpx;
		color: #bbbbbb;
		margin: 0 10rpx;
	}

	.lead-label {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		margin-left: 10rpx;

		.label-text {
			padding: 4rpx 8rpx;
			font-size: 20rpx;
			color: #ffffff;
			border-radius: 10rpx;
			height: fit-content;
			width: fit-content;
			background-color: #4eccb8;
		}
	}
</style>
