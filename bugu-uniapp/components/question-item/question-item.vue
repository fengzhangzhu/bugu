<template>
	<view @click="onQuetionItemClick" class="question-item">
		<view v-if="noAnswer" class="head">
			<view class="help-tips">
				<text>试试帮TA解答~</text>
			</view>
			<view @click.stop="moreClick" class="more">
				<view class="iconfont icon-ellipsis" :style="{
					 fontSize: '25px',
					 color: '#b4b4b4'
				}">
				</view>
			</view>
		</view>
		<view class="title">
			<text>{{questionData.title}}</text>
		</view>
		<view v-if="!noAnswer" class="answer">
			<view class="answer-info">
				<view class="answer-user">
					<view class="user-avatar-content">
						<image class="avatar-image"
						mode="aspectFill"
						:src="answerAvatar"
						>	
						</image>
					</view>
					<view class="user-username">
						<text>{{answerUsername}}</text>
					</view>
					<view class="user-tips">
						<text>{{answerTips}}</text>
					</view>
				</view>
				<view v-if="answerData.text" class="answer-text-content">
					<text>{{answerData.text}}</text>
				</view>
			</view>
			<view v-if="answerImage&&answerData.text" class="answer-image-content">
				<image class='answer-image'
				:src="answerImage"
				mode="aspectFill"
				>	
				</image>
				<view v-show="hadVideo" class="play-icon-content">
					<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="30" />
				</view>
			</view>
		</view>
		<view v-if="answerImage&&!answerData.text" class="answer-image-full-content">
			<image class="answer-image-full"
			:src="answerImage"
			mode="aspectFill"
			>	
			</image>
			<view v-show="hadVideo" class="play-icon-content">
				<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="80" />
			</view>
		</view>
		<view v-if="noAnswer">
			<view class="footer">
				<view class="approval-like-sum">
					<text>{{questionData.viewSum}} 浏览 · {{questionData.collectSum}} 关注</text>
				</view>
				<view @click.stop="onWriteAnswerClick" class="write-answer-button-content">
					 <view class="write-icon">
						 <view class="iconfont icon-yongyan"/>
					 </view>
					 <view class="write-text">
						 <text>写回答</text>
					 </view>
				</view>
			</view>
		</view>
		<view v-else class="footer">
			<view class="approval-like-sum">
				<text>{{answerAgreeSum}} 赞同 · {{answerCommentSum}} 评论</text>
			</view>
			<view @click.stop="moreClick" class="more">
				<view class="iconfont icon-ellipsis" :style="{
					 fontSize: '25px',
					 color: '#b4b4b4'
				}">
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		AnonymousAvatar,
		activity_pic_hendle,
		avatar_pic_hendle
	} from '@/common/constants';
	import {
		QuestionDataItem,
		AnswerDataItem
	}from '@/common/dataClass';
	
	interface QuestionItemProps{
		questionData:QuestionDataItem,
		answerData:AnswerDataItem
	}
	
	/**
	 * questionItem 问答的单个组件
	 * @description: 问答的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/2/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/7
	 * @param {Obeject}  questionData -问题的数据
	 * @param {Object}  answerData -回答的数据
	 * @event {Function()} click -点击主体 
	 * @event {Function()} moreClick -点击更多按钮 
	 */
	export default {
		name:"question-item",
		props:{
			questionData:{
				type:Object,
				required:true
			},
			answerData:{
				type:Object,
				required:false
			}
		},
		setup(props:QuestionItemProps){
			const {questionData,answerData} = props;
			return {
				questionData,
				answerData
			}
		},
		computed:{
			answerTips(){
				if(!this.answerData){
					return ''
				}else{
					if(this.answerData.isAnonymity==1){
						return ''
					}else{
						if(this.answerData.publisher){
							if(this.answerData.publisher.beAttentionSum>1000){
								return '超过'+this.answerData.publisher.beAttentionSum/1000+'用户关注了TA'
							}else if(this.answerData.publisher.beAttentionSum>50){
								return '超过'+this.answerData.publisher.beAttentionSum+'用户关注了TA'
							}else{
								return ''
							}
							
							
						}else{
							return ''
						}
						
					}
				}
			},
			noAnswer(){
				if(!this.answerData){
					return true
				}else{
					return false
				}
			},
			hadVideo(){
				if(!this.answerData){
					return false
				}else{
					if(this.answerData.isVideo===1){
						return true
					}else{
						return false
					}
				}
			},
			answerImage(){
				if(!this.answerData){
					return ''
				}else{

					if(this.answerData.pic.length>0){
						if(this.answerData.isVideo===1){
							return this.answerData.pic[0]+'?vframe/jpg/offset/0'
						}else{
							return this.answerData.pic[0]+activity_pic_hendle
						}
					}else{
						return ''
					}
					
				}
			},
			answerAvatar(){
				if(!this.answerData){
					return ''
				}else{
					if(this.answerData.isAnonymity==1){
						return AnonymousAvatar
					}else{
						if(this.answerData.publisher){
							return this.answerData.publisher.avatar+avatar_pic_hendle
						}else{
							return ''
						}
						
					}
				}
			},
			answerUsername(){
				if(!this.answerData){
					return ''
				}else{
					if(this.answerData.isAnonymity===1){
						return '某只小布咕'
					}else{
						if(this.answerData.publisher){
							return this.answerData.publisher.username
						}else{
							return ''
						}
						
					}
				}
			},
			answerAgreeSum(){
				if(!this.answerData){
					return 0
				}else{
					if(this.answerData.agreeSum<1000){
						return this.answerData.agreeSum
					}else{
						return this.answerData.agreeSum/1000+'K'
					}
					
				}
			},
			answerCommentSum(){
				if(!this.answerData){
					return 0
				}else{
					if(this.answerData.commentSum<1000){
						return this.answerData.commentSum
					}else{
						return this.answerData.commentSum/1000+'K'
					}
					
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			/**
			 * @description 问题主体
			 */
			onQuetionItemClick(){
				this.$emit('click')
			},
			/**
			 * @description 点击更多按钮
			 */
			moreClick(){
				this.$emit('moreClick')
			},
			/**
			 * @description 点击写回答按钮
			 */
			onWriteAnswerClick(){
				uni.navigateTo({
					url:`/pages/publish/write-answers/write-answers?questionTitle=${encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)))}&questionId=${this.questionData.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.question-item{
		background-color: #FFFFFF;
		margin-top: 10rpx;
		padding: 20rpx;
		.head{
			margin-bottom: 10rpx;
			display: flex;
			text-align: left;
			align-items: center;
			.help-tips{
				flex-grow: 1;
				font-size: small;
				color: #C2C2C2;
			}
		}
		.title{
			color:#000000;
			font-size: medium;
			font-weight: bold;
		}
		.answer{
			margin-top: 10rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			text-align: left;
			.answer-info{
				flex-grow: 1;
				.answer-user{
					
					display: flex;
					align-items: center;
					justify-content: flex-start;
					text-align: left;
					.user-avatar-content{
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.avatar-image{
						width: 40rpx;
						height: 40rpx;
						border-radius: 20rpx;
					}
					.user-username{
						margin-left: 10rpx;
						color: #444444;
						font-size: small;
						font-weight: bold;
					}
					.user-tips{
						margin-left: 10rpx;
						color: #999999;
						font-size: small;
					}
				}
				.answer-text-content{
					line-height: 1.5;
					font-weight: 600;
					color: #444444;
					font-size: 27rpx;
					overflow: hidden;
					text-overflow: ellipsis;    
					display:-webkit-box;         
					-webkit-box-orient:vertical;
					-webkit-line-clamp:3;     
				}
			}
			.answer-image-content{
				position: relative;
				margin-left: 20rpx;
				height: 120rpx;
				width: 200rpx;
				border-radius: 5rpx;
				background-color: #BBBBBB;
				// overflow: hidden;
				.answer-image{
					height: 120rpx;
					width: 200rpx;
				}
				.play-icon-content{
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translateX(-15px) translateY(-15px);
					// transform: translateY(50px);
				}
			}
			
			
		}
		.answer-image-full-content{
			position: relative;
			width: 100%;
			height: 50vw;
			margin-top: 10rpx;
			background-color: #BBBBBB;
			border-radius: 10rpx;
			overflow: hidden;
			.answer-image-full{
				width: 100%;
				height: 50vw;
			}
			.play-icon-content{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translateX(-40px) translateY(-40px);
			}
		}
		.footer{
			margin-top: 10rpx;
			display: flex;
			text-align: left;
			align-items: center;
			.approval-like-sum{
				flex-grow: 1;
				font-size: small;
				color: #C2C2C2;
			}
			.write-answer-button-content{
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
				font-size: medium;
				font-weight: 600;
				color: #FFFFFF;
				padding: 10rpx 20rpx;
				background-color: #4eccb8;
				border-radius: 40rpx;
			}
		}
	}
</style>
