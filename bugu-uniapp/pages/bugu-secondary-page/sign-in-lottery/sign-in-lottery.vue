<template>
	<view class="page">

		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">签到抽奖</view>
		</uni-nav-bar>
		<view class="sign-in-lottery-content">
			<!-- 标题 -->
			<view class="lottery-title"> daily attendance </view>
			<!-- 提示 -->
			<view class="lottery-tips"> 每天签到领取vip! </view>
			<!-- 进度条 -->
			<view class="sign-process">
				<view class="sign-process-compelete" v-bind:style="{ width: (signInfo.signInDays / 7) * 100 + '%' }">
				</view>
				<view class="sign-process-text">
					已连续签到{{ signInfo.signInDays }}天
				</view>
			</view>
			<!-- 签到块 -->
			<view class="sign-blocks-content">
				<view class="sign-block-conetnt" v-for="(item, index) in [1, 2, 3, 4, 5, 6]" :key="index" :style="{
            alignItems:
              (index + 1) % 3 == 2
                ? 'center'
                : (index + 1) % 3 == 0
                ? 'flex-end'
                : 'flex-start',
            justifyContent:
              (index + 1) % 3 == 2
                ? 'center'
                : (index + 1) % 3 == 0
                ? 'flex-end'
                : 'left',
          }">
					<view class="sign-block" :style="{
              backgroundImage:
                index < signInfo.signInDays
                  ? 'linear-gradient(to bottom, #42e1e3, #40e399);'
                  : '#ffe6cb',
            }">
						<view class="sign-block-number-bg">
							{{ index + 1 }}
						</view>
						<view class="sign-block-text"> 第{{ index + 1 }}天 </view>
					</view>
				</view>
				<view class="sign-block-conetnt" style="width: 100%">
					<view class="sign-block" :style="{
              backgroundImage:
                signInfo.signInDays >= 7
                  ? 'linear-gradient(to bottom, #42e1e3, #40e399);'
                  : '#ffe6cb',
              width: '100%',
            }">
						<view class="sign-block-number-bg">
							<image class="lucky-draw-icon" :mode="'aspectFill'" :src="'../../../static/svgs/medal.svg'">
							</image>
						</view>
						<view class="sign-block-text"> 第7天 </view>
					</view>
				</view>
			</view>
			<!-- 规则 -->
			<view class="sign-rules">
				<view class="rule-item">
					<view class="emphasis-esymbol"></view>
					<view class="rule-item-text">签到每天从凌晨开始</view>
				</view>
				<view class="rule-item">
					<view class="emphasis-esymbol"></view>
					<view class="rule-item-text">漏签需要重新开始哦</view>
				</view>
				<view class="rule-item">
					<view class="emphasis-esymbol"></view>
					<view class="rule-item-text">连续签到7天获取一个月VIP服务</view>
				</view>
			</view>
			<!-- 签到按钮 -->
			<view class="sign-button" @click="onSignButtonClick()">
				{{
          signInfo.signInDays >= 7
            ? signInfo.getGiftToday
              ? "奖品已经领取"
              : "领取奖品"
            : signInfo.signInToday
            ? "今日已签到"
            : "签到"
        }}
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE
	} from "@/common/constants";
	interface SignInfo {
		signInDays: number;
		signInToday: boolean;
		getGiftToday: boolean;
	}
	/**
	 * signInLottery 签到领取vip界面
	 * @description 签到领取vip界面
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				signInfo: {
					signInDays: 0,
					signInToday: false,
					getGiftToday: false,
				} as SignInfo,
			};
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
			 * @description 点击签到按钮
			 */
			async onSignButtonClick() {
				if (this.signInfo.signInDays >= 7) {
					if (this.signInfo.getGiftToday) {
						uni.showToast({
							title: "奖品已领取",
							icon: "none",
						});
					} else {
						getSignGift();
					}
					return;
				}
				if (this.signInfo.signInToday) {

					return;
				} else {
					let res = await signIn();
					if (res) {
						this.signInfo = await getSignInfo();
					}
				}
			},
		},
		async mounted() {
			this.signInfo = await getSignInfo();
		},
	};

	/**
	 * @description 签到
	 * @returns {Promise<Boolean>}
	 */
	async function signIn(): Promise < Boolean > {
		let res = await request({
			data: {
				method: "PUT",
				group: "signIn",
				action: `signIn`,
				data: {},
				header: {
					"content-type": "application/x-www-form-urlencoded", // 默认值
				},
			},
		});
		if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			uni.showToast({
				title: "签到成功",
				icon: "success",
			});
			return true;
		} else {
			return false;
		}
	}
	/**
	 * @description 签到信息
	 * @returns {Promise<SignInfo>}
	 */
	async function getSignInfo(): Promise < SignInfo > {
		let res = await request({
			data: {
				method: "GET",
				group: "signIn",
				action: `info`,
				data: {},
				header: {
					"content-type": "application/x-www-form-urlencoded", // 默认值
				},
			},
		});
		if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			let signInfo = res.data.data as SignInfo;
			return signInfo;
		} else {
			return {
				signInDays: 0,
				signInToday: false,
				getGiftToday: false,
			} as SignInfo;
		}
	}
	/**
	 * @description 获取签到礼品
	 */
	async function getSignGift() {
		let res = await request({
			data: {
				method: "POST",
				group: "signIn",
				action: `getGift`,
				data: {},
				header: {
					"content-type": "application/x-www-form-urlencoded", // 默认值
				},
			},
		});
		if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			uni.showToast({
				title: "奖品领取成功",
			});
		}
	}
