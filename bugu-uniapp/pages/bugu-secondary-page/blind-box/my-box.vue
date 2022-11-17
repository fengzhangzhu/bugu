<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我的盒子</view>
		</uni-nav-bar>
		<view class="my-box-content">
			<!-- 标签头 -->
			<view class="box-tags-content">
				<view class="box-tag-take"
				:style="{
					backgroundColor:tabSelected == 0?  '#ffd5a9' :'#fff',
					color:tabSelected ==0 ? '#000':'#8a8a8a'
				}"
				@click="onTabChange(0)"
				>
					我开的盒子
				</view>
				<view class="box-tag-put"
				:style="{
					backgroundColor:tabSelected == 1 ? '#ffd5a9' :'#fff',
					color:tabSelected == 1 ? '#000':'#8a8a8a'
				}"
				@click="onTabChange(1)"
				>
				我留的盒子	
				</view>
			</view>
			<!-- 盒子列表 -->
			<view class="box-logs-content">
				<!-- 我获取的盒子 -->
				<uni-transition v-if="tabSelected==0" class="emoji-picker-content" mode-class="slide-left" :show="tabSelected==0">
					<view class="box-take-log">
						<my-box-item v-for="(item,index) in tookBoxInfos"
						:key="item.id"
						:myBoxData="{time: item.collectTime,
									id: item.id,
									sex: item.sex,
									text: item.text,
									userId: item.userId,
									isCollected: 0,
									isDeleted: 0}"
						@onClick="onTookBoxItemClick(item)"
						></my-box-item>
						<uni-pagination :total="tookBoxSum"
						prevText="上一页"
						nextText="下一页"
						pageSize="5" :pagerCount="tookBoxPage" @change="tookBoxPageChange"
						></uni-pagination>
					</view>
				</uni-transition>
				<!-- 我留下的盒子 -->
				<uni-transition v-if="tabSelected==1" class="emoji-picker-content" mode-class="slide-right" :show="tabSelected==1">
					<view class="box-put-log">
						<my-box-item v-for="(item,index) in putBoxInfos"
						:key="item.id"
						:myBoxData="{time: item.createTime,
									id: item.id,
									sex: item.sex,
									text: item.text,
									userId: item.userId,
									isCollected: item.isCollected,
									isDeleted: item.isDeleted}"
						@onClick="onPutBoxItemClick(item)"
						></my-box-item>
						<uni-pagination :total="putBoxSum"
						prevText="上一页"
						nextText="下一页"
						pageSize="5" :pagerCount="putBoxPage" @change="putBoxPageChange"
						></uni-pagination>
					</view>
				</uni-transition>
			</view>
			<!-- 取出盒子的详情 -->
			<action-sheet ref="tookBoxDetailPopup"  needHead title="盒子详情">
				<uni-list v-if="tookBoxDetail.id">
					<uni-list-item title="获取时间" :rightText="tookBoxDetail.collectTime"></uni-list-item>
					<uni-list-item title="内容" :note="tookBoxDetail.text"></uni-list-item>
					<uni-list-item title="性别" :rightText="tookBoxDetail.sex == 0 ? '女' : '男'"></uni-list-item>
					
				</uni-list>
				<view @click="onGoToHomepageClick(tookBoxDetail.userId)" class="box-edit-button main-color">去ta的主页</view>
			</action-sheet>
			<!-- 放入盒子的详情 -->
			<action-sheet ref="putBoxDetailPopup"   needHead title="盒子详情">
				<uni-list v-if="putBoxDetail.id">
					<uni-list-item title="创建时间" :rightText="putBoxDetail.createTime"></uni-list-item>
					<uni-list-item title="内容"  :note="putBoxDetail.text"></uni-list-item>
					<uni-list-item title="性别" :rightText="putBoxDetail.sex == 0 ? '女' : '男'"></uni-list-item>
					
				</uni-list>
				<view v-if="putBoxDetail.isDeleted!=1" class="box-edit-button" @click="onDeleteButtonClick(putBoxDetail)">删除这个盒子</view>
			</action-sheet>
		</view>
	</view>
</template>

