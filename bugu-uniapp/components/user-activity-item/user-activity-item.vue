<template>
	<view>
		<view class="acitivity-content" @click.stop="onClick">
			<!-- 内容体 -->
			<view class="activity-body">
				<!-- 标签部分 -->
				<!-- <view class="activity-tag-content">
				<view 
				v-for="(item, index) in articleItem.labels" 
				:key="item.id" 
				class="activity-body-tag"
				@click="onLabelItemClick(item)"
				>
					#{{ item.content }}</view>
			</view> -->
				<!-- 图片和视频部分 -->
				<view class="activity-body-images">
					<view @click.stop="onMoreClick()" class="activity-header">
						<view class="iconfont icon-gengduo-c right-edit-item" :style="{
							 fontSize: '25rpx',
							 color: '#ffffff'
						}">

						</view>
						<view class="mine-acivity-right-edit">
							<text v-if="isMe" class="right-edit-item">
								{{articleItem.isAnonymity == 1 ? '咕咕状态' : privateSettingGroup[articleItem.visibility]}}
							</text>
						</view>

					</view>
					<!-- 视频 -->
					<view v-if="articleItem.video == 1">
						<view @click.stop="onVideoClick" v-if="articleItem.pic.length>0" class="video-content">
							<video v-show="playVideo" class="video-item" :src="articleItem.pic[0]"
								:id="`video_${articleItem.id}`" initial-time="0" controls
								@fullscreenchange="onFullscreenChange"></video>
							
								<image v-show="!playVideo" :lazy-load="true" mode="aspectFill"  :src="articleItem.pic[0]+'?vframe/jpg/offset/0'"
									class="image-item" />
								<view v-show="!playVideo" class="play-icon-content">
									<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc"
										size="60" />
								</view>
							

						</view>
					</view>
					<!-- 图片 -->
					<view v-if="articleItem.video != 1">
						<view class="image-content" v-if="articleItem.pic.length>0">
							<image :lazy-load="true" mode="aspectFill" :src="articleItem.pic[0]" class="image-item" />
						</view>
					</view>

				</view>
				<!-- 文字部分  -->
				<view class="activity-body-text">
					<text>{{articleItem.text.length<=maxLength?articleItem.text:articleItem.text.slice(0, maxLength) + '...'}}</text>
				</view>
			</view>

			<!-- 头部 -->
			<!-- <view class="activity-header">
				
				<view class="activity-header-name-and-time">
					
					<view class="activity-header-time">
						<view class="creat-time">{{ articleItem.publishTime }}</view>
						<view class="mine-acivity-right-edit">
							<text v-if="isMe" class="right-edit-item">
								{{articleItem.isAnonymity == 1 ? '咕咕状态' : privateSettingGroup[articleItem.visibility]}}
							</text>
							
							<view
							@click.stop="onMoreClick()"
							class="iconfont icon-ellipsis right-edit-item" 
							:style="{
								 fontSize: '50rpx',
								 color: '#cacaca'
							}">

							</view>
						</view>
					</view>
				</view>
			</view> -->

			<!-- 底部 -->
			<view class="activity-footer">
				<!-- 分享按钮 -->
				<!-- <view class="activity-footer-item">
					<view class="iconfont icon-fenxiang" :style="{ fontSize: '25px', color: '#b8b8b8' }" />
				</view> -->
				<!-- 喜欢按钮 -->
				<view class="user-info">
					<view class="avatar-content">
						<image class="avatar" :src="avatar+'?imageView2/1/w/100/h/100'" mode="aspectFill">

						</image>
					</view>
					<view class="username">
						{{username}}
					</view>
				</view>
				<view class="activity-footer-item activity-footer-like" @click.stop="onLikeButtonClick()">
					<view class="iconfont icon-heart-fill" style="color: #EA3F48;font-size: 13px;" />
					<view class="item-value">
						{{ likeSum }}
					</view>

				</view>
				<!-- 评论按钮 -->
				<!-- <view class="activity-footer-item">
					<view class="iconfont icon-pinglun" :style="{ fontSize: '25px', color: '#b8b8b8' }" />
					{{ articleItem.commentSum }}
				</view> -->
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		LabelItem
	} from '@/common/dataClass';
	import {
		privateSettingGroup
	} from '@/common/constants';
	import {
		LikeThisArtice,
		CancleLikeArticle
	} from '@/common/requestFunctions'
	/**
	 * userActivityItem 指定用户的单个动态组件
	 * @description: 指定用户的单个动态组件
	 * @Author: 穆兰
	 * @Date: 2022/1/1
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/8
	 * @property {Object} [articleItem] - 动态的数据对象
	 * @property {Boolean} [isMe] - 是否为我的动态
	 * @property {Boolean} [needShowAll] - 是否需要展示动态的全部内容
	 * @property {String} [avatar] - 头像
	 * @property {String} [username] - 用户名
	 * @event {Function} onClick - 点击动态主体
	 * @event {Function} onMoreClick - 点击更多按钮
	 */
	export default {
		name: "user-activity-item",
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
			avatar: {
				type: String,
				required: true
			},
			username: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				imageContentStyle: '',
				numberOfpics: 0,
				maxLength: 20,
				transformTextLength: 0,
				showAll: true,
				isLiked: false,
				likeSum: 0,
				privateSettingGroup,
				playVideo: false,
				videoContext: {}
			};
		},
		beforeMount() {
			this.isLiked = this.articleItem.isLiked
			this.likeSum = this.articleItem.likeSum
			this.initText()
			this.initImageTypesetting()
		},
		methods: {
			/**
			 *@function 点击动态主体 
			 */
			onClick() {
				this.$emit("onClick")
			},
			/**
			 *@function 点击更多按钮 
			 */
			onMoreClick() {
				this.$emit("onMoreClick")
			},
			/**
			 * @description 点击动态的图片
			 * @param {string} item 图片的URL
			 */
			onImageClick(item) {
				uni.previewImage({
					urls: this.articleItem.pic,
					current: item
				})
			},
			/**
			 * @description 点击动态的视频
			 * @param {string} item 图片的URL
			 */
			onVideoClick() {
				this.playVideo = true
				this.videoContext = uni.createVideoContext(`video_${this.articleItem.id}`,this)
				this.videoContext.requestFullScreen({
					direction: 0
				})
				this.videoContext.play()
			},
			onFullscreenChange(e) {
				this.playVideo = e.detail.fullScreen
				if(!this.playVideo){
					this.videoContext.stop()
				}
			},
			/**
			 * @function 点击单个标签
			 * @param {Object} item 标签
			 */
			onLabelItemClick(item: LabelItem) {
				uni.navigateTo({
					url: `/pages/label-activity/label-activity?labelId=${item.id}&labelContent=${item.content}`,
				})
			},
			/**
			 * @function 初始化文字格式
			 */
			initText() {
				let text = this.articleItem.text
				//一个换成换算成20个字符串，最后只能有20个字符位，多了就要收起
				let line_breaks = 0
				let textMatch = text.match(/\n/ig)
				if (textMatch) {
					line_breaks = textMatch.length
				}
				if (line_breaks <= 0) {
					this.transformTextLength = text.length
				} else {
					this.transformTextLength = text.length + line_breaks * 19
					if (this.transformTextLength > 20) {
						let times = 1
						let first_break = text.indexOf('\n')
						let temp_break = first_break //临时长度 将一个换行换成20长度
						let real_break = first_break //真实长度，一个换行为一个长度
						let temp_text = text
						while (temp_break < 20) {
							temp_text = text.slice(real_break + 1)
							if (temp_text.indexOf('\n') == -1) {
								break
							}
							temp_break = temp_break + 20 + temp_text.indexOf('\n')
							real_break = real_break + 1 + temp_text.indexOf('\n')
							times = times + 1
						}
						if (real_break < 20) {
							this.maxLength = real_break
						}

					}
				}
				console.log(this.maxLength)

			},
			/**
			 * @function 初始化图片排版
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
			 * @function 点击喜欢按钮
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
			 * @function 点击展示全部/收起的文字
			 */
			onShowAllTextClick() {
				this.showAll = !this.showAll
			},

		},

	}
