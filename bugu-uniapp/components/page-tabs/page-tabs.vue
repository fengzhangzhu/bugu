<template>
	<view :class="['tab']">
		<scroll-view 
		:class="['tab-bar','tab-bar-flex-'+flex,'tab-bar-borde-bottom'+borderBottom]"
		scroll-x="true"
		:scroll-into-view="scrollId" 
		scroll-with-animation>
			<view v-for="(item,index) in tabList" class="tab-bar-item"
			 :class="tabIndex===index?'active '+'underline-'+underLineType:''"
			 :id="`tab_${index}`"
			:style="{'padding':`0 ${tabPadding}rpx`,
			'color':tabIndex===index?activeColor:defaultColor,
			'fontSize':tabIndex===index?activeFontSize+'px':defaultFontSize+'px'
			}" 
			 :key="index" 
			 @click="tabChange(index)">
				<text class="txt">{{item.title}}</text>
				<view v-if="item.badge" class="tabs-badge"
				:style="{
					right:item.badge<10?'-5rpx':item.badge<100?'-10rpx':'-20rpx',
				}"
				>
					<text>
						{{item.badge<100?item.badge:'99+'}}
					</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { reactive, toRefs } from 'vue';
	/**
	 * pageTabs 标签页标签
	 * @description 自定义弹出选择层的单个选项组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {Number} index  - 选择的第几个标签
	 * @property {String[]} labels - 标签数组
	 * @property {Boolean} flex -是否使用居中flex布局
	 * @property {Boolean} borderBottom -是否需要底部边线
	 * @property {Number} tabPadding -标题的左右padding
	 * @property {String} activeColor -被选中时的文字颜色
	 * @property {Number} activeFontSize -被选中时的文字大小
	 * @property {String} defaultColor -未被选中时的文字颜色
	 * @property {Number} defaultFontSize -未被选中时的文字大小
	 * @property {String} underLineType= [default|bubble] -被选中时的文字下划线的样式 ；
	 * @event {Function} changeIndex 选择的标签改变时
	 */
	export default {
		name:"page-tabs",
		props:{
			index:{
				type:Number,
				default:0,
			},
			labels:{
				type:Array,
				default:[]
			},
			flex:{
				type:Boolean,
				default:false
			},
			tabPadding:{
				type:Number,
				default:20
			},
			borderBottom:{
				type:Boolean,
				default:false
			},
			activeColor:{
				type:String,
				default:'#000000'
			},
			defaultColor:{
				type:String,
				default:'#aaaaaa'
			},
			defaultFontSize:{
				type:Number,
				default:16
			},
			activeFontSize:{
				type:Number,
				default:16
			},
			underLineType:{
				type:String,
				default:'default'
			}
		},
		emits:['changeIndex'],
		setup(props, context){
			console.log(props.index)
			const data = reactive({
				tabList: props.labels?props.labels: ['默认'],
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
			setTimeout(() => {
				data.scrollId = `tab_${props.index-1}`;
			}, 100)
			return {
				...toRefs(data),
				tabChange
			}
		},
		computed:{
			tabIndex(){
				return this.index ? +this.index : 0
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
		.tab-bar-borde-bottom-true{
			border-bottom: 1rpx solid #ccc;
		}
		.tab-bar {
			
			height: 70rpx;
			white-space: nowrap;

			&-item {
				position: relative;
				display: inline-block;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 30rpx;
				font-weight: 700;
				color: #222;
				text-align: center;
				color: #AAAAAA;
				.tabs-badge{
					line-height:1;
					top: 0rpx;
					right: -20rpx;
					position: absolute;
					font-size: 20rpx;
					font-weight: lighter;
					padding:5rpx 7rpx;
					background-color: #ff4346;
					border-radius: 15rpx;
					color: #FFFFFF;
					text-align: center;
					min-width: 18rpx;
				}
				&.active {
					position: relative;
					color: #FFFFFF;
				}

				&.underline-bubble::after {
					content: '';
					width: 70rpx;
					height: 20rpx;
					opacity: 0.7;
					background-size: 100% auto;
					background-position: center 0;
					background-repeat: no-repeat;
					background-image: url(../../static/svgs/tabs_underline.svg);
					position: absolute;
					bottom: 5rpx;
					left: 50%;
					transform: translateX(-50%);
				}
					
				&.underline-default::after{
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
		}
	}
</style>
