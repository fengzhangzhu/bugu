<template>
	<view class="page">
		<uni-nav-bar left-icon="back" class="nav_bar" fixed="true" backgroundColor="#fff" color="#808080"
			statusBar='true' @clickLeft="onNarLeftClick()">
			<view class="bar-title">帮助与反馈</view>
		</uni-nav-bar>
		<uni-collapse accordion>
		    <uni-collapse-item title="为什么要进行身份认证？">
				<view class="answer-content">
					<text>我们竭力创造一个真实、安全、和谐的社交平台，只有对每一位用户都严格核实身份后我们才能保证社区的真实性，保障每一位用户的安全</text>
				</view>
		    </uni-collapse-item>
		    <uni-collapse-item title="其他人可以看到我的真实身份吗？">
				<view class="answer-content">
					<text>您在身份认证界面上传的资料仅用于身份核实，身份核实完成后我们会加密保存，其他人不会看到您的真实身份信息</text>
				</view>
		    </uni-collapse-item>
		    <uni-collapse-item title="为什么性别设置后不能修改？">
				<view class="answer-content">
					<text>为了用户安全和各类活动参与的真实性，性别一旦进行设置后无法自主修改哦，如果您的性别设置错误，请联系客服上传证明材料修改</text>
				</view>
		    </uni-collapse-item>
			<uni-collapse-item title="为什么我的账户被禁言/封禁？">
				<view class="answer-content">
					 <text>您的公开言论收到平台和社区用户的监督，当您频繁发布违法、侮辱、歧视、谣言、政治敏感等信息时会受到举报和平台的处罚， 如果您并没有发布以上信息，请联系客服进行核实和恢复账号权益</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class='more-question'>
			<text selectable>
				如果您还有其他问题请添加客服QQ：3357936383
			</text>
		</view>
	</view>
</template>

<script>
	/**
	 * help 帮助界面
	 * @description 帮助界面
	 * @Author: 穆兰
	 * @Date: 2022/1/10
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/10
	 */
	export default {
		data() {
			return {
				/**
				 *@description 点击返回按钮 
				 */
				onNarLeftClick() {
					uni.navigateBack({
						delta: 1
					});
				},
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">

.answer-content{
	padding: 10rpx 20rpx;
}

.more-question{
    margin: 20px;
    text-align: center;
}
</style>
