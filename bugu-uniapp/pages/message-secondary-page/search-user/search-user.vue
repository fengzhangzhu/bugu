<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">搜索用户</view>
		</uni-nav-bar>
		<!-- 搜索框 -->
		<view class="search-content">
			<uni-search-bar v-model:modelValue="searchText"  class="search-input" placeholder="搜索用户" cancelButton="none"
				@input="onSearchInput" @confirm="onSearchConfirm()"></uni-search-bar>
			<view class="search-button">
				<button style="background-color: #4eccb8;color: #fff;" @click="onSearchConfirm()"
					size="mini">搜索用户</button>
			</view>
		</view>
		<view class='labels-cotent' v-if="showSeacrhHistory">
			<!-- 搜索历史 -->
			<view v-if="searchHistory.length>0" class='search-history-content'>
				<view class='hot-labels-title'>
					<text>搜索历史</text>
				</view>
				<view class='search-history-items'>
					<view v-for="(item,index) in searchHistory" :key="item" class='history-item'
						@click="onHistoryTextClick(item)">
						{{item}}
					</view>
				</view>
			</view>
		</view>
		<!-- 搜索的用户结果 -->
		<view v-else>
			<scroll-view class='scrollview' scroll-y="true">
				<search-user-item 
				
				v-for="item in searchResult" 
				:item="item"
				:key="item.id"
				></search-user-item>
				<!-- 没有结果时 -->
				<view v-if="searchResult.length<=0" class='no-user'>
					<view class='iconfont icon-xingqiu' :style="{
					fontSize: '150px',
				  }"></view>
					<view class='no-user-text'>没有结果哦换个关键词试试~</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		SEARCH_USER_HISTORY
	} from '@/common/storageKeys';
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE
	} from "@/common/constants";
	/**
	 * searchUser 搜索用户界面-通过昵称查询用户
	 * @description 搜索用户界面-通过昵称查询用户
	 * @Author: 穆兰
	 * @Date: 2022/1/17
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 */
	export default {
		data() {
			return {
				searchText: '',
				searchHistory: [],
				searchResult: [],
				showSeacrhHistory: true
			}
		},
		async onLoad() {
			let searchHistory = await uni.getStorageSync(SEARCH_USER_HISTORY)
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
			 * @description 点击历史搜索文字
			 * @param {string} labelText 文字
			 */
			onHistoryTextClick(labelText: string) {
				this.searchText=labelText
				this.searchUsers(this.searchText)
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
				this.searchUsers(this.searchText)
			},
			/**
			 * @description 根据关键词搜索动态
			 * @param {string} username 搜索的关键词(用户名)
			 */
			async searchUsers(username: string) {
				uni.showLoading({
					title: "搜索中"
				})
				let res = await request({
					data: {
						method: 'GET',
						group: 'social',
						action: 'searchUser',
						data: {
							username: username
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				uni.hideLoading()
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let users = res.data.data
					this.searchResult = users
					this.showSeacrhHistory = false
				}
				let searchHistory = uni.getStorageSync(
					SEARCH_USER_HISTORY
				)
				if(!searchHistory){
					searchHistory = []
				}
				if (searchHistory.indexOf(username) == -1) {
					searchHistory.push(username)
					if (searchHistory.length > 10) {
						searchHistory.splice(0, 1)
					}
				} else {
					searchHistory.splice(searchHistory.indexOf(username), 1)
					searchHistory.push(username)
				}
				uni.setStorage({
					key: SEARCH_USER_HISTORY,
					data: searchHistory
				})
				
				this.searchHistory = searchHistory.reverse()
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

	.no-user {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.no-user-text {
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
