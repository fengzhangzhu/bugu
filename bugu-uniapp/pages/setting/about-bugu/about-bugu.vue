<template>
	<view class="page">
		<view class="body-box">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">关于布咕星球</view>
			</uni-nav-bar>
			<view class='logo-content'>
				<view class='about-logoicon'>
					<image class='about-logo-image' :style="{
			                height: '90px',
			                width: '90px',
			                borderRadius: '30px'
			              }" src='/static/imgs/logo.png' mode='aspectFit'></image>
				</view>
				<view class='about-logo-image-content'>
					<image class='about-logo-image' :style="{
			                height: '25px',
			                width: '110px',
			              }" src='/static/imgs/logo-text.png'></image>
				</view>
			</view>
			<view class='version-number'>
				版本 {{AppVersion}}
			</view>
			<view class='hbutliving-content'>
				<view class='hbutliving-logo'>
					<image class='about-logo-image' :style="{
			                height: '30px',
			                width: '30px',
			              }" src='/static/imgs/hbutliving-logo.png'></image>
				</view>
				<view class='hbutliving-text'>
					湖工Living 出品
				</view>
			</view>
			<view class='update-log'>
				<uni-list-item clickable showArrow link to="/pages/setting/about-bugu/update-log" title='更新日志' arrow='right' />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		AppVersion
	} from "@/common/constants"
	/**
	 * aboutBugu 关于布咕星球
	 * @description 关于布咕星球
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				AppVersion,
			}
		},
		methods: {
			/**
			 *@description 点击返回按钮 
			 */
			onNarLeftClick(){
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.body-box {
		min-height: 100vh;
		width: 100vw;
		background: #FFFFFF;
		background-color: transparent;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}


	.about-logoicon {
		margin: 0 auto;
		margin-top: 20%;
		width: fit-content;
		height: fit-content;
		text-align: center;

	}

	.version-number {
		width: fit-content;
		text-align: center;
		margin: 20rpx auto;
		font-size: large;
		color: #929292;

	}

	.hbutliving-content {
		margin-top: 40rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.login-logo-image {
			border-radius: 10rpx;
		}

		.hbutliving-text {
			margin-left: 20rpx;
			color: #929292;
			font-size: medium;
		}
	}

	.update-log {
		margin: 20rpx 0rpx;
	}

	.about-logo-image-content {

		width: 100%;
		text-align: center;
		margin-top: 5%;
	}
</style>
