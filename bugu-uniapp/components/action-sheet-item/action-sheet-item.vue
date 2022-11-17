<template>
		<view @click="click"  class="article-action-conetnt">
			<view v-if="icon" class="article-action-icon">
				<view  :class="'iconfont '+icon" :style="{
					fontSize: '25px',
					color: '#c1c1c1'
				  }">
				</view>
			</view>
			<view :style="{
				textAlign:icon?'left':'center'
			}" class='article-action-text'>
				{{title}}
			</view>
		</view>

</template>
<script>
	/**
	 * actionSheetItem 自定义弹出选择层的单个选项
	 * @description 自定义弹出选择层的单个选项组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {String} [icon]    - 自定义图标来源为iconfont
	 * @property {String} [title] - 标题
	 * @event {Function} click 点击此组件
	 * @example 调用示例 
	 */
	export default {
		name:"action-sheet-item",
		props:{
			title:{
				type:String,
				required:true
			},
			icon:{
				type:String,
				required:false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			/**
			 * @description 点击事件
			 */
			click(e){
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss">
	.article-action-conetnt {
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	
	}
	
	.article-action-icon {
		display: flex;
		width: 60rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	
	.article-action-text {
		flex-grow: 1;
		text-align: left;
		color: #353535;
		font-size: '23px';
	}
</style>
