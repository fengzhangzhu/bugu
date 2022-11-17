<template>
	<view class="page">
		<view class="my-info-setting-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">个人资料设置</view>
			</uni-nav-bar>
			<view class="setting-items-content">
				<uni-list>
					<!-- 头像 -->
					<uni-list-item clickable :thumb="avatar" thumbSize="lg" showArrow  rightText="修改头像" 
					@click="onChangeAvatarClick"
					/>
					<!-- 昵称 -->
					<uni-list-item clickable showArrow link :to="`/pages/setting/personal_information/change-username?username=${username}`" title="昵称" :rightText="username"/>
					<!-- 性别 -->
					<picker mode="selector" :range="sexGrounp" :value="sex" @change="onSexPickerChange">
						<uni-list-item clickable showArrow title="性别"  :rightText="sex==-1?'未设置':sexGrounp[sex]"/>
					</picker>
					<!-- 是否实名认证 -->
					<uni-list-item clickable showArrow title="是否实名认证"  :rightText="isVerify==1?'已实名认证':'未实名认证'" />
				</uni-list>
			</view>
		</view>
		<!-- 修改头像的对话框 -->
		<uni-popup ref="changeAvatarPopup" type="center">
				<view v-if="avatar" class="change-avatar-content">
					<view class="change-avatar-content-title">
						修改头像
					</view>
					<view class="avatar-content">
						<image :src="avatar" class="avatar-image" mode="aspectFill"/>
					</view>
					<view class="select-image-way"
					@click="onSeletImage('camera')"
					>
						拍照
					</view>
					<view class="select-image-way"
					@click="onSeletImage('album')">
						从相册选择
					</view>
				</view>
		</uni-popup>
	</view>
</template>

<script lang="ts">
	import { USER_INFO } from "@/common/storageKeys";
	import {getMyUserInfo} from "@/common/storageFunctions";
	import {getUserinfo} from "@/common/requestFunctions";
	import {UserInfo} from "@/common/dataClass";
	import {REQUEST_SUCCEEDED_CODE,UploadUrl,sexGrounp} from "@/common/constants";
	import aes from '@/utils/aes/export';
	import {request} from "@/utils/request";
	import {REFRESH_USERINFO} from "@/common/globalMsgKeys";
	/**
	 * personalInfomation 用户信息
	 * @description 用户信息界面
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				userId:0,//id
				username:'',//用户名
				avatar:'',//头像
				sex:0,//性别
				isVerify:0,//是否实名认证
				sexGrounp//性别选择组
			}
		},
		onLoad(){
			this.refreshUserInfo()
		},
		onShow(){
			let _this = this
			 uni.$once(REFRESH_USERINFO,function(data){
			        if(data.needRefresh){
						_this.refreshUserInfo()
					}
			    })
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
			 * @description  刷新用户信息
			 */
			async refreshUserInfo(){
				let userInfoBefore = await getMyUserInfo() as UserInfo
				let userInfoNow = await getUserinfo(userInfoBefore.id)
				if(userInfoNow){
					uni.setStorage({
						key:USER_INFO,
						data:userInfoNow
					})
					this.id = userInfoNow.id
					this.username = userInfoNow.username
					this.avatar = userInfoNow.avatar
					this.sex = userInfoNow.sex == null?-1:userInfoNow.sex
					this.isVerify = userInfoNow.isVerify
				}
			},
			/**
			 * @description 点击修改头像
			 */
			onChangeAvatarClick(){
				this.$refs.changeAvatarPopup.open()
			},
			/**
			 * @description 更换用户名
			 * @param {Object} e
			 */
			onSexPickerChange(e){
				this.changeSex(e.detail.value)
			},
			/**
			 * @description 选择照片
			 * @param {string} type 选择图片的方式 album-相册 camera-拍照
			 */
			onSeletImage(type:string){
				let _this=this
				uni.chooseImage({
					count:1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
					success: function (res) {
					  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					  var tempFiles =res.tempFilePaths
					  _this.changeAvatar(tempFiles[0])
					}
				  })
			},
			/**
			 * @description 修改头像
			 * @param {string} fileUrl 文件的url
			 */
			async changeAvatar(fileUrl: string) {
			    uni.showLoading({
			      title: '正在发布'
			    })
			    //先获取上传图片的凭证
			    let res = await request({
			      data: {
			        method: 'GET',
			        group: 'user',
			        action: 'avatar/token',
			        data: {
			
			        },
			        header: {
			          'content-type': 'application/x-www-form-urlencoded', // 默认值
			
			        },
			      },
			    })
			    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			      let fileName = res.data.data.fileName
			      let fileToken = res.data.data.token
			      let _this = this
			      uni.uploadFile({
			        url: UploadUrl,
			        filePath: fileUrl,
			        name: 'file',
			        formData: {
			          'key': fileName,
			          'token': aes.decrypt(fileToken)
			        },
			        async success(fileRes) {
			          let AvatarChangeRes = await request({
			            data: {
			              method: 'POST',
			              group: 'user',
			              action: 'avatar/change',
			              data: {
			                fileName
			              },
			              header: {
			                'content-type': 'application/x-www-form-urlencoded', // 默认值
			
			              },
			            },
			          })
			          if (AvatarChangeRes.data.code === REQUEST_SUCCEEDED_CODE) {
			            uni.showToast({
			              title: '更换头像成功'
			            })
			            _this.$refs.changeAvatarPopup.close()
			            _this.refreshUserInfo()
						uni.$emit(REFRESH_USERINFO,{needRefresh:true})
			          }
			        }
			      })
			    }
			},
			/**
			 * @description 修改性别
			 * @param {number} sex 0-女 1-男 
			 */
			async changeSex(sex:number){
				uni.showLoading({
					title:'修改中'
				})
				let res = await request({
				  data: {
					method: 'POST',
					group: 'user',
					action: 'sex/update',
					data: {
					 sex:sex
					},
					header: {
					  'content-type': 'application/x-www-form-urlencoded', // 默认值
		  
					},
				  },
				})
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					  uni.showToast({
						title: '修改性别成功'
					  })
					this.refreshUserInfo()
					uni.$emit(REFRESH_USERINFO,{needRefresh:true})
				}
			}
		}
	}
</script>

<style lang="scss">
.change-avatar-content{
	background-color: #FFFFFF;
	border-radius: 20rpx;
	width: 60vw;
	padding:30rpx 20rpx;
	height: fit-content;
	color: #6a6a6a;
	text-align: center;
	position: relative;
	display: block;
	.change-avatar-content-title{
		border-bottom: 1rpx solid #F0F0F0;
		font-size: large;
		
		padding: 10rpx;
	}
	.avatar-content{
		width: 100%;
		text-align: center;
		.avatar-image{
			height: 150rpx;
			width: 150rpx;
			border-radius: 75rpx;
		}
	}
	.select-image-way{
		width: 100%;
		padding: 10rpx 0rpx;
		margin: 20rpx 0;
		border: 1rpx solid #F0F0F0;
		border-radius: 10rpx;
		text-align: center;
	}
}

    
    

</style>
