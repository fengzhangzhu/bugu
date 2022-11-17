<template>
	<view class="page">
		<view class="official-news-info-content">
			<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
				statusBar='true' @clickLeft="onNarLeftClick">
				<view class="bar-title">通知详情</view>
			</uni-nav-bar>
			<scroll-view
			id="news-scrollview"
			scroll-y="true"
			:scroll-into-view="scrollInto"
			:style="{
				height:scollerHeight+'px'
			}"
			>
				<view v-for="item in officialNews"
				:key="item.id"
				:id='`news_${item.id}`'
				>
					<view class='creat-time'>{{item.createTime}}</view>
					<uni-card
					  extra='有任何问题请联系官方客服'
					  title='官方消息'
					  >
						  <Text>
							{{item.text}}
						  </Text>
					</uni-card>
				</view>
			</scroll-view>
			
		</view>
	</view>
</template>

<script lang="ts">
	import {changeUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
	import {request} from "@/utils/request";
	import {ACTIVITY,PUNISH,REQUEST_SUCCEEDED_CODE} from "@/common/constants";
	import {getMyUserInfo} from "@/common/storageFunctions";
	import {getTypeOfficalNews, getOfficalList} from "@/utils/messageUtils/storage"
	import {getOfficeTypeNewsListKey,getOfficeNewsListKey} from "@/utils/messageUtils/storageKeys";
	import {OfficialNewsData} from "@/common/dataClass"
	/**
	 * officialNewsInfo 官方通知详情页面
	 * @description 官方通知详情页面
	 * @Author: 穆兰
	 * @Date: 2022/1/16
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/16
	 */
	export default {
		data() {
			return {
				type:PUNISH,//消息类型
				officialNews: [],//消息列表
				navHeight:0,//顶部导航栏的高度
				contentHeight:0,//整个页面的高度
				scrollInto:''
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#news-scrollview"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params){
			let type = params.type
			this.type = type
			let userInfo = await getMyUserInfo()
			let officialNews = await getTypeOfficalNews(userInfo.id,type)
			//从久到新的顺序
			this.officialNews=officialNews.reverse()//先让页面加载出来
			if(this.officialNews.length>0){
				this.scrollInto = `news_${this.officialNews[this.officialNews.length-1].id}`
			}
			
			//复原便于和未读消息合并
			officialNews.reverse()
			let newOfficialNews = await this.getUnreadTypeofficialNews(type)
			officialNews = officialNews.concat(newOfficialNews)
			this.officialNews=officialNews.reverse()
			if(this.officialNews.length>0){
				this.scrollInto = `news_${this.officialNews[this.officialNews.length-1].id}`
			}
			let OFFICE_TYPE_NEWS = getOfficeTypeNewsListKey(userInfo.id,type)
			uni.setStorage({
				key:OFFICE_TYPE_NEWS,
				data: officialNews
			})
			
			let officialNewsList = await getOfficalList(userInfo.id)
			for(let i = 0;i<officialNewsList.length;i++){
				if(officialNewsList[i].type===type){
					changeUnreadMessageSum(-officialNewsList[i].unreadSum)
					officialNewsList[i].unreadSum=0
					break
				}
			}
			let OFFICE_NEWS_LIST = getOfficeNewsListKey(userInfo.id)
			uni.setStorage({
				key: OFFICE_NEWS_LIST,
				data: officialNewsList
			})
		},
		computed:{
			scollerHeight(){
				
				return this.contentHeight- this.navHeight
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
			 * @description 获取未读的指定类型的官方消息
			 * @param {shring} type 指定官方消息的类型  
			 */
			async getUnreadTypeofficialNews(type: string) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: 'official/unread/special',
						data: {
							type: type
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
		
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let officialNews = res.data.data as OfficialNewsData[]
					return officialNews
				} else {
					return []
				}
			}
		}
	}
</script>

<style>
	.creat-time{
	    text-align: center;
	    width: 96%;
	    padding: 2%;
	    font-size: small;
	    color: #c2c2c2;
	}
</style>
