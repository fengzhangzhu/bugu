<template>
	<view>
		<view class="hot-activity-body" @click="onClick()">
			<view class="hot-ranking" >
				<view class="ranking-content"
				:style="{
					 backgroundColor:ranking==1? '#EF4F4A'
									:ranking==2? '#FD930D'
									:ranking==3? '#F0C174':'#56CDBA'
				}"
				>
					<view  class="ranking-text">
						{{ranking}}
					</view>
					<!-- 辅助视图生成样式 -->
					<view class="ranking-assist"
					:style="{
						borderTop: ranking==1? '8rpx solid #EF4F4A'
									:ranking==2? '8rpx solid #FD930D'
									:ranking==3? '8rpx solid #F0C174':'8rpx solid #56CDBA',
						borderRight: '15rpx solid transparent'
					}"
					/>
				</view>                                                                                                                           
			</view>
			<view class="hot-activity-content">
				<view class="hot-activity-info">
					<view class="hot-activity-text-content">
						<view class="text-info">{{hotText}}</view>
						<view class="hot-activity-footer">
							<text>{{hot}} 热度</text>
						</view>
					</view>
					<view v-if="hotPic" >
						<view v-if="isVideo" class="hot-activity-image">
							<image :lazy-load="true" mode="aspectFill"  :src="hotPic+'?vframe/jpg/offset/0'"
								class="image-item" />
							<view  class="play-icon-content">
								<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc"
									size="30" />
							</view>
						</view>
						<view v-else class="hot-activity-image">
							<image class="image-item" :lazy-load="true" mode="aspectFill" :src="hotPic"  />
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * hotActivityItem 热门动态/问题的单个组件
	 * @description 热门动态/问题的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/18
	 * @property {Number} hotNumber    - 热门指数
	 * @property {String} hotText - 文字内容
	 * @property {String} hotPic - 图片内容
	 * @property {Boolean} isVideo -是否为视频
	 * @property {Number} ranking -排名
	 * @event {Function} onClick 点击此组件
	 */
	export default {
		name:"hot-activity-item",
		props: {
			hotNumber:{
				type:Number,
				required:true
			},
			hotText:{
				type:String,
				required:true
			},
			hotPic:{
				type:String,
				required:true
			},
			isVideo:{
				type:Boolean,
				default:false
			},
			ranking:{
				type:Number,
				required:true
			},
		},
		computed:{
			hot(){
				let hot = this.hotNumber
				let hotText = hot
				if(hot>1000){
					hotText = hot/1000 +'k'
				}
				return hotText
			}
		},
		emits:['onClick'],
		methods:{
			/**
			 * @description 点击主体
			 */
			onClick(){
				this.$emit('onClick')
			},	
		}
	}
</script>

<style scoped lang="scss">
	.hot-activity-body{
		margin: 2rpx 0;
		padding: 30rpx 4%;
		display: flex;
		background-color: #FFFFFF;
		
		
	}
	.hot-ranking{

		width: 8%;
		text-align: center;
		font-size: smaller;
		color: #FFFFFF;
		position: relative;
		.ranking-content{
			margin-top: 7rpx;
			height: 38rpx;
			width: 28rpx;
			font-size: 20rpx;
			display: flex;
			border-radius: 5rpx;
			align-items: center;
			justify-content: center;
			text-align: center;
			z-index: 99;
		}
		.ranking-assist{
			width: 0;
			height: 0;
			content: '';
			position: absolute;
			top: 44rpx;
			
			z-index: 98;
		}
	}
	.hot-activity-content{

		font-size: medium;
		color: #000000;
		width: 92%;
		font-weight: 700;
		position: relative;
		
		.hot-activity-info{
			display: flex;
			.hot-activity-text-content{
				flex-grow: 1;
				text-align: left;
				display: flex;
				flex-direction: column;
				min-height: 130rpx;

				
				.text-info{
					flex-grow: 1;
					overflow: hidden;
					text-overflow: ellipsis;    
					display:-webkit-box;         
					-webkit-box-orient:vertical;
					-webkit-line-clamp:3;   
				}
			}
			.hot-activity-image{
				margin-left: 20rpx;
				height: 120rpx;
				width: 170rpx;
				border-radius: 5rpx;
				overflow: hidden;
				position: relative;
			}
			.image-item{
				height: 120rpx;
				width: 170rpx;
				background-color: #aaaaaa;
				
			}
			.play-icon-content {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translateX(-15px) translateY(-15px);
			
			}
		}
		.hot-activity-footer{
			margin-top: 20rpx;
			display: flex;
			align-items: left;
			color: #d7d7d7;
			font-size: 20rpx;
			font-weight: lighter;
		}
	}
</style>
