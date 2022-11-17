<template>
	<view class="page">
		<view class="publish-updates-content">
			<!-- 标题栏 -->
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">回答问题</view>
			</uni-nav-bar>
			<!-- 问题 -->
			<view class="question-content">
				<text>
					{{questionTitle}}
				</text>
			</view> 
			<!-- 回答输入框 -->
			<textarea 
			class="answer-description-input" 
			maxlength="1000" placeholder="输入你的回答" 
			:value="answerText"
			@input="onTextareaInput"></textarea>
			<!-- 图片选择 -->
			<block v-if="imageFiles.length>0">
				<uni-file-picker @select="onImageFilesSelect" v-model="imageFiles" fileMediatype="image" mode="grid"
					limit="9"></uni-file-picker>
				<!-- 视频选择 -->
			</block>
			<view v-for="(item,index) in videoFiles" :key="index" class="video_content">
				<view class="delete_video_icon">
					<view :style="{
						fontSize: '30rpx',
					    color: '#fff'
					}" class="iconfont icon-bg-close">

					</view>
				</view>
				<video :id="`video_${index}`" :src="item.url" style="width: 90vw;height: 50vw;" initial-time="0"
					controls>
				</video>
			</view>
			<view class="publish-footer">
				<!-- 匿名选项 -->
				<view class="is-anonymity" v-if="isShowAnonymity">
					<view class="anonymity-text">咕咕</view>
					<switch :checked="isAnonymity == 1" @click="onSwitchClick()" color="#49faeb"
						class="anonymity-switch"></switch>
				</view>
				<view class="other-send-option">
					<!-- 从相册选择 -->
					<view class="option-image-content">
						<image @click="onImageIconClick()" class="send-option-image" mode="aspectFill"
							src="/static/svgs/chat-photo.svg">

						</image>
					</view>
					<!-- 从相机选择 -->
					<view class="option-image-content">
						<image @click="onCameraIconClick()" class="send-option-image" mode="aspectFill"
							src="/static/svgs/chat-camera.svg">

						</image>
					</view>
					<!-- 视频 -->
					<view class="option-image-content">
						<image @click="onVideoIconClick()" class="send-option-image" mode="aspectFill"
							src="/static/svgs/video.svg">

						</image>
					</view>
					<view class="text-lenth-count">
						<text>{{answerText.length}}/1000</text>
					</view>
				</view>
				<button @click="prepareBeforePublic()" :loading="buttonIsLoading" class="publish-button">提交回答</button>
			</view>
		</view>
		
	</view>
</template>

