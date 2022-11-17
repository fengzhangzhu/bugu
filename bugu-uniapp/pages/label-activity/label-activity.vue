<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">{{labelContent}}</view>
		</uni-nav-bar>
		<scroll-view 
				class='scrollview' 
				scroll-y="true"
				refresher-enabled
				:refresher-triggered="isRefresh"
				:scroll-into-view="scrollInto"
				@refresherrefresh="onIsRefresh()"
				@scrolltolower="onScrolltolower">
				<view class="label-info-content">
					<view class="label-info-text-content">
						<view class="label-info-tag-content">
							<view class="label-info-tag">
								<view>#</view>
							</view>
						</view>
						<view class="label-info-text">
							<text>{{labelContent}}</text>
						</view>
						<view class="join-button"
						@click="onJoinButtonClick()"
						>
							参与讨论
						</view>
					</view>
					<view class="label-info-tips">
						<text class="label-info-tips-number">{{articleNumber}}</text><text>条动态</text>
					</view>
				</view>
				<view id="activity-head"></view>
				<activity-item 
					v-for="(item,index) in articles" 
					:articleItem="item"
					:isMe="item.publisher&&myId == item.publisher.id" 
					:key="item.id" 
					@onClick="onActivityItemClick(item)"
					@onFollowClick="onFollow(item)"
					@onMoreClick="onMoreClick(item)"></activity-item>
				<!-- 没有结果时 -->
				<view v-if="articles.length<0" class='no-activity'>
					<view class='iconfont icon-xingqiu' :style="{
						fontSize: '150px',
					  }"></view>
					<view class='no-activity-text'>暂时没有动态哦，刷新试试吧</view>
				</view>
				<view v-else class='loading-content'>
					<view v-if="showBottomLoading" class='iconfont icon-sync loading-icon' :style="{
					fontSize: `30px`,
					color: `#adadad`
				  }"></view>
					<view v-else>{{haveMoreData ? '上拉或点击加载更多' : '没有更多内容了'}}</view>
				</view>
			</scroll-view>
		
		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<block v-if="editArticleItem.id">
				<block v-if="editArticleItem.isAnonymity">
					<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报" />
				</block>
				<block v-else>
					<block v-if="editArticleItem.publisher.id == myId">
						<action-sheet-item icon="icon-delete" title="删除" @click="onPopupDeleteClick"/>
					</block>
					<block v-else>
						<action-sheet-item v-if="editArticleItem.publisher.isAttention == 1"
						icon="icon-quxiaoguanzhu" title="取消关注" @click="onCancelFollow(editArticleItem)"/>
						<action-sheet-item v-else icon="icon-guanzhu" title="关注" @click="onFollow(editArticleItem)"/>
						<action-sheet-item icon="icon-message" title="私聊"/>
						<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报"/>
					</block>
				</block>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		cancelAttention,
		deleteMyArticle,
		followUser,
	} from '@/common/requestFunctions';
	import {
		getMyUserInfo
	} from '@/common/storageFunctions';
	import {
		ArticleItem,
		UserInfo
	} from '@/common/dataClass';
	import {
		request
	} from "@/utils/request";
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType
	} from "@/common/constants";
	/**
	 * labelActivity 指定标签下的动态
	 * @description 指定标签下的动态
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 */
	export default {
		data() {
			return {
				articleNumber:0,
				showBottomLoading:false,
				isRefresh:false,//是否刷新
				haveMoreData:false,//是否有更多数据
				labelId:'',//标签的id
				labelContent:'',//标签的内容
				articles:[] as ArticleItem[],//动态列表
				myId:0,//我的id
				editArticleItem:{},//需要进行操作的动态
				page:1//页号
				
			}
		},
		async onLoad(params){
			 this.labelId = params.labelId as number
			 this.labelContent = params.labelContent 
			 let userInfo = await getMyUserInfo() as UserInfo
			 if (userInfo) {
			 	this.myId = userInfo.id
			 }
			 this.getLabelArticles(this.labelId,this.page)
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
			 * @description 点击参与讨论按钮跳转到发布页
			 */
			onJoinButtonClick(){
				uni.navigateTo({
					url:`/pages/publish/publish?labelId=${this.labelId}&labelContent=${this.labelContent}`
				})
			},
			/**
			 * @description 刷新时
			 */
			onIsRefresh(){
				this.isRefresh=true
				this.page =  1
				this.getLabelArticles(this.labelId, this.page)
			},
			/**
			 * @description 滑到最底部时
			 */
			onScrolltolower() {
				if (!this.haveMoreData) {
					return
				}
				
				this.page = this.page + 1
				this.getLabelArticles(this.labelId, this.page)
				
			},
			/**
			 * @description 点击某个动态
			 * @param {ArticleItem}
			 */
			onActivityItemClick(item){
				uni.navigateTo({
					url:`/pages/activity-info/activity-info?activityId=${item.id}`
				})
			},
			/**
			 * @description 点击动态上的更多按钮
			 */
			onMoreClick(item: ArticleItem) {
				this.$refs.articleActionPopup.open()
				this.editArticleItem = item
			},
			/**
			 * @description 点击popup的举报按钮
			 * @param {ArticleItem} item
			 */
			onPopupReportClick(item: ArticleItem){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.articleActionPopup.close()
			},
			/**
			 * @description 点击popup的删除按钮
			 * @param item
			 */
			onPopupDeleteClick(item:ArticleItem) {
				let _this = this
				uni.showModal({
					title: '删除动态',
					content: '你确定要删除这个动态吗',
					success: async function(res) {
						if (res.confirm) {
							if (await deleteMyArticle(item.id)) {
								let articles = _this.articles
								for (let i = 0; i < articles.length; i++) {
									if (articles[i].id == item.id) {
										articles.splice(i, 1)
										break
									}
								}
								_this.articles = articles
								_this.$refs.articleActionPopup.close()
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}
						}
					}
				})
			},
			/**
			 * @description 点击popup/activity-item的取消关注按钮
			 * @param item 
			 */
			async onCancelFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				uni.showModal({
					title: '取消关注',
					content: `你确定要取消关注${item.publisher.username}`,
					success: async function(res) {
						if (res.confirm) {
							if (item.publisher)
								if (await cancelAttention(item.publisher.id)) {
									let articles = _this.articles
									for (let i = 0; i < articles.length; i++) {
										if (articles[i].publisher && articles[i].publisher
											.id == item.publisher.id) {
											articles[i].publisher.isAttention = 0
										}
									}
									_this.articles = articles
									_this.$refs.articleActionPopup.close()
									uni.showToast({
										title: '取消关注',
										icon: 'success'
									})
								}
						}
					}
				})
			},
			/**
			 * @description 点击popup/activity-item的关注按钮
			 *  @param item 
			 */
			async onFollow(item: ArticleItem) {
				if (!item.publisher) {
					return
				}
				let _this = this
				if (await followUser(item.publisher.id)) {
					let articles = _this.articles
					for (let i = 0; i < articles.length; i++) {
						if (articles[i].publisher && articles[i].publisher.id == item.publisher.id) {
							articles[i].publisher.isAttention = 1
						}
					}
					_this.articles = articles
					_this.$refs.articleActionPopup.close()
					uni.showToast({
						title: '关注成功',
						icon: 'success'
					})
				}
			
			
			},
			 /**
			   * @description 获取指定标签下的动态
			   * @param page 页号
			   * @param labelId 标签的Id
			   */
			  async getLabelArticles(labelId:number,page: number) {
			    let res = await request({
			      data: {
			        method: 'GET',
			        group: 'activity',
			        action: 'groupByLabel',
			        data: {
			          page:page,
			          labelId:labelId
			        },
			        header: {
			          'content-type': 'application/x-www-form-urlencoded',// 默认值
			        },
			      }
			    });
			    setTimeout(() => {
			      this.isRefresh= false
			      
			    }, 700)
			
			    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
				  let pageSum = res.data.data.pageSum
				  this.articleNumber = res.data.data.total
				  let articles = res.data.data.list as ArticleItem[]
				  if (page < pageSum) { //判断是不是最后一页
				  	this.haveMoreData = true
				  } else {
				  	this.haveMoreData = false
				  }
			      if (page === 1) {
					  uni.showToast({
						  title:'刷新成功',
						  icon:"none"
					  })
			      	this.articles = articles
			      	this.scrollInto = ''
			      } else {
			      	let allArtilces = this.articles.concat(articles)
			      	this.articles = allArtilces
			      }
			      if (articles.length < 1) { //如果这一页没有动态则切换到下一页
			      	if (page < pageSum) {
			      		this.page = page + 1
			      		this.getLabelArticles(labelId, this.page)
			      	}
			      }
			    }
			  }
		}
	}
