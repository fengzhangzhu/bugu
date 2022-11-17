<template>
	<view>
		<view class="official-news-content"
		@click="onClick"
		>
			<view>
				<image
				mode="aspectFill"
				class="avatar"
				:src="officialNews.type===ACTIVITY? '/static/svgs/official-activities.svg'
                        :'/static/svgs/official-communication.svg'"
				></image>
			</view>
			 <view class='official-news-info'>
				<view class='official-news-info-upper'>
					<view class='official-news-name'>
						<text>布咕通知</text>
					</view>
					<view class='official-news-time'>
						<text>{{lastTime}}</text>
					</view>
					<view class='official-news-more'>
						<view @click="onClickMore" class='iconfont icon-ellipsis' :style="{
							fontSize: '28px',
							color: '#9c9c9c'
						}"
						></view>
					</view>
				</view>
				<view class='official-news-info-lower'>
							<text class='official-news-text'>
								{{newsText}}
							</text>
					<view v-if="unreadSum>0" class='official-news-badge'>
						<text class='badge-text'>{{unreadSum}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {ACTIVITY,PUNISH} from "@/common/constants";
	import {GettimeifferenceOfNow} from "@/utils/dateUtils";
	/**
	 * officialMessageItem 官方消息的列表项
	 * @description 官方消息的列表项
	 * @Author: 穆兰
	 * @Date: 2022/1/16
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/16
	 * @property {Object} [officialNews]    - 官方消息的数据
	 * @event {Function} click 点击此组件
	 * @event {Function} clickMore 点击组件上的更多按钮
	 */
	export default {
		name:"official-message-item",
		props:{
			officialNews:{
				type:Object,
				required:true
			}
		},
		computed:{
			lastTime(){
				return GettimeifferenceOfNow(this.officialNews.lastTime).DistanceNow
			},
			newsText(){
				return this.officialNews.lastText.length> 15 ?
									officialNews.lastText.slice(0, 15) + '...' : officialNews.lastText
			},
			unreadSum(){
				return this.officialNews.unreadSum  > 99 ? '···' : officialNews.unreadSum
			}
		},
		
		data() {
			return {
				ACTIVITY,
				PUNISH
			};
		},
		methods:{
			/**
			 * @description 点击主体
			 */
			onClick(){
				this.$emit('click')
			},
			/**
			 * @description 点击更多按钮
			 */
			onClickMore(){
				this.$emit('clickMore')
			}
		}
	}
</script>

<style lang="scss">
	.official-news-content{
		display: flex;
		width: 98%;
		flex-direction: row;
		margin-top: 1%;
		padding: 2% 1%;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
	}
	.official-news-avatar{
	    position: relative;
	    width: fit-content;
	    height: fit-content;
	    padding: 5rpx;
	    background-color: #c4c4c4;
	    border-radius: 50%;
	    display: flex;
	    text-align: center;
	    align-items: center;
	    justify-content: center;
	    .online-state-point{
	        position: absolute;
	        bottom: 0;
	        right: 0;
	        width: 20rpx;
	        height: 20rpx;
	        border-radius: 10rpx;
	    }
	}
	
	.official-news-info{
	    flex-grow: 1;
	    display: flex;
	    text-align: left;
	    flex-direction: column;
	    align-items: center;
	    margin-left: 20rpx;
	
	}
	.official-news-info-upper{
	    width: 100%;
	    flex-grow: 1; 
	    display: flex;
	    flex-direction: row;
	    .official-news-name{
	        display: flex;
	        text-align: center;
	        align-items: center;
	        justify-items: center;
	        font-size:35rpx;
	        color: #000000;
	        flex-grow: 1;
	    }
	    .official-news-time{
	        display: flex;
	        text-align: center;
	        align-items: center;
	        justify-items: center;
	        font-size: small;
	        color: #9c9c9c;
	        margin:0 10rpx ;
	    }
	    .official-news-more{
	        text-align: center;
	        margin:0 10rpx ;
	    }
	
	}
	
	.official-news-info-lower{
	    display: flex;
	        text-align: center;
	        align-items: center;
	        justify-items: center;
	    width: 100%;
	    text-align: left;
	    flex-grow: 1;
	    .official-news-text{
	        flex: 1;
	        font-size: 30rpx;
	        color: #858585;
	    }
	    .official-news-badge{
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
</style>
