<template>
	<view>
		<view @click="onActivityClick" class="acitivity-content" >
			<!-- 头部 -->
			<view class="activity-header">
				<!-- 头像 -->
				<view @click.stop="onAvatarClick()" class="activity-header-avatar">
					<image  class="activity-user-avatar" :mode="'aspectFill'"
						:src="articleItem.isAnonymity == 1 ? AnonymousAvatar : articleItem.publisher.avatar+avatar_pic_hendle"
						
						></image>
					<view v-if="articleItem.publisher && articleItem.publisher.isVip == 1" class="vip-logo">
						<image :src="'../../static/svgs/vip-logo.svg'" :mode="'aspectFit'" :style="{
									width: '15px',
									height: '15px'
								}"></image>
					</view>
				</view>
				<!-- 用户名和发布时间 -->
				<view class="activity-header-name-and-time">
					<view class="activity-header-name">
						<view class="activity-header-username">
							{{
									articleItem.isAnonymity == 1
										? '某只小布咕'
										: articleItem.publisher.username && articleItem.publisher.username.length > 8
										? articleItem.publisher.username.slice(0, 8) + '...'
								: 		articleItem.publisher.username
								}}

							<!-- 是否实名认证-->
							<view v-if="articleItem.publisher && articleItem.publisher.isVerify == 1"
								class="iconfont icon-shimingrenzheng_shimingrenzheng" :style="{
										fontSize: '15px',
										color: '#3bd8bf',
										marginLeft: '5px'
									}"></view>
							<view v-if="articleItem.publisher && articleItem.publisher.sex != undefined"
								:class="articleItem.publisher.sex == 0 ? 'iconfont icon-nvxing' : 'iconfont icon-nanxing'"
								:style="{
										fontSize: '15px',
										color: articleItem.publisher.sex == 0 ? '#e86591' : '#528cea',
										marginLeft: '5px'
									}" />
						</view>
					</view>
					<!-- 发布时间  -->
					<view class="activity-header-time">
						<view class="creat-time">{{ publishTime }}</view>
					</view>
				</view>
				<!-- 操作按钮 -->
				<view class="activity-header-button">
					<!-- 关注/私聊按钮 -->
					<view v-if="articleItem.isAnonymity == 0">
						<view v-if="!isMe">
							<view @click.stop="onFollowButtonClick()" class="follow-button" v-if="articleItem.publisher.isAttention == 0 ">关注
							</view>
							<view @click.stop="onChatButtonClick()" class="chat-button" v-else>
								<view class="iconfont icon-message" :style="{
											fontSize: '32rpx',
											color: '#FFF'
										}" />
							</view>
						</view>
					</view>
					<!-- 更多按钮 -->
					<view class="activity-more"
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
			<view class="activity-body">
				<!-- 标签部分 -->
				<view class="activity-tag-content">
					<view 
					v-for="(item, index) in articleItem.labels" 
					:key="item.id" 
					class="activity-body-tag"
					@click.stop="onLabelItemClick(item)"
					>
						#{{ item.content }}</view>
				</view>
				<!-- 文字部分  -->
				<view class="activity-body-text">
					<text v-if="showAll">{{articleText}}</text>
					<text v-else>{{articleText.slice(0, maxLength) + '...'}}</text>
					<block v-if="transformTextLength > 100">
						<text @click.stop="onShowAllTextClick()" class="more-text" v-if="showAll">
							{{`\n收起`}}
						</text>
						<text @click.stop="onShowAllTextClick()" class="more-text" v-else>{{`\n展开`}}</text>
					</block>
				</view>
				<!-- 图片和视频部分 -->
				<view class="activity-body-images"
					:style="{ width: articleItem.video != 1&&numberOfpics <= 1 ? '60vw' : '100%' }">
					<!-- 视频 -->
					<view v-if="articleItem.video == 1">
						
						<view @click.stop="onVideoClick" v-for="item in articleItem.pic" :key="item" class="video-content">
							<image v-show="!playVideo" style="width: 100%;height: 55vw;background-color: #000000;" :lazy-load="true" mode="aspectFit" :src="item+'?vframe/jpg/offset/0'" ></image>
							<video v-show="playVideo" style="width: 100%;height: 55vw;background-color: #000000;" :src="item" :id="`video_${articleItem.id}`" initial-time="0"
								@fullscreenchange="onFullscreenChange"
								controls
								></video>
							<view v-show="!playVideo" class="play-icon-content">
								<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="100" />
							</view>
						</view>
					</view>
					<!-- 图片 -->
					<view v-if="articleItem.video != 1">
						<view :key="index" :class="'activity-body-image '+imageContentStyle"
							v-for="(item, index) in articleItem.pic"
							@click.stop="onImageClick(item)"
							>
							<image :lazy-load="true" :mode="numberOfpics <= 1 ? 'widthFix' : 'aspectFill'" :src="item"
								class="image-item" />
						</view>
					</view>
				</view>
			</view>

			
			<!-- 底部 -->
			<view class="activity-footer">
				<!-- 分享按钮 -->
				<view class="activity-footer-item">
					<button size="mini" plain @click.stop="onShareClick()" open-type="share" class="share-button">
						<view class="iconfont icon-fenxiang" :style="{ fontSize: '25px', color: '#b8b8b8' }">
						</view>	
					</button>
				</view>
				<!-- 喜欢按钮 -->
				<view class="activity-footer-item activity-footer-like" @click.stop="onLikeButtonClick()">
					<view  :class="isLiked == 0 ? 'iconfont icon-dianzan' :articleItem.isLiked==0 ? 'iconfont icon-dianzan1 is-activity': 'iconfont icon-dianzan1'" :style="{
									fontSize: '25px',
									color: isLiked == 0 ? '#b8b8b8' : '#83dbcd'
								}" />
					{{ likeSum }}
				</view>
				<!-- 评论按钮 -->
				<view class="activity-footer-item">
					<view class="iconfont icon-pinglun" :style="{ fontSize: '25px', color: '#b8b8b8' }" />
					{{ articleItem.commentSum }}
				</view>
				
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import textFilter from '@/utils/textFilter';
	import {
		LabelItem
	} from '@/common/dataClass';
	import {
		AnonymousAvatar,
		activity_pic_hendle,
		avatar_pic_hendle
	} from '@/common/constants';
	import {
		LikeThisArtice,
		CancleLikeArticle,
	} from '@/common/requestFunctions';
	import {
		GettimeifferenceOfNow
	} from "@/utils/dateUtils"
	/**
	 * activityItem 动态组件
	 * @description: 单个动态组件
	 * @Author: 穆兰
	 * @Date: 2022/1/1
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {Object} [articleItem] - 动态的数据对象
	 * @property {Boolean} [isMe] - 是否为我的动态
	 * @property {Boolean} [needShowAll] - 是否需要展示动态的全部内容
	 * @event {Function} onClick - 点击动态主体
	 * @event {Function} onFollowClick - 点击关注按钮
	 * @event {Function} onMoreClick - 点击更多按钮
	 * @event {Function} onShareClick - 点击更多按钮
	 */
	export default {
		name: "activity-item",
		props: {
			articleItem: {
				type: Object,
				required: true
			},
			isMe: {
				type: Boolean,
				required: true
			},
			needShowAll: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				avatar_pic_hendle,
				activity_pic_hendle,
				AnonymousAvatar,
				imageContentStyle: '',
				numberOfpics: 0,
				maxLength: 100,
				transformTextLength: 0,
				showAll: true,
				isLiked: false,
				likeSum: 0,
				isAttention: 0,
				publishTime:'',
				playVideo:false,
				videoContext:{}
			};
		},
		created() {
			this.isLiked = this.articleItem.isLiked
			this.likeSum = this.articleItem.likeSum
			this.publishTime = GettimeifferenceOfNow(this.articleItem.createTime).DistanceNow
			if (this.articleItem.publisher) {
				this.isAttention = this.articleItem.publisher.isAttention
			}
			this.initText()
			this.initImageTypesetting()
		},
		computed:{
			articleText(){
				return textFilter(this.articleItem.text)
			}
			
		},
		watch:{
			articleItem(newVal){
				console.log("articleItem")
				if(newVal.isAnonymity==0){
					this.isAttention = newVal.publisher.isAttention
				}
				
			}
		},
		
		methods: {
			/**
			 * @description 这个动态时
			 */
			onActivityClick(){
				try{
					this.$emit("onClick")
				}catch{
					
				}
				
			},
			/**
			 * @description 点击头像时
			 */
			onAvatarClick(){
				if(this.articleItem.isAnonymity == 0&&!this.isMe){
					uni.navigateTo({
						url:`/pages/user-home-page/user-home-page?userId=${this.articleItem.publisher.id}`
					})
				}
			},
			/**
			 * @description 点击私聊按钮
			 */
			onChatButtonClick(){
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.articleItem.publisher.id}`
				})
			},
			/**
			 *@description 点击更多按钮 
			 */
			onMoreClick(){
				console.log("onMoreClick()")
				this.$emit("onMoreClick")
			},
			/**
			 * @description 点击动态的图片
			 * @param {string} item 图片的URL
			 */
			onImageClick(item){
				 uni.previewImage({ urls: this.articleItem.pic, current: item })
			},
			/**
			 * @description 点击动态的视频
			 * @param {string} item 图片的URL
			 */
			onVideoClick(){
				this.playVideo=true
				this.videoContext = uni.createVideoContext(`video_${this.articleItem.id}`,this)
				console.log("this.videoContext",this.videoContext)
				this.videoContext.requestFullScreen({direction:0})	
				this.videoContext.play()
			},
			onFullscreenChange(e){
				this.playVideo=e.detail.fullScreen
				console.log('onFullscreenChange',e)
				if(!this.playVideo){
					this.videoContext.stop()
				}
			},
			/**
			 * @description 初始化文字格式
			 */
			initText() {
				let text = this.articleItem.text
				//一个换成换算成20个字符串，最后只能有100个字符位，多了就要收起
				let line_breaks = 0
				let textMatch = text.match(/\n/ig)
				if (textMatch) {
					line_breaks = textMatch.length
				}
				if (line_breaks <= 0) {
					this.transformTextLength = text.length
				} else {
					this.transformTextLength = text.length + line_breaks * 19
					if (this.transformTextLength > 100) {
						let times = 1
						let first_break = text.indexOf('\n')
						let temp_break = first_break //临时长度 将一个换行换成20长度
						let real_break = first_break //真实长度，一个换行为一个长度
						let temp_text = text
						while (temp_break < 100) {
							temp_text = text.slice(real_break + 1)
							if (temp_text.indexOf('\n') == -1) {
								break
							}
							temp_break = temp_break + 20 + temp_text.indexOf('\n')
							real_break = real_break + 1 + temp_text.indexOf('\n')
							times = times + 1
						}
						this.maxLength = real_break
					}
				}
				let showAll = this.transformTextLength <= 100 //换算后的文字长度小于100则转换成真实长度
				if (this.needShowAll) { //先判断父组件是否强制要求收起
					this.showAll = true
				} else {
					this.showAll = showAll
				}

			},
			/**
			 * @description 初始化图片排版
			 */
			initImageTypesetting() {
				let numberOfpics = 0;
				//根据图片数量设置格式
				if (this.articleItem.pic.length) {
					numberOfpics = this.articleItem.pic.length;
				}
				if (numberOfpics <= 1) {
					this.imageContentStyle = "picture-typesetting-1"
				} else if (numberOfpics == 2 || numberOfpics == 4) {
					this.imageContentStyle = "picture-typesetting-4"
				} else {
					this.imageContentStyle = "picture-typesetting-9"
				}
				this.numberOfpics = numberOfpics
			},
			/**
			 * @description 点击单个标签
			 * @param {Object} item 标签
			 */
			onLabelItemClick(item: LabelItem){
				uni.navigateTo({
					url:`../../pages/label-activity/label-activity?labelId=${item.id}&labelContent=${item.content}`,
				})
			},
			/**
			 * @description 点击关注按钮
			 */
			onFollowButtonClick() {
				this.$emit('onFollowClick');	
			},
			/**
			 * @description 点击分享按钮
			 */
			onShareClick(){
				console.log("onShareClick()")
				this.$emit("onShareClick")
			},
			
			/**
			 * @description 点击喜欢按钮
			 */
			async onLikeButtonClick() {
				let isLikeBefore = this.isLiked
				let likeSumBefore = this.likeSum
				if (isLikeBefore == 0) {
					this.isLiked = 1
					this.likeSum = this.likeSum + 1
					
					let res = await LikeThisArtice(this.articleItem.id)

					if (!res) {
						this.isLiked = 0
						this.likeSum = likeSumBefore
					}
				} else {
					this.isLiked = 0
					this.likeSum = this.likeSum - 1
					let res = await CancleLikeArticle(this.articleItem.id)

					if (!res) {
						this.isLiked = 1
						this.likeSum = likeSumBefore
					}
				}

			},
			/**
			 * @description 点击展示全部/收起的文字
			 */
			onShowAllTextClick() {
				this.showAll = !this.showAll
			},

		},

	}
</script>

<style lang="scss">
	.acitivity-content {
		padding: 3%;
		margin-bottom: 3%;
		background-color: white;
	}

	.activity-header {
		display: flex;
		flex-direction: row;
		align-items: center;


	}

	.activity-header-avatar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		.activity-user-avatar {
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

	.activity-header-name-and-time {
		flex-grow: 1;
		margin-left: 3%;
		font-size: medium;
		display: flex;
		flex-direction: column;
	}

	.activity-header-name {
		display: flex;
		align-items: center;
		justify-content: center;

		.activity-header-username {
			flex-grow: 1;
			display: flex;
			align-items: center;
			font-size: small;
			text-align: left;
			color: #555555;
		}

	}

	.activity-header-time {
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

	.activity-header-button {
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
	.activity-body{
		margin-top: 20rpx;
	}
	.activity-tag-content {
		width: 100vw;
		display: flex;
		flex-wrap: wrap;
		.activity-body-tag {
			margin: 1% 0;
			margin-right: 2%;
			background-color: #cffafa;
			width: fit-content;
			color: #296f63;
			padding: 6rpx 15rpx;
			border-radius: 20rpx;
			font-size: small;
		}
	}


	.activity-body-text {
		margin: 2% 0;
		color: #343434;
	}

	.more-text {
		color: #15dceb;
		font-size: medium;
	}

	.activity-body-images {
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
	.activity-body-image {
		display: inline-block;
		margin: 0.2%;
		overflow: hidden;
	}

	.picture-typesetting-1 {
		border-radius: 10rpx;
		width: 60vw;
		max-height: 800rpx;

		.image-item {
			width: 60vw;
		}
	}

	.picture-typesetting-4 {
		width: 49.4%;
		height: 0rpx;
		padding-bottom: 49.4%;

		.image-item {
			width: 49.4vw;
			height: 49.4vw;
		}
	}

	.picture-typesetting-9 {
		width: 32.9%;
		height: 0rpx;
		padding-bottom: 32.9%;

		.image-item {
			width: 32.9vw;
			height: 32.9vw;
		}
	}

	.activity-footer {
		width: 100%;
		display: flex;
		flex-direction: row;
		color: #7F7F7F;
		letter-spacing: 4rpx;
		margin-top: 4%;
	}

	.activity-footer-item {
		width: 33%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;

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
	.activity-footer-like{
		margin-left: 40%;
	}
	.is-activity {
		animation: wobble-ver-left 0.8s both;
		
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
