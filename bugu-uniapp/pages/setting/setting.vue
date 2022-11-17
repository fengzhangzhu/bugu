<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick">
			<view class="bar-title">设置</view>
		</uni-nav-bar>
		<uni-list>
		    <uni-list-item clickable showArrow link to="/pages/setting/personal_information/personal_information" title="个人资料" thumb="/static/icons/user.png" thumb-size="medium" />
			<uni-list-item clickable showArrow link to="/pages/setting/bugu-vip/bugu-vip" title="布咕会员" thumb="/static/icons/crown.png" thumb-size="medium" />
			<uni-list-item clickable showArrow title="实名认证" thumb="/static/icons/security-scan.png" thumb-size="medium" @click="onRealNameAuthenticationClick()"/>
			<view class='split-line'/>
			<uni-list-item clickable showArrow link to="/pages/setting/sound-setting/sound-setting" title="声音设置" thumb="/static/icons/bell.png" thumb-size="medium" />
			<uni-list-item clickable showArrow link to="/pages/setting/help/help" title="帮助与反馈" thumb="/static/icons/question.png" thumb-size="medium" />
			<uni-list-item clickable showArrow link to="/pages/setting/about-bugu/about-bugu" title="关于布咕星球" thumb="/static/icons/read.png" thumb-size="medium" />
			<view class='split-line'/>
			<uni-list-item clickable showArrow title="清除聊天记录" thumb="/static/icons/clear.png" thumb-size="medium" @click="onClearCacheClick()" />
			<uni-list-item clickable showArrow title="退出登录" thumb="/static/icons/logout.png" thumb-size="medium" @click="onLogoutClick"/>
		</uni-list>
		<action-sheet ref="authenticationActionSheet" title="选择认证方式" needCancelButton="true" needHead="true">
			<action-sheet-item @click="onNavigateTo('/pages/setting/school-login/school-login')" title="登录学校官网认证(仅支持湖北工业大学)"/>
			<action-sheet-item @click="onNavigateTo('/pages/setting/real-name-authentication/real-name-authentication')" title="上传照片认证"/>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {getMyUserInfo} from "@/common/storageFunctions";
	import {deleteMessageRecord} from "@/utils/messageUtils/storage";
	import {USER_INFO,TOKEN} from "@/common/storageKeys";
	import {REFRESH_USERINFO,LOGOUT} from "@/common/globalMsgKeys";
	/**
	 * setting 设置界面
	 * @description 设置界面
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				userInfo:{}
			}
		},
		async onLoad(params){
			this.userInfo = await getMyUserInfo()
			let open_real_name_authentication = params.open_real_name_authentication
			if(open_real_name_authentication){
				this.$refs.authenticationActionSheet.open()
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
			/**
			 * @description 跳转到指定页面
			 * @param {string} url 页面跳转的url
			 */
			onNavigateTo(page_url){
				uni.navigateTo({
					url:page_url
				})
			},
			/**
			 * @description 点击实名认证
			 */
			onRealNameAuthenticationClick(){
				if(this.userInfo.isVerify==1){
					uni.showToast({
						title:"您已经完成实名认证",
						icon:"none"
					})
					return
				}
				this.$refs.authenticationActionSheet.open()
			},
			/**
			 * @description 点击清除缓存
			 */
			onClearCacheClick(){
				if(!this.userInfo.id){
					uni.showToast({
						title:"您还未登录，请先登录",
						icon:"error"
					})
					return
				}
				let _this = this
				uni.showModal({
					title:'清除聊天记录吗',
					content:"你确定要清除所有本地的聊天记录吗",
					success:function(res){
						if(res.confirm){
							deleteMessageRecord(_this.userInfo.id)
							uni.showToast({
								title:'清除成功'
							})
						}
					}
				})
				
			},
			/**
			 * @description 登出
			 */
			onLogoutClick(){
				uni.showModal({
					title:'退出登录',
					content:"你确定要退出登录吗？",
					success:function(res){
						if(res.confirm){
							uni.closeSocket()
							uni.setStorage({ key: TOKEN, data: null })
							uni.setStorage({ key: USER_INFO, data: null })
							uni.$emit(LOGOUT,{logout:true})
							uni.navigateBack({
								delta:1
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>
.split-line{
    margin: 10rpx 0rpx;
    height: 1rpx;
    width: 100%;
    background-color: #f5f5f5;
}
</style>
