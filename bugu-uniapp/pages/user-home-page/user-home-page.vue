<template>
	<view class="page">
		<!-- 标题栏 -->
		<View className='upper-head' :style="{
		          position: 'absolute',
		          top: '0px'
		        }"
		        >
		<uni-nav-bar 
		left-icon="back"
		class="nav_bar" 
		fixed="true" 
		:border="false"
		backgroundColor="#ffffff00" 
		color="#808080"
		statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">{{title}}</view>
		</uni-nav-bar>
		</view>
		<!-- 主体 -->
		<scroll-view class='scrollview' 
		:style="{
			height:'100vh',
			width: '100vw',
		}"
		scroll-y="true" @scrolltolower="onScrolltolower">
			<!-- 上半部分 -->
			<view class="user-upper-half"
			@click="onBackgroundClick"
			:style="{
				backgroundImage: userInfo.background?`url(${userInfo.background})`:'linear-gradient(to bottom, #e7d3aa, #61c5ae);'
			}"
			>
				<block v-if="userInfo.id">
					<view class="user-info-content"
					@click.stop=""
					>
						<view class="upper-user-info">
							<view class="user-info-left">
								<!-- 头像 -->
								<view class="upper-user-avater"
								@click.stop="onNavigateTo('/pages/setting/personal_information/personal_information')"
								>
									<image v-if="userInfo.avatar" class="user-avater-image" :src="userInfo.avatar"
										:mode="'aspectFill'"></image>
									<!-- VIP标识 -->
									<view class="vip-logo">
										<image
											:src="userInfo.vip&&userInfo.vip.remainDays>0?'../../static/svgs/vip-logo.svg':'../../static/svgs/no-vip-logo.svg'"
											:mode="'aspectFill'" style="width: 25px;height: 25px;">
						
										</image>
									</view>
								</view>
							</view>
							<view class="user-info-right">
								<!-- 关注、粉丝、访问次数 -->
								<view class="upper-tags-group">
									<!-- 关注数 -->
									<view class="upper-tag"
									@click.stop="onFollowedNumberClick"
									>
										<view class="tag-value">
											{{userInfo.attentionSum}}
											
										</view>
										<view class="tag-type">
											关注
										</view>
									</view>
									<view class='dividing-line'></view>
									<!-- 粉丝数 -->
									<view class="upper-tag"
									@click.stop="onFansNumberClick"
									>
										<view class="tag-value">
											{{userInfo.beAttentionSum}}
											
										</view>
										<view class="tag-type">
											粉丝
										</view>
									</view>
									<view class='dividing-line'></view>
									<!-- 访问数 -->
									<view class="upper-tag"
									@click.stop="onVisitorNumberClick"						
									>
										<view class="tag-value">
											{{userInfo.visitorSum}}
											
										</view>
										<view class="tag-type">
											访客
										</view>
									</view>
								</view>
								<view class="button-content">
									<view v-if="isAttention == 0"
									@click.stop="onFollowButtonClick()"
									class='edit-button'>
										<view class='iconfont icon-chakantieziguanzhu' :style="{
									          fontSize: '20px',
									          color: '#fff',
									        }" />
									</view>
									<view @click.stop="onChatButtonClick()" class='edit-button'>
										<view class='iconfont icon-message' :style="{
									          fontSize: '20px',
									          color: '#fff',
									        }" />
									</view>	
								</view>
							</view>
							
						</view>
						<!-- 昵称 -->
						<view  class="upper-user-ignature">
							BE Ur self
							<!-- <view class="iconfont icon-shimingrenzheng_shimingrenzheng" :style="{
								fontSize: '15px',
								color: userInfo.isVerify == 1 ? '#3bd8bf' : '#b4b4b4',
								marginLeft: '5px'
							}">
							</view>
							<view v-if="userInfo.sex == undefined" class="iconfont icon-xingbie-unkown" :style="{
									fontSize: '15px',
									color: '#3bd8bf',
									marginLeft: '5px'
								  }" />
													
							<view v-else-if="userInfo.sex == 0" class="iconfont icon-nvxing" :style="{
								fontSize: '15px',
								color: '#e86591',
								marginLeft: '5px'
							}" />
							<view v-else class="iconfont icon-nanxing" :style="{
								fontSize: '15px',
								color: '#528cea',
								marginLeft: '5px'
							}" /> -->
						</view>
					</view>
					
				</block>
			</view>
			<!-- 下半部分 -->
			<view class="user-lower-half">
				<!-- 标签 -->
				<custom-tabs
				index="0"
				:animation="true" 
				tabPadding="80" 
				:flex="true" 
				>
					<custom-tab-pane label="动态"
					>
						<!-- 我发布的动态 -->
						<view class="lower-my-aciticities">
							<view :key="item.id" class="activity-item" v-for="(item,index) in myArticles">
								<user-activity-item
								:articleItem="item"
								:isMe="true"
								:avatar="userInfo.avatar"
								:username="userInfo.username"
								@onClick="onActivityItemClick(item)"
								@onMoreClick="onMoreClick(item)"
								>
								</user-activity-item>
							</view>
							
						</view>
					</custom-tab-pane>
					<!-- <custom-tab-pane label="赞过"
					>
					
					</custom-tab-pane> -->
				</custom-tabs>
			</view>
		</scroll-view>
		

		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态选择" :needCancelButton="true">
			<block v-if="editArticleItem.id">
				<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报"/>
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		UserInfo,
		MyArticleItem
	} from "@/common/dataClass";
	import {
		REQUEST_SUCCEEDED_CODE,
		reportObjectType
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getUserinfo,followUser
	} from "@/common/requestFunctions";
	import {getMyUserInfo} from "@/common/storageFunctions"
	/**
	 * userHomePage 用户主页
	 * @description 用户主页
	 * @Author: 穆兰
	 * @Date: 2021/12/27
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 */
	export default {
		data() {
			return {
				title: "用户主页",
				isRefresh: false,
				userInfo: {} as UserInfo,
				myArticles: [] as MyArticleItem[],
				articlesPage: 1,
				haveMoreData: true,
				isAttention: 0,
				isMe:false,
				editArticleItem:{}
			}
		},
		async onLoad(params) {
			let userId = params.userId as number
			let userInfo = await getUserinfo(userId)
			let myUserInfo = await getMyUserInfo()
			
			if (userInfo) {
				
				this.userInfo = userInfo
				this.isAttention = userInfo.isAttention
				if(userInfo.id==myUserInfo.id){
					this.isMe = true
				}
				this.getUserArticles(userInfo.id, this.articlesPage)
				
			}
			
		},
		//#ifdef MP-WEIXIN
		/**
		 * @description 分享
		 */
		onShareAppMessage() {
		    return {
		      title:`${this.userInfo.username}的主页` ,
		      path: `/pages/user-home-page/user-home-page?userId=${this.userInfo.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl:''
		    };
		},
		/**
		 * @description 分享
		 */
		onShareTimeline() {
		    return {
		      title:`${this.userInfo.username}的主页` ,
		      path: `/pages/user-home-page/user-home-page?userId=${this.userInfo.id}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
		      imageUrl:this.userInfo.avatar
		    };
		},
		// #endif
		methods: {
			/**
			 * @description 点击返回按钮
			 */
			onNarLeftClick(){
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * @description 向下滑动时
			 */
			onScrolltolower(){
				if(this.haveMoreData){
					this.articlesPage = this.articlesPage+1
					this.getUserArticles(this.userInfo.id, this.articlesPage)
				}
				
			},
			/**
			 * @description 点击单个动态
			 * @param {MyArticleItem} item
			 */
			onActivityItemClick(item:MyArticleItem){
				uni.navigateTo({
					url:`/pages/activity-info/activity-info?activityId=${item.id}`
				})
				
			},
			/**
			 * @description 点击动态上的更多按钮
			 * @param {MyArticleItem} item
			 */
			onMoreClick(item: MyArticleItem) {
				if(this.isMe){
					uni.showToast({
						title:'请到我的页面进行操作',
						icon:"none"
					})
				}else{
					this.$refs.articleActionPopup.open()
					this.editArticleItem = item
				}
				
			},
			/**
			 * @description 点击popup的举报按钮
			 * @param {MyArticleItem} item
			 */
			onPopupReportClick(item: MyArticleItem){
				uni.navigateTo({
					url:`/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.articleActionPopup.close()
			},
			/**
			 * @description 点击私聊按钮
			 */
			onChatButtonClick(){
				uni.navigateTo({
					url:`/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.userInfo.id}`
				})
			},
			/**
			 * @description 点击关注按钮
			 */
			async onFollowButtonClick() {
				if (await followUser(this.userInfo.id)) {
					this.isAttention=1
				}	
			},
			/**
			 * @description 通过用户id获取用户发表过的动态
			 * @param userId {number} 用户的id
			 * @param page {number}  页码   
			 */
			async getUserArticles(userId: number, page: number) {
				uni.showLoading({
					title: '加载中'
				})
				let res = await request({
					data: {
						method: 'GET',
						group: 'user',
						action: `${userId}/activity`,
						data: {
							userId: userId,
							page: page
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});
				uni.hideLoading()
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let pageSum = res.data.data.pageSum
					let articles = res.data.data.list as MyArticleItem[]
					if (page < pageSum) { //判断是不是最后一页
						this.haveMoreData = true
					} else {
						this.haveMoreData = false
					}
					if (page === 1) {
						this.myArticles = articles
					} else {
						let allArtilces = this.myArticles.concat(articles)
						this.myArticles = allArtilces
					}
					if (articles.length < 1) { //如果这一页没有动态则切换到下一页
						if (page < pageSum) {
							this.articlesPage = page + 1
							this.getUserArticles(userId, this.articlesPage)
						}
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.scrollview{
		background-color: #000000;
	}
	.user-upper-half {
		position: relative;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-color: #000000;
		background-image: linear-gradient(to bottom, #e7d3aa, #61c5ae);
		height: 50vh;
	}

	.user-info-content{
		width: 94%;
		position: absolute;
		bottom: 0;
		padding: 3%;
		background-image: linear-gradient(to bottom, #00000000, #000000 50%);
		.upper-user-info{
			display: flex;
			text-align: center;
			justify-content: center;
			align-items: center;
			height: fit-content;
			.user-info-left{
				width: 200rpx;
				height: 200rpx;
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
				.upper-user-avater{
					
				    position: relative;
				    width: fit-content;
				    height: fit-content;
				    background: white;
				    padding: 2px;
				    border-radius: 50%;
				    margin: 0 auto;
				    display: flex;
				    align-items: center;
					flex-wrap: wrap;
				    .vip-logo{
				        position:absolute;
				        height: fit-content;
				        width: fit-content;
				        bottom: -5px;
				        right: -5px;
				       }
					   .user-avater-image{
						   width: 140rpx;
						   height: 140rpx;
						   border-radius: 50%;
					   }
				}
			}
			.user-info-right{
				flex-grow: 1;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				
				.upper-tags-group{ 
				    flex-grow: 1;
				    display: flex;
				    text-align: center;
				    align-items: center;
				    justify-content: center;
					.upper-tag{
					    width: 100%;
					    text-align: center;
					    flex-grow: 1;
					    color: #fff;
					    font-size: medium;
					}
					.tag-value{
					    margin: 0 auto;
					    width: fit-content;
					    position: relative;
					    font-size: medium;
					}
					.tag-value .tag-badge{
					    position: absolute;
					    top:-20rpx;
					    right:-40rpx;
					}
					.upper-tag .tag-type{
					    font-size: 22rpx;
					    color: #aaaaaa;
					}
					.dividing-line{
					    width: 1px;
					    height:15px;
					    font-size: smaller;
					    background-color: #959595;
					}
					
				}
				.button-content{
					
					flex-grow: 1;
					padding: 10rpx;
					display: flex;
					text-align: center;
					align-items: center;
					justify-content: center;
					.edit-button{
						margin: 0 10rpx;
						flex-grow: 1;
						text-align: center;
						padding: 10rpx;
						border-radius: 30rpx;
						border: 1rpx solid #F1F1F1;
						color: #FFFFFF;
						font-size: small;
					}
				}
				
			}
			
		}
		.upper-user-ignature{
			margin-left: 3%;
			font-size: 22rpx;
			color: #aaaaaa;
			
		}
		
	}
	
	.no-activity {
		margin-top: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.user-home-page-footer {
		height: 7vh;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.home-page-footer-botton {
		text-align: center;
		color: #fff;
		flex-grow: 1;
		margin: 0 8%;
		border-radius: 20rpx;
		padding: 10rpx;
		background-color: #4eccb8;
		transition: all 300ms;
	}
	.user-lower-half{
		background-color: #000000;
	}
	.lower-my-aciticities{
		columns: 2; // 默认列数
		column-gap:0px; // 列间距
		height: fit-content;
		.activity-item{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			break-inside: avoid;
		}
	}
	
	.no-activity {
	    margin-top: 30%;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    text-align: center;
	    color: #dadada;
	}
</style>
