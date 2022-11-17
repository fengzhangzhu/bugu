<template>
	<view class="question-skeleton">
		<view class="question-labels">
			<view v-for="(item,index) in [...new Array(3)]" 
			:key="'label'+index" 
			class="question-labels-item skeleton-item"/>
		</view>
		<view class="question-title">
			<view class="question-title-text skeleton-item"/>
			<view class="question-title-text skeleton-item"/>
			<view class="question-title-text skeleton-item"/>
		</view>
		<view class="question-description">
			<view class="question-description-text skeleton-item"/>
			<view class="question-description-text skeleton-item"/>
		</view>
		<view class="question-footer">
			<view class="view-sum skeleton-item"/>
			<view class="like-sum skeleton-item"/>
		</view>
	</view>
</template>

<script>
	export default {
		name:"question-skeleton",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.question-skeleton{
		background-color: #FFFFFF;
		width: 94%;
		padding: 5% 3%;
		.skeleton-item{
			background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
			background-size: 400% 100%;
			background-position: 100% 50%;
			animation: skeleton-loading 1.4s ease infinite;
			
		}
		.question-labels{
			display: flex;
			align-items: center;
			text-align: left;
			justify-content: flex-start;
			.question-labels-item{
				margin-right: 10rpx;
				height: 50rpx;
				width: 150rpx ;
				
			}
		}
		.question-title{
			margin-top: 20rpx;
			
			.question-title-text{
				width: 100%;
				border-radius: 10rpx;
				height: 50rpx;
				margin-top: 10rpx;
			}
		}
		.question-description{
			font-weight: 600;
			margin-top: 20rpx;
			
			.question-description-text{
				margin-top: 5rpx;
				width: 100%;
				border-radius: 10rpx;
				height: 30rpx;
			}
			
		}
		.question-footer{
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #838383;
			.view-sum{
				flex-grow: 1;
				border-radius: 10rpx;
				height: 30rpx;
			}
			.like-sum{
				width: 150rpx;
				border-radius: 10rpx;
				height: 30rpx;
			}
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
