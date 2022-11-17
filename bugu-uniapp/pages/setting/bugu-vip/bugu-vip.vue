<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">布咕会员</view>
		</uni-nav-bar>
		<view class="header">
			<!-- 背景辅助样式 -->
			<view class="bg-w">
				<view class="bg" />
			</view>
			<!-- 用户信息展示 -->
			<view class="cont">
				<view class="my-vip-info">
					<block v-if="userInfo.id">
						<view class="avatar-content">
							<image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
						</view>
						<view class="username-and-vip-info">
							<view class="username">
								{{userInfo.username}}
							</view>
							<view class="vip-info">
								{{userInfo.vip&&userInfo.vip.remainDays>0?
							'您的会员剩余' + userInfo.vip.remainDays + '天'
							:'开通布咕会员，享更多权益'}}
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- VIP权益展示 -->
		<view class='vip-interests'>
			<view class='interests-item'>
				<image class='interests-image' src='/static/svgs/vip-huiyuan.svg'>
				</image>
				<view class='interests-text'>
					身份标识
				</view>
			</view>
			<view class='interests-item'>
				<image class='interests-image' src='/static/svgs/vip-yonghuchaxun.svg'>
				</image>
				<view class='interests-text'>
					查看访客
				</view>
			</view>
			<view class='interests-item'>
				<image class='interests-image' src='/static/svgs/vip-zhuangshi.svg'>
				</image>
				<view class='interests-text'>
					自定义主页
				</view>
			</view>
			<view class='interests-item'>
				<image class='interests-image' src='/static/svgs/vip-xihuan.svg'>
				</image>
				<view class='interests-text'>
					盲盒劵
				</view>
			</view>
			<view class='interests-item'>
				<image class='interests-image' src='/static/svgs/vip-liuyan.svg'>
				</image>
				<view class='interests-text'>
					消息漫游
				</view>
			</view>
		</view>
		<!-- VIP种类展示 -->
		<view class='vip-type'>
			<view class='vip-type-card' @click="onVipTypeClick(0)" :style="{
					backgroundColor: typeSelect==0 ?'#ffefdb':'#ffffff',
					border: typeSelect==0 ?'2px solid #deb887':'2px solid #ffffff00'
				}">
				<view class='vip-type-title'>
					月度会员
				</view>
				<view class='vip-type-price'>
					￥19
				</view>
				<view class='vip-type-tips'>
					畅享一个月会员权益
				</view>
			</view>
			<view class='vip-type-card' @click="onVipTypeClick(1)" :style="{
					backgroundColor: typeSelect==1 ?'#ffefdb':'#ffffff',
					border: typeSelect==1 ?'2px solid #deb887':'2px solid #ffffff00'
				}">
				<view class='vip-type-title'>
					季度会员
				</view>
				<view class='vip-type-price'>
					￥45
				</view>
				<view class='vip-type-tips'>
					畅享一个季度会员权益
				</view>
			</view>
			<view class='vip-type-card' @click="onVipTypeClick(2)" :style="{
					backgroundColor: typeSelect==2 ?'#ffefdb':'#ffffff',
					border: typeSelect==2 ?'2px solid #deb887':'2px solid #ffffff00'
				}">
				<view class='vip-type-title'>
					年度会员
				</view>
				<view class='vip-type-price'>
					￥150
				</view>
				<view class='vip-type-tips'>
					畅享一年会员权益
				</view>
			</view>
		</view>
		<!-- 领取方式展示 -->
		<!-- <view class='vip-activities'>
			<view class='vip-activity-content' @click="getFreeVip">
				<view class='vip-activity-text'>
					<view class='vip-activity-title'>
						限时福利①
					</view>
					<view class='vip-activity-info'>
						新用户注册领取一个月VIP
					</view>
				</view>
				<view class='vip-activity-button-content'>
					<view class='vip-activity-button'>
						立即领取
					</view>

				</view>
			</view>
		</view> -->
		<view class='vip-activities'>
			<view class='vip-activity-content' @click="getVipByActivitySum">
				<view class='vip-activity-text'>
					<view class='vip-activity-title'>
						限时福利①
					</view>
					<view class='vip-activity-info'>
						连续发布五条动态领取vip
					</view>
				</view>
				<view class='vip-activity-button-content'>
					<view class='vip-activity-button'>
						立即领取
					</view>
				</view>
			</view>
		</view>
		<view class='vip-page-footer'>
			<view class='vip-footer-botton'>
				立即开通
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		REQUEST_SUCCEEDED_CODE,
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {
		getUserinfo,
	} from "@/common/requestFunctions"
	/**
	 * buguVip 布咕会员
	 * @description 布咕会员开通界面
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {


		data() {
			return {
				userInfo: {},//用户信息
				typeSelect: 0//选择的vip类型
			}
		},
		onLoad() {
			this.refreshUserInfo()
		},
		methods: {
			/**
			 *@description 点击返回按钮 
			 */
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 更新用户信息
			 */
			async refreshUserInfo() {
				uni.showLoading({
					title: "加载中"
				})
				let userInfoBefore = await getMyUserInfo()
				this.userInfo = await getUserinfo(userInfoBefore.id)
				uni.hideLoading()
			},
			/**
			 * @description 选择vip的种类
			 * @param {number} select 选择的第几个
			 */
			onVipTypeClick(select: number) {
				this.typeSelect = select
			},
			/**
			 * @description 点击开通会员的按钮
			 */
			onOpenVipClick() {
				uni.showModal({
					title: '开通会员',
					content: '暂时还不能开通哦~，参加官方活动可以免费领取会员哦~'
				})
			},
			/**
			 * @description 新用户领取一个月vip
			 */
			async getFreeVip() {
				uni.showLoading({
					title: "领取中"
				})
				let res = await request({
					data: {
						method: 'PUT',
						group: 'welfare',
					 action: `vip/oneMonth`,
						data: {

					 },
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值

						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					uni.showToast({
						title: '领取成功',
						icon: 'success'
					})
					this.refreshUserInfo()
				}
			},
			/**
			 * 
			 * @function 连续发布五条动态领取vip
			 */
			async getVipByActivitySum() {
				let res = await request({
					data: {
						method: 'PUT',
						group: 'welfare',
						action: `getByActivitySum`,
						data: {

						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值

						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					uni.showToast({
						title: '领取成功',
						icon: 'success'
					})
					this.refreshUserInfo()
				}
			}
		}
	}
</script>

<style lang="scss">
	.my-vip-info {
		position: relative;
		z-index: -1;
		padding: 20rpx 30rpx;
		margin: 0px 5%;
		margin-top: 10%;
		margin-bottom: 0;
		background-color: #ffe9cc85;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		.username-and-vip-info {
			margin-left: 20rpx;
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.username {
			width: 100%;
			text-align: left;
			color: #633a05;
			font-size: large;
		}

		.vip-info {
			width: 100%;
			text-align: left;
			color: #633a05;
			font-size: small;
		}
	}

	.header {
		position: relative;
		margin: 0 auto;
		/*max-width: 990px;*/
	}

	.bg-w {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		overflow: hidden;
	}

	.bg-w .bg {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 600%;
		height: 2000rpx;
		border-radius: 50%;
		border: 1rpx solid #deb887;
		background-color: burlywood;
		transform: translate(-50%, 0);
	}

	.header .cont {
		position: relative;
		z-index: 2;
		padding: 20rpx 0;
		text-align: center;
		color: #fff;
	}

	.vip-type {
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.vip-type-card {
		width: 25%;
		height: 300rpx;
		margin: 0 4.15%;
		background-color: #ffffff;
		border-radius: 20rpx;

		.vip-type-title {
			margin: 30rpx 0px;
			color: #633a05;
			font-size: medium;
		}

		.vip-type-price {
			margin: 40rpx 0px;
			font-size: larger;
			font-weight: bold;
			color: #633a05;
		}

		.vip-type-tips {
			margin: 30rpx 10rpx;
			color: #949494;
			font-size: 20rpx;
		}
	}

	.vip-page-footer {
		position: absolute;
		bottom: 0;
		height: 9vh;
		width: 100%;
		display: flex;
		align-items: center;

		.vip-footer-botton {
			text-align: center;
			flex-grow: 1;
			margin: 20rpx 10%;
			padding: 20rpx;
			background-color: burlywood;
			border-radius: 20rpx;
			color: #633a05;
		}
	}

	.vip-interests {
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		.interests-item {
			flex-grow: 1;
		}

		.interests-image {
			width: 70rpx;
			height: 70rpx;
		}

		.interests-text {
			font-size: small;
			color: #633a05;
		}
	}

	.vip-activities {
		margin: 4.15%;

		.vip-activity-content {
			display: flex;
			padding: 15rpx;
			background-color: #ffe9cc;
			border-radius: 20rpx;
			align-items: center;
			justify-content: center;
		}

		.vip-activity-text {
			flex-grow: 1;

			.vip-activity-title {
				width: 100%;
				text-align: left;
				color: #633a05;
				font-size: large;
			}

			.vip-activity-info {
				width: 100%;
				text-align: left;
				color: #633a05;
				font-size: medium;
			}
		}

		.vip-activity-button-content {
			width: 200rpx;
			text-align: center;

			.vip-activity-button {
				text-align: center;
				padding: 10rpx 20rpx;
				background-image: linear-gradient(to right, #fed353, #febc2b);
				border-radius: 20rpx;
				color: #633a05;
			}
		}
	}
</style>
