<template>
	<view>
		<view class="user-message-item-content"
		@click.stop="onClick()"
		>
			<!-- 头像 -->
			<view class="avatar-content">
				<image mode="aspectFill" class="message-avatar"
				:src="messageAvatr"/>
				<!-- 在线状态 -->
				<view class="online-state-point-content"
				v-if="needOnlineState"
				>
					<view class="online-state-point"
					:style="{
						backgroundColor:onLineState?'#3bd8bf':'#c4c4c4'
					}"/>
				</view>
			</view>
			<!-- 消息详情 -->
			 <view class='message-info'>
				<view class='info-upper'>
					<view class='message-name'>
						<Text>{{title}}</Text>
					</view>
					<view class='meassage-time'>
						<Text>{{lastTime}}</Text>
					</view>
					<view class='meassage-more'
					@click.stop="onMoreClick()"
					>
						<uni-icons customPrefix="customicons" type="more-filled" color="#a1a1a1" size="20" />
					</view>
				</view>
				<!-- 消息详情 -->
				<view v-if="note" class='info-lower'>
					<text class='meassage-text'>
						{{note.length > 15 ?
							note.slice(0, 15) + '...' :note}}
					</text>
					<!-- 未读消息数量 -->
					<view v-if="badgeNumber > 0" class='message-badge'>
						<Text class='badge-text'>{{badgeNumber > 99 ? '···' : badgeNumber}}</Text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {GettimeifferenceOfNow} from "@/utils/dateUtils";
	import {
			avatar_pic_hendle
		} from '@/common/constants';
	/**
	 * userMessageItem 用户聊天列表的单个组件
	 * @description 用户聊天列表的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/1/13
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/13
	 * @property {String} [avatar] - 头像的链接
	 * @property {String} [title] -标题、用户名
	 * @property {String} [note] -详细描述
	 * @property {String} [time] -时间
	 * @property {Boolean} [needOnlineState] 是否需要展示在线状态
	 * @property {Boolean} [onLineState]  在线状态
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
			note:{
				type:String,
				required:true
			},
			time:{
				type:String,
				required:true
			},
			needOnlineState:{
				type:Boolean,
				default:false
			},
			onLineState:{
				type:Boolean,
				default:false
			},
			messageType:{
				type:String,
				default:"user"
			}
		},
		computed:{
			lastTime(){
				return GettimeifferenceOfNow(this.time).Detailed
			},
			messageAvatr(){
				if(this.messageType==="official"){
					return this.avatar
				}else{
					return this.avatar+avatar_pic_hendle
				}
			}
		},
		data() {
			return {
				avatar_pic_hendle
			};
		},
		emits:['onClick','onMoreClick'],
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
		margin-top: 1rpx;
		display: flex;
		width: 92%;
		flex-direction: row;
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
		background-color: #46c7dc;
	}
	.message-info{
	    flex-grow: 1;
	    margin-left: 20rpx;
		height: 100rpx;
		.info-upper{
			    width: 100%;
			    display: flex;
			    flex-direction: row;
				
			    .message-name{
			        display: flex;
			        text-align: center;
			        font-size:30rpx;
			        color: #797979;
			        flex-grow: 1;
					font-weight: 550;
			    }
			    .meassage-time{
			        display: flex;
			        text-align: center;
			        font-size: small;
			        color: #9c9c9c;
			        margin:0 10rpx ;
			    }
			    .meassage-more{
			        text-align: center;
			        margin:0 10rpx ;
			    }
			
			}
			
			.info-lower{
				margin-top: 10rpx;
			    display: flex;
			    width: 100%;
			    text-align: left;
			    .meassage-text{
			        flex: 1;
			        font-size: 25rpx;
			        color: #bababa;
			    }
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
			}

	
	}
</style>
