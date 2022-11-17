<template>
	<view :class="['tab','tab-scrollY-'+scrollY]">
		<scroll-view :class="['tab-bar','tab-bar-flex-'+flex,'tab-bar-borde-bottom'+borderBottom]" scroll-x="true" :scroll-into-view="scrollId" scroll-with-animation>
			<view v-for="(item,index) in tabList" class="tab-bar-item"
			 :class="{'active':tabIndex===index}"
			 :id="`tab_${index}`"
			:style="{'padding':`0 ${tabPadding}rpx`,
			'color':tabIndex===index?activeColor:defaultColor}" 
			 :key="index" 
			 @click="tabChange(index)">
				<text class="txt">{{item}}</text>
			</view>
		</scroll-view>
		<view  class="tab-cont" 
		:style="{'transform':`translateX(${translateX}%)`,'transition':`transform ${transition}s ease-in-out`}"
		>
			<slot></slot>
		</view>
	</view>
</template>
<script>
	import { reactive, toRefs } from 'vue';
	export default {
		name: "tabs",
		props:{
			index:{
				type:Number,
				default:0
			},
			tabPadding:{
				type:Number,
				default:20
			},
			scrollY:{
				type:Boolean,
				default:false
			},
			flex:{
				type:Boolean,
				default:false
			},
			borderBottom:{
				type:Boolean,
				default:false
			},
			defaultColor:{
				type:String,
				default:'#AAAAAA'
			},
			activeColor:{
				type:String,
				default:'#FFF'
			}
		},
		emits: ['changeIndex'],
		setup(props, context) {
			const data = reactive({
				tabList: [],
				tabIndex: props.index ? +props.index : 0,
				translateX: -100 * (+props.index),
				transition: props.animation === false ? 0 : .2,
				scrollId: 'tab_0',
				tabPadding: props.tabPadding ? props.tabPadding : 20
			});
			const tabChange = (index) => {
				if (data.tabIndex == index) return false;
				data.tabIndex = index;
				data.translateX = -100 * data.tabIndex;
				data.scrollId = `tab_${index-1}`;
				context.emit('changeIndex', index);
			}
			uni.$on('getTabLabel', (val) => {
				data.tabList.push(val);
				if (data.timeId) clearTimeout(data.timeId);
				data.timeId = setTimeout(() => {
					// 移除全局监听
					uni.$off('getTabLabel');
				}, 1000)
			})
			setTimeout(() => {
				data.scrollId = `tab_${props.index-1}`;
			}, 100)
			return {
				...toRefs(data),
				tabChange
			}
		}
	}
</script>
<style>
	/*每个页面公共css */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}
	/* #ifdef H5 */
	.tab-bar.tab-bar-flex-true .uni-scroll-view-content {
		display: flex;
		justify-content: center;
	}
	/* #endif */
	/* #ifndef H5 */
	.tab-bar.tab-bar-flex-true {
		text-align: center;
	}
	/* #endif */
</style>
<style scoped lang="scss">
	.tab {
		display: flex;
		flex-direction: column;
		overflow-x: hidden;

		&-scrollY-true {
			height: 100vh;
		}
		.tab-bar-borde-bottom-true{
			border-bottom: 1rpx solid #ccc;
		}
		.tab-bar {
			
			height: 90rpx;
			white-space: nowrap;
			margin-bottom: 30rpx;

			&-item {
				display: inline-block;
				height: 90rpx;
				line-height: 90rpx;
				font-size: 30rpx;
				color: #222;
				text-align: center;
				color: #AAAAAA;
				&.active {
					position: relative;
					color: #FFFFFF;
				}

				&.active::after {
					content: '';
					width: 40rpx;
					height: 4rpx;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					background: #66AFA1;
				}
			}
		}

		.tab-cont {
			display: flex;
			height: fit-content;
		}
	}
</style>
