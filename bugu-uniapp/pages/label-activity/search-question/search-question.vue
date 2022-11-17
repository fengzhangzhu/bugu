<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">搜索问题</view>
		</uni-nav-bar>
		<!-- 搜索框 -->
		<view class="search-content">
			<uni-search-bar v-model:modelValue="searchText" class="search-input" placeholder="问题搜索" cancelButton="none"
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
		<!-- 搜索的问题结果 -->
		<view v-else>
			<scroll-view class='scrollview' scroll-y="true" 
				:scroll-into-view="scrollInto"
				@scrolltolower="onScrolltolower">
				<view id="question-head"></view>
				<question-item 
					v-for="(item,index) in questions"
					:key="'question'+item.id"
					:questionData="item"
					:answerData="item.hotAnswer"
					@click="onQuestionItemClick(item.id)"
					@moreClick="onQuestionItemMoreClick(item)"
				></question-item>
				<!-- 没有结果时 -->
				<view v-if="questions.length<=0" class='no-question'>
					<view class='iconfont icon-xingqiu' :style="{
						fontSize: '150px',
					  }"></view>
					<view class='no-question-text'>没有结果哦换个关键词试试~</view>
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
		<!-- 问题操作弹出层 -->
		<action-sheet ref="questionActionPopup" :needHead="true" title="问题选择" :needCancelButton="true">
			<block v-if="editQuestionItem.id">
				<block v-if="editQuestionItem.publisher&&editQuestionItem.publisher.id == myId">
					<action-sheet-item icon="icon-delete" title="删除" @click="onQuestionDeleteClick(editQuestionItem.id)"/>
				</block>
				<block v-else>
					<action-sheet-item @click="onQuestionReportClick(editQuestionItem.id)" icon="icon-alert" title="举报" />
					<action-sheet-item v-if="editQuestionItem.isCollected" 
					icon="icon-quxiaoguanzhu" title="取消收藏" @click="onCancelQuestionCollect(editQuestionItem.id)"/>
					<action-sheet-item v-else icon="icon-guanzhu" title="收藏问题" @click="onQuestionCollect(editQuestionItem.id)"/>
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
	} from '@/common/requestFunctions';
	import {
		collectQuestion,
		cancelCollectQuestion,
		likeQuestion,
		cancelLikeQuestion,
		deleteQuestion
	} from '@/services/questionServices'
	
	import {
		SEARCH_QUESTION_HISTORY
	} from '@/common/storageKeys';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	import {
		QuestionDataItem,
		LabelItem,
		UserInfo,
		PageInfo
	} from '@/common/dataClass';
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType
	} from "@/common/constants";
	/**
	 * searchQuestion 搜索指定关键词下的问题
	 * @description  搜索指定关键词下的问题
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/17
	 */
	export default {
		data() {
			return {
				searchText: '',//搜索文字
				searchTextBefore: '',//之前搜索的文字,用于用户删除或更改搜索文字但是没有点击搜索的情况
				haveMoreData: false,//是否有更多数据
				questions: [] as QuestionDataItem[],//问题
				showBottomLoading: false,//是否处于loading状态
				page: 1,//页号
				editQuestionItem: {} as QuestionDataItem,//需要进行操作的问题
				scrollInto: '',//滑动到指定id视图的位置
				hotLabels: [] as LabelItem[],//热门标签
				showHotLabels: true,//是否展示热门标签
				searchHistory: [] as string[],//搜索历史
				myId: -1//我的id
			}
		},
		async onLoad() {
			this.hotLabels = await this.getHotLabels()
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id
			}
			let searchHistory = uni.getStorageSync(SEARCH_QUESTION_HISTORY)
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
				this.searchQuestions(this.searchText, this.page)
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
					this.searchQuestions(this.searchTextBefore, this.page)
				} else {
					this.searchQuestions(this.searchText, this.page)
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
				this.searchQuestions(this.searchText, this.page)
			},
			/**
			 * @description 点击单个问题跳转到问题详情页
			 * @param {number} id 问题的id
			 */
			onQuestionItemClick(id:number){
				uni.navigateTo({
					url:`/pages/activity-info/question-info/question-info?questionId=${id}`
				})
			},
			/**
			 * @description 点击问题上的更多按钮
			 * @param {QuestionDataItem} item
			 */
			onQuestionItemMoreClick(item){
				this.editQuestionItem=item
				this.$refs.questionActionPopup.open()
			},
			/**
			 * @description 收藏问题
			 * @param {number} id 问题的id
			 */
			async onQuestionCollect(id){
				if (await collectQuestion(id)) {
					let questions: QuestionDataItem[] = this.questions
					for (let i = 0; i < questions.length; i++) {
						if (questions[i].id == id) {
							questions[i].isCollected = 1
							questions[i].collectSum = questions[i].collectSum+1
							break
						}
					}
					this.questions = questions
					this.$refs.questionActionPopup.close()
					uni.showToast({
						title: '收藏成功',
						icon: 'success'
					})
				}else{
					uni.showToast({
						title: '收藏失败',
						icon: 'error'
					})
				}
			},
			/**
			 * @description 取消点赞问题
			 * @param {number} id 问题的id
			 */
			async onCancelQuestionCollect(id){
				if (await cancelCollectQuestion(id)) {
					let questions:QuestionDataItem[] = this.questions
					for (let i = 0; i < questions.length; i++) {
						if (questions[i].id == id) {
							questions[i].isCollected = 0
							questions[i].collectSum = questions[i].collectSum-1
							break
						}
					}
					this.questions = questions
					this.$refs.questionActionPopup.close()
					uni.showToast({
						title: '取消成功',
						icon: 'success'
					})
				}else{
					uni.showToast({
						title: '取消失败',
						icon: 'error'
					})
				}
			},
			/**
			 * @description 删除问题
			 * @param {number} id
			 */
			onQuestionDeleteClick(id:number){
				let _this = this
				uni.showModal({
					title:'删除问题',
					content:'你确定要删除这个问题吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteQuestion(id)) {
								let questions:QuestionDataItem[] = _this.questions
								for (let i = 0; i < questions.length; i++) {
									if (questions[i].id == id) {
										questions.splice(i, 1)
										break
									}
								}
								_this.questions = questions
								_this.$refs.questionActionPopup.close()
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}else{
								uni.showToast({
									title: '删除失败',
									icon: 'error'
								})
							}
						}
					}
				})
			},
			/**
			 * @description 获取热门标签
			 */
			async getHotLabels():Promise<LabelItem[]>{
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'label/list',
						data: {
							page:1
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let labels: LabelItem[] = res.data.data.list
					return labels
				} else {
					return []
				}
			},
			/**
			 * @description 根据关键词搜索问题
			 * @param subText 搜索的关键词
			 * @param page 页码
			 */
			async searchQuestions(subText: string, page: number) {

				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'fullTextQuery',
						data: {
							page,
							subText
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});

				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageInfo = res.data.data as PageInfo<QuestionDataItem>
					let questions = pageInfo.list
					if (questions.length < 1&&pageInfo.hasNext) { //如果这一页没有问题则切换到下一页
						if (pageInfo.hasNext) {
							this.page = page + 1
							this.searchQuestions(subText, this.page)
						}
						return
					}
					if (pageInfo.hasNext) { //判断是不是最后一页
						this.haveMoreData = true
					} else {
						this.haveMoreData = false
					}
					if (page === 1) {
						this.questions = questions
						this.scrollInto = ''
					} else {
						let allQuestions = this.questions.concat(questions)
						this.questions = allQuestions
					}
					
				}
				//隐藏热门搜索
				uni.hideLoading()
				this.showHotLabels = false
				// 将搜索的内容加入到搜索历史
				if (page == 1) {
					let searchHistory: string[] = []
					let searchHistoryStorage = uni.getStorageSync(SEARCH_QUESTION_HISTORY)
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
						key: SEARCH_QUESTION_HISTORY,
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
	
	.no-question {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.no-question-text {
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