</script>

<style lang="scss">
	.sign-in-lottery-content {
		margin: 30rpx;
		border-radius: 30rpx;
		background-color: #fff;
		height: fit-content;
		text-align: center;
		padding: 40rpx 30rpx;
	}

	.lottery-title {
		width: 100%;
		font-size: 60rpx;
		color: #000;
		font-weight: 900;
	}

	.lottery-tips {
		width: 100%;
		margin-top: 10rpx;
		font-size: medium;
		color: #818181;
	}

	.sign-process {
		position: relative;
		margin-top: 50rpx;
		height: 50rpx;
		background-color: #eeeeee;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.sign-process-compelete {
			transition: all 300ms;
			left: 0;
			top: 0;
			z-index: 99;
			position: absolute;
			height: 100%;
			background-color: #4eccb8;
			border-radius: 20rpx;
		}

		.sign-process-text {
			z-index: 100;
			font-size: small;
		}
	}

	.sign-blocks-content {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;

		.sign-block-conetnt {
			width: 33.3%;

			margin-top: 70rpx;
			display: flex;
		}

		.sign-block {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 170rpx;
			width: 170rpx;
			border-radius: 30rpx;
			// background-image: linear-gradient(to bottom, #42e1e3, #40e399);
			background: #ffe6cb;

			.sign-block-text {
				z-index: 100;
				font-size: large;
				font-weight: lighter;
			}

			.sign-block-number-bg {
				position: absolute;
				font-size: 150rpx;
				font-weight: bold;
				color: #fff;
				opacity: 0.4;
				z-index: 99;
				display: flex;
				align-items: center;
				justify-content: center;

				.lucky-draw-icon {
					width: 130rpx;
					height: 130rpx;
				}
			}
		}
	}

	.sign-rules {
		text-align: left;
		margin-top: 50rpx;

		.rule-item {
			margin-top: 10rpx;
			color: #909090;
			display: flex;
			align-items: center;

			.emphasis-esymbol {
				background-color: #4eccb8;
				width: 14rpx;
				height: 14rpx;
				border-radius: 7rpx;
			}

			.rule-item-text {
				font-size: small;
				margin-left: 10rpx;
			}
		}
	}

	.sign-button {
		margin: 0 auto;
		margin-top: 30rpx;
		width: 100%;
		padding: 20rpx 0rpx;
		font-size: larger;
		color: #fff;
		background-color: #4eccb8;
		border-radius: 20rpx;
	}
</style>
