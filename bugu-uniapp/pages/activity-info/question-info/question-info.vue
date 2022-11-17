<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">问题详情</view>
		</uni-nav-bar>
		
		<!-- 回答 -->
		<scroll-view class="answer-scroll"
		:scroll-y="true"
		:style="{
			height:scollerHeight+'px'
		}"
		:refresher-enabled="true"
		:refresher-triggered="isRefresh" 
		@refresherrefresh="onAnswerIsRefresh()"
		>
			<!-- 问题容器 -->
			<view id="question-content">
				<!-- 问题骨架屏 -->
				<view v-if="questionLoading">
					<question-skeleton></question-skeleton>
				</view>
				<view v-else class="question-content">
					<!-- 问题标签 -->
					<view class="question-labels">
						
						<view v-for="(item,index) in questionData.labels" :key="'label'+item.id" 
						class="question-labels-item"
						@click="onQuestionLabelClick(item)"
						>
							<text>{{item.content}}</text>
						</view>
					</view>
					<!-- 问题标题 -->
					<view class="question-title">
						<text>{{questionData.title}}</text>
					</view>
					<!-- 问题描述 -->
					<view class="question-description">
						<view v-if="questionData.pics.length>0&&!showAllDescription" class="question-description-image-one">
							<view  class="image-item-content">
								<image class="image-item"
								:src="questionData.pics[0]"
								mode="aspectFill"
								>
								</image>
							</view>
						</view>
						<View v-if="questionData.video.length>0&&!showAllDescription" class="question-description-image-one">
							<view  class="image-item-content">
								<image class="image-item"
								:src="questionData.video[0]+'?vframe/jpg/offset/0'"
								mode="aspectFill"
								>
								</image>
								<view v-show="!playVideo" class="play-icon-content">
									<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="70" />
								</view>
							</view>
						</View>
						<view class="question-description-text">
							<text>{{questionDescription}}</text>
						</view>
						<view v-show="questionData.pics.length>0&&showAllDescription" class="question-description-image">
							<view v-for="item in questionData.pics" :key="item" class="image-item-content">
								<image class="question-image-item"
								:src="item"
								mode="widthFix"
								>
								</image>
							</view>
						</view>
						<view v-show="questionData.video.length>0&&showAllDescription" class="question-description-image">
							<view v-for="(item,index) in questionData.video" :key="item" class="image-item-content">
								<video style="width: 100%;height: 55vw;background-color: #000000;" :src="item" :id="`video_${index}`" initial-time="0"
									controls
								></video>
							</view>
						</view>
						<view v-if="showUnfoldButton" @click="onUnfoldClick()" class="unfold-content">
							<block v-if="showAllDescription">
								<view>收起 </view><view class="unfold-triangle">▲</view>
							</block>
							<block v-else>
								<view>展开 </view><view class="unfold-triangle">▼</view>
							</block>
						</view>
					</view>
					<!-- 问题底部 -->
					<view class="question-footer">
						<view class="view-sum">
							<text class="sum-number">{{questionData.answerSum}}</text>
							<text> 回答 </text>
							<text> · </text>
							<text class="sum-number">{{questionData.viewSum}}</text>
							<text> 浏览 </text>
						</view>
						<view @click="onLikeButtonClick" :class="['like-sum','is-liked-'+questionData.isLiked]">
							<view class="like-icon">
								<uni-icons type="hand-up" :color="questionData.isLiked==1?'#04543B':'#838383'" size="20" />
							</view>
							<view class="like-text">
								<text>好问题 {{questionData.likeSum}}</text>
							</view>
							
						</view>
					</view>
				</view>
			</view>
			<!-- 问题选项 -->
			<view class="operation-options-content">
				<view class="option-item">
					<button size="mini" plain open-type="share" class="share-button">
						<view class="option-icon">
							<uni-icons 
							type="personadd-filled" 
							color="#626262" size="23" />
						</view>
						<view class="option-text">
							<text>邀请回答</text>
						</view>
					</button>
				</view>
				<view class="divider-line"/>
			
				<view class="option-item"
				@click="onWriteAnswerClick()"
				>
					<view class="option-icon">
						<uni-icons
						type="compose" 
						color="#626262" size="23" />
					</view>
					<view class="option-text">
						<text>写回答</text>
					</view>
				</view>
				<view class="divider-line"/>
				<view @click="onCollectButtonClick" class="option-item">
					<view class="option-icon">
						<uni-icons
						:type="questionData.isCollected==1?'star-filled':'star'" 
						color="#626262" size="23" />
					</view>
					<view class="option-text">
						<text>{{questionData.isCollected==1?"已收藏":"收藏问题"}}</text>
					</view>
				</view>
			</view>
			<view class="answer-head">
				<view v-if="questionData.issue" class="answers-sum">
					<text>回答 {{questionData.answerSum}}</text>
				</view>
			</view>
			<view class="answers-content">
				<view :key="item.id" v-for="item in answers">
					<answer-item
					:answerData="item"
					@click="onAnswerClick(item)"
					@moreClick="onAnswerMoreClick(item)"
					></answer-item>
				</view>
			</view>
		</scroll-view>
		
		<!-- 回答操作弹出层 -->
		<action-sheet ref="answerActionPopup" :needHead="true" title="回答选择" :needCancelButton="true">
			<block v-if="editAnswerItem.id">
				<block v-if="editAnswerItem.publisher&&editAnswerItem.publisher.id == myId">
					<action-sheet-item icon="icon-delete" title="删除" @click="onAnswerDeleteClick(editAnswerItem.id)"/>
				</block>
				<block v-else>
					<action-sheet-item @click="onAnswerReportClick(editAnswerItem.id)" icon="icon-alert" title="举报" />
				</block>
			</block>
		</action-sheet>
	</view>
	
