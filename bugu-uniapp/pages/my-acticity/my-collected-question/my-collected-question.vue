<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我关注的问题</view>
		</uni-nav-bar>
		<view v-if="isLoading">
			<question-item-skeleton
			:key="'skeleton'+index"
			:needLabel="false"
			v-for="(item,index) in [...new Array(5)]"
			></question-item-skeleton>
		</view>
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
					<view class='no-question-text'>你还没有关注任何问题哦~</view>
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
					icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelQuestionCellect(editQuestionItem.id)"/>
					<action-sheet-item v-else icon="icon-guanzhu" title="关注问题" @click="onQuestionCollect(editQuestionItem.id)"/>
				</block>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		deleteQuestion,
		collectQuestion,
		cancelCollectQuestion
	} from '@/services/questionServices';
	import {
		SEARCH_QUESTION_HISTORY
	} from '@/common/storageKeys';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	import {
		QuestionDataItem,
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
	 * myLiekdQuestion 我关注的问题
	 * @description  我关注的问题
	 * @Author: 穆兰
	 * @Date: 2022/2/11
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/11
	 */
	export default {
		data() {
			return {
				isLoading:true,
				haveMoreData: false,//是否有更多数据
				questions: [] as QuestionDataItem[],//问题
				showBottomLoading: false,//是否处于loading状态
				page: 1,//页号
				editQuestionItem: {} as QuestionDataItem,//需要进行操作的问题
				scrollInto: '',//滑动到指定id视图的位置
				myId: -1//我的id
			}
		},
		async onLoad() {
			
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id
			}
			await this.getMyCollectedQuestions(this.page)
			this.isLoading = false
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
			 * @description 滑到最底部时
			 */
			onScrolltolower() {
				if (!this.haveMoreData) {
					return
				}
				this.page = this.page + 1
				this.getMyCollectedQuestions( this.page)
				
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
								let questions = _this.questions
								for (let i = 0; i < questions.length; i++) {
									if (questions[i].issue.id == id) {
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
			 * @description 举报问题
			 * @param {number} id 问题的id
			 */
			onQuestionReportClick(id){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${id}&objectType=${reportObjectType.question}&modular=question`
				})
				this.$refs.questionActionPopup.close()
			},
			/**
			 * @description 关注问题
			 * @param {number} id 问题的id
			 */
			async onQuestionCollect(id){
				if (await collectQuestion(id)) {
					let questions = this.questions
					for (let i = 0; i < questions.length; i++) {
						if (questions[i].issue.id == id) {
							questions[i].isLike = 1
							questions[i].issue.likeSum = questions[i].issue.likeSum+1
							break
						}
					}
					this.questions = questions
					this.$refs.questionActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}else{
					uni.showToast({
						title: '关注失败',
						icon: 'error'
					})
				}
			},
			/**
			 * @description 取消关注问题
			 * @param {number} id 问题的id
			 */
			async onCancelQuestionCellect(id){
				if (await cancelCollectQuestion(id)) {
					let questions = this.questions
					for (let i = 0; i < questions.length; i++) {
						if (questions[i].issue.id == id) {
							questions[i].isLike = 0
							questions[i].issue.likeSum = questions[i].issue.likeSum-1
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
			 * @description 获取我关注的问题
			 * @param page 页码
			 */
			async getMyCollectedQuestions(page: number) {

				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'my/collected',
						data: {
							page
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
							this.page = page + 1
							this.getMyCollectedQuestions(this.page)
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
				uni.hideLoading()
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

</style>
