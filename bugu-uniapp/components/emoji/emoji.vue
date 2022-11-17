<!--
 * @FileDescription: emoji选择组件
 * @Author: 穆兰
 * @Date: 2021/12/31
 * @LastEditors: 穆兰
 * @LastEditTime: 2022/1/3
 -->
<template>
	<view>

	
	<scroll-view :style="{
		 height: contentHeight + 'px'
	}" scroll-y="true" class="scroller">
			<div  class="emoji-content">
				<block v-for="(item,index) in emojiList" :key="index">
					<view class="emoji-item">
						<text @click="setEmoj(item,index)" class="emoj_box_img">{{item}}</text>
					</view>
				</block>
			</div>
	</scroll-view>
	</view>
</template>

<script lang="ts">
	import {emojiList }from "@/common/constants";
	/**
	 * emoji emoji表情组件
	 * @description emoji表情组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/14
	 * @event {Function} setEmoj 点击某个表情图标
	 * @example 调用示例 
	 */
	export default {
		props: {
			contentHeight:{
				type:Number,
				default:300
			}
		},
		data() {
			return {
				emojiList
			}
		},
		methods:{
			setEmoj(item,index){
				this.$nextTick(() =>{
					this.$emit('setEmoj',item,index)
				})
			}
		}
	}
</script>

<style scoped>
	.emoji-content{
		background-color: #ffffff;
	    display: flex;
	    flex-direction: row;
	    flex-flow: wrap;
	}
	.emoji-item{
	    width: 12vw;
	    height: 12vw;
	    display: flex;
	    text-align: center;
	    align-items: center;
	    justify-content: center;
	    font-size: 50rpx;
	}
</style>