<script lang="ts">
	  import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE
	} from '@/common/constants';
	interface PutBoxInfo {
	    createTime: string,
	    id: number,
	    sex: number,
	    text: string,
	    userId: number,
	    isCollected: number,
	    isDeleted: number,
	}
	interface TookBoxInfo {
	    collectTime: string,
	    id: number,
	    sex: number,
	    text: string,
	    userId: number,
	}
	/**
	 * myBox 我的盒子界面
	 * @description 我的盒子界面
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				tabSelected:0,
				tookBoxInfos:[] as TookBoxInfo[],
				tookBoxPage:1,
				tookBoxSum:0,
				tookBoxDetail:{},
				putBoxInfos:[] as PutBoxInfo[],
				putBoxPage:1,
				putBoxSum:0,
				putBoxDetail:{}
			}
		},
		onLoad(){
			this.tookBoxLog(1)
			this.putBoxLog(1)
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
			/**
			 * @description 标签页改变时
			 * @param {number} tab
			 */
			onTabChange(tab:number){
				this.tabSelected = tab
			},
			/**
			 * @description 我开的盒子页数改变时
			 */
			tookBoxPageChange(e){
				this.tookBoxPage=e.current
				this.tookBoxLog(this.tookBoxPage)
			},
			/**
			 * @description 我放的盒子页数改变时
			 */
			putBoxPageChange(e){
				this.putBoxPage=e.current
				this.putBoxLog(this.putBoxPage)
			},
			/**
			 * @description 点击某个我获取的盒子
			 * @param {TookBoxInfo} item
			 */
			onTookBoxItemClick(item){
				this.tookBoxDetail = item
				this.$refs.tookBoxDetailPopup.open()
			},
			/**
			 * @description 点击某个我放入的盒子
			 * @param {PutBoxInfo} item
			 */
			onPutBoxItemClick(item){
				this.putBoxDetail = item
				this.$refs.putBoxDetailPopup.open()
			},
			/**
			 * @description 点击删除按钮
			 * @param {PutBoxInfo} item
			 */
			onDeleteButtonClick(item){
				 let _this = this
				 uni.showModal({
					 title: '删除盒子',
					 content: '你确定要删除这个盒子吗？已经被收取的盒子无法删除哦',
					 success: function (res) {
						 if (res.confirm) {
							 _this.deleteBox(item.id)
							 _this.$refs.putBoxDetailPopup.close()
						 }
					 }
				 })
			},
			/**
			 * @description 盲盒收取记录
			 * @param {number} page 页号  
			 */
			async tookBoxLog(page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'blindBox',
						action: 'collect/log',
						data: {
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.tookBoxInfos= res.data.data.list
					this.tookBoxSum=res.data.data.total
				}
			},
			/**
			 * @description 盲盒投递记录
			 * @param {number} page 页号  
			 */
			async putBoxLog(page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'blindBox',
						action: 'deliver/log',
						data: {
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					this.putBoxInfos = res.data.data.list
					this.putBoxSum = res.data.data.total
				}
			},
			/**
			 * @descrition 点击去他的主页
			 * @param {number} id 用户id 
			 */
			onGoToHomepageClick(id){
				uni.navigateTo({
					url:`/pages/user-home-page/user-home-page?userId=${id}`
				})
			},
			/**
			 * @description 删除指定id的盲盒
			 * @param {number} id 盲盒id 
			 */
			async deleteBox(id: number) {
			        let res = await request({
			            data: {
			                method: 'DELETE',
			                group: 'blindBox',
			                action: `${id}/delete`,
			                data: {
			                    id: id
			                },
			                header: {
			                    'content-type': 'application/x-www-form-urlencoded', // 默认值
			                },
			            }
			        });
			        if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			           for(let i = 0;i<this.putBoxInfos.length;i++){
						   if(this.putBoxInfos[i].id == id){
							this.putBoxInfos[i].isDeleted = 1
							break
						   }
					   }
			        }
			    }
			
		}
	}
</script>

<style lang="scss">
.my-box-content {
    padding: 2%;
   
}

.box-tags-content {
    display: flex;
    align-items: center;
    justify-content: center;
    .box-tag-take {
        text-align: center;
        flex-grow: 1;
        margin-right: 10rpx;
        padding: 20rpx;
        background-color: #fff;
        border-radius: 20rpx 20rpx 0 0;
    }
    .box-tag-put {
        text-align: center;
        flex-grow: 1;
        margin-left: 10rpx;
        padding: 20rpx;
        color: #fff;
        background-color: #ca9306;
        border-radius: 20rpx 20rpx 0 0;
    }
}
.box-logs-content {
	position: relative;
	.box-take-log{
		width: 100%;
		position: absolute;
		background-color: #FFF;
		min-height: 200rpx;
		width: 100%;
		padding: 10rpx 0rpx;
		border-radius: 0 0 20rpx 20rpx;
	}
	.box-put-log{
		width: 100%;
		position: absolute;
		background-color: #FFF;
		min-height: 200rpx;
		width: 100%;
		padding: 10rpx 0rpx;
		border-radius: 0 0 20rpx 20rpx;
	}
	
}
.box-edit-button{
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
