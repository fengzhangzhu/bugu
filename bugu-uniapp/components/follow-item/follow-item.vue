<template>
	<view>
		<view class='follow-content'
		@click.stop="onContentClick()"
		>
			<!-- 头像 -->
			<view class='user-avatar'>
				<image
				  mode='aspectFill' class='user-item-avatar' :src="item.avatar+'?imageView2/1/w/100/h/100'"
				></image>
			</view>
			<!-- 用户名 --> 
			<text class='user-name'>{{item.username}}</text>
			<!-- 关注的状态 -->
			<view class='attention-statu-button-content'
			@click.stop="onFollowButtonClick"
			>
			   <view
				:style="{
						backgroundColor:isFollowed?'#bbbbbb':'#75e4d2',}"
				 class='attention-statu-button'> {{buttontext}} </view>
			</view>
		</view>
	</view>
</template>

<script>
	import {followUser,cancelAttention} from "@/common/requestFunctions";
	
	/**
	 * followItem 关注列表的单个项
	 * @description 关注列表的单个项
	 * @Author: 穆兰
	 * @Date: 2022/1/16
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/16
	 * @property {Object} [item] - 项的数据
	 */
	export default {
		name:"follow-item",
		props:{
			item: {
				type:Object,
				required:true
			}
		},
		computed:{
			buttontext(){
				return this.isFollowed?this.item.mutual == 1?'互相关注':'已关注':'关注'
			}
		},
		beforeCreate() {
		},
		data() {
			return {
				isFollowed:true
			};
		},
		methods:{
			/**
			 * @description  点击主体
			 */
			onContentClick(){
				uni.navigateTo({
					url:`/pages/user-home-page/user-home-page?userId=${this.item.id}`
				})
			},
			/**
			 * @description  点击关注按钮
			 */
			async onFollowButtonClick(){
				if (!this.isFollowed ) {
					if (await followUser(this.item.id)) {
						this.isFollowed = true
					}
				} else {
					let _this = this
					uni.showModal({
						title: '取消关注',
						content: '你确定要取消关注这个用户吗？',
						success: async function (res) {
							if (res.confirm) {
								if (await cancelAttention(_this.item.id)) {
									_this.isFollowed = false
								}
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
	
					})
				}
			}
		}
		
	}
</script>

<style lang="scss">
.follow-content{
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    padding: 1% 2%;
    margin: 1% 0;
    background-color: #fff;
	.user-name{
	
	    text-align: left;
	    flex-grow: 1;
	    padding-left:20rpx;
	    font-size: medium;
	    font-weight: lighter;
	    color: #aaaaaa;
	
	}
	.attention-statu-button-content{
	    
	   width: 30%;
	    
	}
	.attention-statu-button{
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
	.user-item-avatar{
	    width: 80rpx;
	    height: 80rpx;
	    border-radius: 50%;
	    background-color: #75e4d2;
	}
}



</style>
