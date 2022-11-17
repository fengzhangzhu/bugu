<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">{{title}}</view>
		</uni-nav-bar>
		<view v-if="interactiveMessageList.data.length>0" class='messages-clear-all'>
			<view class='number-of-messages'>{{interactiveMessageList.data.length}}条</view>
			<view class='clear-all-button' @click="onDeleteAllInteractiveMessageClick">清除全部</view>
		</view>
		<view v-if="interactiveMessageList.data.length>0" class="interactive-list-content">
			<interactive-message-item
			v-for="(item,index) in interactiveMessageList.data"
			:key="item.createTime"
			:interactiveData="item"
			@onClick="onInteractiveMessageItemClick(item)"
			>
			</interactive-message-item>
		</view>
		<view v-else class='no-message'>
			<view class='iconfont icon-message' :style="{fontSize: '300rpx'}" />
			<view class='no-message-text'>暂时没有互动消息</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import {getInteractiveMessageList,interactiveMessageALLRead,
			deleteAllInteractiveMessage,
			likeGroup,
			commentGroup
	} from "@/utils/messageUtils/storage";
	import {changeUnreadMessageSum} from "@/utils/tabBarBadgeUtils";
	import {
		InteractiveType,
		InteractiveGroup
	} from "@/common/constants";
	import {
		InteractiveMessageData,
	} from "@/utils/messageUtils/model";
	export default {
		data() {
			return {
				type:InteractiveType.LIKE,
				userInfo:{},
				interactiveMessageList:{unreadSum:0,data:[] as InteractiveMessageData[]},
			}
		},
		async onLoad(params){
			this.type = params.type
			this.userInfo = await getMyUserInfo()
			if(this.userInfo.id){
				
				let interactiveMessageList = await getInteractiveMessageList(this.userInfo.id,this.type)
				this.interactiveMessageList=interactiveMessageList
				changeUnreadMessageSum(-interactiveMessageList.unreadSum)
				interactiveMessageALLRead(this.userInfo.id,this.type)
			}
		},
		computed:{
			title(){
				if(likeGroup.indexOf(this.type)>-1){
					return "我收到的喜欢和赞同"
				}else if(commentGroup.indexOf(this.type)>-1){
					return "我收到的回答和评论"
				}
			}
		},
		methods: {
			onNarLeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 点击某个互动消息时
			 * @param {Object} item
			 */
			onInteractiveMessageItemClick(item:InteractiveMessageData){
				
				if (item.type == InteractiveType.ATTENTION) {
				  uni.navigateTo({ url: `/pages/user-home-page/user-home-page?userId=${item.userId}` })
							
				}else if(item.group===InteractiveGroup.ACTIVITY){
					uni.navigateTo({
						url: `/pages/activity-info/activity-info?activityId=${item.contentId}`
					})
				}else if (item.group===InteractiveGroup.QUESTION) {
					uni.navigateTo({
						url: `/pages/activity-info/question-info/question-info?questionId=${item.contentId}`
					})
				} else if(item.group===InteractiveGroup.ANSWER){
					uni.navigateTo({
						url: `/pages/activity-info/answer-info/answer-info?answerId=${item.contentId}`
					})
				} 
			},
			onDeleteAllInteractiveMessageClick(){
				let _this = this
				uni.showModal({
					title:"清除全部",
					content:"你确定要清除所有消息吗？",
					success:function (res){
						if(res.confirm){
							deleteAllInteractiveMessage(_this.userInfo.id,_this.type)
							_this.interactiveMessageList={unreadSum:0,data:[]}
							uni.showToast({
								title:"清除成功"
							})
						}
						
					}
					
				})
				
			}
		}
	}
</script>

<style lang="scss">
.no-message{
		width: 100%;
		height: 100vh;
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
</style>
