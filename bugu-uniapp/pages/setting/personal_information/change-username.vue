<template>
	<view class="page">
		<view class="change-username-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">更改昵称</view>
			</uni-nav-bar>
			<input :value="username" @input="onUsernameInput" class="change-username-input" />
			<view class="change-username-tips">
				好的名字更容易遇见有趣的人哦~
			</view>
			<button class="change-username-button main-color" @click="onSaveButtonClick()">保存并退出</button>
		</view>
	</view>
</template>

<script>
	import {REQUEST_SUCCEEDED_CODE} from "@/common/constants";
	import {request} from "@/utils/request";
	import {REFRESH_USERINFO} from "@/common/globalMsgKeys"
	/**
	 * changeUsername 修改用户名
	 * @description 修改用户名界面
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				username:''
			}
		},
		onLoad(params){
			
			this.username = params.username
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
			/**
			 * @description  输入时
			 * @param {Object} e
			 */
			onUsernameInput(e){
				this.username = e.detail.value
			},
			/**
			 * @description  点击保存按钮
			 */
			onSaveButtonClick(){
				if(this.username.length<1){
					uni.showToast({
						title:"请先输入昵称",
						icon:"error"
					})
					return
				}
				if(this.username.length>16){
					uni.showToast({
						title:"昵称不能超过16个字符",
						icon:"error"
					})
					return
				}
				this.changeName(this.username)
			},
			/**
			 * @description  修改姓名
			 * @param {string} newUsername
			 */
			async changeName(newUsername) {
				uni.showLoading({
					title:"修改中"
				})
			    let res = await request({
			      data: {
			        method: 'POST',
			        group: 'user',
			        action: `username/change/${newUsername}`,
			        data: {
			          username: newUsername
			        },
			        header: {
			          'content-type': 'application/x-www-form-urlencoded',// 默认值
			
			        },
			      }
			    });
				uni.hideLoading()
			    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					uni.$emit(REFRESH_USERINFO,{needRefresh:true})
			        uni.navigateBack()
			    }
			  }
		}
	}
</script>

<style>
	.change-username-input{
		padding: 2%;
		background-color: #FFFFFF;
		margin: 1%;
	}
	.change-username-tips{
		font-size: smaller;
		color: #C0C0C0;
		margin-left: 2%;
	}
	.change-username-button{
		margin: 2%;
		font-weight: bold;
		color: #fff;
	}
</style>
