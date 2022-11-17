<template>
	<view class="visitor-item-content">
		<view class="user-avatar">
			<view class="user-item-avatar-content">
				<image
				class="user-item-avatar"
				mode="aspectFill"
				:src="avatar+'?imageView2/1/w/100/h/100'"
				:style="{
					filter:unlocked?'none':' blur(10rpx)'
				}"
				></image>
			</view>
			
		</view>
		<view class="visit-info"> 
			<view class="user-name">
				{{username}}
			</view>
			<view class="visit-sum">
				上次访问{{lastTime}}
			</view>
		</view>
		<view class="unlock-button-content">
			<view class="unlock-button"
			@click="onUnlockButtonClick"
			>
				{{unlocked?'去Ta的主页':'解锁访客'}}
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {request} from "@/utils/request";
	import {REQUEST_SUCCEEDED_CODE,AnonymousAvatars} from "@/common/constants";
	import {GettimeifferenceOfNow} from "@/utils/dateUtils";
	/**
	 * visitorItem 访客列表的单个项
	 * @description 访客列表的单个项
	 * @Author: 穆兰
	 * @Date: 2022/1/16
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/16
	 * @property {Object} [item]    - 项数据
	 */
	export default {
		name:"visitor-item",
		props:{
			item:{
				type:Object,
				required:true,
			}
		},
		data() {
			return {
				unlocked:false,
				visitorInfo:{}
			};
		},
		computed:{
			avatar(){
				return this.unlocked&&this.visitorInfo.avatar?this.visitorInfo.avatar:this.item.avatar
			},
			username(){
				return  this.unlocked&&this.visitorInfo.username?this.visitorInfo.username:`已经访问过你${this.item.visitSum}次了`
			},
			lastTime(){
				return GettimeifferenceOfNow(this.item.lastTime).DistanceNow
			},
			
		},
		methods:{
			/**
			 * @description 点击解锁用户的按钮
			 */
			onUnlockButtonClick(){
				if(this.unlocked){
					uni.navigateTo({
						url: `/pages/user-home-page/user-home-page?userId=${this.visitorInfo.id}&isAttention=${this.visitorInfo.isAttention}`
					})
				}else{
					this.unLockVisitor(this.item.visitorId)
				}
			},
			/**
			 * @description 解锁隐身用户
			 * @param {number}  visitorId 用户的id
			 */
			async unLockVisitor(visitorId: number) {
				uni.showLoading({
					title:"正在解锁"
				})
				let res = await request({
					data: {
						method: 'GET',
						group: 'user/visitor',
						action: `${visitorId}/unlock`,
						data: {
							visitorId: visitorId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded',// 默认值
		
						},
					}
				});
				uni.hideLoading()
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
				    this.unlocked=true,
					this.visitorInfo=res.data.data
				   uni.showToast({
					   title:'解锁成功',
					   icon:'success'
				   })
					return true
				} else if (res.data.code === 'A0203') {
					uni.showModal({
						title: '没有权限',
						content: '只有vip才能查看访客哦~',
						cancelText: '我知道了',
						confirmText: '立即充值',
						success: function (e) {
							if (e.confirm) {
							   uni.navigateTo({
								   url:'/pages/setting/bugu-vip/bugu-vip'
							   })
							} else if (e.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
.visitor-item-content{
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    padding: 1% 2%;
    margin: 1% 0;
    background-color: #fff;
	.visit-info{
		text-align: left;
		flex-grow: 1;
		padding-left:20rpx;
		.user-name{
			font-size: medium;
			color: #7d7d7d;
		}
		.visit-sum{
			color: #aaaaaa;
			font-size: small;
			font-weight: lighter;
		}
	}
	.unlock-button-content{
	    
	   width: 30%;
	    
	}
	.unlock-button{
	    padding: 5rpx 20rpx;
	    width: fit-content;
	    background-color: #bbbbbb;
	    color: #FFF;
	    border-radius: 30rpx;
	    margin: 0 auto;
	    text-align: center;
	    font-size: smaller;
	    font-weight: bold;
	    
	}
	.user-item-avatar-content{
	    width: 80rpx;
	    height: 80rpx;
	    border-radius: 50%;
		overflow: hidden;
	}
	.user-item-avatar{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #75e4d2;
		
		
	}
}
</style>
