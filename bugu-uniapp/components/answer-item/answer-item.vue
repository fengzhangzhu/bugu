<template>
	<view @click="onAnserItemClick()" class="answer-item">
		<!-- 答主 -->
		<view class="answer-user">
			<!-- 头像 -->
			<view class="answer-user-avatar">
				<image 
				class="answer-user-avatar-image"
				mode="aspectFill"
				:src="answerAvatar"
				/>
			</view>
			<!-- 用户名 -->
			<view class="answer-user-username">
				<text>{{answerUsername}}</text>
			</view>
			<!-- 用户徽标 -->
			<view class="answer-user-badges-content">
				
			</view>
		</view>
		<!-- 回答内容体 -->
		<view class="answer-content">
			<!-- 图片/视频 -->
			<view v-if="answerImage" class="answer-image-content">
				<image mode="aspectFill"
				class="answer-image"
				:src="answerImage"
				></image>
				<view v-show="hadVideo" class="play-icon-content">
					<uni-icons customPrefix="customicons" type="videocam-filled" color="#c5c5c5dc" size="80" />
				</view>
			</view>
			<!-- 文字 -->
			<view  class="answer-content-text">
				<text>{{answerData.text}}</text>
			</view>
		</view>
		<!-- 底部 -->
		<view class="answer-footer">
			<view class="answer-footer-text">
				<text>{{answerAgreeSum}} 赞同 · {{answerCommentSum}} 评论 · {{publishTime}}</text>
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
	import textFilter from '@/utils/textFilter';
	import {
		GettimeifferenceOfNow
	} from "@/utils/dateUtils";
	import {
		AnonymousAvatar,
		avatar_pic_hendle
	} from '@/common/constants';
	import {
		AnswerDataItem
	} from '@/common/dataClass';
	
	interface AnswerItemProps{
		answerData:AnswerDataItem
		click: ()=>void
		moreClick:() => void
	}
	/**
	 * answerItem 答案的单个组件
	 * @description: 答案的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/2/8
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/7/21
	 * @param {Object} 回答数据  
	 * @event {Function()} click 点击回答
	 * @event {Function()} moreClick 点击回答的更多按钮  
	 */
	export default {
		name:"answer-item",
		props:{
			answerData:{
				type:Object,
				required:true
			}
		},
		setup(props:AnswerItemProps){
			const {answerData,click,moreClick} = props
			return{
				answerData,
				click,
				moreClick
			}
		},
		emits:['click','moreClick'],
		computed:{
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
					if(this.answerData.isAnonymity==1){
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
			// 是否含有视频，若含有视频则头图显示视频
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
							return this.answerData.pic[0]
						}
					}else{
						return ''
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
			},
			publishTime(){
				if(!this.answerData){
					return ''
				}else{
					
					return GettimeifferenceOfNow(this.answerData.publishTime).DistanceNow
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			/**
			 * @description 点击回答主体
			 */
			onAnserItemClick(){
				this.$emit('click')
			},
			/**
			 * @description 点击更多按钮
			 */
			moreClick(){
				this.$emit('moreClick')
			}
		}
	}
</script>

<style lang="scss">
	.answer-item{
		 background-color: #FFFFFF;
		 width: 94%;
		 padding: 3%;
		 margin-bottom: 10rpx;
		 .answer-user{
			 display: flex;
			 align-items: center;
			 justify-content: flex-start;
			 text-align: left;
			 .answer-user-avatar{
				 display: flex;
				 align-items: center;
				 justify-content: center;
				 .answer-user-avatar-image{
					width: 60rpx;
					height: 60rpx;
					border-radius: 30rpx; 
				 }
			 }
			 .answer-user-username{
			 	margin-left: 15rpx;
			 	color: #838383;
			 	font-size: small;
			 }
		 }
		 .answer-content{
			 .answer-image-content{
				 position: relative;
				 width: 100%;
				 height: 50vw;
				 .answer-image{
					 background-color: #EDEDED;
					 margin-top: 15rpx;
					 width: 100%;
					 height: 50vw;
					 border-radius: 10rpx;
				 }
				 .play-icon-content{
				 	position: absolute;
				 	top: 50%;
				 	left: 50%;
				 	transform: translateX(-40px) translateY(-30px);
				 	
				 }
			 }
			 
			 .answer-content-text{
				 letter-spacing: 3rpx;
				 margin-top: 20rpx;
				 font-size: 28rpx;
				 color: #454545;
				 overflow: hidden;            
				 text-overflow: ellipsis;    
				 display:-webkit-box;         
				 -webkit-box-orient:vertical;
				 -webkit-line-clamp:3;       
			 }
		 }
		 .answer-footer{
			 margin-top: 15rpx;
			 color: #A5A5A5;
			 font-size: 26rpx;
			 display: flex;
			 text-align: left;
			 align-items: center;
			 .answer-footer-text{
				 flex-grow: 1;
			 }
		 }
	}
</style>