</script>

<style lang="scss">
	.label-info-content{
		width: 94%;
		padding: 3%;
		background-color: #FFFFFF;
		.label-info-text-content{
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			
			.label-info-tag-content{
				
				.label-info-tag{
					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
					height: 35rpx;
					width: 35rpx;
					font-size: large;
					padding: 5rpx;
					background-color: #4eccb8;
					color: #FFFFFF;
					font-weight: bold;
					border-radius: 50%;
				}
			}
			
			.label-info-text{
				flex-grow: 1;
				margin-left: 20rpx;
				color: #000000;
				font-size: larger;
				font-weight: bold;
				text-align: left;
			}
			.join-button{
				font-size: small;
				padding: 10rpx 20rpx;
				background-color: #4eccb8;
				color: #FFFFFF;
				border-radius: 30rpx;
			}
		}
		.label-info-tips{
			margin-top: 10rpx;
			font-size: small;
			color: #A5A4A4;
			.label-info-tips-number{
				font-size: medium;
				color: #000;
			}
		}
	}
.no-activity{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color:#dadada
}
.no-activity-text{
    margin-top: 20px;
    font-size: large;
    color: #b6b6b6;
}
.loading-content{
    width: 100%;
    height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.loading-content {
		width: 100%;
		height: 60px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: small;
		color: #aaaaaa;
	}
.no-activity {
		width: 100%;
		height: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.no-activity-text {
		margin-top: 20rpx;
		font-size: large;
		color: #b6b6b6;
	}

	.labels-cotent {
		padding-top: 20rpx;
		background-color: #fff;

	}

</style>
