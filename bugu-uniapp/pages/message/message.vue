<template>
	<view class="page">
		<view class="message-head"
		:style="{
			paddingTop:statusBarHeight
		}">
			
			<page-tabs
			:labels="tabLabels"
			:index="tabSelect"
			:tabPadding="26"
			:activeFontSize="18"
			:defaultFontSize="16"
			:flex="true"
			defaultColor="#7a7a7a"
			underLineType="bubble"
			@changeIndex="onTabsClick"
			>
			</page-tabs>
		</view>
		<swiper :current="tabSelect" 
		:style="{
			height:scollerHeight+'px'
		}"
		class="swiper" id="message-swiper"
		@change="onSwiperChange"
		@transition="onSwiperTransition"
		@animationfinish="onSwiperAnimationfinish"
		>
			<swiper-item>
				<scroll-view 
				class='scrollview' 
				scroll-y="true"
				:style="{
					height:scollerHeight+'px'
				}"
				>
					<!-- 搜索框 -->
					<view class='search-bar-content'>
						<view class='search-bar'
						@click="onSearchBarClick()"
						>
							<view class='search-tips'>
										搜索
							</view>
						</view>
					</view>
					<!-- 互动消息 -->
					<interactive-message
					avatar="/static/svgs/add_user.svg"
					:title="'关注'"
					:badgeNumber="attentionUnreadSum"
					@onClick="onInteractiveMessageClick('ATTENTION')"
					/>
					<interactive-message
					avatar="/static/svgs/message-comment.svg"
					title="评论和回答"
					:badgeNumber="commentUnreadSum"
					@onClick="onInteractiveMessageClick('COMMENT')"
					/>
					<interactive-message
					avatar="/static/svgs/message-like.svg"
					title="喜欢和赞同"
					:badgeNumber="likedUnreadSum"
					@onClick="onInteractiveMessageClick('LIKE')"
					/>
					<!-- 官方的消息 -->
					<view v-if="officialNewsList.length>0">
						<user-message-item
						:key="item.type"
						v-for="item in officialNewsList"
						:avatar="item.type===OfficeMessageType.ACTIVITY? '/static/svgs/official-activities.svg'
			            :'/static/svgs/official-communication.svg'"
						title="布咕通知"
						:messageType="'official'"
						:badgeNumber="item.unreadSum"
						:note="item.lastText"
						:needOnlineState="false"
						:time="item.lastTime"
						@onClick="onOfficialNewsItemClick(item)"
						@onMoreClick="onOfficialNewsItemMoreClick(item)"
						>	
						</user-message-item>
					</view>
					<!-- 私聊的消息 -->
					<view v-if="userMessageList.length>0">
						 <!-- 自定义右侧内容 -->
						<user-message-item v-for="item in userMessageList" 
						:key="item.userId" 
						:avatar="item.avatar"
						:title="item.username"
						:note="item.lastMessageType==1?'[图片]':item.lastMessageType==2?'语音':item.lastMessage"
						:needOnlineState="true"
						:time="item.lastTime"
						:onLineState="item.online"
						:badgeNumber="item.unReadSum"
						@onClick="onUserMessageItemClick(item)"
						@onMoreClick="onUserMessageMoreClick(item)"
						/>
					</view>
					
				</scroll-view>
			</swiper-item>
			<!-- 动态 -->
			<swiper-item>
				<scroll-view class='scrollview' 
						scroll-y="true" 
						:style="{
							height:scollerHeight+'px'
						}"
						:refresher-enabled="refresherEnabled"
						:refresher-triggered="attentionArticles.isRefresh" 
						:scroll-into-view="scrollInto"
						@refresherrefresh="onAttentionIsRefresh()"
						@scrolltolower="onAttentionScrolltolower()" >
					<view id="attention-scrollview-top"></view>
					<activity-item v-for="(item,index) in attentionArticles.data" :articleItem="item"
						:isMe="false" :key="item.id" @onFollowClick="onFollow(item)"
						@onMoreClick="onMoreClick(item)"
						@onClick="onActivityItemClick(item)"
						@onShareClick="onShareClick(item)"
						>
					</activity-item>
					
					<view v-if="attentionArticles.data.length>0" class='loading-content'>
						<uni-load-more
						iconType="circle"
						:status="attentionArticles.haveMoreData?showBottomLoading?'loading':'more':'noMore'"  
						:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多数据了'}"
						></uni-load-more>
					</view>
					<view v-else class='no-activity'>
						<view class='iconfont icon-xingqiu' :style="{fontSize: '300rpx'}" />
						<view class='no-activity-text'>你还没有关注任何人哦~</view>
					</view>
				</scroll-view>
			</swiper-item>
			
		</swiper>
		<!-- 私聊操作弹出层 -->
		<action-sheet ref="userMessageActionPopup" :needHead="true" title="消息选择" :needCancelButton="true">
			<block v-if="editUserMessageItem.userId">
				<action-sheet-item @click="onUserMessageDeleteClick(editUserMessageItem)" icon="icon-delete" title="删除对话"/>
				<action-sheet-item @click="onUserMessageReportClick(editUserMessageItem)" icon="icon-alert" title="举报用户"/>
			</block>
		</action-sheet>
		<!-- 官方消息操作弹出层 -->
		<action-sheet ref="officialNewsActionPopup" :needHead="true" title="消息选择" :needCancelButton="true">
			<block v-if="editOfficialNewsItem.type">
				<action-sheet-item @click="onOfficialNewsDeleteClick(editOfficialNewsItem)" icon="icon-delete" title="删除对话"/>
			</block>
		</action-sheet>
		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<block v-if="editArticleItem.id">
				<action-sheet-item v-if="editArticleItem.publisher.isAttention == 1"
				icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelFollow(editArticleItem)"/>
				<action-sheet-item v-else icon="icon-guanzhu" title="关注" @click="onFollow(editArticleItem)"/>
				<action-sheet-item @click="onChatClick(editArticleItem)" icon="icon-message" title="私聊"/>
				<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报"/>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		ArticleItem,RingingToneItem
	} from '@/common/dataClass';
	import {
		UserMessageListItem,
		ChatUserInfo,
		InteractiveMessageList,
		InteractiveMessageData,
		OfficialNewsListItem} from "@/utils/messageUtils/model";
	import {
		getAndHandOfficialNewsList
	} from "@/utils/messageUtils";
	import {getUserMessageList,
	getInteractiveMessageList,
	getOfficalList,
	interactiveMessageALLRead,
	deleteOfficalNewsItem,
	deleteUserMessageItem,
	deleteAllInteractiveMessage,
	likeGroup,
	commentGroup
	} from "@/utils/messageUtils/storage";
	import {
			getMyUserInfo,
	} from '@/common/storageFunctions';
	import {INTERACTIVE,USER_MESSAGE,WITHDRAW,REQUEST_SUCCEEDED_CODE,
		InteractiveType,
		InteractiveGroup,
		OfficeMessageType,
		reportObjectType,
		RingingToneList
	} from "@/common/constants"
	import store from '@/store/index';
	import {connectSocket} from "@/utils/socket";
	import {
	REFRESH_DYNAMIC_SOUND
	} from "@/common/storageKeys";
	import {request} from "@/utils/request";
	import {changeUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
	import {
	cancelAttention,
	followUser} from "@/common/requestFunctions";
	
	/**
	 * message 消息界面
	 * @description 消息界面
	 * @Author: 穆兰
	 * @Date: 2022/1/9
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/20
	 */
	export default {
		data() {
			return {
				tabLabels:[{title:'消息',badge:0},{title:'动态',badge:0}],
				tabSelect:0,
				InteractiveGroup,
				InteractiveType,
				OfficeMessageType,
				scrollInto:'',//滚动到指定位置
				userMessageList:[] as UserMessageListItem[],
				officialNewsList:[] as OfficialNewsListItem[],
				attentionUnreadSum:0,//未读关注     总数
				likedUnreadSum:0,//未读赞总数
				commentUnreadSum:0,//未读评论总数
				publishUnreadSum:0,//未读关注动态总数
				questionMessageUnreadSum:0,//未读的问题消息总数
				state:store.state as any,
				userInfo:{},
				editArticleItem:{},
				refresherEnabled:false,//是否允许下拉刷新
				editUserMessageItem:{},
				editOfficialNewsItem:{},
				attentionArticles: {
					data: [] as ArticleItem[],
					isRefresh: false,
					haveMoreData: true,
					page: 1,
				},
				contentHeight:0,
				navHeight:0,
			}
		},
		async onLoad(){
			this.userInfo = await getMyUserInfo()
			if(!this.userInfo){
				return
			}
			this.refreshMessages(this.userInfo)
			this.officialNewsList = await getOfficalList(this.userInfo.id)
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#message-swiper"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onShow(){
			changeUnreadMessageSum()
			
			this.userInfo = await getMyUserInfo()
			if(!this.userInfo){
				this.tabLabels=[{title:'动态',badge:0},{title:'消息',badge:0}]
				this.userMessageList=[]
				this.interactiveMessageList={unreadSum: 0, data: []}
				this.likedUnreadSum=0
				this.commentUnreadSum=0
				this.publishUnreadSum=0
				return
			}
			this.refreshMessages(this.userInfo)
			if(!this.state.socketStateStore.isConnectSocket){
				connectSocket()
				
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
			/**
			 * @description 有新消息時
			 * @param {Object} message 新的消息
			 */
			newMessage: async function(message) { 
				if (message.type === USER_MESSAGE || message.type === WITHDRAW) {
					let userMessageList = await getUserMessageList(this.userInfo.id)
					this.userMessageList = userMessageList.reverse()
				} else if(message.type === INTERACTIVE) {
					let interactiveMessageList = await getInteractiveMessageList(this.userInfo.id,message.data.type)
					if(likeGroup.indexOf(message.data.type)!=-1){
						this.likedUnreadSum = interactiveMessageList.unreadSum
					}else if(commentGroup.indexOf(message.data.type)!=-1){
						this.commentUnreadSum = interactiveMessageList.unreadSum
					}else if(message.data.type===InteractiveType.PUBLISH){
						this.tabLabels[0].badge = interactiveMessageList.unreadSum
					}else if(message.data.type===InteractiveType.ATTENTION){
						this.attentionUnreadSum = interactiveMessageList.unreadSum
					}
					
					
					
				}
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
			 * @description 更新所有消息列表
			 * @param {Object} userInfo 用户信息
			 */
			async refreshMessages(userInfo){
				let userMessageList = await getUserMessageList(this.userInfo.id)
				this.userMessageList = userMessageList.reverse()
				this.attentionUnreadSum = (await getInteractiveMessageList(this.userInfo.id,InteractiveType.ATTENTION)).unreadSum
				this.likedUnreadSum = (await getInteractiveMessageList(this.userInfo.id,InteractiveType.LIKE)).unreadSum
				this.commentUnreadSum = (await getInteractiveMessageList(this.userInfo.id,InteractiveType.COMMENT)).unreadSum
				this.tabLabels[0].badge = (await getInteractiveMessageList(this.userInfo.id,InteractiveType.PUBLISH)).unreadSum
				let officialNewsList = await getAndHandOfficialNewsList(this.userInfo.id)
				this.officialNewsList = officialNewsList.reverse()
			},
			/**
			 * @description 点击导航标签
			 * @param {number} 点击的第几个
			 */
			onTabsClick(tabNumber: number) {
				this.tabSelect = tabNumber;
			},
			/**
			 * @description 切换页面时
			 * @param {Object} e
			 */
			async onSwiperChange(e) {
				this.tabSelect = e.detail.current;
				if(this.tabSelect==1){
					if(this.tabLabels[1].badge>0){
						changeUnreadMessageSum(-this.tabLabels[1].badge)
						this.tabLabels[1].badge=0
						if(this.userInfo.id){
							interactiveMessageALLRead(this.userInfo.id,InteractiveType.PUBLISH)
						}
					}
					
				}
			},
			/**
			 * swiper位置变化时
			 */
			onSwiperTransition(){
				//swiper改变时禁用下拉刷新
				//正在刷新时则不禁用
				if(!this.attentionArticles.isRefresh){
					this.refresherEnabled=false
				}
			},
			/**
			 * swiper动画结束 允许下拉刷新
			 */
			onSwiperAnimationfinish(){
				this.refresherEnabled=true
				if(this.tabSelect==1){
					if(this.attentionArticles.data.length<1&&this.attentionArticles.haveMoreData){
						this.attentionArticles.isRefresh=true
					}
				}
			},
			/**
			 * @description 下拉刷新关注动态
			 */
			onAttentionIsRefresh() {
				this.attentionArticles.isRefresh = true
				this.attentionArticles.page = 1
				this.getAttentionarticles(this.attentionArticles.page)
			},
			/**
			 * @description 上拉获取之前的关注动态
			 */
			onAttentionScrolltolower() {
				if (!this.attentionArticles.haveMoreData) { //没有更多时不进行请求
					return
				}
				this.showBottomLoading = true
				this.attentionArticles.page = this.attentionArticles.page + 1
				this.getAttentionarticles(this.attentionArticles.page)
			},
			/**
			 * @description 点击某个动态
			 * @param {ArticleItem}
			 */
			onActivityItemClick(item){
				uni.navigateTo({
					url:`/pages/activity-info/activity-info?activityId=${item.id}`
				})
			},
			/**
			 * @description 点击动态上的更多按钮
			 */
			onMoreClick(item: ArticleItem) {
				this.$refs.articleActionPopup.open()
				this.editArticleItem = item
			},
			/**
			 * @description 点击动态的分享按钮
			 *  @param item 
			 */
			onShareClick(item){
				this.editArticleItem = item
			},
			/**
			 * @description 点击popup的举报按钮
			 * @param {ArticleItem} item
			 */
			onPopupReportClick(item: ArticleItem){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.articleActionPopup.close()
			},
			/**
			 * @description 点击popup的取消关注按钮
			 * @param item 
			 */
			async onCancelFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				uni.showModal({
					title: '取消关注',
					content: `你确定要取消关注${item.publisher.username}`,
					success: async function(res) {
						if (res.confirm) {
							if (item.publisher)
								if (await cancelAttention(item.publisher.id)) {
									
									let attentionArticles = _this.attentionArticles.data
									for (let i = 0; i < attentionArticles.length; i++) {
										if (attentionArticles[i].publisher && attentionArticles[i]
											.publisher.id ==
											item.publisher.id) {
											attentionArticles[i].publisher.isAttention = 0
										}
									}
									_this.attentionArticles.data = attentionArticles
									_this.$refs.articleActionPopup.close()
									uni.showToast({
										title: '取消关注',
										icon: 'success'
									})
								}
						}
					}
				})
			},
			/**
			 * @description 点击popup/activity-item的关注按钮
			 *  @param item 
			 */
			async onFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				if (await followUser(item.publisher.id)) {
					
					let attentionArticles = _this.attentionArticles.data
					for (let i = 0; i < attentionArticles.length; i++) {
						if (attentionArticles[i].publisher && attentionArticles[i].publisher.id ==
							item.publisher.id) {
							attentionArticles[i].publisher.isAttention = 1
						}
					}
					_this.attentionArticles.data = attentionArticles
					_this.$refs.articleActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}
			},
			/**
			 * @description 点击popup私聊按钮
			 *  @param item 
			 */
			async onChatClick(item: ArticleItem){
				if(item.publisher)
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-content/chat-content?fromUserId=${item.publisher.id}`
				})
			},
			/**
			 * @description 点击搜索框
			 */
			onSearchBarClick(){
				uni.navigateTo({
                    url: '/pages/message-secondary-page/search-user/search-user'
                  })
			},
			/**
			 * @description 点击互动消息
			 * @param {string} type 互动消息的类型
			 */
			onInteractiveMessageClick(type:string){
				uni.navigateTo({
					url:"/pages/message-secondary-page/interactive-message/interactive-message?type="+type
				})
			},
			/**
			 * @description 点击问答消息
			 */
			onQuestionMessageClick(){
				uni.navigateTo({
					url:"/pages/message-secondary-page/question-message/question-message"
				})
			},
			/**
			 * @description 点击某个私聊消息时
			 * @param {Object} item
			 */
			onUserMessageItemClick(item){
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-content/chat-content?fromUserId=${item.userId}`
				})
			},
			/**
			 * @description 点击某个私聊消息的更多按钮
			 * @param {Object} item
			 */
			onUserMessageMoreClick(item){
				this.editUserMessageItem = item
				this.$refs.userMessageActionPopup.open()
				
			},
			/**
			 * @description 点击弹出框的删除对话按钮
			 * @param {UserMessageListItem} item 选择的对话
			 */
			onUserMessageDeleteClick(item){
				let _this = this
				uni.showModal({
					title: '删除对话',
					content: `你确定要删除与${item.username}的对话吗？`,
					success: async function (res) {
					  if (res.confirm) {
						if (item) {
							changeUnreadMessageSum(-item.unReadSum)
						    let messageList = await deleteUserMessageItem(_this.userInfo.id,item.userId)
						    _this.userMessageList = messageList
						}
						_this.$refs.userMessageActionPopup.close()
					  }
					}
				})
			},
			/**
			 * @description 点击弹出框的举报按钮
			 * @param {UserMessageListItem} item 选择的对话
			 */
			onUserMessageReportClick(item){
				this.$refs.userMessageActionPopup.close()
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.userId}&objectType=chat`
				})
			},
			/**
			 * @description 点击某个官方消息的更多按钮
			 * @param {Object} item
			 */
			onOfficialNewsItemMoreClick(item){
				this.editOfficialNewsItem=item
				this.$refs.officialNewsActionPopup.open()
			},
			/**
			 * @description 点击弹出框的删除对话按钮
			 * @param {OfficialNewsListItem} item 选择的对话
			 */
			onOfficialNewsDeleteClick(item){
				let _this = this
				uni.showModal({
					title: '删除对话',
					content: `你确定要删除这个消息记录吗？`,
					success: async function (res) {
					  if (res.confirm) {
						if (item) {
							changeUnreadMessageSum(-item.unreadSum)
						    let officialNewsList = await deleteOfficalNewsItem(_this.userInfo.id,item.type)
						    _this.officialNewsList=officialNewsList
						}
						_this.$refs.officialNewsActionPopup.close()
					  }
					}
				})
			},
			/**
			 * @description 点击某个官方消息时
			 * @param {Object} item
			 */
			onOfficialNewsItemClick(item){
				uni.navigateTo({
					url:`/pages/message-secondary-page/official-news-info/official-news-info?type=${item.type}`
				})
			},
			
			
			/**
			 * 
			 * @description 获取关注的动态列表
			 * @param page 第几页 
			 * @param notPlaySound 可选参数是否播放刷新音效
			 */
			async getAttentionarticles(page: number, notPlaySound: boolean = false) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: 'attention',
						data: {
							page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
			
						},
					}
				});
				setTimeout(() => {
					this.attentionArticles.isRefresh = false
				}, 700)
				this.showBottomLoading = false
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageSum = res.data.data.pageSum
					let articles = res.data.data.list as ArticleItem[]
					if (page === 1) {
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						})
						if (!notPlaySound) {
							this.playRefreshDynamicSound()
						}
						this.attentionArticles.data = articles
						this.scrollInto = ''
			
						if (pageSum <= 1) {
							this.attentionArticles.haveMoreData = false
						} else {
							this.attentionArticles.haveMoreData = true
						}
					} else {
						if (page > pageSum) { //判断是不是最后一页
							this.attentionArticles.haveMoreData = false
							this.attentionArticles.page = page - 1
						} else {
							let allarticles = this.attentionArticles.data.concat(articles)
							this.attentionArticles.data = allarticles
							if (page == pageSum) {
								this.attentionArticles.haveMoreData = false
							} else {
								this.attentionArticles.haveMoreData = true
							}
						}
					}
					if (articles.length < 1) { //如果这一页没有动态则切换到下一页
						if (page < pageSum) {
							this.attentionArticles.page = page + 1
							this.getAttentionarticles(this.attentionArticles.page, true)
						}
					}
				}
			},
			/**
			 * @description 播放刷新音效
			 */
			async playRefreshDynamicSound() {
			      let refreshDynamicSound = uni.getStorageSync(REFRESH_DYNAMIC_SOUND) as RingingToneItem
				  if(!refreshDynamicSound){
					  refreshDynamicSound = RingingToneList[6]
				  }
			      const innerAudioContext =uni.createInnerAudioContext()
			      innerAudioContext.autoplay = true
			      innerAudioContext.src = refreshDynamicSound.url
			    
			  }
		}
	}
</script>

<style lang="scss">
	.message-head {
		height: fit-content;
		width: 100%;
		background-color: white;
		display: flex;
		flex-direction:column;
		align-items: center;
		text-align: center;
		justify-content: center;
	}

	.message-tabs {
		height: 3.5vh;
		padding-top: 7vh;
		width: 100vw;
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
	}

	.message-tabs .tab {
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
	.tab-bottom-line-content{
		width: 200rpx;
		text-align: left;
	}
	.tab-bottom-line {
		width: 60rpx;
		height: 0.5vh;
		border-radius: 2rpx;
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
		margin-top: 1rpx;
		width: 100vw;
	}

	.scrollview {
		height: 89vh;
		width: 100vw;
		overflow-anchor: auto;
	}
	.message-content{
		height: 100%;
		width: 100%;
		overflow: hidden;
		
	}
	.no-message{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color:#dadada
	}
	.no-message-text{
		margin-top: 20rpx;
		font-size: large;
		color: #b6b6b6;
	}
	.messages-clear-all{
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 2%;
		.number-of-messages{
			flex: 1;
			color: #b1b1b1;
		}
		.clear-all-button{
		padding: 5rpx 20rpx;
		border-radius: 10rpx;
		font-size: small;
		color: #777575;
		background-color: #eeeeee;
		}
	}
	.message-action-conetnt {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.message-action-icon {
		display: flex;
		width: 60rpx;
		margin-right: 20rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	.message-action-text {
		flex-grow: 1;
		text-align: left;
		color:#353535;
		font-size: '23px';
	}
	.message-action-cancel{
	   margin-left: 5%;
	   margin-right: 5%;
	   margin-top: 2%;
	   width: 90%;
	   padding-top: 20rpx;
	   padding-bottom: 20rpx;
	   background-color: #f1f1f1;
	   border-radius: 50rpx;
	   text-align: center;
	}
	.search-bar-content{
		height: fit-content;
		background-color: #fff;
		padding:2% 4%;
	}
	.search-bar{
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		background-color:#F0F0F0;
		display: flex;
		align-items: center;
		.search-tips{
			width: 100%;
			text-align: center;
			font-size: small;
			color: #A5A5A5;
		}
	}
	.chat-custom-right{
		display: flex;
		text-align: center;
		align-items: center;
		justify-items: center;
		font-size: small;
		color: #9c9c9c;
		margin:0 10rpx ;
		.chat-custom-text{
			margin-right: 20rpx;
		}
	}
	.no-activity {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}
	
	.no-activity-text {
		margin-top: 20px;
		font-size: large;
		color: #b6b6b6;
	}
</style>
