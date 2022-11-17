<template>
	<view>
		<web-view
		:src="UseProtocolUrl"
		></web-view>
	</view>
</template>

<script>
	import {UseProtocolUrl} from "@/common/constants"
	export default {
		data() {
			return {
				UseProtocolUrl
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>