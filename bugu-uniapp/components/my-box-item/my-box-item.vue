<template>
	<view>
		<view class='my-box-ite-content'
		  :style="{
			backgroundImage:myBoxData.sex==0? 
			`linear-gradient(to left, #fce9f0, #fff);`:
			`linear-gradient(to left, #ebf2fd, #fff);`}"
			@click="onClick"
		>
			<view class='my-box-info'>
				<view class='my-box-type'>
					{{myBoxData.sex==0?'女生盒子':'男生盒子'}}
					{{myBoxData.isDeleted==1?'-已删除':
					myBoxData.isCollected==1?'-已被收取':''}}
				</View>
				<view class='my-box-text'>{{myBoxData.text}}</View>
				<view class='my-box-time'>{{myBoxData.time}}</View>
			</View>
			<view class='my-box-more-icon'>
				<uni-icons color="#b4b4b4" type="right" size="20"/>
			</View>
		</View>
	</view>
</template>

<script>
	/**
	 * myBoxItem 我的盲盒-单个盲盒组件
	 * @description:我的盲盒-单个盲盒组件
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 * @property {BoxInfo} [myBoxData] - 盲盒的数据
	 * @event {Function} onClick - 点击组件主体
	 */
	export default {
		name:"my-box-item",
		props:{
			 myBoxData:{
				 type:Object,
				 required:true
			 },
		},
		data() {
			return {
				
			};
		},
		methods:{
			/**
			 * @description 点击主体
			 */
			onClick(){
				this.$emit("onClick")
			}
		}
	}
</script>

<style lang="scss">
.my-box-ite-content{
    padding: 2%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1%;
}
.my-box-info{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
    font-size: small;
    .my-box-type{
        font-size: smaller;
        color: #9c9c9c;
    }
    .my-box-text{
        margin-top: 10rpx;
    }
    .my-box-time{
        margin-top: 5rpx;
        color: #9c9c9c;
        font-size: smaller;
    }
}
.my-box-more-icon{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
