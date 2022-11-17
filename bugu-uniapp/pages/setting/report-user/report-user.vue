<template>
	<view class="page">
		<view class="report-user-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">举报用户</view>
			</uni-nav-bar>
			<view v-if="!reportSuccess" class="report-user">
				<radio-group @change="onReportTypesChange" class="report-select-content">
					<label class="report-select-item" v-for="item in reportTypes" :key="item">
						<view class="report-text">{{item}}</view>
						<view class="report-radio">
							<radio color="#4eccb8" :value="item" :checked="item === reportSelected" />
						</view>
					</label>
				</radio-group>
				<view class="reason-title">
					详细描述
				</view>
				<textarea class="reason-input" :value="reportReason" :maxlength="49-reportSelected.length"
					:placeholder="reportSelected=== '其他' ? '举报详细说明(必填)' : '举报详细说明(选填)'" @input="onTextInput"></textarea>
				<button class="report-button" @click="onReportButtonClick">举报</button>
			</view>
			<uni-transition class="emoji-picker-content" mode-class="zoom-in" :show="reportSuccess">
				<view class="report-success">
					<text>
						{{
						`举报成功,我们会尽快处理
					  感谢您为维护社区氛围做出的贡献`
					}}
					</text>
				</view>
			</uni-transition>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		reportTypes
	} from "@/common/constants";
	import {request} from "@/utils/request";
	import {REQUEST_SUCCEEDED_CODE} from "@/common/constants"
	/**
	 * reportUser 举报界面
	 * @description 举报界面
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 */
	export default {
		data() {
			return {
				modular:'activity',
				reportTypes, //举报的类型
				reportSelected: reportTypes[reportTypes.length - 1], //选择的举报类型
				reportReason: '', //举报的原因
				reportSuccess: false, //是否举报成功
				objectId: -1, //举报对象的id
				objectType: '' //举报对象的类型 动态为activity,评论为comment,私聊为chat,评论的回复是commentResponse
			}
		},
		onLoad(params) {
			this.objectId = params.objectId as number
			this.objectType = params.objectType
			let modular = params.modular
			if(modular){
				this.modular=modular
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
			 * @description  选择举报的类型
			 * @param {object} evt 
			 */
			onReportTypesChange(evt) {
				this.reportSelected = evt.detail.value
			},
			/**
			 * @description  输入时
			 * @param {object} e 
			 */
			onTextInput(e) {
				this.reportReason = e.detail.value
			},
			/**
			 * @description  点击举报按钮
			 */
			async onReportButtonClick() {
				if (this.reportSelected === "其他" && this.reportReason.length < 1) {
					uni.showToast({
						title: '请先输入原因！',
						icon: "none"
					})
					return
				}
				this.reportSuccess = await this.reportUser(this.objectId, this.objectType, this.reportSelected + '-' + this.reportReason)
			},
			/**
			 * @description  举报用户
			 * @param {number} objectId 举报的id
			 * @param {string} objectType 举报的类型
			 * @param {string} reason 举报的原因  
			 * @return {boolean} 成功返回true失败返回false
			 */
			async reportUser(objectId: number, objectType: string, reason: string) {
				let res = {}
				if(this.modular==='question'){
					res = await request({
						data: {
							method: 'POST',
							modular:'dhy',
							group: 'helping',
							action: 'inform',
							data: {
								objectId: objectId,
								objectType: objectType,
								reason: reason
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
				}else{
					res = await request({
						data: {
							method: 'POST',
							group: 'user',
							action: 'inform',
							data: {
								objectId: objectId,
								objectType: objectType,
								reason: reason
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded', // 默认值
							},
						}
					});
				}
				
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					return true
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
	.report-user-content{
		background-color: #FFFFFF;
		min-height: 100vh;
		padding-bottom: 20rpx;
	}
	.reason-title {
		margin-top: 10rpx;
		margin-left: 10rpx;
		color: #9e9e9e;
		font-size: medium;
	}

	.reason-input {
		margin-top: 10rpx;
		padding: 20rpx;
		border-bottom: 1px solid #F1F1F1; 
		border-top:  1px solid #F1F1F1;
	}

	.report-button {
		margin: 20rpx;
	}

	.report-success {
		margin-top: 30vh;
		color: #8d8d8d;
		font-size: larger;
		width: 100%;
		text-align: center;
	}

	.report-select-content {
		line-height: 60rpx;
		height: fit-content;


		.report-select-item {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #F1F1F1;
			padding: 15rpx;

			.report-text {
				flex-grow: 1;
				font-size: large;
			}

			.report-radio {}
		}
	}
</style>
