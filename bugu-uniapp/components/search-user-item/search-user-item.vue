<template>
	<view @click.stop="onContentClick" class="search-user-content">
		<view class='user-avatar'>
			<image mode='aspectFill' class='user-item-avatar' :src="item.avatar"></image>
		</view>
		<text class='user-name'>{{item.username}}</text>
		<view class='search-user-statu-button-content'
		@click.stop="onFollowButtonClick">
			<view :style="{
					backgroundColor: isFollowed?'#bbbbbb':'#75e4d2',
				}" class='search-user-statu-button'> {{buttontext}} </view>
		</view>
	</view>
</template>

<script>
	import {followUser,cancelAttention} from "@/common/requestFunctions";
	/**
	 * searchUserItem 搜索用户结果的单个项
	 * @description 搜索用户结果的单个项
	 * @Author: 穆兰
	 * @Date: 2022/1/17
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 * @property {Object} [item] - 项的数据
	 */
	export default {
		name: "search-user-item",
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		computed: {
			buttontext() {
				return this.isFollowed ? '已关注' : '关注'
			}
		},
		data() {
			return {
				isFollowed: false
			};
		},
		created(){
			if(this.item.isAttention==1){
				this.isFollowed=true
			}
		},
		methods: {
			/**
			 * @description 点击组件主体 跳转到用户主页
			 */
			onContentClick() {
				uni.navigateTo({
					url: `/pages/user-home-page/user-home-page?userId=${this.item.id}`
				})
			},
			/**
			 * @description 点击关注按钮
			 */
			async onFollowButtonClick() {
				if (this.isFollowed) {
					let _this = this
					uni.showModal({
						title: '取消关注',
						content: '你确定要取消关注这个用户吗？',
						success: async function(res) {
							if (res.confirm) {
								if (await cancelAttention(_this.item.id)) {
									_this.isFollowed=false
								}
							} else{
								console.log('用户点击取消')
							}
						}
					})
				} else {
					if (await followUser(this.item.id)) {
					this.isFollowed=true
					}
				}
			},
		}
	}
</script>

<style>
	.search-user-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		padding: 1% 2%;
		margin: 1% 0;
		background-color: #fff;
	}


	.search-user-content .user-name {

		text-align: left;
		flex-grow: 1;
		padding-left: 20rpx;
		font-size: medium;
		font-weight: lighter;
		color: #aaaaaa;

	}

	.search-user-content .search-user-statu-button-content {

		width: 20%;

	}

	.search-user-statu-button {
		padding: 5rpx 20rpx;
		width: fit-content;
		background-color: #bbbbbb;
		color: #FFF;
		border-radius: 30rpx;
		margin: 0 auto;
		text-align: center;
		font-size: smaller;
		font-weight: bold;

	}

	.user-item-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #75e4d2;
	}
</style>
