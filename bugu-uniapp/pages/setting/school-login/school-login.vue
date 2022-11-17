<template>
	<view class="page">
		<view class="account-login-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">学生认证</view>
			</uni-nav-bar>
			<!-- 标题和提醒 -->
			<view class="identify-title">
				登录学校个人门户认证
			</view>
			<!-- 输入框 -->
			<view class="input-content">
				<uni-forms class="login-form-atform">
					<uni-forms-item required="true" label="用户名" name="username">
						<uni-easyinput :value="username" @input="onUsernameInput" class="login-form-input"
							type="text" placeholder="请输入用户名" />
					</uni-forms-item>
					<uni-forms-item required="true" label="密码" name="password">
						<uni-easyinput :value="password" @input="onPasswordInput" class="login-form-input"
							type="password" placeholder="请输入密码" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<!-- 底部 -->
			<view class="login-bottom">
				<!-- 用户协议和隐私政策 -->
				<view class="login-useragreement-content">
					<checkbox :color="MainColor" class='login-useragreement' @click="onCheckBoxClick()"
						:checked="agreest">
					</checkbox>已阅读并同意<text @click.stop="onUserProtocolClick" 
			class='login-agreement1'>《用户协议》</text>和<text @click.stop="onPrivacyPolicyClick"
			 class='login-agreement2'>《隐私政策》</text>
				</view>
				<!-- 登录按钮 -->
				<button :color="MainColor" class="login-form-button" @click="onLoginButtonClick()">登录</button>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { request } from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE,
		MainColor
	} from '@/common/constants';
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import { USER_INFO } from "@/common/storageKeys";
	/**
	 * schoolLogin 登录学校官网认证
	 * @description 登录学校官网认证
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				username: '',
				password: '',
				agreest: false,
				MainColor
			}
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
			 * @event {Function()} 点击同意checkbox 
			 */
			onCheckBoxClick() {
				this.agreest = !this.agreest
			},
			/**
			 * @event {Function()} 输入密码的input响应事件 
			 * @param {Object} e 事件
			 */
			onPasswordInput(e) {
				
				this.password = e
			},
			/**
			 * @event {Function()} 输入用户名的input响应事件 
			 * @param {Object} e 事件
			 */
			onUsernameInput(e) {
				this.username = e
			},
			/**
			 * @description 点击用户协议文字
			 */
			onUserProtocolClick(){
				uni.navigateTo({
					url: "/pages/login/bugu-use-protocol/bugu-use-protocol"
				})
			},
			/**
			 * @description 点击隐私政策文字
			 */
			onPrivacyPolicyClick(){
				uni.navigateTo({
					url: "/pages/login/bugu-privacy-policy/bugu-privacy-policy"
				})
			},
			/**
			 * @description 点击登录按钮
			 */
			onLoginButtonClick() {
				if (this.username && this.password) {
					if(this.agreest){
						this.tryToLogin(this.username, this.password)
					}else{
						uni.showToast({
							title: "请先同意用户协议和隐私政策",
							icon: 'none'
						})
					}	
				} else {
					uni.showToast({
						title: "请先输入用户名或密码",
						icon: 'none'
					})
				}
			},
			/**
			 * @function 登录湖工大教务处
			 * @param username 用户名
			 * @param password 密码
			 * @returns 
			 */
			async tryToLogin(username:string, password:string) {
				uni.showLoading({
					title: '正在登陆'
				})

				try {
					let res = await request({
						data: {
							method: 'POST',
							group: 'verify',
							action: 'login',
							data: {
								username: username,
								password: password
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded' // 默认值
							},
						}
					});
					uni.hideLoading()
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						uni.showToast({
							title: '认证成功',
							icon: 'success'
						})
						let userInfo = await getMyUserInfo()
						userInfo.isVerify = 1
						uni.setStorage({
							key:USER_INFO,
							data:userInfo
						})
						 setTimeout(function (){
							uni.navigateBack({
								delta: 1
							});
						},1000)
					}
				} catch {
					uni.showToast({
						title: '登录失败，请稍后再试',
						icon: 'none'
					})
				}
			}
		},
	}
</script>

<style>
	.account-login-content {
		height: 100vh;
		background-color: #ffffff;
	}

	.identify-title {
		margin-top: 150rpx;
		width: 100%;
		text-align: center;
		font-size: 50rpx;
	}

	.input-content {
		margin-top: 100rpx;
		padding: 2%;
	}

	.login-bottom {
		margin-top: 20rpx;
		padding: 2%;
	}

	.login-form-button {
		margin-top: 50rpx;
		background-color: #4eccb8;
		color: #FFFFFF;
	}

	.login-useragreement-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		margin: 0 auto;
		margin-top: 20rpx;
		color: #6d6d6d;
	}

	.login-useragreement {
		transform: scale(0.7);
		flex-grow: 1;
		font-size: 20rpx;
	}

	.login-agreement1 {
		color: #0083FB;

	}

	.login-agreement2 {
		color: #0083FB;

	}
</style>
