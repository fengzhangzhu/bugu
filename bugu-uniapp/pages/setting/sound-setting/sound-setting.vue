<template>
	<view class="page">
		<view class="sound-setting-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick">
				<view class="bar-title">声音设置</view>
			</uni-nav-bar>
		</view>
		<!-- 设置项 -->
		<uni-list>
			<uni-list-item clickable showArrow title="刷新动态" :rightText="refreshDynamicSound.label" @click="onChangeSoundItemClick(REFRESH_DYNAMIC_SOUND)" />
			<uni-list-item clickable showArrow title="消息通知"  :rightText="newMessageSound.label" @click="onChangeSoundItemClick(NEW_MESSAGE_SOUND)"/>
		</uni-list>
		<!-- 铃声选择的弹出层 -->
		<action-sheet ref="soundSelectPopup" :needHead="true" title="铃声选择">
				<radio-group  class="sound-select-content">
					<label @click="onRadioItemClick(item)" class="sound-select-item" v-for="(item, index) in RingingToneList" :key="item">
						<view class="sound-text">{{item.label}}</view>
						<view class="sound-radio">
							<radio color="#4eccb8" :value="item" :checked="item.value == ringingToneSelected" />
						</view>
					</label>
				</radio-group>
		</action-sheet>
	</view>
</template>

<script>
	import {RingingToneList} from "@/common/constants";
	import {REFRESH_DYNAMIC_SOUND,NEW_MESSAGE_SOUND } from "@/common/storageKeys"
	/**
	 * soundSetting 声音设置界面
	 * @description 声音设置界面
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				 RingingToneList,//可供选择的音效
				 refreshDynamicSound:{},//刷新时的音效
				 newMessageSound:{},//新消息时的音效
				 REFRESH_DYNAMIC_SOUND,//保存刷新音效的key
				 NEW_MESSAGE_SOUND,//保存新消息音效的key
				 ringingToneSelected:0,//选择铃声对象的value
				 selectType:REFRESH_DYNAMIC_SOUND//修改何种类型的音效
				 
			}
		},
		onLoad(){
			let refreshDynamicSound = uni.getStorageSync(REFRESH_DYNAMIC_SOUND)
			if(!refreshDynamicSound){
				refreshDynamicSound = RingingToneList[6]
			}
			this.refreshDynamicSound = refreshDynamicSound
			let newMessageSound = uni.getStorageSync(NEW_MESSAGE_SOUND)
			if(!newMessageSound){
				newMessageSound = RingingToneList[0]
			}
			this.newMessageSound=newMessageSound
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
			 * @description  点击某个list选项
			 * @param {sting} type 需要更改的声音类型  
			 */
			onChangeSoundItemClick(type){
				this.selectType = type
				if (type === REFRESH_DYNAMIC_SOUND) {
				    this.ringingToneSelected = this.refreshDynamicSound.value 
				} else if(type === NEW_MESSAGE_SOUND) {
				    this.ringingToneSelected = this.newMessageSound.value 
				}
				this.$refs.soundSelectPopup.open()
			},
			/**
			 * @description 点击radio更换声音时
			 * @param {RingingToneItem} item
			 */
			onRadioItemClick(item){
				this.ringingToneSelected=item.value
				 const innerAudioContext =uni.createInnerAudioContext()
				 innerAudioContext.autoplay = true
				 innerAudioContext.src = item.url
				 this.changeSound(item,this.selectType)
			},
			/**
			 * @description 更改声音
			 * @param {RingingToneItem}  ringingTone
			 * @param {string} type 更改的类型
			 */
			async changeSound(ringingTone, type) {
					
			        await uni.setStorage({
			            key: type,
			            data: ringingTone
			        })
			        if (type === REFRESH_DYNAMIC_SOUND) {
			            this.refreshDynamicSound= ringingTone 
			        } else if(type === NEW_MESSAGE_SOUND) {
			            this.newMessageSound = ringingTone
			        }
			    }
		}
	}
</script>

<style lang="scss">
	.sound-select-content {
		line-height: 60rpx;
		height: fit-content;
		.sound-select-item {
			display: flex;
			align-items: center;
			padding: 20rpx;
			.sound-text {
				flex-grow: 1;
				font-size: large;
			}
	
			.sound-radio {}
		}
	}
	
</style>
