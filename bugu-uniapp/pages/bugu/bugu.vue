<template>
	<view>
		<uni-nav-bar statusBar='true' class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080">
			<view class="bar-title">布咕</view>
		</uni-nav-bar>

		<view class="bugu-page-content">
			<!-- 头部banner -->
			<view class="bugu-banner-content">
				<swiper class="bugu-banner" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					:duration="duration">
					<swiper-item v-for="item in bannerList" :key="item.id">
						<image class="bugu-banner-image" :src="item.pic" :model="'scaleToFill'" @error="imageError">
						</image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 活动卡片 -->
			<view class="interactive-cards">
				<!-- 左半部分 -->
				<view class="left-cards">
					<!-- 天气卡片 -->
					<view class="weather-card">
						<view class="city-info-content">
							<view class="city-info">
								<text>{{weatherResult.city}}</text>
							</view>
						</view>
						<view class="weather-info">

							<view class="weather-text">
								<text>{{timeNow}} {{weatherResult.weather}}</text>
							</view>
							<view class="weather-text">
								<text>{{weatherResult.winddirection}}风 {{weatherResult.windpower}}级</text>
							</view>
							<view class="weather-text">
								<text>湿度 {{weatherResult.humidity}}%</text>
							</view>

						</view>
						<view class="weather-temperature">
							<image v-if="weatherIcon" :src="`/static/weather/${weatherIcon}.png`" :model="'scaleToFill'"
								class="weather-icon" />
							<view class="temperature-text">
								<text>{{weatherResult.temperature}}℃</text>
							</view>

						</view>
					</view>
					<view class="lucky-draw-1" 
					@click="onNightPhoneClick()"
					>
						<image src="/static/svgs/Support.svg" mode="aspectFill" class="draw-icon-left">
						</image>
						<view class="right-lucky-draw-title-content">
							<view class="lucky-draw-title"> 晚安电话 </view>
							<image class="lucky-draw-icon" mode="aspectFill" src="/static/svgs/invitation.svg">
							</image>
						</view>
					</view>
					<!-- 签到抽奖 -->
					<view class="lucky-draw-0" @click="onSignCardClick()">
						<image src="/static/svgs/Deadline.svg" :mode="'aspectFill'" class="draw-icon-left">
						</image>
						<view class="left-lucky-draw-title-content">
							<view class="lucky-draw-title"> 签到抽奖 </view>
							<image class="lucky-draw-icon" mode="aspectFill" src="/static/svgs/medal.svg">
							</image>
						</view>
					</view>
					
				</view>
				<!-- 右半部分 -->
				<view class="right-cards">
					<view class="lucky-draw-0" @click="onBoxCardClick()">
						<image src="/static/svgs/Email.svg" mode="aspectFill" class="draw-icon-right">
						</image>
						<view class="right-lucky-draw-title-content">
							<view class="lucky-draw-title"> 互动盒子 </view>
							<image class="lucky-draw-icon" mode="aspectFill" src="/static/svgs/box.svg">
							</image>
						</view>
					</view>
					<view @click="OnInviteClick()" class="lucky-draw-1">
						<image src="/static/svgs/Hello.svg" mode="aspectFill" class="draw-icon-left">
						</image>
						<view class="right-lucky-draw-title-content">
							<view class="lucky-draw-title"> 邀请获奖 </view>
							<image class="lucky-draw-icon" mode="aspectFill" src="/static/svgs/invitation.svg">
							</image>
						</view>
					</view>
					<view class="lucky-draw-2" >
						
						<view class="title-content">
							<view class="title">更多活动, </view>
							<view class="title">敬请期待... </view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang='ts'>
	import {
		REQUEST_SUCCEEDED_CODE,
		TitleColor,
	} from "@/common/constants";
	import {
		request,
		getWeatherInfo
	} from "@/utils/request";
	import {
		GetNowDate
	} from "@/utils/dateUtils";
	import {
		changeUnreadMessageSum
	} from "@/utils/tabBarBadgeUtils";
	import {
		getInviteUserCode
	} from "@/common/requestFunctions";
	interface BannerItem {
		id: number;
		pic: string;
	}

	interface Forecast {
		date ? : string;
		fengli ? : string;
		fengxiang ? : string;
		high ? : string;
		low ? : string;
		type ? : string;
	}
	interface WeatherResult {
		adcode: string,
			city: string,
			humidity: string,
			province: string,
			reporttime: string,
			temperature: string,
			weather: string,
			winddirection: string,
			windpower: string,
	}
	const Keywords = {
		'sunny': /晴/,
		'shower': /阵雨/,
		'thunder-shower': /雷阵雨/,
		'overcast': /阴/,
		'cloudy': /多云/,
		'rainy-storm': /暴雨/,
		'raniy-large': /大雨/,
		'raniy-lightning': /雷|电/,
		'raniy-mid': /中雨/,
		'raniy-small': /小雨/,
		'snow-small': /小雪|雪/,
		'snow-mid': /中雪/,
		'sleet': /雨夹雪/,
		'snow-large': /大雪/,
		'fog': /雾/,
		'smog': /霾/
	}
	/**
	 * bugu 布咕界面
	 * @description 布咕界面-用于展示一些活动
	 * @Author: 穆兰
	 * @Date: 2021/12/27
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/17
	 */
	export default {
		data() {
			return {
				nbTitle: "布咕",
				backgroundColor: "#fff",
				frontColor: TitleColor,
				bannerList: [] as BannerItem[],
				weatherResult: {
					adcode: "110108",
					city: "武汉",
					humidity: "N/A",
					province: "湖北",
					reporttime: "",
					temperature: "N/A",
					weather: "N/A",
					winddirection: "N/A",
					windpower: "N/A",
				} as WeatherResult,
				helloText: "",
				timeNow: "",
				weatherIcon: "",
				InviteCode:""
			};
		},
		onShow() {
			changeUnreadMessageSum()
		},
		//#ifdef MP-WEIXIN
	  /**
		* 
		* @function 分享给好友 
		*/
		onShareAppMessage() {
	
			return {
				title: "布咕星球",
				path: `/pages/index/index?inviteCode=${this.InviteCode}`,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
				imageUrl: '' // 图片q路径
			};
	
		},
		/**
		 * 
		 * @function 分享到朋友圈 
		 */
		onShareTimeline() {
			return {
				title: "布咕星球",
				path: `/pages/index/index?inviteCode=${this.InviteCode}`
			}
		},
		//#endif
		methods: {
			/**
			 * @description 点击签到抽奖
			 */
			onSignCardClick() {
				uni.navigateTo({
					url: '/pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery',
				});
			},
			/**
			 * @description 点击互动盒子
			 */
			onBoxCardClick() {
				uni.navigateTo({
					url: '/pages/bugu-secondary-page/blind-box/blind-box',
				});
			},
			/**
			 * @description 点击晚安电话
			 */
			onNightPhoneClick(){
				uni.showModal({
					title: '晚安电话',
					content: '未到开放时间哦~',
					
				})
			},
			/**
			 * @description 点击邀请获奖
			 */
			OnInviteClick(){
				uni.showModal({
					title: '邀请获奖',
					content: '点击右上角将布咕星球分享给好友，好友点开链接并登录，你可以获取5天vip哦~',
					
				})
			}
		},
		async mounted() {
			this.bannerList = await getBannerList();
			this.helloText = getHellowText();
			this.timeNow = GetNowDate().MonthAndDay;
			this.InviteCode = await getInviteUserCode()
			let _this =this
			uni.getLocation({
			    type: 'wgs84',
			    success: async function (res) {
			        let weatherInfo = await getWeather(res.latitude,res.longitude);
					if (weatherInfo) {
					
						_this.weatherResult = weatherInfo.weatherResult;
						_this.weatherIcon = weatherInfo.weatherIcon;
					}
			    }
			});
			
		},
	};
	/**
	 * @description 获取天气信息
	 * @returns
	 */
	async function getWeather(latitude:number,longitude:number) {
		// 临时天气api
		let res = await getWeatherInfo(latitude,longitude);
		if (res.data.code === "0000") {
			let weatherResult = res.data.data.lives[0] as WeatherResult;
			let weatherIcon = "";
			for (let weather in Keywords)
				if (Keywords[weather].test(weatherResult.weather))
					weatherIcon = weather;
			return {
				weatherResult,
				weatherIcon,
			};
		}
	}
	/**
	 * @description 获取轮播图列表
	 * @returns {Promise<BannerItem[]>}
	 */
	async function getBannerList(): Promise < BannerItem[] > {
		let res = await request({
			data: {
				method: "GET",
				group: "banner",
				action: "list",
				data: {},
				header: {
					"content-type": "application/x-www-form-urlencoded", // 默认值
				},
			},
		});
		if (res.data.code === REQUEST_SUCCEEDED_CODE) {
			return res.data.data as BannerItem[];
		} else {
			return [];
		}
	}
	/**
	 *
	 * @description 获取欢迎语
	 * @returns {string}
	 */
	function getHellowText(): string {
		let date = new Date();
		if (date.getHours() >= 0 && date.getHours() < 12) {
			return "Good morning";
		} else if (date.getHours() >= 12 && date.getHours() < 18) {
			return "Good afternoon";
		} else {
			return "Good evening";
		}
	}
