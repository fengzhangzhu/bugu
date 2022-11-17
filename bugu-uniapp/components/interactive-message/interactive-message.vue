<template>
	<view>
		<view class="user-message-item-content"
		@click.stop="onClick()"
		>
			<!-- 头像 -->
			<view class="avatar-content">
				<image mode="aspectFill" class="message-avatar"
				:src="avatar"/>
			</view>
			<!-- 消息详情 -->
			 <view class='message-info'>
				
				<view class='message-name'>
					<Text>{{title}}</Text>
				</view>
				
				<view class="right-info">
					<!-- 未读消息数量 -->
					<view v-if="badgeNumber > 0" class='message-badge'>
						<Text class='badge-text'>{{badgeNumber > 99 ? '···' : badgeNumber}}</Text>
					</view>
					<uni-icons customPrefix="customicons" type="right" color="#a3a3a3" size="16" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {GettimeifferenceOfNow} from "@/utils/dateUtils";
	/**
	 * interactiveMessage 用户互动消息列表的单个组件
	 * @description 用户互动消息列表的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/1/13
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/21
	 * @property {String} [avatar] - 头像的链接
	 * @property {String} [title] -标题、用户名
	 * @property {String} [note] -详细描述
	 * @property {Number} [badgeNumber] - 未读消息数量
	 * @event {Function} onClick - 点击消息主体
	 * @event {Function} onMoreClick - 点击更多按钮
	 */
	export default {
		name:"user-message-item",
		props:{
			badgeNumber:{
				type:Number,
				default:0
			},
			avatar:{
				type:String,
				required:true
			},
			title:{
				type:String,
				required:true
			},
		},
		computed:{
			lastTime(){
				return GettimeifferenceOfNow(this.time).Detailed
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			/**
			 * @description 点击主体
			 */
			onClick(){
				this.$emit('onClick')
			},
			/**
			 * @description 点击更多按钮
			 */
			onMoreClick(){
				this.$emit('onMoreClick')
			}
		}
	}
</script>

<style lang="scss">
	.user-message-item-content{
		display: flex;
		width: 92%;
		flex-direction: row;
		margin-top: 1rpx;
		padding: 2% 4%;
		background-color: #fff;
		justify-content: center;
		align-items: center;
	}
	.avatar-content{
	    position: relative;
	    width: fit-content;
	    height: fit-content;
	    .online-state-point-content{
	        position: absolute;
	        bottom: 0;
	        right: 0;
	        padding: 4rpx;
	        background-color: #fff;
	        border-radius: 12rpx;
	    }
	    .online-state-point{
	       
	        width: 20rpx;
	        height: 20rpx;
	        border-radius: 15rpx;
	    }
	}
	.message-avatar{
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		background-color:#46C7DC;
		
	}
	.message-info{
	    flex-grow: 1;
	    margin-left: 20rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		.message-name{
			flex: 1;
			text-align: left;
			font-size:30rpx;
			color: #797979;
			flex-grow: 1;
			font-weight: 550;
		}
		.right-info{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
		}
	}
	// 未读消息的标识
	.message-badge{
	    height: 45rpx;
	    width: 45rpx;
	    margin-right: 20rpx;
	    border-radius: 50%;
	    background-color: #4eccb8;
	    color: #fff;
	    display: flex;
	    align-items: center;
	    justify-items: center;
	    font-size: small;
	    .badge-text{
	        width: 45rpx;
	        text-align: center;
	    }
	}
</style>
