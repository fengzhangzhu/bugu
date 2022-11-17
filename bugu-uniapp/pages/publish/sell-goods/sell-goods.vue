<template>
	<view class="page">
		<view class="publish-updates-content">
			<!-- 标题栏 -->
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">发布闲置</view>
			</uni-nav-bar>
			<!-- 文字输入框 -->
			<textarea class="goods-text-input" maxlength="500" placeholder="买家都关心品牌型、入手渠道、转手原因..." :value="goodsText"
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
					<view class="text-lenth-count">
						<text>{{goodsText.length}}/500</text>
					</view>
				</view>
				<!-- 商品价格 -->
				<view class="goods-price">
					<view class="price-title">
						<view class="iconfont icon-jiage"
						style="font-size: 20px; color: #1f1f1f;"
						>
						</view>
						<view class="title-text">
							价格
						</view>
					</view>
					<view class="price-number">
						<input 
						class="price-number-input"
						 type="number"
						 @input="onPriceInput" 
						 :value="goodsPrice" />
						 <view>
							 <text>￥</text>
						 </view>
						 
					</view>
				</view>
				<button @click="prepareBeforePublic()" :loading="buttonIsLoading" class="publish-button">发布闲置</button>
			</view>
		</view>
		<!-- 标签选择的弹出层 -->
		<uni-popup backgroundColor="#ffffff" ref="labelPopup" type="bottom">
			<view class="choose-labels-content">
				<view class="search-content">
					<uni-search-bar v-model:modelValue="labelSearchText" class="search-input" placeholder="搜索标签" cancelButton="none"
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
	 * sellGoods 发布商品界面
	 * @description 发布商品界面
	 * @Author: 穆兰
	 * @Date: 2022/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/7
	 */
	export default {
		data() {
			return {
				goodsText: '',//发布的文字
				goodsPrice:'0.00',//商品价格
				imageFiles: [] as File[],//选择的图片文件
				videoFiles: [] as File[],//选择的视屏文件
				labels: [] as LabelItem[],//可供选择的标签
				labelSelect: [] as LabelItem[],//选择的标签
				labelSelectIds: [] as number[],//选择的标签的id
				isAnonymity: 0,//是否匿名
				showEmojiPicker: false,//是否显示表情选择框
				labelPage: 1,//标签页号
				buttonIsLoading: false,//是否正在发布中
				labelSearchText: ''//搜索标签的文字
			}
		},
		async beforeMount() {
			this.getLabels(this.labelPage)
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
			 * @description 输入内容时
			 */
			onTextareaInput(e) {
				this.goodsText = e.detail.value
			},
			/**
			 * @description 输入价格时
			 */
			onPriceInput(e) {
				this.goodsPrice = e.detail.value
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
				this.goodsText = this.goodsText + item
			},
			/**
			 * @description 点击匿名开关
			 */
			onSwitchClick() {
				this.isAnonymity = this.isAnonymity == 1 ? 0 : 1
			},
			/**
			 * @description 点击隐私选择
			 */
			onPrivaterChooseClick() {
				this.$refs.privateSelectPopup.open()
			},
			/**
			 * @description 点击选择某个隐私权限选项
			 */
			onPrivaterAdioChange(evt) {
				for (let i = 0; i < this.privateSettingGroup.length; i++) {
					if (this.privateSettingGroup[i] === evt.detail.value) {
						this.privateSelect = i;
						break;
					}
				}
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
				if (this.imageFiles.length > 0) {
					uni.showModal({
						title: '无法选择视频',
						content: '一个动态不支持同时发布视频和图片哦~'
					})
					return
				}
				if (this.videoFiles.length >= 1) {
					uni.showModal({
						title: '无法选择视频',
						content: '一个动态只能选择一个视频'
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
			 * @description 搜索动态标签
			 * @param context 搜索的关键字
			 */
			async searchLabels(context: string) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: 'label/query',
						data: {
							content: context
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let labels = res.data.data as LabelItem[]
					if (labels.length <= 0) {
						let label_id = await this.addLabel(context)
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
				} else {
					uni.showToast({
						title: res.data.userMSg,
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
						group: 'activity',
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
			 * @description 获取动态标签
			 */
			async getLabels(page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: 'label/list',
						data: {
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let result = res.data.data as GetLabelResult
					let labels: LabelItem[] = res.data.data.list
					if (page < result.pageSum) {
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
				if (this.goodsText.length <= 0) {
					uni.showToast({
						title: '请先输入内容',
						icon: 'none'
					})
					return
				}
				if(this.imageFiles.length <= 0 && this.videoFiles.length <= 0){
					uni.showToast({
						title: '请先上传商品图片或视频',
						icon: 'none'
					})
					return
				}
				if (this.goodsPrice <= 0) {
					uni.showToast({
						title: '请先输入商品价格',
						icon: 'none'
					})
					return
				}
			},
			/**
			 * @description 发布动态
			 * @param text 文字内容
			 * @param uploadMedias 需要上传的图片名
			 * @param visibility 动态可见性
			 * @param isAnonymity 是否隐身
			 * @param labelIds 标签
			 * @param video 是否为视频
			 */
			async publishgoods(text: string, uploadMedias: string[], visibility: number,
				isAnonymity: number,
				labelIds: number[], video: number = 0) {
				let res = await request({
					data: {
						method: 'POST',
						group: 'activity',
						action: 'publish',
						data: {
							text: text,
							pic: JSON.stringify(uploadMedias),
							visibility: visibility,
							isAnonymity: isAnonymity,
							labelIds: labelIds.length > 0 ? JSON.stringify(labelIds) : '',
							video: video
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
					this.goodsText = ''
					this.imageFiles = []
					this.labelSelect = []
					this.labelSelectIds = []
					this.videoFiles = []
					uni.switchTab({
						url: '/pages/index/index'
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

	.goods-text-input {
		min-height: 300rpx;
		width: 100%;
		padding: 2%;
		text-align: start;
		border: none;
		border-top: 1rpx solid #d6d6d6;
		border-radius: 0rpx;

	}
	.goods-price{
		width: 96%;
		padding: 2%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		.price-title{
			display: flex;
			align-items: center;
			text-align: center;
			.title-text{
				margin-left: 10rpx;
			}
		}
		.price-number{
			flex-grow: 1;
			margin-right: 15rpx;
			color:#F52C39;
			display: flex;
			align-items: center;
			.price-number-input{
				flex-grow: 1;
				text-align: right;
				
			}
			
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
		margin-left: 10rpx;
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

		.text-lenth-count {
			margin-left: 15%;
			width: fit-content;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			text-align: right;
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
