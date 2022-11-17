<template>
	<view class="page">

		<uni-nav-bar class="upper-head" fixed="true" :border="false" backgroundColor="#ffffff00" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view v-if="userInfo.id" class="username-title">{{userInfo.username}}</view>
			<view @click="onSettingButtonClick" class="nav-left-content" slot="left" style="font-size: 18px;">
				<view>
					<uni-icons customPrefix="customicons" type="settings-filled" color="#fdfdfd" size="25" />
				</view>
			</view>
		</uni-nav-bar>


		<view>
			<!-- 上半部分 -->
			<view class="mine-upper-half" @click="onBackgroundClick" :style="{
				backgroundImage: userInfo.background?`url(${userInfo.background})`:'linear-gradient(to bottom, #e7d3aa, #61c5ae);'
			}">
				<block v-if="userInfo.id">
					<view class="user-info-content" @click.stop="">
						<view class="upper-user-info">
							<view class="user-info-left">
								<!-- 头像 -->
								<view class="upper-user-avater"
									@click.stop="onNavigateTo('/pages/setting/personal_information/personal_information')">
									<image v-if="userInfo.avatar" class="user-avater-image" :src="userInfo.avatar"
										:mode="'aspectFill'"></image>
									<!-- VIP标识 -->
									<view class="vip-logo"
									@click.stop="onVipLogoClick()"
									>
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
									<view class="upper-tag" @click.stop="onFollowedNumberClick">
										<view class="tag-value">
											{{userInfo.attentionSum}}
											<uni-badge v-if="numberChange.followedNumber>0"
												:text="numberChange.followedNumber" type="error" size="small"
												:max-num="99" class="tag-badge">
											</uni-badge>
										</view>
										<view class="tag-type">
											关注
										</view>
									</view>
									<view class='dividing-line'></view>
									<!-- 粉丝数 -->
									<view class="upper-tag" @click.stop="onFansNumberClick">
										<view class="tag-value">
											{{userInfo.beAttentionSum}}
											<uni-badge v-if="numberChange.fansNumber>0" :text="numberChange.fansNumber"
												type="error" size="small" :max-num="99" class="tag-badge">
											</uni-badge>
										</view>
										<view class="tag-type">
											粉丝
										</view>
									</view>
									<view class='dividing-line'></view>
									<!-- 访问数 -->
									<view class="upper-tag" @click.stop="onVisitorNumberClick">
										<view class="tag-value">
											{{userInfo.visitorSum}}
											<uni-badge v-if="numberChange.viewsNumber>0"
												:text="numberChange.viewsNumber" type="error" size="small" :max-num="99"
												class="tag-badge">
											</uni-badge>
										</view>
										<view class="tag-type">
											访客
										</view>
									</view>
								</view>
								<view class="button-content">
									<view v-if="isLogin" class="edit-button"
										@click.stop="onNavigateTo('/pages/setting/personal_information/personal_information')">
										编辑信息
									</view>
									<view v-else class="edit-button"
										@click.stop="onNavigateTo('/pages/login/login')">
										点击登录
									</view>
								</view>
							</view>

						</view>
						<!-- 昵称 -->
						<view class="upper-user-ignature">
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
			<view class="mine-lower-half">

				<!-- 标签 -->
				<custom-tabs :index="tabSelect" :animation="true" tabPadding="40" :flex="true"
					@changeIndex="onTabChange">
					<custom-tab-pane label="动态">
						<scroll-view class="mine-scrollview" :refresher-triggered="isRefresh" :scroll-y="true"
							@scrolltolower="onScrolltolower">
							<!-- 我发布的动态 -->
							<view v-if="myArticles.data.length>0" class="lower-my-aciticities">
								<view :key="item.id" class="activity-item" v-for="(item,index) in myArticles.data">
									<user-activity-item :articleItem="item" :isMe="true" :avatar="userInfo.avatar"
										:username="userInfo.username" @onClick="onActivityItemClick(item)"
										@onMoreClick="onActivityItemMoreClick(item)">
									</user-activity-item>
									</view>
							</view>
							<view v-else class='no-activity'>
								<view class='iconfont icon-xingqiu' :style="{fontSize: '300rpx'}" />
								<view class='no-activity-text'>你还没有发动态哦~</view>
							</view>
						</scroll-view>
					</custom-tab-pane>
					<custom-tab-pane label="赞过">
						<scroll-view class="mine-scrollview" :refresher-triggered="isRefresh" :scroll-y="true"
							@scrolltolower="onScrolltolower">
							<!-- 我赞过的动态 -->
							<view v-if="likedArticles.data.length>0" class="lower-my-aciticities">
								<view :key="item.id" class="activity-item" v-for="(item,index) in likedArticles.data">
									<block v-if="item.isAnonymity!=1&&item.publisher">
										<user-activity-item :articleItem="item" :isMe="item.publisher.id==userInfo.id"
											:avatar="item.publisher.avatar" :username="item.publisher.username"
											@onClick="onActivityItemClick(item)"
											@onMoreClick="onActivityLikedItemMoreClick(item)">
										</user-activity-item>

									</block>
									<block v-else>
										<user-activity-item :articleItem="item" :isMe="false" :avatar="AnonymousAvatar"
											:username="'匿名用户'" @onClick="onActivityItemClick(item)"
											@onMoreClick="onActivityLikedItemMoreClick(item)">
										</user-activity-item>
									</block>
								</view>
							</view>
							<view v-else class='no-activity'>
								<view class='iconfont icon-xingqiu' :style="{fontSize: '300rpx'}" />
								<view class='no-activity-text'>你还没有发动态哦~</view>
							</view>
						</scroll-view>
					</custom-tab-pane>
					
				</custom-tabs>

			</view>
		</view>
		<!-- 动态操作弹出层 -->
		<action-sheet ref="articleActionPopup" :needHead="true" title="动态设置">

			<block v-if="editArticleItem.id">
				<radio-group @change="onPrivaterAdioChange" class="private-select-content">
					<label class="private-select-item" v-for="(item, index) in privateSettingGroup" :key="item">
						<view class="private-text">{{item}}</view>
						<view class="private-radio">
							<radio color="#4eccb8" :value="item" :checked="item === privateSelected" />
						</view>
					</label>
				</radio-group>
				<view @click="onActivityDeleteButtonClick" class='article-action-delete'>删除</view>
			</block>
		</action-sheet>
		<!-- 赞过的动态操作弹出层 -->
		<action-sheet ref="articleLikedActionPopup" :needHead="true" title="动态设置">
			<block v-if="editArticleItem.id">
				<action-sheet-item @click="onPopupReportClick(editArticleItem)" icon="icon-alert" title="举报" />
			</block>
		</action-sheet>
	</view>
