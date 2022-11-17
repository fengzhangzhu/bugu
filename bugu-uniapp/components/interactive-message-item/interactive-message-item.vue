<template>
	<view>
		<view class='interactive-content' @click="onClick">
			<view class='interactive-avatar' @click.stop="onAvatarClick">
				<image mode='aspectFill' class='avatar' :src="avatar" />
			</view>
			<view class='interactive-info'>
				<view class='interactive-info-upper'>
					<view class='interactive-name'>
						<text> {{username}}</text>
						<view class='interactive-type'>
							<view v-if="interactiveData.type==='LIKE'" 
							class='iconfont icon-heart-fill' 
							:style="{
								fontSize: '23px',
								color: '#83dbcd'}"/> 
							<text v-else>{{title}} </text>
							</view>
							<text >了你的{{action}}</text>
						</view>
						<view class='interactive-time'>
							<text class='interactive-text'>
								{{createTime}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script lang="ts">
	import {
		avatar_pic_hendle,
		InteractiveType,
		InteractiveGroup
	} from "@/common/constants";
	import {
		GettimeifferenceOfNow
	} from "@/utils/dateUtils";
	import {
		InteractiveMessageData
	} from "@/utils/messageUtils/model";
	import {onMounted,reactive } from 'vue'
	interface Props{
		interactiveData:InteractiveMessageData
	}
	/**
	 * interactiveMessageItem 互动消息列表的单个组件
	 * @description 互动消息列表的单个组件
	 * @Author: 穆兰
	 * @Date: 2022/1/13
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/2/20
	 * @property {InteractiveMessageData} [interactiveData] - 组件的数据
	 * @property {String} messageType - 消息的类型 ACTIVITY 动态 QUESTION 问答
	 * @event {Function} onClick - 点击消息主体
	 */
	const ACTIVITY = 'ACTIVITY'
	const QUESTION = 'QUESTION'
	export default {
		name: "interactive-message-item",
		props: {
			interactiveData:{
				type: Object,
				required: true,
			},
		},
		// setup(props:Props){
		// 	const {interactiveData} = props
		// 	onMounted(()=>{
		// 		console.log("onMounted",interactiveData)
		// 	})
		// 	return {
		// 		interactiveData
		// 	}
		// },
		computed: {
			createTime() {
				return GettimeifferenceOfNow(this.interactiveData.createTime).DistanceNow
			},
			username() {
					return this.interactiveData.username.length < 7 ?
							this.interactiveData.username : this.interactiveData.username.slice(0, 7) + '...'
				
			},
			avatar() {
					return this.interactiveData.avatar+avatar_pic_hendle
			},
			title() {
				let type = this.interactiveData.type
				let title = ''
				if (type === InteractiveType.COMMENT) {
					title = '评论'
				} else if (type === InteractiveType.LIKE) {
					title = '喜欢'
				} else if (type === InteractiveType.ATTENTION) {
					title = '关注'
				} else if (type === InteractiveType.PUBLISH) {
					title = '发布'
				}else if (type === InteractiveType.ANSWER) {
					title = '回答'
				}else if(type ===InteractiveType.AGREE){
					title = '赞同'
				}
				return title
			},
			action(){
				let group = this.interactiveData.group
				
				let title = ''
				if (group === InteractiveGroup.ACTIVITY) {
					title = '动态'
				}else if (group === InteractiveGroup.QUESTION) {
					title = '问题'
				}else if (group === InteractiveGroup.ANSWER) {
					title = '回答'
				}
				return title
			}
		},
		data() {
			return {
			};
		},
		mounted() {
			console.log(this.interactiveData)
		},
		methods: {
			/**
			 * @description 点击头像时
			 */
			onAvatarClick() {
				uni.navigateTo({
					url: `/pages/user-home-page/user-home-page?userId=${this.interactiveData.userId}`
				})
			},
			/**
			 * @description 点击主体
			 */
			onClick() {
				this.$emit('onClick')
			},
		}
	}
</script>

<style lang="scss">
	.interactive-content {
		display: flex;
		width: 98%;
		flex-direction: row;
		margin-top: 1%;
		padding: 1%;
		background-color: #fff;
		justify-content: center;
		align-items: center;
	}

	.interactive-avatar {
		position: relative;
		width: fit-content;
		height: fit-content;
		padding: 5rpx;
		border-radius: 50%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;

	}

	.interactive-info {
		flex-grow: 1;
		display: flex;
		text-align: left;
		flex-direction: column;
		align-items: center;
		margin-left: 20rpx;

	}

	.interactive-info-upper {
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: row;

		.interactive-name {
			display: flex;
			text-align: center;
			align-items: center;
			justify-items: center;
			font-size: 35rpx;
			color: #000000;
			flex-grow: 1;
			font-size: smaller;
			font-weight: lighter;

		}

		.interactive-type {
			margin: 0 20rpx;
		}

		.interactive-time {
			display: flex;
			text-align: center;
			align-items: center;
			justify-items: center;
			font-size: small;
			color: #9c9c9c;
			margin: 0 10rpx;
		}

		.interactive-more {
			text-align: center;
			margin: 0 10rpx;
		}

	}
</style>
