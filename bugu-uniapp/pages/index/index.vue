<template>
	<view class="page">
		<view class="index-conent">
			<movable-area :style="{
							height:'100vh'
						}" class="refresh-button-movable">
				<view class="square-head"
				:style="{
					paddingTop:statusBarHeight
				}"
				>
					<page-tabs
					:labels="tabLabels"
					:index="tabSelect"
					:tabPadding="26"
					:activeFontSize="18"
					:defaultFontSize="16"
					defaultColor="#676767"
					underLineType="bubble"
					@changeIndex="onTabsClick"
					>
					</page-tabs>
				</view>
				
				<swiper :current="tabSelect" :style="{
							height:scollerHeight+'px'
						}" class="swiper"  id="index-swiper"
					@change="onSwiperChange"
						@transition="onSwiperTransition"
						@animationfinish="onSwiperAnimationfinish"
						>
					<!-- 广场的动态 -->
					<swiper-item>
						<movable-view :x="300" :y="500" class="refresh-button-content" direction="all">
							<view @click="onPublishButtonClick" class="send-button">
								<view class="iconfont icon-fabu" :style="{ fontSize: '30px', color: '#FFF' }" />
							</view>
						</movable-view>
						<square-activity
						:scollerHeight="scollerHeight"
						:refresherEnabled="refresherEnabled"
						@onRefreshing="onRefreshing"
						:myId = "myId"
						></square-activity>
					</swiper-item>
					<!-- 知道板块 -->
					<swiper-item>
						<movable-view :x="300" :y="500" class="refresh-button-content" direction="all">
							<view @click="onAskQuestionButtonClick" class="send-button">
								<view class="iconfont icon-edit-square" :style="{ fontSize: '30px', color: '#FFF' }" />
							</view>
						</movable-view>
						<questions
						:scollerHeight="scollerHeight"
						:refresherEnabled="refresherEnabled"
						:myId = "myId"
						@onRefreshing="onRefreshing"
						></questions>
					</swiper-item>
					<!-- 热门的动态/問題 -->
					<swiper-item>
						<hot-articles
						:scollerHeight="scollerHeight"
						:refresherEnabled="refresherEnabled"
						@onRefreshing="onRefreshing"
						:myId = "myId"
						></hot-articles>
						
					</swiper-item>
					<!-- 市集板块 -->
					<!-- <swiper-item>
						<movable-view :x="300" :y="500" class="refresh-button-content" direction="all">
							<view @click="onSellGoodsButtonClick" class="send-button">
								<view class="iconfont icon-qitake" :style="{ fontSize: '30px', color: '#FFF' }" />
							</view>
						</movable-view>
						<scroll-view class='scrollview' scroll-y="true" 
						:refresher-enabled="refresherEnabled"
							:style="{
								height:scollerHeight+'px'
							}"
							:refresher-triggered="false"
							 @refresherrefresh="onMarketIsRefresh()"
							:scroll-into-view="scrollInto" 
							@scrolltolower="onMarketScrolltolower()">
							<view id="market-scrollview-top"></view> -->
							<!-- 搜索框 -->
							<!-- <view class='search-bar-content' id='activity-search-bar-content'>
								<view class='search-bar'
								@click="onSearchBarClick()"
								>
									<view class='iconfont icon-search' :style="{
										  fontSize: '25px',
										  color: '#707070'
										}">
									</view>
									<view class='labels-swiper'>
										<view class='search-tips'>
											<text>找闲置</text>
										</view>
									</view >
								</view>
							</view>
							<view class="market-content">
								<view v-for="(item,index) in [...new Array(10)]" :key="index" class="market-item" >
									<goods-item
									avatar="../../static/imgs/anonymous.png"
									username="布咕星球"
									:goodsData="{
										id:1,
										text:'急用钱转手卖，茶吧饮水机',
										video:0,
										price:98,
										labels:[{id:0,content:'功能完好无维修'}],
										pic:['http://test.file.your_url.example/user/activity/47-0a926324-4625-4e4d-baa4-02462513bcf5'],
										
									}"
									></goods-item>
								</view>
							</view>
							<view class='loading-content'>
								<uni-load-more
								:status="hotArticles.haveMoreData?showBottomLoading?'loading':'more':'noMore'" 
								:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多数据了'}"
								iconType="circle"
								></uni-load-more>
							</view>
						</scroll-view>
					</swiper-item> -->
				
				</swiper>
			</movable-area>
		</view>
		
		
	</view>
