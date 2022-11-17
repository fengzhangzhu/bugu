<template>
	<view class="page">
		<view class="publish-updates-content">
			<!-- 标题栏 -->
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">提问</view>
			</uni-nav-bar>
			<!-- 问题输入框 -->
			<textarea 
			class="question-input" 
			maxlength="50" 
			placeholder="输入问题并以问号结尾"
			:auto-height="true"
			:value="questionText"
			@input="onQuestionInput"
			
			></textarea>
			<!-- 问题描述输入框 -->
			<textarea 
			class="question-description-input" 
			maxlength="500" placeholder="对问题的描述(选填)" 
			:value="questionDescription"
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
			<!-- 标签 -->
			<view class="labels-content">
				<uni-tag class="activity-label" size="small" v-for="(item,index) in labelSelect" :key="item.id"
					:text="`#${item.content}`" :circle="true"></uni-tag>
			</view>
			<view class="publish-footer">
				<!-- 匿名选项 -->
				<view class="is-anonymity" v-if="isShowAnonymity">
					<view class="anonymity-text">咕咕</view>
					<switch :checked="isAnonymity == 1" @click="onSwitchClick()" color="#49faeb"
						class="anonymity-switch"></switch>
				</view>
				<!-- 添加标签 -->
				<view class="footer-add-label-content">
					<view class="footer-add-label" @click="onAddLabelClick()">
						<view class="iconfont icon-huati" style="font-size: 30rpx;color: #808080;">
						</view>
						<view>添加标签</view>
					</view>
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
				</view>
				<button @click="prepareBeforePublic()" :loading="buttonIsLoading" class="publish-button">发布问题</button>
			</view>
		</view>
		<!-- 表情选择 -->
		<uni-transition class="emoji-picker-content" mode-class="slide-bottom" :show="showEmojiPicker">
			<view class="emoji-picker">
				<view class="emoji-picker-head">
					<view class="emoji-picker-head-text">选择表情</view>
					<uni-icons @click="onEmojiPickerCloseClick()" customPrefix="customicons" type="closeempty"
						color="#808080" size="25" />
				</view>
				<emoji @setEmoj="setEmoj"></emoji>
			</view>
		</uni-transition>
		<!-- 标签选择的弹出层 -->
		<uni-popup backgroundColor="#ffffff" ref="labelPopup" type="bottom">
			<view class="choose-labels-content">
				<view class="search-content">
					<uni-search-bar class="search-input" placeholder="搜索标签" cancelButton="none"  v-model:modelValue="labelSearchText"
						@confirm="onSearchConfirm()"></uni-search-bar>
					<view class="search-button">
						<button style="background-color: #4eccb8;color: #fff;" @click="onSearchConfirm()"
							size="mini">搜索</button>
					</view>
				</view>
				<view class="activity-labels-content">
					<uni-tag class="activity-label" :type="labelSelectIds.indexOf(item.id) != -1?'primary':'default'"
						v-for="item in labels" :text="item.content" size="default" :circle="true" :key="item.id"
						@click="onChooseLabelClick(item)"></uni-tag>
					<view class="activity-label" style="display: flex;color:#808080;" @click="onRefreshLabelClick()">
						<view :style="{fontSize: '25px',}" class='iconfont icon-sync' />
						<text>换一批</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script lang="ts">
	import {
		LabelItem,PageInfo
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
	 * askQuestions 提问界面
	 * @description 提问界面
	 * @Author: 穆兰
	 * @Date: 2022/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/7
	 */
	export default {
		data() {
			return {
				questionText: '',//问题
				questionDescription:'',//问题描述
				imageFiles: [] as File[],//选择的图片文件
				videoFiles: [] as File[],//选择的视屏文件
				labels: [] as LabelItem[],//可供选择的标签
				labelSelect: [] as LabelItem[],//选择的标签
				labelSelectIds: [] as number[],//选择的标签的id
				isAnonymity: 0,//是否匿名
				showEmojiPicker: false,//是否显示表情选择框
				labelPage: 1,//标签页号
				isShowAnonymity: false,//是否显示匿名选项
				buttonIsLoading: false,//是否正在发布中
				labelSearchText: ''//搜索标签的文字
			}
		},
		async beforeMount() {
			this.isShowAnonymity = await this.getAnonymityState()
			this.getLabels(this.labelPage)
		},
		onLoad(params){
			let labelId = params.labelId as number
			let labelContent = params.labelContent 
			if(labelId&&labelContent){
				this.labelSelect=[{
					id: labelId,
					content: labelContent,
					hot:0
				}]
				this.labelSelectIds=[labelId]
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
			 * @description 输入问题描述时
			 */
			onTextareaInput(e) {
				this.questionDescription = e.detail.value
			},
			/**
			 * @description 输入问题时
			 */
			onQuestionInput(e) {
				this.questionText = e.detail.value
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
			 * @description 选择表情
			 */
			setEmoj(item) {
				this.questionText = this.questionText + item
			},
			/**
			 * @description 点击匿名开关
			 */
			onSwitchClick() {
				this.isAnonymity = this.isAnonymity == 1 ? 0 : 1
			},
			/**
			 * @description 点击添加标签
			 */
			onAddLabelClick() {
				this.$refs.labelPopup.open()
			},
			/**
			 * @description 点击标签
			 */
			onChooseLabelClick(item) {
				let labelSelect = this.labelSelect
				let labelSelectIds = this.labelSelectIds
				if (labelSelectIds.indexOf(item.id) == -1) {
					if (this.labelSelect.length >= 5) {
						uni.showToast({
							title: '最多只能选择五个哦~',
							icon: 'none'
						})
						return
					}
					labelSelectIds.push(item.id)
					labelSelect.push(item)
				} else {
					for (let i = 0; i < labelSelectIds.length; i++) {
						if (labelSelectIds[i] == item.id) {
							labelSelectIds.splice(i, 1)
							break
						}
					}
					for (let i = 0; i < labelSelect.length; i++) {
						if (labelSelect[i].id == item.id) {
							labelSelect.splice(i, 1)
							break
						}
					}
				}
				this.labelSelect = labelSelect
				this.labelSelectIds = labelSelectIds

			},
			/**
			 * @description 搜索输入框输入时
			 */
			onSearchInput(e) {
				this.labelSearchText = e
			},
			/**
			 * @description 搜索框确认时
			 */
			onSearchConfirm() {
				if (this.labelSearchText.length < 1) {
					uni.showToast({
						title: "请先输入内容",
						icon: "none"
					})
				} else {
					this.searchLabels(this.labelSearchText)
				}

			},
			/**
			 * @description 点击标签选择的更换按钮
			 */
			onRefreshLabelClick() {
				this.getLabels(this.labelPage)
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
				if (this.imageFiles.length > 0) {
					uni.showModal({
						title: '无法选择视频',
						content: '一个问题不支持同时发布视频和图片哦~'
					})
					return
				}
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
			 * @description 搜索动态标签
			 * @param content 搜索的关键字
			 */
			async searchLabels(content: string) {
				
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'label/query',
						data: {
							content,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let labels = res.data.data as LabelItem[]
					if (labels.length <= 0) {
						let label_id = await this.addLabel(content)
						if (label_id != 0) {
							this.labels = [{
								id: label_id,
								content: this.labelSearchText,
								hot: 0
							}]
							this.labelSearchText = ''
						}
					} else {
						this.labels = labels
						this.labelSearchText = ''
					}
				} else if(res.data.code ==="NOT_FOUND"){
					let label_id = await this.addLabel(content)
					if (label_id != 0) {
						this.labels = [{
							id: label_id,
							content: this.labelSearchText,
							hot: 0
						}]
						this.labelSearchText = ''
					}
				} else {
					
					uni.showToast({
						title: res.data.userMsg,
						icon: 'none'
					})
				}
			},
			/**
			 * 
			 * @description 添加标签
			 * @param content 标签的内容
			 * @returns {number} 标签的id
			 */
			async addLabel(content: string) {
				let res = await request({
					data: {
						method: 'PUT',
						group: 'question',
						action: 'label/add',
						data: {
							content: content
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					return res.data.data
				} else {
					return 0
				}
			},
			/**
			 * @description 获取问题的标签
			 */
			async getLabels(page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'label/list',
						data: {
							page,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageInfo: PageInfo<LabelItem> = res.data.data
					let labels: LabelItem[] = pageInfo.list;
					if (pageInfo.hasNext) {
						this.labelPage = this.labelPage + 1 //下次刷新时更新到下一页
					} else {
						this.labelPage = 1 //下次刷新时更新回到第一页
					}
					//将已经选择的标签加入，便于用户取消
					for (let i = 0; i < this.labelSelect.length; i++) {
						let hava_data = false
						for (let j = 0; j < labels.length; j++) {
							if (labels[j].id == this.labelSelect[i].id) {
								hava_data = true
								break
							}
						}
						if (!hava_data) {
							labels.push(this.labelSelect[i])
						}
					}
					this.labels = labels
				} else {
					console.error(res.data)
				}
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
				if (this.questionText.length <= 0) {
					uni.showToast({
						title: '请先输入内容',
						icon: 'none'
					})
					return
				}
				if(this.questionText.charAt(this.questionText.length-1)!='?'&&this.questionText.charAt(this.questionText.length-1)!='？'){
					uni.showToast({
						title: '请以问号结尾',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title:'正在发布'
				})
				
				this.buttonIsLoading = true
				let isVideo = 0
				let uploadMedias: string[] = []
				let mediaFiles: File[] = []
				var _this = this
				let filesNumber = 0
				// 文件检查
				if (this.imageFiles.length > 0) {
					filesNumber = this.imageFiles.length
					mediaFiles = this.imageFiles
					if (this.videoFiles.length > 0) {
						uni.showModal({
							title: '发布失败',
							content: '一个问题不能同时发布视频和图片哦~'
						})
						return
					}
				} else {
					if (this.videoFiles.length > 0) {
						if (userInfo.isVerify == 1 && userInfo.vip && userInfo.vip.remainDays >
							0) {
							isVideo = 1
							filesNumber = this.videoFiles.length
							mediaFiles = this.videoFiles
						} else {
							uni.showModal({
								title: "发布失败",
								content: "只有实名认证并且为vip用户才能发布视频哦~"
							})
							return
						}
					}

				}
				//没有图片或视频则直接上传
				if (filesNumber < 1) {
					await this.publishQuestion(this.questionText,this.questionDescription,this.isAnonymity,[],[],this.labelSelectIds)
					uni.hideLoading()
					return
				}
				//先获取上传图片/视频的凭证
				let data = {sum: filesNumber}
				let FileVouchers: FileVoucher[]
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'publish/getToken',
						data: data,
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					},
				})
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					FileVouchers = res.data.data as FileVoucher[]	
				} else {
					uni.showToast({
						title: "没有权限，请先登录",
						icon: 'none'
					})
					return
				}
				//保存要上传的文件名
				FileVouchers.forEach((item) => {
					uploadMedias.push(item.fileName)
				})

				mediaFiles.forEach(async (item, index) => {
					uni.uploadFile({
						url: UploadUrl,
						filePath: item.url,
						name: 'file',
						formData: {
							'key': FileVouchers[index].fileName,
							'token': aes.decrypt(FileVouchers[index].token)
						},
						success(fileRes) {
							if (index === mediaFiles.length -1) { //全部上传完成后，发布动态
								let imgs = []
								let videos = []
								if(isVideo==1){
									videos = uploadMedias
								}else{
									imgs = uploadMedias
								}
								_this.publishQuestion(_this.questionText,_this.questionDescription,_this.isAnonymity,imgs,videos,_this.labelSelectIds)
							}
						}
					})
				})
			},
			/**
			 * @description 发布问题
			 * @param questionTitle 问题标题
			 * @param questionDetails 问题详情
			 * @param isAnony 是否隐身
			 * @param imgs 图片
			 * @param videos 视频
			 * @param labelIds 标签
			 */
			async publishQuestion(questionTitle: string,questionDetails:string, isAnony: number,imgs: string[], 
								videos:string[],labelIds: number[]) {
				let res = await request({
					data: {
						method: 'POST',
						group: 'question',
						action: 'publish',
						data: {
							title:questionTitle,
							text:questionDetails,
							isAnonymity:isAnony,
							pics:JSON.stringify(imgs),
							video:JSON.stringify(videos),
							labelIds:JSON.stringify(labelIds)
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', 
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
					this.questionText = ''
					this.imageFiles = []
					this.labelSelect = []
					this.labelSelectIds = []
					this.videoFiles = []
					uni.navigateBack()
				}else{
					uni.showToast({
						title: res.data.userMsg,
						icon:"error"
					})
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
	.question-input{

		width: 96%;
		padding: 2%;
		text-align: start;
		font-size: large;
		font-weight: bold;
		border: none;
		border-top: 1rpx solid #d6d6d6;
		border-radius: 0rpx;
	}
	.question-description-input {
		min-height: 300rpx;
		width: 96%;
		padding: 2%;
		text-align: start;
		border: none;
		line-height: 1.2;
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
		width: 98%;

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
