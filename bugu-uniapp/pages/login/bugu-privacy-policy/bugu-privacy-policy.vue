<template>
	<view>
		<web-view
		:src="PrivacyPolicyUrl"
		></web-view>
	</view>
</template>

<script>
	import {PrivacyPolicyUrl} from "@/common/constants"
	export default {
		data() {
			return {
				PrivacyPolicyUrl
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
