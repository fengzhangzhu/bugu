<template>
	<view>
		<view  class="acitivity-skeleton-content" >
			<!-- 头部 -->
			<view class="activity-header">
				<!-- 头像 -->
				<view class="activity-header-avatar">
					<view  class="activity-user-avatar skeleton-item" ></view>
				</view>
				<!-- 用户名和发布时间 -->
				<view class="activity-header-name-and-time">
					<view class="activity-header-name skeleton-item"/>
					<!-- 发布时间  -->
					<view class="activity-header-time skeleton-item"/>
				</view>
			</view>
			<!-- 内容体 -->
			<view class="activity-body">
				
				<!-- 文字部分  -->
				<view class="activity-body-text">
					<view class="body-text skeleton-item"/>
					<view class="body-text skeleton-item"/>
					<view class="body-text skeleton-item"/>
				</view>
				<!-- 图片和视频部分 -->
				<view class="activity-body-images">
					<view class="image-item skeleton-item" />
				</view>
			</view>

			
			<!-- 底部 -->
			<view class="activity-footer">
				<view class="footer skeleton-item" />
				
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	
	/**
	 * activitySkeleton 动态组件的骨架屏
	 * @description: 单个动态组件
	 * @Author: 穆兰
	 * @Date: 2022/1/1
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/23
	 */
	export default {
		name: "activity-item",
		props: {

		},
		data() {
			return {
			
			};
		},
		
	}
</script>

<style lang="scss">
	.acitivity-skeleton-content {
		padding: 3%;
		margin: 3% 0rpx;
		background-color: white;
		list-style: none;
		.skeleton-item{
			background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
			background-size: 400% 100%;
			background-position: 100% 50%;
			animation: skeleton-loading 1.4s ease infinite;
			
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
			width: 100%;
			height: 30rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.activity-header-time {
			margin-top: 5rpx;
			height: 30rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.activity-body{
			margin-top: 20rpx;
		}
		
		.activity-body-text {
			margin: 2% 0;
			color: #343434;
			
			.body-text{
				border-radius: 10rpx;
				height: 30rpx;
				margin-top: 5rpx;
			}
		}
		.activity-body-images {
			border-radius: 10rpx;
			overflow: hidden;
			line-height: 0rpx;
			
			.image-item{
				width: 100%;
				height: 60vw;
				border-radius: 10rpx;
				margin-top: 5rpx;
			}
		}
		.activity-footer {
			border-radius: 10rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			color: #7F7F7F;
			letter-spacing: 4rpx;
			margin-top: 4%;
			height: 30rpx;
			margin-top: 5rpx;
			
		}
	}

	@keyframes skeleton-loading {
	  0% {
	    background-position: 100% 50%;
	  }
	  100% {
	    background-position: 0 50%;
	  }
	}
	
</style>
