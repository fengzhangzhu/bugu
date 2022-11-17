<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">{{labelText}}</view>
		</uni-nav-bar>
		<view class="label-info-content">
			<view class="label-info-text-content">
				<view class="label-info-tag-content">
					<view class="label-info-tag">
						<view>#</view>
					</view>
				</view>
				<view class="label-info-text">
					<text>{{labelContent}}</text>
				</view>
				<view class="join-button"
				@click="onJoinButtonClick()"
				>
					我要提问
				</view>
			</view>
			<view class="label-info-tips">
				<text class="label-info-tips-number">{{questions.length}}</text><text>条问题</text>
			</view>
		</view>
		<!-- 问题 -->
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
					<action-sheet-item v-if="editQuestionItem.isLike" 
					icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelQuestionCollect(editQuestionItem.id)"/>
					<action-sheet-item v-else icon="icon-guanzhu" title="关注问题" @click="onQuestionCollect(editQuestionItem.id)"/>
				</block>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
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
	 * labelQuestion 指定id标签下的问题
	 * @description  指定id标签下下的问题
	 * @Author: 穆兰
	 * @Date: 2022/2/20
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/20
	 */
	export default {
		data() {
			return {
				labelText:'',//标签文字
				labelId:0,//标签ID
				isLoading: true,//是否正在加载
				haveMoreData: false,//是否有更多数据
				questions: [] as QuestionDataItem[],//问题
				showBottomLoading: false,//是否处于loading状态
				page: 1,//页号
				editQuestionItem: {} as QuestionDataItem,//需要进行操作的问题
				scrollInto: '',//滑动到指定id视图的位置
				myId: -1//我的id
			}
		},
		async onLoad(params) {
			this.labelContent = params.labelContent
			this.labelId = params.labelId
			
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id
			}
			if(this.labelId){
				await this.getQuestionsBylabelId(this.labelId,this.page)
			}
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
			 * @description 点击发布问题按钮跳转到发布页
			 */
			onJoinButtonClick(){
				uni.navigateTo({
					url:`/pages/publish/ask-questions/ask-questions?labelId=${this.labelId}&labelContent=${this.labelContent}`
				})
			},
			/**
			 * @description 滑到最底部时
			 */
			onScrolltolower() {
				if (!this.haveMoreData) {
					return
				}
				
				this.page = this.page + 1
				this.getQuestionsBylabelId(this.labelId,this.page)
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
			 * @description 获取指定标签id下的问题
			 * @param label_id {number} 搜索的关键词
			 * @param page 页码
			 */
			async getQuestionsBylabelId(labelId: string, page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: 'groupByLabel',
						data: {
							labelId,
							page,
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
							this.getQuestionsBylabelId(labelId, this.page)
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
			}
		}
	}
</script>

<style lang="scss">
	.label-info-content{
		width: 94%;
		padding: 3%;
		background-color: #FFFFFF;
		.label-info-text-content{
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			
			.label-info-tag-content{
				
				.label-info-tag{
					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
					height: 35rpx;
					width: 35rpx;
					font-size: large;
					padding: 5rpx;
					background-color: #4eccb8;
					color: #FFFFFF;
					font-weight: bold;
					border-radius: 50%;
				}
			}
			
			.label-info-text{
				flex-grow: 1;
				margin-left: 20rpx;
				color: #000000;
				font-size: larger;
				font-weight: bold;
				text-align: left;
			}
			.join-button{
				font-size: small;
				padding: 10rpx 20rpx;
				background-color: #4eccb8;
				color: #FFFFFF;
				border-radius: 30rpx;
			}
		}
		.label-info-tips{
			margin-top: 10rpx;
			font-size: small;
			color: #A5A4A4;
			.label-info-tips-number{
				font-size: medium;
				color: #000;
			}
		}
	}
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
