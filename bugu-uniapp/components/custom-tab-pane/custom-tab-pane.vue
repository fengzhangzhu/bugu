<template>
	<view class="tab-pane">
		<slot></slot>
	</view>
</template>
<script>
	export default {
		props: ['label'],
		setup(props, context) {
			uni.$emit('getTabLabel', props.label);
		}
	}
</script>
<style scoped>
	.tab-pane {
		width: 750rpx;
		flex-shrink: 0;
	}
</style>
