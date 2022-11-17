<template>
	<view class="page">
		<view class="blind-box-content" :style="{
			backgroundImage:
				boxSelected == 0 ?
				`linear-gradient(to bottom, #fcf5f7, #fff);`:
				boxSelected == 1 ?
				`linear-gradient(to bottom, #f1f5fc, #fff);`: 
				'linear-gradient(to bottom, #fefaf5, #fff);'}">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick()">
				<view class="bar-title">布咕盲盒</view>
			</uni-nav-bar>
			<!-- 右上角提示 -->
			<view class="upper-right-tips-content">
				<view class="tips-image-content">
					<image mode="aspectFill" src="/static/imgs/bird.png" class="tips-image">
						<view class="tips rule-tips" 
						:style="{backgroundColor: boxSelected == 0 ?`#f0afc7` 
								:boxSelected == 1 ?`#8fd5f1`: '#f9e3ce'}"
						@click="onShowRulesButtonClick()"		
								>
							查看规则
						</view>
						<view class="tips box-tips" 
						:style="{backgroundColor: boxSelected == 0 ?`#f0afc7` 
								:boxSelected == 1 ?`#8fd5f1`: '#f9e3ce'}">
								{{boxSelected == 0 ?`当前有${femaleBoxSum}个女生盒子` :
								  boxSelected == 1 ?`当前有${maleBoxSum}个男生盒子`: '我收到和投入的盒子'}}
						</view>
						<view class="tips tickets-tips" 
						:style="{backgroundColor: boxSelected == 0 ?`#f0afc7` 
								:boxSelected == 1 ?`#8fd5f1`: '#f9e3ce'}"
						@click="onBoxTicketsButtonClick"
						>
							剩余盲盒劵：{{boxTicketsAvailableSum}}张
						</view>
					</image>
				</view>
			</view>
			<!-- 选择盲盒 -->
			<view class='take-box-content'>
				<view class='take-girl-box'>
					<view class='box-imgae' :style="{
							border: boxSelected == 0 ?'7px dotted #f0afc7':'7px dotted #ffffff00'
						}" @click="onBoxSelected(0)">
						<image :style="{height: '70px',width: '70px'}" mode='aspectFill'
							:src="boxSelected == 0 ? '/static/svgs/box-girl-selected.svg' : '/static/svgs/box-girl.svg'">
						</image>
					</view>
				</view>
				<view class='take-boy-box'>
					<view class='box-imgae' :style="{border: boxSelected == 1 ?'7px dotted #8fd5f1':'7px dotted #ffffff00'} " @click="onBoxSelected(1)">
						<image :style="{height: '70px',width: '70px'}" 
						mode='aspectFill' :src="boxSelected == 1 ? '/static/svgs/box-boy-selected.svg' : '/static/svgs/box-boy.svg'">
						</image>
					</view>
				</view>
				<view class='take-me-box'>
					<view class='box-imgae' :style="{border: boxSelected == 2 ?'7px dotted #f9e3ce':'7px dotted #ffffff00'}" @click="onBoxSelected(2)">
						<image :style="{height: '70px',width: '70px'}" 
						mode='aspectFill' :src="boxSelected == 2 ? '/static/svgs/box-me-selected.svg' : '/static/svgs/box-me.svg'">
						</image>
					</view>
				</view>
			</view>
			<view class='get-more-tikets' 
			:style="{backgroundColor: boxSelected == 0 ?`#f0afc7` :
									boxSelected == 1 ?`#8fd5f1`: '#f9e3ce'}"
			@click="onGetMoreTicketsClick()"
			>
				<view class='iconfont icon-menpiao' :style="{fontSize:'25px',color:'#787f8b'}"/>
				<view>获取更多盲盒劵</view>
			</view>
			<!-- 投送盲盒 -->
			<view class='put-box-content'>
				<view class='put-box'>
					<view class='put-box-text' 
					:style="{backgroundColor: boxSelected == 0 ?`#f0afc7`:boxSelected == 1 ?`#8fd5f1`:'#f9e3ce'}"
					@click="onPutBoxButtonClick()"
					>
						{{boxSelected == 0 ?`留下女盒` :boxSelected == 1 ?`留下男盒` :'我的盒子'}}
					</view>
				</view>
			</view>
		</view>
		<!-- 抽取盲盒的popup -->
		<uni-popup ref="takeboxPopup" type="dialog">
		    <uni-popup-dialog v-if="boxOwnerInfo.username" 
				:title="`来自${boxOwnerInfo.username}的盒子`" 
				customOkText="和ta打声招呼"
				@confirm="onBoxConfirmClick(boxOwnerInfo.id)"
				customCancelText="再等一会儿"
				>
				<text>
					{{boxInfo.text}}
				</text>
			</uni-popup-dialog>
		</uni-popup>
		<!-- 投放盲盒的popup -->
		<uni-popup ref="putboxPopup" type="dialog">
		    <uni-popup-dialog mode="input" title="投放盲盒" placeholder="介绍一下自己吧"   @confirm="onPutBoxConfirm">
				
			</uni-popup-dialog>
		</uni-popup>
		<!-- 盲盒规则介绍 -->
		<uni-popup ref="boxRulePopup" type="dialog">
		    <uni-popup-dialog 
				:title="`盲盒规则介绍`" 
				customCancelText="我知道了">
				<text>
					 {{`
						1.点击盒子切换类型，再次点击抽取一个盲盒
						2.投入盲盒可以获取一张盲盒劵，每周上限两张
						3.抽取盲盒需要消耗一张盲盒劵哦~
						4.一天只能抽取和投入一个盲盒哦~
						`}}
				</text>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script lang="ts">
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE
	} from '@/common/constants';
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {
		UserInfo
	} from "@/common/dataClass";
	import {
		getUserinfo
	} from "@/common/requestFunctions";
	interface BoxInfo {
		 createTime: string,
			id: number,
			sex: number,
			text: string,
			userId: number,
	}
	/**
	 * blindBox 盲盒界面
	 * @description 盲盒界面
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				boxSelected: 0,
				femaleBoxSum: 0,
				maleBoxSum: 0,
				lastClickTime: 0,
				boxTicketsAvailableSum: 0,
				userInfo: {},
				boxInfo: {},
				boxOwnerInfo: {}

			}
		},
		async onLoad() {
			this.userInfo = await getMyUserInfo() as UserInfo
			this.getBoxInfo()
			this.getBoxTicketsInfo(1)
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
			 * @description 点击查看盲盒规则
			 */
			onShowRulesButtonClick(){
				this.$refs.boxRulePopup.open()
			},
			/**
			 * @description 点击获取更多盲盒劵
			 */
			onGetMoreTicketsClick(){
				uni.showModal({
					title:"获取方法",
					content:"投入盲盒即可获取一张盲盒劵哦~"
				})
			},
			/**
			 * @description 点击放入盒子/我的盒子按钮
			 */
			onPutBoxButtonClick(){
				if(this.boxSelected==2){//如果点击的是我的盒子
					uni.navigateTo({
						url:"/pages/bugu-secondary-page/blind-box/my-box"
					})
					return
				}
				this.$refs.putboxPopup.open()
			},
			/**
			 * @description 确定投放盲盒
			 */
			onPutBoxConfirm(e){
				
				this.putBox(this.boxSelected,e)
			},
			/**
			 * @description 点击剩余盲盒劵的文字
			 */
			onBoxTicketsButtonClick(){
				uni.navigateTo({
					url:"/pages/bugu-secondary-page/blind-box/box-tickets"
				})
			},
			/**
			 * @descrition 点击去去和他打声招呼按钮
			 * @param {number} id 用户id 
			 */
			onBoxConfirmClick(id){
				uni.navigateTo({
					url:`/pages/user-home-page/user-home-page?userId=${id}`
				})
			},
			/**
			 * @description 获取盲盒
			 * @param {number} sex 性别 0-女 1-男  
			 */
			async takeBox(sex) {
				if (this.userInfo.sex == sex) {
			 	uni.showToast({
						title: '只能获取异性的盲盒哦',
						icon: 'error'
					})
					return
				}
				let res = await request({
					data: {
						method: 'GET',
						group: 'blindBox',
						action: 'collect',
						data: {
							sex: sex
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let boxInfo = res.data.data as BoxInfo
					let userInfo = await getUserinfo(boxInfo.userId)
					this.boxInfo = boxInfo
					this.boxOwnerInfo = userInfo
					this.getBoxInfo()
					this.$refs.takeboxPopup.open()
				} else {
					uni.showModal({
						title: '获取失败',
						content: res.data.userMsg
					})
				}
			},
			/**
			 * @description  切换盲盒
			 * @param {number} selected 选择的盒子  
			 */
			onBoxSelected(selected) {
				let clickTime = Date.now()
				
				if (this.boxSelected == selected) {
					if(this.boxSelected==2){//如果点击的是我的盒子
						uni.navigateTo({
							url:"/pages/bugu-secondary-page/blind-box/my-box"
						})
						return
					}
					if (clickTime - this.lastClickTime < 500) {
						return
					} else {
						this.lastClickTime = clickTime
					}
					let _this = this
					uni.showModal({
						title: '抽取盲盒',
						content: `你确定要消耗一张盲盒劵抽取一个${selected==0?'女':'男'}盒吗？`,
						success: function(res) {
							if (res.confirm) {
								_this.takeBox(selected)
								_this.lastClickTime = clickTime
							}
						}
					})
				} else {
					this.boxSelected = selected
					this.lastClickTime = clickTime
				}
			},
			/**
			 * @description  投送盲盒
			 * @param {number} sex 性别
			 * @param {string} text 介绍的文字    
			 */
			async putBox(sex, text) {
				let res = await request({
					data: {
						method: 'PUT',
						group: 'blindBox',
						action: 'deliver',
						data: {
							sex: sex,
							text: text
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.getBoxInfo()
					uni.showToast({
						title: '投送成功',
						icon: 'success'
					})
				}
			},
			/**
			 * @description  获取盲盒信息
			 */
			async getBoxInfo() {
				let res = await request({
					data: {
						method: 'GET',
						group: 'blindBox',
						action: 'info',
						data: {

						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
			 	}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.femaleBoxSum = res.data.data.femaleBoxSum,
					this.maleBoxSum = res.data.data.maleBoxSum
				}
			},
			/**
			 * @description 获取盲盒劵信息
			 * @param {number}  page 页号 
			 */
			async getBoxTicketsInfo(page) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'blindBox',
						action: 'ticket/list',
						data: {
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
			 });
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.boxTicketsAvailableSum = res.data.data.list.availableSum
				}
			},

		}
	}
</script>

<style lang="scss">
	.blind-box-content {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.upper-right-tips-content {
		height: 20%;
		position: relative;
		border-bottom: 1rpx solid #4eccb8;

		.tips {
			position: absolute;
			width: fit-content;
			height: fit-content;
			padding: 15rpx 30rpx;
			background-color: #dbe8fd;
			color: #787f8b;
			font-size: small;
		}

		.tips-image-content {
			position: absolute;
			bottom: -7rpx;
			right: 20rpx;
			height: fit-content;
			width: fit-content;
			overflow: visible;
		}

		.tips-image {
			position: relative;
			width: 170rpx;
			height: 135rpx;
			overflow: visible;
		}

		.rule-tips {
			position: absolute;
			top: -100rpx;
			left: -20rpx;
			border-radius: 30rpx 30rpx 30rpx 0;
		}

		.box-tips {
			width: fit-content;
			text-align: center;
			min-width: 270rpx;
			position: absolute;
			top: -80rpx;
			left: -380rpx;
			border-radius: 30rpx 30rpx 0rpx 30rpx;
		}

		.tickets-tips {
			text-align: center;
			width: 250rpx;
			position: absolute;
			top: 0rpx;
			left: -320rpx;
			border-radius: 30rpx 30rpx 0rpx 30rpx;
		}
	}

	.take-box-content {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		text-align: center;
		padding: 0px 20rpx;

		.box-imgae {
			width: fit-content;
			height: fit-content;
			padding: 30rpx;
			border-radius: 30rpx;
		}

		.take-girl-box {
			flex-grow: 1;
			text-align: center;
		}

		.take-boy-box {
			flex-grow: 1;
			text-align: center;
		}

		.take-me-box {
			flex-grow: 1;
			text-align: center;
		}
	}

	.put-box-content {
		margin-top: 20%;
		display: flex;
		align-items: center;
		text-align: center;
		padding: 0rpx 20rpx;

		.put-box {
			flex-grow: 1;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			.put-box-text {
				width: fit-content;
				font-size: larger;
				padding: 30rpx 120rpx;
				border-radius: 30rpx;
			}
		}
	}

	.get-more-tikets {
		margin: 0 auto;
		margin-top: 10%;
		width: fit-content;
		background-color: #d1e2ff;
		color: #787f8b;
		font-size: small;
		padding: 15rpx 60rpx;
		border-radius: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
