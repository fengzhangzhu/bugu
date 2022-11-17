<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './static/css/iconfonts/iconfont.css';
	.status_bar {
		height: var(--status-bar-height);
		background-color: #fff;
		
	}
	.bar-title {
	  font-size: 17px;
	  width: 100%;
	  text-align: center;
	  font-size: small;
	  font-weight: 600;
	  color: #262626;
	}
	.page {
	background-color: #f9f9f9;
	min-height: 100vh;
	position: relative;
	}
	.scrollview {
		height: 89vh;
		width: 100vw;
		overflow-anchor: auto;
	}
	
	

	.avatar{
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	background-color: #3bd8bf;
	}
	.comment-action-sheet{
	    position:absolute;
	    bottom: 0;
	}
	.main-color{
		background-color: #4eccb8;
	}
	.title-color{
		color: #808080;
	}
</style>