</template>

<script lang="ts">
	import {
		ArticleItem,
		UserInfo,
		LabelItem,
		RingingToneItem,
		TabLabelItem,
		QuestionDataItem
		
	} from '@/common/dataClass';
	import {
		request
	} from '@/utils/request';
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType,
		RingingToneList
	} from '@/common/constants';
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";

	import store from '@/store/index';
	import {connectSocket} from "@/utils/socket";
	import {setGlobalData,getGlobalData} from "@/common/constants";
	import {ALL_UNREAD_MESSAGE_SUM} from "@/common/globalMsgKeys";
	import {initUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
	import questions from "./questions";
	import hotArticles from "./hot-articles";
	import squareActivity from './square-activity';
	/**
	 * index 广场界面
	 * @description 广场界面
	 * @Author: 穆兰
	 * @Date: 2021/12/27
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/12
	 */
	export default {
		components: {
			questions,
			hotArticles,
			squareActivity
		},
		data() {
			return {
				tabLabels:[{title:'推荐',badge:0},{title:'问答',badge:0},{title:'热榜',badge:0}] as TabLabelItem[],
				tabSelect:0,//选择的标签页
				touchY:0,//手指在屏幕y轴的位置
				myId: 0,//用户的id
				state:store.state as any,//vuex仓库
				refresherEnabled:true,
				// goods:{
				// 	data: [] as ArticleItem[],
				// 	isRefresh: false,
				// 	haveMoreData: true,
				// 	page: 1,
				// },
				contentHeight:0,
				navHeight:0,
				isRefresh:false//是否正在刷新
			};
		},
		async onLoad(params) {
			let inviteCode = params.inviteCode
			if(inviteCode){
				uni.setStorage({key:"BeInvitedCode",data:inviteCode})
			}
			let userInfo = await getMyUserInfo() as UserInfo
			if(!userInfo){
				this.isLoading = false
				uni.showModal({
					title: '未登录',
					content: '未登录，请先登录',
					success: function(res) {
						if (res.confirm) {
							uni.setStorage({
								key: 'token',
								data: null
							})
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}else{
						}
					}
				})
				return
			}
			this.myId = userInfo.id
			this.isLoading = false
			initUnreadMessageSum(userInfo.id)
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#index-swiper"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onShow(){
			let userInfo = await getMyUserInfo() as UserInfo
			if(!userInfo){
				uni.closeSocket()
			}else{
				if(!this.state.socketStateStore.isConnectSocket){
					connectSocket()
				}
			}
			
		},
		computed:{
		       newMessage() {
		           return this.state.messageStore.newMessage
		          },
				statusBarHeight(){
					
					return uni.getSystemInfoSync().statusBarHeight + 'px'
				},
				scollerHeight(){
					return this.contentHeight - this.navHeight
				}
		    },
		watch: {
			newMessage: function(message) {
			  this.$refs.messagePopup.open()
			},
			
		},
		//#ifdef MP-WEIXIN
		/**
		 * @description 分享
		 */
		onShareAppMessage() {
			let imageUrl =''
			if(this.editArticleItem.pic.length>0){
				if(this.editArticleItem.video==1){
					imageUrl=this.editArticleItem.pic[0]+'?vframe/jpg/offset/0'
				}else{
					imageUrl=this.editArticleItem.pic[0]
				}
			}
			let username = ''
			if(this.editArticleItem.isAnonymity==1){
				username="匿名用户"
			}else{
				if(this.editArticleItem.publisher){
					username = this.editArticleItem.publisher.username
				}
			}
		    return {
		      title:`${username}发布了一条动态，快来看看ta说了什么` ,
		      path: `/pages/activity-info/activity-info?activityId=${this.editArticleItem.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl
		    };
		},
		// #endif
		methods: {
			
			/**
			 * @description 有页面刷新时
			 * @param {boolean} isRefreshing 
			 */
			onRefreshing(isRefreshing){
				this.isRefresh = isRefreshing
			},
			/**
			 * @description 跳转到指定页面
			 * @param {string} url 页面路径
			 */
			navigateTo(url:string){
				uni.navigateTo({
					url
				})
			},
			/**
			 * @description swiper位置变化时
			 */
			onSwiperTransition(){
				//swiper改变时禁用下拉刷新
				//如果正在刷新则不禁用
				if(!this.isRefreshing){
					this.refresherEnabled=false
				}
				
			},
			/**
			 * @description swiper动画结束 允许下拉刷新
			 */
			onSwiperAnimationfinish(){
				this.refresherEnabled=true
			},
			
			/**
			 * @description 发送按钮
			 */
			onPublishButtonClick(){
				uni.navigateTo({
					url:"/pages/publish/publish"
				})
			},
			
			/**
			 * @description 点击提问按钮
			 */
			onAskQuestionButtonClick(){
				uni.navigateTo({
					url:"/pages/publish/ask-questions/ask-questions"
				})
			},
			/**
			 * @description 点击发布闲置按钮
			 */
			onSellGoodsButtonClick(){
				uni.navigateTo({
					url:"/pages/publish/sell-goods/sell-goods"
				})
			},
			/**
			 * @description 切换页面时
			 * @param {Object} e
			 */
			onSwiperChange(e) {
				this.tabSelect = e.detail.current;
				
			},
			/**
			 * @description 点击导航标签
			 * @param {number} 点击的第几个
			 */
			onTabsClick(index: number) {
				this.tabSelect = index;

			},
		}
	};
	
</script>

<style lang="scss">
	//广场、消息页面默认样式
	.square-head {
		height: fit-content;
		width: 100%;
		background-color: white;
	}

	.activity-tabs {
		height: 3.5vh;
		padding-top: 7vh;
		width: 100vw;
	}

	.activity-tabs .tab {
		float: left;
		width: 100rpx;
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		height: 100%;
		font-size: large;
		transition: all 300ms;
		color: #a5a5a5;
	}

	.tab-bottom-line {
		width: 60rpx;
		height: 0.5vh;
		border-radius: 2px;
		background-color: #3bd8bf;
		transition: all 300ms;
	}

	.tab-select-0 {
		margin-left: 22rpx;
	}

	.tab-select-1 {
		margin-left: 122rpx;
	}

	.tab-select-2 {
		margin-left: 222rpx;
	}

	.swiper {
		margin-top: 1px;
		height: 89vh;
		width: 100vw;
	}


	.index-conent {
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.refresh-button-movable {
		width: 100vw;
	}

	.refresh-button-content {
		height: 100rpx;
		width: 100rpx;
		z-index: 3;

		.send-button {
			height: 100rpx;
			width: 100rpx;
			border-radius: 50rpx;
			overflow: hidden;
			display: flex;
			text-align: center;
			align-items: center;
			justify-content: center;
			background-color: #4eccb8;
			
			z-index: 100;
		}
	}

	
	



	// .no-activity {
	// 	width: 100%;
	// 	height: 100%;
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;
	// 	justify-content: center;
	// 	text-align: center;
	// 	color: #dadada;
	// }

	// .no-activity-text {
	// 	margin-top: 20px;
	// 	font-size: large;
	// 	color: #b6b6b6;
	// }
	.market-content{
		columns: 2; // 默认列数
		column-gap: 0px; // 列间距
		height: fit-content;
		.market-item{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			break-inside: avoid;
		}
	}

</style>