</script>

<style lang="scss">
	.bar-title {
		width: 100%;
		text-align: center;
		font-size: 20px;
	}

	.bugu-page-content {
		margin: 20rpx 30rpx;
	}

	.bugu-banner-content {
		box-shadow: 10rpx 10rpx 5rpx #d4d4d4;
		height: 44vw;
		border-radius:20rpx;
		overflow: hidden;
	}

	.bugu-banner {
		height: 100%;
		width: 100%;
		border-radius: 20rpx;
	}

	.bugu-banner-image {
		height: 100%;
		width: 100%;
		border-radius: 20rpx;
	}

	.interactive-cards {
		width: 100%;
		margin-top: 2vh;
		display: flex;
		justify-content: flex-start;

		.left-cards {
			flex: 1;
			margin-right: 10rpx;
		}

		.right-cards {
			margin-left: 10rpx;
			flex: 1;
		}
	}

	.lucky-draw-0 {
		box-shadow: 10rpx 10rpx 5rpx #d4d4d4;
		margin-top: 20rpx;
		height: 66vw;
		border-radius: 20rpx;
		background-image: linear-gradient(to bottom, #42e1e3, #40e399);
		position: relative;
		overflow: hidden;

		.left-lucky-draw-title-content {
			position: absolute;
			width: 140rpx;
			height: 140rpx;
			background-color: #ffd5a9;
			top: 20rpx;
			right: 20rpx;
			border-radius: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;

			.lucky-draw-title {
				width: 70%;
				height: 70%;
				position: absolute;
				left: 0rpx;
				font-size: large;
				font-weight: bold;
				z-index: 100;
				color: #868686;
			}

			.lucky-draw-icon {
				height: 90%;
				width: 90%;
				opacity: 0.5;
			}
		}

		.right-lucky-draw-title-content {
			position: absolute;
			width: 140rpx;
			height: 140rpx;
			background-color: #ffd5a9;
			top: 20rpx;
			left: 20rpx;
			border-radius: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;

			.lucky-draw-title {
				width: 70%;
				height: 70%;
				position: absolute;
				right: -15px;
				font-size: large;
				font-weight: bold;
				z-index: 100;
				color: #868686;
			}

			.lucky-draw-icon {
				height: 90%;
				width: 90%;
				opacity: 0.5;
			}
		}

		.draw-icon-left {
			position: absolute;
			width: 45vw;
			height: 45vw;
			left: -40rpx;
			bottom: -30rpx;
			opacity: 0.7;
			z-index: 5;
			transform: rotateY(180deg);
			/* 水平镜像翻转 */
		}

		.draw-icon-right {
			position: absolute;
			width: 50vw;
			height: 50vw;
			right: -90rpx;
			bottom: -40rpx;
			opacity: 0.7;
			z-index: 5;
		}
	}

	.lucky-draw-1 {
		box-shadow: 10rpx 10rpx 5rpx #d4d4d4;
		margin-top: 20rpx;
		height: 44vw;
		border-radius: 20rpx;
		background-color: #f9e1c7;
		position: relative;
		overflow: hidden;

		.draw-icon-left {
			position: absolute;
			width: 50vw;
			height: 50vw;
			left: -40rpx;
			bottom: -20vw;
			opacity: 0.7;
			z-index: 5;
			transform: rotateY(180deg);
			/* 水平镜像翻转 */
		}

		.draw-icon-right {
			position: absolute;
			width: 45vw;
			height: 45vw;
			right: -40rpx;
			z-index: 5;
			bottom: -30vw;
		}

		.right-lucky-draw-title-content {
			position: absolute;
			width: 140rpx;
			height: 140rpx;
			background-color: #4eccb8;
			top: 20rpx;
			right: 20rpx;
			border-radius: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;

			.lucky-draw-title {
				width: 70%;
				height: 70%;
				position: absolute;
				left: 0rpx;
				font-size: large;
				font-weight: bold;
				z-index: 100;
				color: #868686;
			}

			.lucky-draw-icon {
				height: 90%;
				width: 90%;
				opacity: 0.5;
			}
		}
	}
	.lucky-draw-2 {
		box-shadow: 10rpx 10rpx 5rpx #d4d4d4;
		margin-top: 20rpx;
		height: 22vw;
		border-radius: 20rpx;
		background-color: #f9e1c7;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.title-content{
			width: 30vw;
			text-align: left;
			font-size: large;
			font-weight: bold;
			color: #868686;
		}
	}
	
	.weather-card {
		box-shadow: 10rpx 10rpx 5rpx #d4d4d4;
		margin-top: 20rpx;
		height: 22vw;
		border-radius: 20rpx;
		background-color: #f9e1c7;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.city-info-content {
			width: 80rpx;
			align-items: center;
			display: flex;
			padding-top: 2%;
			padding-bottom: 2%;
			.city-info {
				writing-mode: vertical-rl;
				color: #000000;
				margin: 0 auto;
				font-size: 34rpx;
				letter-spacing: 10rpx;
			}
		}

		.weather-info {
			padding-top: 2vw;
			flex: 4;
			color: #000000;
			display: flex;
			flex-direction: column;
			letter-spacing: 5rpx;
			height: 20vw;
			.weather-text {
				flex-grow: 1;
				display: block;
				font-size: 20rpx;
			}

		}

		.weather-temperature {
			width: 80rpx;
			line-height: 1.5;
			text-align: center;
			.weather-icon {
				width: 70rpx;
				height: 70rpx;
			}

			.temperature-text {
				text-align: center;
				font-weight: bold;
			}
		}
	}

	.lucky-draw-0:hover {
		box-shadow:none;
	}

	.lucky-draw-1:hover {
		box-shadow: none;
	}

	.weather-card:hover {
		box-shadow: none;
	}
</style>>
