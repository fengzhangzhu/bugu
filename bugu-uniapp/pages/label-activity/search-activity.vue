<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">搜索</view>
		</uni-nav-bar>
		<!-- 搜索框 -->
		<view class="search-content">
			<uni-search-bar v-model:modelValue="searchText" class="search-input" placeholder="搜索标签" cancelButton="none"
				 @confirm="onSearchConfirm()"></uni-search-bar>
			<view class="search-button">
				<button style="background-color: #4eccb8;color: #fff;" @click="onSearchConfirm()"
					size="mini">搜索</button>
			</view>
		</view>
		<!-- 标签 -->
		<view class='labels-cotent' v-if="showHotLabels">
			<!-- 搜索历史 -->
			<view v-if="searchHistory.length>0" class='search-history-content'>
				<view class='hot-labels-title'>
					<text>搜索历史</text>
				</view>
				<view class='search-history-items'>
					<view v-for="(item,index) in searchHistory" :key="item" class='history-item'
						@click="onLabelTextClick(item)">
						{{item}}
					</view>
				</view>
			</view>
			<!-- 热搜 -->
			<view class='hot-labels-title'>
				<text>热门搜索</text>
				<view class='iconfont icon-remen' :style="{
		                    fontSize: '20px',
		                    color: '#FE5F64'
		                  }"></view>
			</view>
			<view class='hot-labels-content'>

				<view v-for="(item,index) in hotLabels" :key="item.id" class='label-item'
					@click="onLabelTextClick(item.content)">
					<view :class="index < 3 ? 'label-index-hot' : 'label-index'">
						{{index + 1}}
					</view>
					<view class='label-text'>
						{{item.content}}
					</view>
					<view class='label-hot'>
						{{item.hot}}热度
					</view>
				</view>

			</view>
		</view>
		<!-- 搜索的动态结果 -->
		<view v-else>
			<scroll-view class='scrollview' scroll-y="true" 
				:scroll-into-view="scrollInto"
				@scrolltolower="onScrolltolower">
				<view id="activity-head"></view>
				<activity-item 
					v-for="(item,index) in articles" 
					:articleItem="item"
					:isMe="item.publisher&&myId == item.publisher.id" 
					:key="item.id" 
					@onClick="onActivityItemClick(item)"
					@onFollowClick="onFollow(item)"
					@onMoreClick="onMoreClick(item)"></activity-item>
				<!-- 没有结果时 -->
				<view v-if="articles.length<0" class='no-activity'>
					<view class='iconfont icon-xingqiu' :style="{
						fontSize: '150px',
					  }"></view>
					<view class='no-activity-text'>没有结果哦换个关键词试试~</view>
				</view>
				<view v-else class='loading-content'>
					<uni-load-more
					:status="haveMoreData?showBottomLoading?'loading':'more':'noMore'" 
					:contentText="{contentdown: '上拉显示更多',contentrefresh: '正在加载...',contentnomore: '没有更多数据了'}"
					iconType="circle"
					></uni-load-more>
				</view>
			</scroll-view>
		</view>
		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<block v-if="editArticleItem.id">
				<block v-if="editArticleItem.isAnonymity">
					<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报" />
				</block>
				<block v-else>
					<block v-if="editArticleItem.publisher.id == myId">
						<action-sheet-item icon="icon-delete" title="删除" @click="onPopupDeleteClick"/>
					</block>
					<block v-else>
						<action-sheet-item v-if="editArticleItem.publisher.isAttention == 1"
						icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelFollow(editArticleItem)"/>
						<action-sheet-item v-else icon="icon-guanzhu" title="关注" @click="onFollow(editArticleItem)"/>
						<action-sheet-item icon="icon-message" title="私聊"/>
						<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报"/>
					</block>
				</block>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		cancelAttention,
		deleteMyArticle,
		followUser,
		getHotLabels
	} from '@/common/requestFunctions';
	import {
		SEARCH_ACTIVITY_HISTORY
	} from '@/common/storageKeys';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	import {
		ArticleItem,
		LabelItem,
		UserInfo
	} from '@/common/dataClass';
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType
	} from "@/common/constants";
	/**
	 * searchActivity 搜索指定关键词下的动态
	 * @description  搜索指定关键词下的动态
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 */
	export default {
		data() {
			return {
				searchText: '',//搜索文字
				searchTextBefore: '',//之前搜索的文字,用于用户删除或更改搜索文字但是没有点击搜索的情况
				haveMoreData: false,//是否有更多数据
				articles: [] as ArticleItem[],//动态
				showBottomLoading: false,//是否处于loading状态
				page: 1,//页号
				editArticleItem: {},//需要进行操作的动态
				scrollInto: '',//滑动到指定id视图的位置
				hotLabels: [] as LabelItem[],//热门标签
				showHotLabels: true,//是否展示热门标签
				searchHistory: [] as string[],//搜索历史
				myId: -1//我的id
			}
		},
		async onLoad() {
			this.hotLabels = await getHotLabels()
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id
			}
			let searchHistory = uni.getStorageSync(SEARCH_ACTIVITY_HISTORY)
			if (searchHistory) {
				this.searchHistory = searchHistory
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
			 * @description 点击标签文字
			 * @param labelText 文字
			 */
			onLabelTextClick(labelText: string) {
				this.page = 1
				this.searchTextBefore = this.searchText = labelText
				this.searchActivities(this.searchText, this.page)
			},
			/**
			 * @description 滑到最底部时
			 */
			onScrolltolower() {
				if (!this.haveMoreData) {
					return
				}
				
				this.page = this.page + 1
				if (this.searchText !== this.searchTextBefore) {
					this.searchActivities(this.searchTextBefore, this.page)
				} else {
					this.searchActivities(this.searchText, this.page)
				}
			},
			/**
			 * @description 搜索框输入时
			 */
			onSearchInput(e) {
				this.searchText = e
			},
			/**
			 * @description 点击搜索按钮时
			 */
			onSearchConfirm() {
				if (this.searchText.length < 1) {
					uni.showToast({
						title: "请先输入关键词"
					})
					return
				}
				this.page = 1
				uni.showLoading({
					title: "搜索中"
				})
				this.searchTextBefore = this.searchText
				this.searchActivities(this.searchText, this.page)
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
			 * @description 点击popup的删除按钮
			 * @param item
			 */
			onPopupDeleteClick(item:ArticleItem) {
				let _this = this
				uni.showModal({
					title: '删除动态',
					content: '你确定要删除这个动态吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteMyArticle(item.id)) {
								let articles = _this.articles
								for (let i = 0; i < articles.length; i++) {
									if (articles[i].id == item.id) {
										articles.splice(i, 1)
										break
									}
								}
								_this.articles = articles
								_this.$refs.articleActionPopup.close()
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}
						}
					}
				})
			},
			/**
			 * @description 点击popup/activity-item的取消关注按钮
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
									let articles = _this.articles
									for (let i = 0; i < articles.length; i++) {
										if (articles[i].publisher && articles[i].publisher
											.id == item.publisher.id) {
											articles[i].publisher.isAttention = 0
										}
									}
									_this.articles = articles
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
					let articles = _this.articles
					for (let i = 0; i < articles.length; i++) {
						if (articles[i].publisher && articles[i].publisher.id == item.publisher.id) {
							articles[i].publisher.isAttention = 1
						}
					}
					_this.articles = articles
					_this.$refs.articleActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}
			
			
			},
			/**
			 * @description 根据关键词搜索动态
			 * @param subText 搜索的关键词
			 * @param page 页码
			 */
			async searchActivities(subText: string, page: number) {

				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: 'fullTextQuery',
						data: {
							page: page,
							subText: subText
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});

				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageSum = res.data.data.pageSum
					let articles = res.data.data.list as ArticleItem[]
					if (page < pageSum) { //判断是不是最后一页
						this.haveMoreData = true
					} else {
						this.haveMoreData = false
					}
					if (page === 1) {
						this.articles = articles
						this.scrollInto = ''
					} else {
						let allArtilces = this.articles.concat(articles)
						this.articles = allArtilces
					}
					if (articles.length < 1) { //如果这一页没有动态则切换到下一页
						if (page < pageSum) {
							this.page = page + 1
							this.searchActivities(subText, this.page)
						}
					}
				}
				//隐藏热门搜索
				uni.hideLoading()
				this.showHotLabels = false
				// 将搜索的内容加入到搜索历史
				if (page == 1) {
					let searchHistory: string[] = []
					let searchHistoryStorage = uni.getStorageSync(SEARCH_ACTIVITY_HISTORY)
					if (searchHistoryStorage) {
						searchHistory = searchHistoryStorage
					}
					if (searchHistory.indexOf(subText) == -1) {
						searchHistory.push(subText)
						if (searchHistory.length > 10) {
							searchHistory.splice(0, 1)
						}
					} else {
						searchHistory.splice(searchHistory.indexOf(subText), 1)
						searchHistory.push(subText)
					}
					uni.setStorage({
						key: SEARCH_ACTIVITY_HISTORY,
						data: searchHistory
					})
					this.searchHistory = searchHistory.reverse()
				}
			}
		}
	}