</template>

<script lang="ts">
	import {
		likeQuestion,
		cancelLikeQuestion,
		collectQuestion,
		cancelCollectQuestion,
	} from "@/services/questionServices";
	import {
		deleteAnswer
	} from "@/services/answerServices";
	import {
		request
	} from '@/utils/request';
	import {
		reportObjectType,
		REQUEST_SUCCEEDED_CODE
	} from '@/common/constants';
	import {
		QuestionDataItem,
		UserInfo,
		PageInfo,
		AnswerDataItem
	} from '@/common/dataClass';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	/**
	 * questionInfo  问题详情
	 * @description  问题详情
	 * @Author: 穆兰
	 * @Date: 2021/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/20
	 */
	export default {
		data() {
			return{
				questionData:{} as QuestionDataItem,//问题信息
				answers:[] as AnswerDataItem[],//回答
				editAnswerItem:{} as AnswerDataItem,//需要进行操作的回答
				havaMoreData:true,
				bottomLoading:false,
				showAllDescription:false,//展开所有详细描述
				questionLoading:true,//是否正在加载
				contentHeight:0,
				navHeight:0,
				page:1,
				myId:-1,
				myUserInfo:{},
				isRefresh:false
			}
			
		},
		
		computed:{
			questionDescription(){
				if(!this.questionData.id){
					return ''
				}
				let text = this.questionData.text
				if(this.showAllDescription){
					return text
				}else{
					let realMaxLength=58
					let maxLength = 58
					
					//一个换成换算成20个字符串，最后只能有35个字符位，多了就要收起
					let line_breaks = 0
					let transformTextLength =0
					let textMatch = text.match(/\n/ig)
					if (textMatch) {
						line_breaks = textMatch.length
					}
					if (line_breaks <= 0) {
						transformTextLength = text.length
					} else {
						transformTextLength = text.length + line_breaks * 19
						if (transformTextLength > maxLength) {
							let times = 1
							let first_break = text.indexOf('\n')
							let temp_break = first_break //临时长度 将一个换行换成20长度
							let real_break = first_break //真实长度，一个换行为一个长度
							let temp_text = text
							while (temp_break < maxLength) {
								temp_text = text.slice(real_break + 1)
								if (temp_text.indexOf('\n') == -1) {
									break
								}
								temp_break = temp_break + 20 + temp_text.indexOf('\n')
								real_break = real_break + 1 + temp_text.indexOf('\n')
								times = times + 1
							}
							realMaxLength = real_break
						}
					}
					let showAll = transformTextLength <= realMaxLength //换算后的文字长度小于100则转换成真实长度
					if(showAll){
						return this.questionData.text
					}else{
						return this.questionData.text.slice(0, realMaxLength) + '...'
					}
				}
			},
			// 是否显示展开按钮
			showUnfoldButton(){
				if(!this.questionData.id){
					return false
				}else{
					if(this.questionData.pics||this.questionData.video){
						return true
					}
					let text = this.questionData.text
					let maxLength = 40
					//一个换成换算成20个字符串，最后只能有35个字符位，多了就要收起
					let transformTextLength =0
					let line_breaks = 0
					let textMatch = text.match(/\n/ig)
					if (textMatch) {
						line_breaks = textMatch.length
					}
					if (line_breaks <= 0) {
						transformTextLength = text.length
					} else {
						transformTextLength = text.length + line_breaks * 19
					}
					if(transformTextLength<maxLength){
						return false
					}else{
						return true
					}
				}
			},
			scollerHeight(){
				return this.contentHeight - this.navHeight
			}
		},
		onReady() {
			let _this=this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					_this.contentHeight=res.windowHeight
				}
			})
					
			let titleH=uni.createSelectorQuery().select("#question-content"); //想要获取高度的元素名（class/id）
			titleH.boundingClientRect(data=>{
				_this.navHeight = data.top
				  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			}).exec()
		},
		async onLoad(params){
			this.questionId = params.questionId
			this.getQuetionsInfo(this.questionId)
			this.getAnswers(this.questionId,1)
			let userInfo = await getMyUserInfo() as UserInfo
			if (userInfo) {
				this.myId = userInfo.id
				this.myUserInfo = userInfo
			}
		},
		//#ifdef MP-WEIXIN
		/**
		 * @description 分享
		 */
		onShareAppMessage() {
			let imageUrl =''
			if(this.questionData.video){
				imageUrl=this.questionData.video[0]+'?vframe/jpg/offset/0'
			}else if(this.questionData.issue.imgs){
				imageUrl=this.questionData.pics[0]
			}
			let username = this.myUserInfo.username.length>7?this.myUserInfo.username.slice(0,7):this.myUserInfo.username
			
		    return {
		      title:`${username}邀请您回答问题“${this.questionData.title}”` ,
		      path: `/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl
		    };
		},
		onShareTimeline() {
			let imageUrl =''
			if(this.questionData.video){
				imageUrl=this.questionData.video[0]+'?vframe/jpg/offset/0'
			}else if(this.questionData.pics){
				imageUrl=this.questionData.pics[0]
			}
			let username = this.myUserInfo.username.length>7?this.myUserInfo.username.slice(0,7):this.myUserInfo.username
			
			return {
			  title:`${username}邀请您回答问题“${this.questionData.title}”` ,
			  path: `/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
			  imageUrl
			};
		},
		//#endif
		methods:{
			/**
			 * @description 点击返回按钮 
			 */
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 点击问题的标签
			 * @params item 单个问题
			 */
			onQuestionLabelClick(item){
				uni.navigateTo({
					url:`/pages/label-activity/label-question/label-question?labelId=${item.id}&labelContent=${item.content}`
				})
			},
			/**
			 * @description 点击展开/收起按钮 
			 */
			onUnfoldClick(){
				this.showAllDescription = !this.showAllDescription
			},
			/**
			 * @description 点击写回答时 
			 */
			onWriteAnswerClick(){
				let questionTitle=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)))
				uni.navigateTo({
					url:`/pages/publish/write-answers/write-answers?questionTitle=${questionTitle}&questionId=${this.questionData.id}`
				})
			},
			
			/**
			 * @description 点击点赞按钮 
			 */
			async onLikeButtonClick(){
				if(this.questionData.isLiked===0){
					this.questionData.isLiked=1
					this.questionData.likeSum = this.questionData.likeSum+1
					if (await likeQuestion(this.questionData.id)) {
						uni.showToast({
							title: '点赞成功',
							icon: 'success'
						})
					}else{
						this.questionData.isLiked=0
						this.questionData.likeSum = this.questionData.likeSum-1
						uni.showToast({
							title: '点赞失败',
							icon: 'error'
						})
					}
				}else if(this.questionData.isLiked===1){
					this.questionData.isLiked=0
					this.questionData.likeSum = this.questionData.likeSum-1
					if (await cancelLikeQuestion(this.questionData.id)) {
						uni.showToast({
							title: '取消成功',
							icon: 'success'
						})
					}else{
						this.questionData.isLiked=1
						this.questionData.likeSum = this.questionData.likeSum+1
						
						uni.showToast({
							title: '取消失败',
							icon: 'error'
						})
					}
				}
			},
			/**
			 * @description 点击收藏按钮 
			 */
			async onCollectButtonClick(){
				if(this.questionData.isCollected===0){
					this.questionData.isCollected=1
					this.questionData.collectSum = this.questionData.collectSum+1
					if (await collectQuestion(this.questionData.id)) {
						uni.showToast({
							title: '收藏成功',
							icon: 'success'
						})
					}else{
						this.questionData.isCollected=0
						this.questionData.collectSum = this.questionData.collectSum-1
						uni.showToast({
							title: '关注失败',
							icon: 'error'
						})
					}
				}else if(this.questionData.isCollected==1){
					this.questionData.isCollected=0
					this.questionData.collectSum = this.questionData.collectSum-1
					if (await cancelCollectQuestion(this.questionData.id)) {
						uni.showToast({
							title: '取消成功',
							icon: 'success'
						})
					}else{
						this.questionData.isCollected=1
						this.questionData.collectSum = this.questionData.collectSum+1
						
						uni.showToast({
							title: '取消失败',
							icon: 'error'
						})
					}
				}
			},
			/**
			 * 下拉刷新时
			 */
			async onAnswerIsRefresh(){
				this.isRefresh = true
				this.page = 1
				await this.getAnswers(this.questionData.id,this.page)
				setTimeout(()=>{
					this.isRefresh = false
				},700)
			},
			/**
			 * @description 点击某个回答
			 * @param {AnswerDataItem} item  
			 */
			onAnswerClick(item: AnswerDataItem){
				let questionTitle=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)))
				let questionId=this.questionData.id
				uni.navigateTo({
					url:`/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.id}`
				})
			},
			/**
			 * @description 点击某个回答的更多按钮
			 * @param {AnswerDataItem} item  
			 */
			onAnswerMoreClick(item){
				this.editAnswerItem = item
				this.$refs.answerActionPopup.open()
			},
			/**
			 * @description 点击举报回答
			 * @param {number} id 回答的id 
			 */
			onAnswerReportClick(id){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${id}&objectType=${reportObjectType.answer}&modular=question`
				})
				this.$refs.answerActionPopup.close()
			},
			/**
			 * @description 点击删除回答
			 * @param {number} id 回答的id 
			 */
			onAnswerDeleteClick(id){
				
				let _this = this
				uni.showModal({
					title:'删除回答',
					content:'你确定要删除这个回答吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteAnswer(id)) {
								let answers = _this.answers
								for (let i = 0; i < answers.length; i++) {
									if (answers[i].id == id) {
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
			 * @description 获取问题的详情
			 * @param {Object} question_id 问题的id
			 */
			async getQuetionsInfo(question_id){
				let res = await request({
					data: {
						method: 'GET',
						group: 'question',
						action: `${question_id}/detail`,
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
				
						},
					}
				});
				if(res.data.code===REQUEST_SUCCEEDED_CODE){
					this.questionData = res.data.data
					this.questionLoading = false
				}
			},
			/**
			 * @description 获取问题的回答
			 * @param {number} issue_id
			 * @param {number} page
			 */
			async getAnswers(questionId,page){
				let res = await request({
					data: {
						method: 'GET',
						group: 'answer',
						action: 'all',
						data: {
							questionId,
							page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
				
						},
					}
				});
				if(res.data.code===REQUEST_SUCCEEDED_CODE){
					let pageInfo = res.data.data as PageInfo<AnswerDataItem>
					let answers = pageInfo.list
					this.haveMoreData = pageInfo.hasNext
					if (page === 1) {
						this.answers = answers
						this.scrollInto = ''
					} else {
						let allanswers = this.answers.concat(answers)
						this.answers = allanswers
					}
				}
			}
		},
		
	}
</script>

<style lang="scss">
	.question-content{
		background-color: #FFFFFF;
		width: 94%;
		padding: 5% 3%;
		.question-labels{
			display: flex;
			align-items: center;
			text-align: left;
			justify-content: flex-start;
			.question-labels-item{
				margin-right: 10rpx;
				padding: 10rpx 20rpx;
				background-color: #F6F6F6;
				border-radius: 10rpx;
				color: #999999;
				font-size: 28rpx;
			}
		}
		.question-title{
			margin-top: 20rpx;
			font-size: larger;
			color: #000000;
			font-weight: bold;
		}
		.question-description{
			font-weight: 600;
			letter-spacing: 3rpx;
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #6f6f6f;
			position: relative;
			.question-description-image-one{
				.image-item-content{
					width: 100%;
					height: 40vw;
					position: relative;
					.play-icon-content{
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translateX(-35px) translateY(-35px);
						// transform: translateY(50px);
					}
					.image-item{
						width: 100%;
						height: 40vw;
						border-radius: 10rxp;
						background-color: #C7C7C7;
					}
				}
				
			}
			.question-description-image{
				.image-item-content{
					width: 100%;
					
				}
				.question-image-item{
					margin-top: 5rpx;
					width: 100%;
					border-radius: 10rxp;
					background-color: #C7C7C7;
				}
			}
			.unfold-content{
				width: 100%;
				text-align: right;
				margin-top: 5rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				z-index: 100;
				.unfold-triangle{
					text-indent: 10rpx;
					font-size: 15rpx;
				}
			}
		}
		.question-footer{
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #838383;
			.view-sum{
				flex-grow: 1;
				text-align: left;
				font-size: 22rpx;
				.sum-number{
					font-size: 24rpx;
					color: #000000;
					font-weight: bold;
				}
			}
			.like-sum{
				padding: 5rpx 10rpx;
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
				
				border-radius: 20rpx;
				font-size: 20rpx;
			}
			.is-liked-0{
				background-color: #F6F6F6;
			}
			.is-liked-1{
				background-color: #C6F4E7;
				color: #04543B;
			}
		}
	}
	.operation-options-content{
		background-color: #FFFFFF;
		border-top: solid 1rpx #F1F1F1;
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		height: 120rpx;
		.divider-line{
			width: 1rpx;
			height: 100%;
			background-color: #F1F1F1;
		}
		.option-item{
			padding: 20rpx;
			flex-grow: 1;
			width: 30%;
			color: #626262;
			font-size: 27rpx;
			font-weight: bold;
		}
		.share-button{
			background-color: #FFFFFF;
			border: none !important;
			padding: 0px !important;
			border-radius: 0;
			line-height: normal !important;
		}
	}
	.answer-scroll{
		margin-top: 20rpx;
		width: 100%;
		.answer-head{
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			text-align: left;
			justify-content: left;
			padding:0 3%;
			.answers-sum{
				color: #565656;
				font-size: 27rpx;
				font-weight: bold;
				padding:20rpx 0rpx;
			}
		}
	}
</style>
