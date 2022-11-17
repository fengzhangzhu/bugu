<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我的粉丝</view>
		</uni-nav-bar>
		<scroll-view 
		id="fans-scrollview"
		scroll-y="true"
		refresher-enabled
		:style="{
			height:scollerHeight+'px'
		}"
		:refresher-triggered="isRefresh"
		scroll-anchoring
		@refresherrefresh="onScrollRefresheRrefresh()"
		>
			<fan-item v-for="item in fansList"
			:item="item"
			:key="item.id"
			></fan-item>
		</scroll-view>
	</view>
</template>

<script lang="ts">
	import {
		USER_INFO,
		getFansNumberChangedKey,
	} from "@/common/storageKeys";
	import {
		REQUEST_SUCCEEDED_CODE,
	} from "@/common/constants";
	import {request} from "@/utils/request";
	import {getMyUserInfo} from "@/common/storageFunctions";
	interface FanItem{
	    avatar:string,
	    id:number,
	    username:string,
	    mutual:number
	}
	export default {
		data() {
			return {
				isRefresh:false,
				navHeight:0,//顶部导航栏的高度
				contentHeight:0,//整个页面的高度
				fansList:[] as FanItem[]//粉丝列表
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#fans-scrollview"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(){
			let userInfo = await getMyUserInfo()
			let FANS_NUMBER_CHANGED = getFansNumberChangedKey(userInfo.id)
			uni.setStorage({ key:FANS_NUMBER_CHANGED , data: 0 })
			this.fansList = await this.getMyFans(userInfo.id)
			
		},
		computed:{
			scollerHeight(){
				let keyboardHeight = this.showEmojiPicker?this.emojiContentHeight:this.keyboardHeight
				return this.contentHeight- keyboardHeight - this.navHeight -110
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
			 * @description 下拉刷新时
			 */
			onScrollRefresheRrefresh(){
				
			},
			/**
			 * @description 获取粉丝列表
			 * @param {number} userId 用户id
			 * @return {Promise<FanItem[]>}
			 */
			async getMyFans(userId:number):Promise<FanItem[]>{
			     let res = await request({
			      data: {
			        method: 'GET',
			        group: 'user',
			        action: `${userId}/fansList`,
			        data: {
			          userId: userId
			        },
			        header: {
			          'content-type': 'application/x-www-form-urlencoded',// 默认值
			        },
			      }
			    });
				setTimeout(() => {
				    this.isRefresh=false
				  }, 500)
			    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			      return res.data.data as FanItem[]
			    } else {
			      return []
			    }
			}
		}
	}
</script>

<style>

</style>