</script>

<style lang="scss">
	.acitivity-content {
		background-color: #1A191F;
		width: 49vw;
		margin-top: 1vw;

		border-radius: 15rpx;
		padding-bottom: 10rpx;
	}



	.activity-body {}

	.activity-body-text {
		text-align: left;
		padding: 2% 6%;
		color: #BFC0C5;
		font-size: small;
	}

	.activity-body-images {
		position: relative;
		overflow: hidden;
		border-radius: 10rpx;
		// line-height: 0rpx;
		min-height: 40rpx;

		.image-item {
			width: 48vw;
			height: 62vw;
			z-index: 98;
		}

		.video-item {
			width: 48vw;
			height: 62vw;
			z-index: 98;
		}

	}

	.activity-header {
		background-color: #1a191f67;
		position: absolute;
		width: 100%;
		height: 40rpx;
		display: flex;
		flex-direction: row-reverse;
		color: #FFFFFF;
		font-size: 20rpx;
		z-index: 99;
		align-items: center;
		justify-content: flex-start;

		.right-edit-item {
			margin-right: 10rpx;
		}

		.mine-acivity-right-edit {
			margin-right: 10rpx;
		}
	}

	.activity-footer {
		width: 90%;
		display: flex;
		flex-direction: row;
		color: #7F7F7F;
		padding: 2% 5%;

		.user-info {
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			.avatar-content {
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;

				.avatar {
					height: 35rpx;
					width: 35rpx;
					border-radius: 50%;
				}
			}

			.username {
				margin-left: 5rpx;
				flex-grow: 1;
				text-align: left;
				color: #535254;
				font-size: 24rpx;
			}
		}
	}

	.video-content {
		position: relative;

		.play-icon-content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-30px) translateY(-30px);
		
		}
	}



	.activity-footer-item {
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;

		.item-value {
			margin-left: 5rpx;
			font-size: 24rpx;
		}
	}
</style>
