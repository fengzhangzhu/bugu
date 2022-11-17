
<template>
	<view class="action-sheet">
		<uni-popup  backgroundColor="#ffffff00" safe-area ref="actionPopup" type="bottom">
			<view>
				<view v-if="needHead" class="popup-head">
					<view class="popup-head-text">{{title}}</view>
					<view class="close-icon-content">
						<uni-icons @click="close()" customPrefix="customicons" type="closeempty"
							color="#000000" size="25" />
					</view>
					
				</view>
				<view class="action-sheet-content">
					<slot name=""></slot>
					<view v-if="needCancelButton" @click="close()" class='article-action-cancel'>取消</view>
				</view>
			</view>
			
		</uni-popup>	
	</view>
</template>

<script>
	/**
	 * actionSheet 自定义弹出选择层
	 * @description 从下弹出的选择组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {String} [title] - 标题
	 * @property {Boolean} [needHead] - 是否需要标题头
	 * @example 调用示例 
	 * <action-sheet
		ref="articleActionPopup"
		:needHead="true"
		title="动态选择"
		@close="onActionSheetClose"
		></action-sheet>
	 */
	export default {
		name:"action-sheet",
		props:{
			title:{
				type:String,
				required:false
			},
			needHead:{
				type:Boolean,
				default:false
			},
			needCancelButton:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			
			/**
			 *@description 关闭悬浮层
			 */
			close(){
				this.$refs.actionPopup.close()
			},
			/**
			 *@description 打开悬浮层
			 */
			open(){
				this.$refs.actionPopup.open()
			},
		}
	}
</script>

<style lang="scss">
	.action-sheet{
		
	}
	.popup-head {
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		overflow: hidden;
		padding: 20rpx;
		display: flex;
		background-color: #FFFFFF;
		align-items: center;
	
		.popup-head-text {
			flex-grow: 1;
			text-align: center;
			margin-left: 50rpx;
		}
		.close-icon-content{
			width: 50rpx
		}
	}
	.action-sheet-content{
		background-color: #FFFFFF;
		padding-bottom: 2%;
	}
	.article-action-cancel {
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 2%;
		width: 90%;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		background-color: #ff7345;
		border-radius: 50rpx;
		color: #FFFFFF;
		font-size: 35rpx;
		font-weight: bold;
		text-align: center;
	}
</style>