</template>

<script lang="ts">
	import {
		MyArticleResult,
		UserInfo,
		MyArticleItem,
		ArticleItem
	} from "@/common/dataClass";
	import {
		REQUEST_SUCCEEDED_CODE,
		privateSettingGroup,
		UploadUrl,
		AnonymousAvatar,
		reportObjectType
	} from "@/common/constants";
	import {
		request
	} from "@/utils/request";
	import {
		getMyUserInfo
	} from "@/common/storageFunctions";
	import aes from '@/utils/aes/export';
	import {
		deleteMyArticle,
		getUserinfo,
	} from "@/common/requestFunctions"
	import {
		USER_INFO,
		getFansNumberChangedKey,
		getFollowedNumberChangedKey,
		getViewsNumberChangedKey,
	} from "@/common/storageKeys"
	import {
		REFRESH_USERINFO,
		LOGOUT
	} from "@/common/globalMsgKeys";
	import {
		changeUnreadMessageSum
	} from "@/utils/tabBarBadgeUtils";
	/**
	 * mine 我的界面
	 * @description 我的界面
	 * @Author: 穆兰
	 * @Date: 2022/1/4
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				isLogin:true,
				AnonymousAvatar,
				privateSettingGroup, //隐私设置选项
				privateSelected: privateSettingGroup[0], //选择的隐私的设置
				isRefresh: false, //是否刷新
				userInfo: {} as UserInfo, //用户信息
				tabSelect: 0,
				myArticles: {
					data: [] as MyArticleItem[],
					page: 1,
					haveMore: true,
				}, //我发布的动态
				likedArticles: {
					data: [] as ArticleItem[],
					page: 1,
					haveMore: true,
				},
				editArticleItem: {} as MyArticleItem, //需要进行设置的动态
				numberChange: {
					followedNumber: 0,
					fansNumber: 0,
					viewsNumber: 0
				}, //关注、粉丝、访客数的变化
				lastClickTime: 0, //最后一次点击的时间，防止重复点击
			};
		},
		async onLoad() {
			let userInfo = await getMyUserInfo()
			if(!userInfo){
				this.userInfo={
					attentionSum: 0,
					visitorSum: 0,
					beAttentionSum: 0,
					avatar: AnonymousAvatar,
					id: -1,
					registerDay: 0,
					username: '未登录',
					isVerify: 0
				}
				this.isLogin = false
				return
			}else{
				this.userInfo = userInfo
				this.isLogin = true
				this.refreshUserInfo()
				changeUnreadMessageSum()
			}
		},
		async onShow() {
			let _this = this
			uni.$once(REFRESH_USERINFO, function(data) {
				if (data.needRefresh) {
					_this.refreshUserInfo()
				}
			})
			uni.$once(LOGOUT, function(data) {
				if (data.logout) {
					_this.userInfo={
						attentionSum: 0,
						visitorSum: 0,
						beAttentionSum: 0,
						avatar: AnonymousAvatar,
						id: -1,
						registerDay: 0,
						username: '未登录',
						isVerify: 0
					}
					_this.isLogin = false
					_this.myArticles.data = []
					_this.myArticles.page = 1
				}
			})
		},
		methods: {
			/**
			 * @description 跳转到指定页面
			 * @param {string} url 页面跳转的url
			 */
			onNavigateTo(page_url) {
				uni.navigateTo({
					url: page_url
				})
			},
			/**
			 * @description  刷新用户信息
			 */
			async refreshUserInfo() {
				this.userInfo = await getMyUserInfo() as UserInfo
				if (!this.userInfo) {
					uni.showModal({
						title: '未登录',
						content: '未登录请先登录',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/login"
								})
							}
						}
					})
					this.myArticles.data = []
					this.myArticles.page = 1

				} else {
					this.myArticles.page = 1
					this.initNumberChange(this.userInfo)
					this.getMyArticle(this.userInfo.id, this.myArticles.page)

				}

			},
			/**
			 * @description 初始化关注、粉丝、和访客的数据
			 * @param {UserInfo} userInfo 用户之前缓存的数据
			 */
			async initNumberChange(userInfo: UserInfo) {
				//获取key
				let FOLLOWED_NUMBER_CHANGED = getFollowedNumberChangedKey(userInfo.id)
				let FANS_NUMBER_CHANGED = getFansNumberChangedKey(userInfo.id)
				let VIEWS_NUMBER_CHANGED = getViewsNumberChangedKey(userInfo.id)
				//读取数据
				let followedNumberChanged = uni.getStorageSync(FOLLOWED_NUMBER_CHANGED) as number
				let fansNumberChanged = uni.getStorageSync(FANS_NUMBER_CHANGED) as number
				let viewsNumberChanged = uni.getStorageSync(VIEWS_NUMBER_CHANGED) as number
				//为null则设置为0
				if (!followedNumberChanged) followedNumberChanged = 0
				if (!fansNumberChanged) fansNumberChanged = 0
				if (!viewsNumberChanged) viewsNumberChanged = 0
				//进行修改
				let userInfoNow = await getUserinfo(userInfo.id)
				if (userInfoNow) {
					this.userInfo = userInfoNow
					followedNumberChanged = userInfoNow.attentionSum - userInfo.attentionSum + followedNumberChanged
					fansNumberChanged = userInfoNow.beAttentionSum - userInfo.beAttentionSum + fansNumberChanged
					viewsNumberChanged = userInfoNow.visitorSum - userInfo.visitorSum + viewsNumberChanged
					//保存修改后的数据
					uni.setStorage({
						key: USER_INFO,
						data: userInfoNow
					})
					uni.setStorage({
						key: FOLLOWED_NUMBER_CHANGED,
						data: followedNumberChanged > 0 ? followedNumberChanged : 0
					})
					uni.setStorage({
						key: FANS_NUMBER_CHANGED,
						data: fansNumberChanged > 0 ? fansNumberChanged : 0
					})
					uni.setStorage({
						key: VIEWS_NUMBER_CHANGED,
						data: viewsNumberChanged > 0 ? viewsNumberChanged : 0
					})
					this.numberChange = {
						followedNumber: followedNumberChanged,
						fansNumber: fansNumberChanged,
						viewsNumber: viewsNumberChanged
					}
				}
			},
			/**
			 * @description 点击设置按钮
			 */
			onSettingButtonClick() {
				uni.navigateTo({
					url: "/pages/setting/setting"
				})
			},
			/**
			 * @description 点击背景图
			 */
			onBackgroundClick() {
				let clickTime = Date.now()
				if (clickTime - this.lastClickTime > 1000) {
					this.lastClickTime = clickTime
				} else {
				 return
				}
				if (!this.userInfo) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
				}
				if (!this.userInfo.vip || this.userInfo.vip.remainDays < 1) {
					uni.showToast({
						title: '只有vip用户可以更换背景哦~',
						icon: 'none'
					})
					return
				}
				let _this = this
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFiles = res.tempFilePaths
						_this.changeBackgroud(tempFiles[0])
					}
				})
			},
			/**
			 * @description 点击关注数
			 */
			onVipLogoClick(){
				uni.navigateTo({
					url: "/pages/setting/bugu-vip/bugu-vip"
				})
			},
			/**
			 * @description 点击关注数
			 */
			onFollowedNumberClick() {
				if (this.userInfo) {
					uni.navigateTo({
						url: "/pages/mine-secondary-page/follow-list/follow-list"
					})
					this.numberChange.followedNumber = 0
				}
			},
			/**
			 * @description 点击粉丝数
			 */
			onFansNumberClick() {
				if (this.userInfo) {
					uni.navigateTo({
						url: "/pages/mine-secondary-page/fan-list/fan-list"
					})
					this.numberChange.fansNumber = 0
				}
			},
			/**
			 * @description 点击访客数
			 */
			onVisitorNumberClick() {
				if (this.userInfo) {
					uni.navigateTo({
						url: "/pages/mine-secondary-page/visitor-list/visitor-list"
					})
					this.numberChange.viewsNumber = 0
				}
			},
			/**
			 * @description  标签页改变时
			 * @param {number} index 
			 */
			async onTabChange(index) {
				this.tabSelect = index
				if (index == 1) {
					if (this.likedArticles.data.length < 1 && this.likedArticles.haveMore) {
						this.likedArticles.page = 1
						let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page)
						if (articles.length > 0) {
							this.likedArticles.data = articles
						} else {
							this.likedArticles.haveMore = false
						}
					}
				}

			},
			/**
			 * @description 下拉刷新我的动态和信息
			 */
			async onRefresh() {
				this.isRefresh = true
				this.initNumberChange(this.userInfo)
				this.myArticles.page = 1
				this.likedArticles.page = 1
				this.getMyArticle(this.userInfo.id, this.myArticles.page)
				let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page)
				if (articles.length > 0) {
					this.likedArticles.data = articles
				} else {
					this.likedArticles.haveMore = false
				}
			},
			/**
			 * @description 点击选择某个隐私权限选项
			 */
			async onPrivaterAdioChange(evt) {
				this.privateSelected = evt.detail.value
				let visibility = this.privateSettingGroup.indexOf(this.privateSelected)
				if (this.editArticleItem.id) {
					uni.showLoading({
						title: "权限修改中"
					})
					let res = await this.ChangeVisibility(this.editArticleItem.id, visibility)
					uni.hideLoading()
					if (res) {
						let myArticles = this.myArticles.data

						for (let i = 0; i < myArticles.length; i++) {
							if (myArticles[i].id == this.editArticleItem.id) {
								myArticles[i].visibility = visibility
								break
							}
						}
						this.myArticles.data = myArticles
						uni.showToast({
							title: "可见性修改成功！"
						})
						this.$refs.articleActionPopup.close()
					} else {
						this.privateSelected = this.privateSettingGroup[this.editArticleItem.visibility]
					}
				}

			},
			/**
			 * @description 点击删除按钮
			 */
			onActivityDeleteButtonClick() {
				if (this.editArticleItem.id) {
					let _this = this
					uni.showModal({
						title: "删除动态",
						content: "你确定要删除这个动态吗",
						confirmText: "确定",
						cancelText: "取消",
						success: async function(res) {
							if (res.confirm) {
								uni.showLoading({
									title: "权限修改中"
								})
								let res = await deleteMyArticle(_this.editArticleItem.id)
								uni.hideLoading()
								if (res) {
									let myArticles = _this.myArticles.data
									for (let i = 0; i < myArticles.length; i++) {
										if (myArticles[i].id == _this.editArticleItem.id) {
											myArticles.splice(i, 1)
											break
										}
									}
									_this.myArticles.data = myArticles
									uni.showToast({
										title: "删除成功！"
									})
									_this.$refs.articleActionPopup.close()
								}
							}
						}
					})

				}
			},
			/**
			 * @description 点击popup的举报按钮
			 * @param {ArticleItem} item
			 */
			onPopupReportClick(item: ArticleItem) {
				uni.navigateTo({
					url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${reportObjectType.activity}`
				})
				this.$refs.articleLikedActionPopup.close()
			},
			/**
			 * @description 点击单个动态
			 * @param {MyArticleItem} item
			 */
			onActivityItemClick(item: MyArticleItem) {
				uni.navigateTo({
					url: `/pages/activity-info/activity-info?activityId=${item.id}`
				})

			},
			/**
			 * @description 点击单个动态的更多按钮
			 * @param {MyArticleItem} item
			 */
			onActivityItemMoreClick(item: MyArticleItem) {
				this.editArticleItem = item
				this.privateSelected = this.privateSettingGroup[item.visibility]
				this.$refs.articleActionPopup.open()
			},
			/**
			 * @description 点击单个动态的更多按钮
			 * @param {ArticleItem} item
			 */
			onActivityLikedItemMoreClick(item: MyArticleItem) {
				this.editArticleItem = item
				this.$refs.articleLikedActionPopup.open()
			},
			/**
			 * @description 上拉获取之前发布的动态
			 */
			async onScrolltolower() {
				if (this.tabSelect == 0) {
					if (!this.myArticles.haveMore) { //没有更多时不进行请求
						return
					}
					this.myArticles.page = this.myArticles.page + 1
					this.getMyArticle(this.userInfo.id, this.myArticles.page)
				} else if (this.tabSelect == 1) {
					this.likedArticles.page = this.likedArticles.page + 1
					let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page)
					if (articles.length > 0) {
						this.likedArticles.data = this.likedArticles.data.concat(articles)
					} else {
						this.likedArticles.haveMore = false
					}
				}

			},
			/**
			 * @description 获取我的动态
			 * @param userId 用户的id
			 * @param page 页号
			 */
			async getMyArticle(userId: number, page: number) {
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
				setTimeout(() => {
					this.isRefresh = false
				}, 700)
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let result = res.data.data as MyArticleResult
					let artices = res.data.data.list as MyArticleItem[]
					if (page <= result.pageSum) {
						if (page == 1) {
							this.myArticles.data = artices
						} else {
							this.myArticles.data = this.myArticles.data.concat(artices)
						}
						if (page == result.pageSum) {
							this.myArticles.haveMore = false
						} else {
							this.myArticles.haveMore = true
						}
					} else {
						this.myArticles.page = this.myArticles.page - 1
						this.myArticles.haveMore = false
					}
				}
			},
			/**
			 * @description 获取我赞过的动态
			 * @param {number} userId 用户的id
			 * @param {number} page 页号
			 * @return {Promise<ArticleItem[]>}
			 */
			async getMyLikedArticle(userId: number, page: number) {
				let res = await request({
					data: {
						method: 'GET',
						group: 'activity',
						action: `uLikeActivity`,
						data: {
							uid: userId,
							startPage: page,
							pageSize: 8
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值
						},
					}
				});

				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let articles = res.data.data as ArticleItem[]
					return articles
				} else {
					return []
				}
			},
			/**
			 * @description 修改指定动态的可见性
			 * @param {number} ArticleId 动态的id
			 * @param {number} visibility 可见状态 0-所有人可见，1-主页可见，2-仅自己可见
			 */
			async ChangeVisibility(ArticleId: number, visibility: number) {
				let res = await request({
					data: {
						method: 'POST',
						group: 'activity',
						action: `${ArticleId}/visibility/change`,
						data: {
							id: ArticleId,
							visibility: visibility
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值

						},
					}
				});
				if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					return true
			 } else {
					return false
				}
			},
			/**
			 * @description 更换背景图
			 * @param {string} fileUrl 文件链接
			 */
			async changeBackgroud(fileUrl: string) {
				uni.showLoading({
					title: '正在发布',
				})
			 //先获取上传图片的凭证
				let res = await request({
					data: {
						method: 'GET',
						group: 'user',
			  	action: 'background/token',
						data: {

						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', // 默认值

						},
					},
				})
			 if (res.data.code === REQUEST_SUCCEEDED_CODE) {
					let fileName = res.data.data.fileName
					let fileToken = res.data.data.token
					let _this = this
					uni.uploadFile({
						url: UploadUrl,
						filePath: fileUrl,
						name: 'file',
						formData: {
			 			'key': fileName,
			 			'token': aes.decrypt(fileToken)
						},
						async success(fileRes) {
							let backgroundChangeRes = await request({
								data: {
									method: 'POST',
									group: 'user',
									action: 'background/update',
									data: {
										background: fileName
									},
									header: {
										'content-type': 'application/x-www-form-urlencoded', // 默认值
									},
								},
							})
			  		if (backgroundChangeRes.data.code === REQUEST_SUCCEEDED_CODE) {
								uni.showToast({
									title: '更换背景成功'
								})
								_this.refreshUserInfo()
							} else {

							}
						}
					})
				} else {
					uni.showToast({
						title: "没有权限，请先登录",
						icon: 'none'
					})
					return
				}
			}
		},

	}
</script>

<style lang="scss">
	.upper-head {
		position: absolute;
		top: 0;
		z-index: 100;
	}

	.username-title {
		width: 100%;
		text-align: center;
		color: #FFFFFF;
		font-size: 35rpx;
		font-weight: 500;

	}

	.nav_bar {
		opacity: 0;
	}

	.nav-left-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bar {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
	}

	.navigation-bar-box {

		position: relative;
		margin-left: 2%;
	}

	.setting-button-content {
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.set-avatar-button {
		height: 80px;
		text-align: center;
		font-size: 30px;

	}

	.mine-scrollview {
		height: 100vh;
		width: 100vw;
		background-color: #000000;
	}

	.mine-upper-half {
		position: relative;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-color: #000000;
		background-image: linear-gradient(to bottom, #e7d3aa, #61c5ae);
		height: 50vh;


	}

	.user-info-content {
		width: 94%;
		position: absolute;
		bottom: 0;
		padding: 3%;
		background-image: linear-gradient(to bottom, #00000000, #000000 50%);
		.upper-user-info {
			display: flex;
			text-align: center;
			justify-content: center;
			align-items: center;
			height: fit-content;
			.user-info-left {
				width: 200rpx;
				height: 200rpx;
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
				.upper-user-avater {
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
					.vip-logo {
						position: absolute;
						height: fit-content;
						width: fit-content;
						bottom: -5px;
						right: -5px;
					}
					.user-avater-image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 50%;
					}
				}
			}

			.user-info-right {
				flex-grow: 1;
				height: 200rpx;
				display: flex;
				flex-direction: column;

				.upper-tags-group {
					flex-grow: 1;
					display: flex;
					text-align: center;
					align-items: center;
					justify-content: center;

					.upper-tag {
						width: 100%;
						text-align: center;
						flex-grow: 1;
						color: #fff;
						font-size: medium;
					}

					.tag-value {
						margin: 0 auto;
						width: fit-content;
						position: relative;
						font-size: medium;
					}

					.tag-value .tag-badge {
						position: absolute;
						top: -20rpx;
						right: -40rpx;
					}

					.upper-tag .tag-type {
						font-size: 22rpx;
						color: #aaaaaa;
					}

					.dividing-line {
						width: 1px;
						height: 15px;
						font-size: smaller;
						background-color: #959595;
					}

				}

				.button-content {

					flex-grow: 1;
					padding: 10rpx;
					display: flex;
					text-align: center;
					align-items: center;
					justify-content: center;

					.edit-button {
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

		.upper-user-ignature {
			margin-left: 3%;
			font-size: 22rpx;
			color: #aaaaaa;

		}

	}

	.upper-registration-days {
		margin-top: 10px;
		font-size: medium;

		color: #fff;
	}

	.upper-head {
		z-index: 100;
	}

	.mine-lower-half {
		background-color: #000000;
	}

	.lower-my-aciticities {
		min-height: 101vh;
		columns: 2; // 默认列数
		column-gap: 0px; // 列间距
		height: fit-content;

		.activity-item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			break-inside: avoid;
		}
	}

	.no-activity {
		margin-top: 10%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #dadada;
	}

	.article-action-delete {
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 2%;
		margin-bottom: 2%;
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

	.private-select-content {
		line-height: 60rpx;
		height: fit-content;

		.private-select-item {
			display: flex;
			align-items: center;
			padding: 20rpx;

			.private-text {
				flex-grow: 1;
				font-size: large;
			}

			.private-radio {}
		}
	}
</style>