<script lang="ts">
	import {
		LabelItem
	} from "@/common/dataClass";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import aes from '@/utils/aes/export';
	import {
		privateSettingGroup,
		REQUEST_SUCCEEDED_CODE,
		UploadUrl
	} from "@/common/constants";
	import {
		request
	} from '@/utils/request';

	interface FileVoucher {
		fileName: string,
			token: string
	}
	interface GetLabelResult {
		list: LabelItem[]
		pageSum: number
		total: number
	}
	interface FileItem {
		path: string
		size: number
	}
	interface File {
		url: string
		file ? : FileItem
	}
	/**
	 * writeAnswers 回答界面
	 * @description 回答界面
	 * @Author: 穆兰
	 * @Date: 2022/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/7
	 */
	export default {
		data() {
			return {
				questionTitle:'',
				questionId:0,
				answerText: '',//回答
				imageFiles: [] as File[],//选择的图片文件
				videoFiles: [] as File[],//选择的视屏文件
				isAnonymity: 0,//是否匿名
				isShowAnonymity: false,//是否显示匿名选项
				buttonIsLoading: false,//是否正在发布中
			}
		},
		async onLoad(params) {
			this.isShowAnonymity = await this.getAnonymityState();
			this.questionTitle = JSON.parse(JSON.parse(decodeURIComponent(params.questionTitle)))
			this.questionId = params.questionId
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
			 * @description 输入问题描述时
			 */
			onTextareaInput(e) {
				this.answerText = e.detail.value
			},
			
			/**
			 * @description 选择图片时
			 * @param {Object} e
			 */
			onImageFilesSelect(e) {
				let tempFiles = this.imageFiles
				e.tempFilePaths.forEach((item, index) => {
					tempFiles.push({
						url: item,
						file: e.tempFiles[index]
					})
				})
				this.imageFiles = tempFiles
			},
			
			/**
			 * @description 点击匿名开关
			 */
			onSwitchClick() {
				this.isAnonymity = this.isAnonymity == 1 ? 0 : 1
			},
			/**
			 * @description 点击照片选择图标
			 */
			onImageIconClick() {
				if (this.videoFiles.length > 0) {
					uni.showModal({
						title: '无法选择图片',
						content: '一个动态不支持同时发布视频和图片哦~'
					})
					return
				}
				let _this = this
				let maxNumber = 9 - this.imageFiles.length
				if (maxNumber <= 0) {
					uni.showToast({
						title: '最多选择9张哦~',
						icon: 'none'
					})
				} else {
					uni.chooseImage({
						count: maxNumber, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
						success: function(res) {
							// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
							let tempFiles = _this.imageFiles

							if (Array.isArray(res.tempFilePaths)) {
								res.tempFilePaths.forEach((item, index) => {
									tempFiles.push({
										url: item,
										file: res.tempFiles[index]
									})
								})
							}

							_this.imageFiles = tempFiles

						}
					})
				}
			},
			/**
			 * @description 点击相机图标
			 */
			onCameraIconClick() {
				let _this = this
				let maxNumber = 9 - this.imageFiles.length
				if (maxNumber <= 0) {
					uni.showToast({
						title: '最多选择9张哦~',
						icon: 'none'
					})
				} else {
					uni.chooseImage({
						count: 1, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: [
							'camera'
						], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
						success: function(res) {
							// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
							var tempFiles = _this.imageFiles
							if (Array.isArray(res.tempFilePaths)) {
								res.tempFilePaths.forEach((item, index) => {
									tempFiles.push({
										url: item,
										file: res.tempFiles[index]
									})
								})
								_this.imageFiles = tempFiles
							}


						}
					})
				}
			},
			/**
			 * @description 点击视频选择图标
			 */
			async onVideoIconClick() {
				let userInfo = await getMyUserInfo()
				if (!userInfo) {
					uni.showModal({
						title: '无法选择',
						content: '您还未登录，请先登录',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/login'
								})
							}
						}
					})
					return
				} else {
					if (userInfo.isVerify == 1 && userInfo.vip && userInfo.vip.remainDays > 0) {} else {
						uni.showModal({
							title: "选择失败",
							content: "只有实名认证并且为vip用户才能发布视频哦~"
						})
						return
					}
				}
				if (this.videoFiles.length >= 1) {
					uni.showModal({
						title: '无法选择视频',
						content: '一个回答只能选择一个视频'
					})
					return
				}
				uni.chooseVideo({
				    sourceType: ['camera', 'album'],
					maxDuration: 60,
					camera: 'back',
					success: (res) => {
						if (res.duration > 210) {
							uni.showModal({
								title: '选择失败',
								content: '只能选择3分30秒以下的视屏哦~'
							})
							return
						}
						this.videoFiles = [{
							url: res.tempFilePath
						}]
					}
				})
			},
			/**
			 * @description 获取是否显示咕咕状态
			 * @returns {boolean}
			 */
			async getAnonymityState() {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: 'anonymity/state',
						data: {},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {

					return res.data.data as boolean
				} else {
					return false
				}
			},
			/**
			 * @description 发布前的准备操作,包括上传图片等
			 */
			async prepareBeforePublic() {
				// 登录检查
				let userInfo = await getMyUserInfo()
				if (!userInfo) {
					uni.showModal({
						title: '发布失败',
						content: '您还未登录，请先登录',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/login'
								})
							}
						}
					})
					return
				}
				// 内容检查
				if (this.answerText.length <= 0&& this.imageFiles.length <= 0 && this.videoFiles
					.length <= 0) {
					uni.showToast({
						title: '请先输入内容',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '正在发布',
				})
				this.buttonIsLoading = true
				var _this = this
				let imgs = [] //图片文件名数组
				let fileVouchers : FileVoucher[] = []//图片上传凭证数组
				let isVideo = 0;
				if(this.imageFiles.length>0&&this.videoFiles.length>0){
					uni.showModal({
						title:"发布失败",
						content:"一个回答不能同时发布视频和图片"
					})
					return;
				}else if(this.videoFiles.length>0){
						isVideo = 1
				}
				
				let mediaFiles = isVideo===0 ? this.imageFiles:this.videoFiles;
				// 文件检查
				if (mediaFiles.length > 0) {
					let sum = mediaFiles.length
					//先获取上传文件的凭证
					let res = await request({
						data: {
							method: 'GET',
							group: 'answer',
							action: 'publish/getToken',
							data: {
								sum
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						},
					})
					if (res.data.code === REQUEST_SUCCEEDED_CODE) {
						fileVouchers = res.data.data as FileVoucher[]
					} else {
						uni.showToast({
							title: res.data.userMsg,
							icon: 'none'
						})
						return
					}
					//保存要上传的文件名
					fileVouchers.forEach((item) => {
						imgs.push(item.fileName)
					})
				} 

				//没有图片或视频则直接上传
				if (mediaFiles.length < 1) {
					this.publishAnswer(this.questionId,this.answerText,[],this.isAnonymity,0)
					return
				}

				
				mediaFiles.forEach(async (item, index) => {
					uni.uploadFile({
						url: UploadUrl,
						filePath: item.url,
						name: 'file',
						formData: {
							'key': fileVouchers[index].fileName,
							'token': aes.decrypt(fileVouchers[index].token)
						},
						success(fileRes) {
							if (index === mediaFiles.length -1) { //全部上传完成后，发布回答
								_this.publishAnswer(_this.questionId,_this.answerText,imgs, _this.isAnonymity,isVideo);
							}
						}
					})
				})
			},
			/**
			 * @description 发布回答
			 * @param {number} questionId 问题的id 
			 * @param {string} text 文字内容
			 * @param {string[]} pics 需要上传的图片名
			 * @param {number} isAnonymity 是否隐身
			 * @param {number} isVideo 是否为视频
			 */
			async publishAnswer(questionId:number,text: string, pic: string[],isAnonymity:number,isVideo:number) {
				let res = await request({
					data: {
						method: 'POST',
						group: 'answer',
						action: 'publish',
						data: {
							questionId,
							text,
							pic: JSON.stringify(pic),
							isVideo,
							isAnonymity
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},

					}
				});
				uni.hideLoading()
				this.buttonIsLoading = false

				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					})
					this.answerText = ''
					this.imageFiles = []
					this.videoFiles = []
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	.publish-updates-content {
		background-color: #FFF;
		width: 100%;
		height: 100vh;
		position: relative;
	}
	.question-content{

		width: 96%;
		padding: 2%;
		text-align: start;
		font-size: large;
		font-weight: bold;
		border: none;
		border-top: 1rpx solid #d6d6d6;
		border-radius: 0rpx;
	}
	.answer-description-input {
		min-height: 300rpx;
		width: 96%;
		padding: 2%;
		line-height: 1.2;
		text-align: start;
		border: none;
		border-radius: 0rpx;

	}

	.private-select-content {
		line-height: 60rpx;
		height: fit-content;
		.private-select-item {
			display: flex;
			align-items: center;
			padding: 20rpx;
			.private-text {
				flex-grow: 1;
				font-size: large;
			}
	
			.private-radio {}
		}
	}

	.labels-content {
		display: flex;
		flex-wrap: wrap;
		line-height: 60rpx;
		width: 96vw;
		margin: 0 2vw;
	}

	.publish-footer {
		display: flex;
		height: 60rpx;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;

	}

	.is-anonymity {

		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1a1a1;
		font-size: small;
		text-align: center;

		.anonymity-text {
			width: fit-content;
			margin-left: 20rpx;

		}

		.anonymity-switch {
			transform: scale(0.6, 0.6);
			// 14rpx * 2
			margin-left: 0rpx;
		}

	}

	.footer-add-label {
		height: fit-content;
		width: fit-content;
		display: flex;
		font-weight: lighter;
		font-size: 20rpx;
		align-items: center;
		justify-content: center;
		padding: 8rpx 10rpx;
		background-color: #eef3fc;
		border-radius: 20rpx;
	}

	.footer-privacy-settings {
		text-align: right;
		flex: 1;
		font-size: small;
		color: #979797;
	}

	.choose-labels-content {
		height: 50vh;
	}

	.activity-labels-content {
		line-height: 60rpx;
	}

	.activity-label {
		margin: 5rpx;
		float: left;
	}

	.text-lenth-count {
		flex-grow: 2;
		text-align: end;
		font-size: small;
		color: #a1a1a1;
	}

	.other-send-option {
		flex-grow: 1;
		display: flex;
		padding: 10rpx 20rpx;

		.option-image-content {
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: left;
			text-align: left;
		}

		.send-option-image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.publish-button {
		margin: 2%;
		background-color: #27c9c1;
		color: white;
		font-weight: bold;
		width: 100%;

	}

	.more-labels {
		margin: 10rpx;
		float: left;
		width: fit-content;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		color: #929191;
	}

	.video_content {
		height: fit-content;
		width: fit-content;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.delete_video_icon {
		z-index: 100;
		position: absolute;
		right: 10rpx;
		top: 10rpx;

	}

	.search-content {
		display: flex;
		align-items: center;
		.search-input {
			flex-grow: 1;
			transition: all 300ms;
		}
		.search-button {
			margin: 5rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.emoji-picker-content {
		position: absolute;
		bottom: 0;

		.emoji-picker-head {
			padding: 20rpx;
			display: flex;
			background-color: #ebebeb;
			align-items: center;

			.emoji-picker-head-text {
				flex-grow: 1;
			}
		}
	}
</style>
