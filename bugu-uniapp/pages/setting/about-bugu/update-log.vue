<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick">
			<view class="bar-title">更新日志</view>
		</uni-nav-bar>
		<view class="passage">
			<uni-card v-for="(item,index) in updateLogs" :key='item.version'  :title="'v '+item.version+' 更新日志'">
				<view class="content">
					<view v-for="(logText,logIndex) in item.logTexts" :key="logIndex">
						{{logIndex+1}}.{{logText}}
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import {updateLogs} from "@/common/constants"
	/**
	 * updateLog 更新日志
	 * @description 更新日志
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/9
	 */
	export default {
		data() {
			return {
				updateLogs
			}
		},
		onLoad(){
		},
		methods: {
			/**
			 *@description 点击返回按钮 
			 */
			onNarLeftClick(){
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.passage {
		font-size: 30rpx;
		padding: 5rpx;

		.content {
			text-align: left;
			color: #606266;
		}


	}

</style>