</script>

<style lang="scss">
	.scrollview {
		height: 89vh;
		width: 100vw;
		overflow-anchor: auto;
	}
	
	.no-activity {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.no-activity-text {
		margin-top: 20rpx;
		font-size: large;
		color: #b6b6b6;
	}

	.labels-cotent {
		padding-top: 20rpx;
		background-color: #fff;

	}

	.search-history-items {
		padding: 20rpx 0rpx;
		height: fit-content;
		width: fit-content;
		width: 90%;

		.history-item {
			padding: 10rpx 20rpx;
			background-color: #F7F7F7;
			color: #626262;
			border-radius: 30rpx;
			float: left;
			margin-left: 10rpx;
			margin-top: 10rpx;
		}
	}

	.hot-labels-title {
		width: 100%;
		padding-top: 10rpx;
		margin-left: 20rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		text-align: left;
	}

	.label-item {
		display: flex;
		padding: 20rpx 10rpx;
		align-items: center;
		justify-content: center;

		.label-index-hot {
			color: #FE5F64;
			font-size: medium;
			width: 60rpx;
			text-align: center;
			font-weight: bold;

		}

		.label-index {
			font-size: medium;
			width: 60rpx;
			color: #8A8A8A;
			text-align: center;
			font-weight: bold;
		}

		.label-text {
			flex-grow: 1;
			font-size: medium;
			color: #676767;
			text-align: left;
			font-weight: 500;
		}

		.label-hot {
			margin: 0rpx 10rpx;
			font-size: small;
			color: #9b9b9b;
		}
	}

	.loading-content {
		width: 100%;
		height: 60px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: small;
		color: #aaaaaa;
	}


	.search-content {
		display: flex;
		align-items: center;
		background-color: #FFF;
		border: 1rpx solid #F7F7F7;

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
</style>
