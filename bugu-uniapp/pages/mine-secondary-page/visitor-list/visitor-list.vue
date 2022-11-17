<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我的访客</view>
		</uni-nav-bar>
		<scroll-view 
		id="visitor-scrollview"
		scroll-y="true"
		refresher-enabled
		:style="{
			height:scollerHeight+'px'
		}"
		:refresher-triggered="isRefresh"
		scroll-anchoring
		@refresherrefresh="onScrollRefresheRrefresh()"
		>
			<visitor-item v-for="item in visitorList"
			:item="item"
			:key="item.visitorId"
			></visitor-item>
		</scroll-view>
	</view>
</template>

<script lang="ts">
	import {
		USER_INFO,
		getViewsNumberChangedKey,
	} from "@/common/storageKeys";
	import {
		REQUEST_SUCCEEDED_CODE,
	} from "@/common/constants";
	import {request} from "@/utils/request";
	import {getMyUserInfo} from "@/common/storageFunctions";
	interface VistorItem {
	    lastTime: string,
	    visitSum: number,
	    visitorId: number,
		avatar:string
	}
	export default {
		data() {
			return {
				isRefresh:false,
				navHeight:0,//顶部导航栏的高度
				contentHeight:0,//整个页面的高度
				visitorList:[] as VistorItem[]//访客列表
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#visitor-scrollview"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(){
			let userInfo = await getMyUserInfo()
			let VIEWS_NUMBER_CHANGED = getViewsNumberChangedKey(userInfo.id)
			uni.setStorage({ key:VIEWS_NUMBER_CHANGED , data: 0 })
			this.visitorList = await this.getMyVisitors(userInfo.id)
			
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
			 * @return {Promise<VistorItem[]>}
			 */
			async getMyVisitors(userId:number):Promise<VistorItem[]>{
			     let res = await request({
			      data: {
			        method: 'GET',
			        group: 'user',
			        action: `visitor/list`,
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
				  return res.data.data as VistorItem[]
			    } else {
			      return []
			    }
			}
		}
	}
</script>

<style>

</style>
