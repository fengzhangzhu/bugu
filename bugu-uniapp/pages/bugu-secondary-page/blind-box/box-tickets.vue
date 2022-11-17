<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">我的盲盒劵</view>
		</uni-nav-bar>
		<view class="box-tickets-content">
			<uni-card
			title="我的盲盒劵"
			:extra="`剩余${boxTicketsAvailableSum}张`"
			>
				<uni-list>
					<uni-list-item
					v-for="(item,index) in tickets"
					:key="item.id"
					title="获取时间"
					:note="item.createTime"
					:rightText="item.isUsed==1?'已使用':'未使用'"
					></uni-list-item>
				</uni-list>
				<uni-pagination 
				class="takes-pagination"
				:total="total"
				prevText="上一页"
				nextText="下一页"
				pageSize="5" :pagerCount="pageNumber" @change="onPageChange"
				></uni-pagination>
			</uni-card>
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
	interface TicketItem {
	    createTime: string
	    id: number
	    isUsed: number
	}
	/**
	 * boxTickets 我的盲盒劵
	 * @description 我的盲盒劵
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				boxTicketsAvailableSum:0,
				tickets:[] as TicketItem[],
				total:0,
				pageNumber:1
			}
		},
		onLoad(){
			this.getBoxTicketsInfo(this.pageNumber)
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
			 * @description 页数改变时
			 */
			onPageChange(e){
				this.pageNumber = e.current
				this.getBoxTicketsInfo(this.pageNumber)
			},
			/**
			 * @description  获取我拥有的盲盒劵的信息
			 * @param {number} page 页号  
			 */
			async getBoxTicketsInfo(page: number) {
			        let res = await request({
			            data: {
			                method: 'GET',
			                group: 'blindBox',
			                action: 'ticket/list',
			                data: {
			                    page: page
			                },
			                header: {
			                    'content-type': 'application/x-www-form-urlencoded', // 默认值
			                },
			            }
			        });
			        if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			            let ticketsResult = res.data.data 
			            this.boxTicketsAvailableSum=ticketsResult.list.availableSum,
						this.tickets = ticketsResult.list.tickets,
						this.total = ticketsResult.total
			        }
			    }
		}
	}
</script>

<style>
.box-tickets-content{
    margin-top: 20px;
}
.takes-pagination{
    margin-top: 10px;
}
</style>
