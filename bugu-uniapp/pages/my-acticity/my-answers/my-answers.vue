<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我的回答</view>
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
					v-for="(item,index) in answers"
					:key="'question'+item.questionId"
					:questionData="item.question"
					:answerData="item"
					@click="onQuestionItemClick(item.questionId)"
					@moreClick="onQuestionItemMoreClick(item)"
				></question-item>
				<!-- 没有结果时 -->
				<view v-if="answers.length<=0" class='no-question'>
					<view class='iconfont icon-xingqiu' :style="{
						fontSize: '150px',
					  }"></view>
					<view class='no-question-text'>你还没有回答任何问题哦~</view>
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
		<!-- 回答操作弹出层 -->
		<action-sheet ref="answerActionPopup" :needHead="true" title="回答选择" :needCancelButton="true">
			<block v-if="editAnswerItem.id">
				<action-sheet-item icon="icon-delete" title="删除" @click="onAnswerDeleteClick(editAnswerItem)"/>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		deleteAnswer,
	} from '@/services/answerServices';
	import {
		SEARCH_QUESTION_HISTORY
	} from '@/common/storageKeys';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	import {
		MyAnswerDataItem,
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
	 * myAnswer 我的回答
	 * @description  我的回答
	 * @Author: 穆兰
	 * @Date: 2022/2/15
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/15
	 */
	export default {
		data() {
			return {
				isLoading:true,
				haveMoreData: false,//是否有更多数据
				answers: [] as MyAnswerDataItem[],//我回答的问题
				showBottomLoading: false,//是否处于loading状态
				page: 1,//页号
				editAnswerItem: {} as MyAnswerDataItem,//需要进行操作的问题
				scrollInto: '',//滑动到指定id视图的位置
				myUserInfo:{},
				myId: -1//我的id
			}
		},
		async onLoad() {
			
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id;
				this.myUserInfo = userInfo;
			}
			await this.getMyAnswer(this.page)
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
				this.getMyAnswer( this.page)
				
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
				this.editAnswerItem=item
				this.$refs.answerActionPopup.open()
			},
			/**
			 * @description 删除回答
			 * @param {QuestionDataItem} item
			 */
			onAnswerDeleteClick(item){
				let _this = this
				uni.showModal({
					title:'删除回答',
					content:'你确定要删除这个回答吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteAnswer(item.id)) {
								let answers = _this.answers
								for (let i = 0; i < answers.length; i++) {
									if (answers[i].id == item.id) {
										answers.splice(i, 1)
										break
									}
								}
								_this.answers = answers
								_this.$refs.answerActionPopup.close()
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
			 * @description 根据关键词搜索问题
			 * @param subText 搜索的关键词
			 * @param page 页码
			 */
			async getMyAnswer(page: number) {

				let res = await request({
					data: {
						method: 'GET',
						group: 'answer',
						action: 'my/publish',
						data: {
							page,
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});

				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageInfo = res.data.data as PageInfo<MyAnswerDataItem>
					let answers = pageInfo.list
					if (answers.length < 1&&pageInfo.hasNext) { //如果这一页没有问题则切换到下一页
						if (page < pageInfo.totalPages) {
							this.page = page + 1
							this.getMyAnswer(this.page)
						}
					}
					this.haveMoreData = pageInfo.hasNext
					if (page === 1) {
						this.answers = answers
						this.scrollInto = ''
					} else {
						let allanswers = this.answers.concat(answers)
						this.answers = allanswers
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
