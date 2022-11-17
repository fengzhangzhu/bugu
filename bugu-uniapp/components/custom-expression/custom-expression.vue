<template>
	<view>
		<scroll-view
		scroll-y="true"
		:style="{
			 height: contentHeight ? contentHeight+'px' : 300 + 'px'
		}"
		lower-threshold="80"
		@scrolltolower="onScroolToLower"
		>
			<view class="expression-content">
				<view class="expression-item"
				v-for="(item, index) in expressions"
				:key="item.id"
				>
					<image @click="onExpressionItemClick(item,index)" 
					@longpress="onLongPress(item,index)"
					:style="{
						width: '16vw',
						height: '16vw'
					}"
					  :src="item.url"
					  mode='aspectFill'
					/>
				</view>
			</view>
			<view v-if="expressions.length < 1" class='no-expression'>
				您还未添加任何表情~
			</view>
		</scroll-view>
		<!-- 自定义表情操作弹出层 -->
		<action-sheet ref="expressionItemActionPopup" :needHead="true" title="设置消息" :needCancelButton="true">
			<block v-if="editExpression.id">
				<action-sheet-item  @click="onDeleteTextClick" title="删除"></action-sheet-item>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		REQUEST_SUCCEEDED_CODE
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	
    interface ExpressionItem {
	    id: number
	    url: string
	}
	/**
	 * customExpression 自定义表情组件
	 * @description 自定义表情组件
	 * @Author: 穆兰
	 * @Date: 2022/1/14
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/14
	 * @property {Number} [contentHeight]    - 组件的高度
	 * @event {Function} onItemClick 点击此组件的单个表情
	 * @example 调用示例 
	 */
	export default {
		name:"custom-expression",
		props:{
			contentHeight:{
				type:Number,
				required:true
			}
		},
		data() {
			return {
				haveMore:true,
				page:1,
				expressions:[] as ExpressionItem[],
				editExpression:{},
				editIndex:0
				
			};
		},
		async created(){
			this.expressions=await this.getExpressions(this.page)
		},
		methods:{
			/**
			 * @description 点击单个表情图片
			 * @param {ExpressionItem} item 
			 * @param {number} index 
			 */
			onExpressionItemClick(item,index){
				this.$emit('onItemClick',item,index)
			},
			/**
			 * @description 长按某个表情图片
			 * @param {object} item
			 * @param {number} index 第几个
			 */
			onLongPress(item,index){
				this.editExpression = item
				this.editIndex = index
				this.$refs.expressionItemActionPopup.open()
			},
			/**
			 * @description 删除某个自定义图片
			 */
			onDeleteTextClick(){
				 this.deleteExpression(this.editExpression.id,this.editIndex)
				 this.$refs.expressionItemActionPopup.close()
			},
			/**
			 * @description 刷新表情
			 */
			async refresh(){
				
				this.page=1
				this.expressions=await this.getExpressions(this.page)
				
			},
			/**
			 * @description 滑动到最底部时
			 */
			async onScroolToLower(){
				if (this.haveMore) {
					this.page = this.page + 1
					let more_expression=await this.getExpressions(this.page)
					let expressions = this.expressions
					expressions = expressions.concat(more_expression)
					this.expressions = expressions
				}
			},
			/**
			 * @function 获取表情包列表
			 * @param {number} page 页数
			 * @returns  {Promise<ExpressionItem[]>}
			 */
			async getExpressions(page: number): Promise<ExpressionItem[]> {
				let res = await request({
					data: {
						method: 'GET',
						group: 'message',
						action: 'emoticon/list',
						data: {
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
		
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let expressionList = res.data.data.list as ExpressionItem[]
					console.log('expressionList', expressionList)
					let pageSum = res.data.data.pageSum
					if (pageSum <= page) {
						this.haveMore = false
					}
					return expressionList
				} else {
					return []
				}
			},
			/**
			 * @function 删除表情
			 * @param id 表情的id
			 * @param index 表情的序号
			 */
			async deleteExpression(id: number,index){
				let res = await request({
					data: {
						method: 'DELETE',
						group: 'message',
						action: 'emoticon/delete',
						data: {
							id: id
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' // 默认值
						},
					}
				});
		
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let expressions = this.expressions
					expressions.splice(index, 1)
					this.expressions = expressions
					uni.showToast({
						title:'删除成功',
						icon:'success'
					})
					
					return true
				} else {
					return false
				}
			 }
		}
	}
</script>

<style lang="scss">
.expression-content{
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
}
.expression-item{
    width: 20vw;
    height: 20vw;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 50rpx;
}
.no-expression{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    color: #888888;
}
</style>
