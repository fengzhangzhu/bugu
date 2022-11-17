<template>
	<view @click="onQuetionItemClick" class="question-item">
		<view class="title">
			<view class="question-title-text skeleton-item"/>
			<view class="question-title-text skeleton-item"/>
		</view>
		<view class="answer">
			<view class="answer-info">
				<view class="answer-user">
					<view class="user-avatar-content skeleton-item"/>
					<view class="user-username skeleton-item" />
				</view>
				<view class="answer-text-content">
					<view class="answer-text skeleton-item"/>
					<view class="answer-text skeleton-item"/>
				</view>
			</view>
			<view  class="answer-image-content skeleton-item"/>
		</view>
		<view class="footer">
			<view class="view-sum skeleton-item"/>
			<view class="like-sum skeleton-item"/>
		</view>
	</view>
</template>
<script>
	export default {
		name:"question-item",
		data() {
			return {
				
			};
		}
		
	}
</script>

<style lang="scss">
	.question-item{
		background-color: #FFFFFF;
		margin-top: 10rpx;
		padding: 20rpx;
		.title{
			.question-title-text{
				width: 100%;
				border-radius: 10rpx;
				height: 50rpx;
				margin-top: 10rpx;
			}
		}
		.answer{
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			text-align: left;
			.answer-info{
				flex-grow: 1;
				.answer-user{
					display: flex;
					align-items: center;
					justify-content: flex-start;
					text-align: left;
					width: 100%;
					.user-avatar-content{
						width: 40rpx;
						height: 40rpx;
						border-radius: 20rpx;
					}
					.user-username{
						margin-left: 10rpx;
						width: 100%;
						border-radius: 10rpx;
						height: 30rpx;
					}
					
				}
				.answer-text{
					margin-top: 5rpx;
					width: 100%;
					border-radius: 10rpx;
					height: 30rpx;
				}
			}
			.answer-image-content{
				position: relative;
				margin-left: 20rpx;
				height: 120rpx;
				width: 200rpx;
				border-radius: 5rpx;
			}
		}
		.footer{
			margin-top: 10rpx;
			display: flex;
			text-align: left;
			align-items: center;
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
	.skeleton-item{
		background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
		background-size: 400% 100%;
		background-position: 100% 50%;
		animation: skeleton-loading 1.4s ease infinite;
		
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
