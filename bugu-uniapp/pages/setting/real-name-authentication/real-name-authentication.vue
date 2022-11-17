<template>
	<view class="page">
		<view class="real-name-authentication-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">身份认证</view>
			</uni-nav-bar>
			<uni-transition class="emoji-picker-content" mode-class="zoom-in" :show="isSuccessed">
			<view  class="authentication-success">
				您已经提交认证信息，我们会尽快审核，感谢您为维护社区氛围做出的贡献
			</view>
			</uni-transition>
			<view v-if="!isSuccessed" class="authentication-info-content">
				一.认证流程
				<view class="authentication-tips">
					相关资料仅用于校园身份认证,并受隐私保护协议与相关法律保护，将严格保密
				</view>
				<view class="info-type">
					 1.请上传证明照片*
				</view>
				<!-- 照片容器 -->
				<view class="authentication-image-content"
				@click="onImageContentClick()"
				>
					<block v-if="fileUrl">
					<image :src="fileUrl" mode="scaleToFill" class="authentication-image"></image>
					</block>
					<block v-else>
						<view class='iconfont icon-xiangji'
						:style="{
								fontSize: '50px',
								color: '#979797'
							}"
						>
						</view>
						<view class='authentication-image-text'>
							请拍摄并上传清晰的学生证、一卡通、或录取通知书的照片
						</view>
					</block>
				</view >
				<!-- 说明 -->
				<view class="authentication-reason">
					<view>说明：</view>
					<view>
					  1. 请在本页提供一张录取通知书/学生证/校园卡/学位证/毕业证的正面照片
					</view>
					<view>
					  2. 照片必须保持清晰，但我们<text style="color:#fc1313;"
					  >不会采集或分析其中的信息，可以自行对学号、序列号、条形码等信息进行遮盖处理</text>
					</view>
					<view>
					  3. 后台将进行人工审核，保证信息符合要求
					</view>
					<view>
					  4. 对于蓄意伪造、冒用以及欺诈等行为，本方保留封禁乃至报案的权利
					  </view>
					  <view>
					  5. 其他用户无法得知您的实名认证信息
					  </view>
				</view>
				<view class="agree-content">
					<text style="color:#fc1313" >上传照片代表您已阅读并同意</text>
					<text style="color:#2c80ff" @click.stop="onPrivacyPolicyClick" >《布咕星球隐私保护指引》</text>
				</view>
				<button class="authentication-button main-color" @click="onSubmitButtonClick()">提交</button>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		request
	} from "@/utils/request";
	import {
		UploadUrl,
		REQUEST_SUCCEEDED_CODE
	} from "@/common/constants";
	import aes from '@/utils/aes/export';
	/**
	 * realNameAuthentication 实名认证界面
	 * @description 实名认证界面
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				isSuccessed:false,//是否提交认证成功
				fileUrl:''//提交照片的url
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
			 * @description  点击选择图片的方框
			 */
			onImageContentClick(){
				let _this = this
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
					success: function (res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFiles = res.tempFilePaths
						_this.fileUrl = tempFiles[0] 
					}
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
			 * @description 点击提交按钮
			 */
			onSubmitButtonClick(){
				if(!this.fileUrl){
					uni.showToast({
						title:"请先选择照片",
						icon:"error"
					})
					return
				}
				this.submit_authentication(this.fileUrl)
			},
			/**
			 * @description  提交实名认证
			 * @param {string}  fileUrl 文件地址 
			 */
			async submit_authentication(fileUrl: string) {
			        uni.showLoading({
			            title:'正在提交'
			        })
			        //先获取上传图片的凭证
			        let res = await request({
			            data: {
			                method: 'GET',
			                group: 'user',
			                action: 'verify/token',
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
			                    let authenticationChangeRes = await request({
			                        data: {
			                            method: 'PUT',
			                            group: 'user',
			                            action: 'verify/submit',
			                            data: {
			                                verifyPic: fileName,
			                            },
			                            header: {
			                                'content-type': 'application/x-www-form-urlencoded', // 默认值
			                            },
			                        }
			                    });
			                    uni.hideLoading()
			                    if (authenticationChangeRes.data.code === REQUEST_SUCCEEDED_CODE) {
			                        _this.isSuccessed=true  
			                    }
			                }
			            })
			        }
			    }

		}
	}
</script>

<style lang="scss">

.authentication-success{
padding: 30% 15%;
font-size: large;
font-weight: bold;
text-align: center;
color: #727272;
}


.real-name-authentication-content{
    background-color: #fff;
    min-height: 100vh;
}
.authentication-reason{
margin-top: 2%;
margin-left: 2%;
margin-right: 5%;
color: #696969;
text-align: left;
font-size: smaller;
}


.authentication-info-content {
    padding: 2%;
    text-align: left;
    .authentication-tips{
        font-size: smaller;
        color: #fc1313;
    }
    .shcool-id-input {
        border-radius: 20rpx;
        padding:10rpx;
        border: 1rpx solid #979797;
        border-radius: 30rpx;
    }
    .info-type {
        width: 100%;
        text-align: left;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
        color: #6b6b6b;
    }
}
.authentication-image-content {
    margin: 30rpx auto;
    width: 80vw;
    height: 40vw;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #979797;
    border: 1rpx solid #979797;
    border-radius: 30rpx;
    overflow: hidden;
	.authentication-image{
		width: 80vw;
		height: 40vw;
	}
    .authentication-image-text {
        margin: 2% 30rpx;
        font-size: small;
    }
}
.authentication-tips {
    margin: 20rpx auto;
    width: 80%;
    color: #979797;
    font-size: small;
    text-align: left;
}
.authentication-button {
    margin: 2%;
}
.agree-content{
    text-align: right;
    font-size: smaller;
}
</style>
