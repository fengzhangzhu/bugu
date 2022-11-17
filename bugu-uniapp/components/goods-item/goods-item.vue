<template>
	<view>
		<view class="goods-content" @click.stop="onClick">
			<!-- 内容体 -->
			<view class="goods-body">
				<!-- 图片和视频部分 -->
				<view :class="imageStyle">
					<!-- 视频 -->
					<view v-if="goodsData.video == 1">
						<view @click.stop="onVideoClick" v-if="goodsData.pic.length>0" class="video-content">
							<video v-show="playVideo" class="video-item" :src="goodsData.pic[0]"
								:id="`video_${goodsData.id}`" initial-time="0" controls
								@fullscreenchange="onFullscreenChange"></video>
							
								<image v-show="!playVideo" :lazy-load="true" mode="aspectFill"  :src="goodsData.pic[0]+'?vframe/jpg/offset/0'"
									class="image-item" />
								<view v-show="!playVideo" class="play-icon-content">
									<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc"
										size="60" />
								</view>
						</view>
					</view>
					<!-- 图片 -->
					<view v-if="goodsData.video != 1">
						<view class="image-content" v-if="goodsData.pic.length>0">
							<image :lazy-load="true" mode="aspectFill" :src="goodsData.pic[0]" class="image-item" />
						</view>
					</view>

				</view>
				<!-- 文字部分  -->
				<view class="goods-body-text">
					<text>{{goodsData.text.length<=maxLength?goodsData.text:goodsData.text.slice(0, maxLength) + '...'}}</text>
				</view>
				<!-- 标签部分 -->
				<view class="goods-tag-content">
					<view 
					v-for="(item, index) in goodsData.labels" 
					:key="item.id" 
					class="goods-body-tag"
					@click="onLabelItemClick(item)"
					>
					{{ item.content }}</view>
				</view>
				<!-- 价格部分-->
				<view class="goods-price">
					<view class="price">
						<text>￥</text><text class="price-number">{{goodsData.price}}</text>
					</view>
					<view class="wants-sum">
						<text>34人想要</text>
					</view>
				</view>
			</view>

			<!-- 底部 -->
			<view class="goods-footer">
				<view class="user-info">
					<view class="avatar-content">
						<image class="avatar" :src="avatar" mode="aspectFill">

						</image>
					</view>
					<view class="username">
						{{username}}
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script >
	import {
		LabelItem
	} from '@/common/dataClass';
	import {
		privateSettingGroup
	} from '@/common/constants';
	import {
		LikeThisArtice,
		CancleLikegoods
	} from '@/common/requestFunctions'
	/**
	 * goodsData 商品的单个组件
	 * @description: 商品的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/1/1
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/8
	 * @property {Object} [goodsData] - 动态的数据对象
	 * @property {Boolean} [isMe] - 是否为我的动态
	 * @property {Boolean} [needShowAll] - 是否需要展示动态的全部内容
	 * @property {String} [avatar] - 头像
	 * @property {String} [username] - 用户名
	 * @event {Function} onClick - 点击动态主体
	 * @event {Function} onMoreClick - 点击更多按钮
	 */
	export default {
		name: "goods-item",
		props: {
			goodsData: {
				type: Object,
				required: true
			},
			isMe: {
				type: Boolean,
				default: false
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
				
				numberOfpics: 0,
				maxLength: 8,
				transformTextLength: 0,
				showAll: true,
				playVideo: false,
				videoContext: {}
			};
		},
		beforeMount() {
			
			this.initText()
			
		},
		computed:{
			imageStyle(){
				if(Math.round(Math.random())==0){
					return 'goods-body-image-rectangle'
				}else{
					return 'goods-body-image-square'
				}
			},
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
					urls: this.goodsData.pic,
					current: item
				})
			},
			/**
			 * @description 点击动态的视频
			 * @param {string} item 图片的URL
			 */
			onVideoClick() {
				this.playVideo = true
				this.videoContext = uni.createVideoContext(`video_${this.goodsData.id}`)
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
			 * @function 初始化文字格式
			 */
			initText() {
				let text = this.goodsData.text
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
					if (this.transformTextLength > 8) {
						let times = 1
						let first_break = text.indexOf('\n')
						let temp_break = first_break //临时长度 将一个换行换成20长度
						let real_break = first_break //真实长度，一个换行为一个长度
						let temp_text = text
						while (temp_break <8) {
							temp_text = text.slice(real_break + 1)
							if (temp_text.indexOf('\n') == -1) {
								break
							}
							temp_break = temp_break + 20 + temp_text.indexOf('\n')
							real_break = real_break + 1 + temp_text.indexOf('\n')
							times = times + 1
						}
						if (real_break < 8) {
							this.maxLength = real_break
						}

					}
				}
				

			},
			
		},

	}
</script>

<style lang="scss">
	.goods-content {
		background-color: #ffffff;
		width: 49vw;
		margin-top: 20rpx;
		overflow: hidden;
		border-radius: 15rpx;
		padding-bottom: 10rpx;
	}
	.goods-body-text {
		text-align: left;
		padding: 2% 3%;
		color: #000000;
		font-weight: bold;
		font-size: medium;
	}
	.goods-tag-content{
		padding: 2% 3%;
		margin-top: 10rpx;
		display: flex;
		.goods-body-tag{
			font-weight: 600;
			font-size: 20rpx;
			color: #F06067;
			border: solid 1rpx #F06067;
			padding: 2rpx 10rpx;
			border-radius: 15rpx;
		}
	}
	.goods-price{
		width: 94%;
		padding: 2% 3%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		text-align: left;
		.price{
			color: #F52C39;
			font-size: small;
			text-align: left;
			font-weight: bold;
			.price-number{
				font-size: large;
			}
		}
		.wants-sum{
			margin-left: 10rpx;
			font-weight: 600;
			font-size: 20rpx;
			color: #cccccc;
		}
		
	}
	.goods-body-image-rectangle {
		background-color: #C7C7C7;
		position: relative;
		min-height: 40rpx;
		border-radius: 15rpx;
		width: 48vw;
		height: 62vw;
		overflow: hidden;
		.image-item {
			width: 48vw;
			height: 62vw;
		}
		.video-item {
			width: 48vw;
			height: 62vw;
		}
	}
	.goods-body-image-square {
		background-color: #C7C7C7;
		position: relative;
		// line-height: 0rpx;
		min-height: 40rpx;
		border-radius: 15rpx;
		overflow: hidden;
		width: 48vw;
		height: 48vw;
		.image-item {
			width: 48vw;
			height: 48vw;
		}
		.video-item {
			width: 48vw;
			height: 48vw;
		}
	
	}

	.goods-header {
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

	.goods-footer {
		width: 90%;
		display: flex;
		flex-direction: row;
		color: #cccccc;
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
				color: #cccccc;
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



	.goods-footer-item {
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
