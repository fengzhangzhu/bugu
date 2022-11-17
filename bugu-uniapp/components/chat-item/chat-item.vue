<template>
	<view>
		<view v-if="messageType==-1" class="message-withdraw">
			{{chatText}}
		</view>
		<block v-else>
			<view :class="isMe?'chat-item-me-content':'chat-item-content'">
				<view >
					<image mode="aspectFill" class='chat-avatar' :src="avatarUrl+avatar_pic_hendle" />
				</view>
				<view @longpress="onLongPress" class='chat-text'>
						<view v-if="messageType==1">
							<image :style="{
							   height: '60vw',
							   maxWidth:'60vw'}" 
							   lazyLoad mode='heightFix' 
								:src="chatText"
								@click="onImageClick"
								/>
						</view>
						<view v-else-if="messageType==2" class='chat-voice'
						  :style="{width:`${voiceTime/20*100}px`}">
							<view class='iconfont icon-yuyin-l'
							  :style="{
									fontSize: '25px',
									color: '#c1c1c1'
								}"/>
							<view @click="onVoicePlayClick" class='voice-play-tips'>{{isPlayVoice ? '正在播放' : `${voiceTime}`}}
							</view>
						</view> 
						<text v-else>
							{{chatText}}
						</text>
						<view v-if="isNotRead" class='is-not-read-ponit'/>
				</view>
			</view>
		</block>
	</view>
</template>
<script>
	import {
		avatar_pic_hendle
	} from '@/common/constants';
	const innerAudioContext = uni.createInnerAudioContext()
	/**
	 * chatItem 聊天记录的单个组件
	 * @description 自定义弹出选择层的单个选项组件
	 * @Author: 穆兰
	 * @Date: 2022/1/7
	 * @LastEditors: 穆兰
	 * @LastEditTime: 2022/1/7
	 * @property {String} [chatText]    - 聊天的文字内容、音频/图片链接
	 * @property {String} [messageType] - 消息的类型 0-文字 1-图片 2-语言
	 * @property {String} [avatarUrl] 头像的链接
	 * @property {Boolean} [isMe] 是否为我发出的内容
	 * @property {Number} [voiceTime] 语言消息的时长
	 * @property {Boolean} [isNotRead] 消息是否为未读状态
	 * @event {Function} onLongPress 点击此组件
	 * @example 调用示例 
	 */
	export default {
		name:"chat-item",
		props:{
			chatText:{
				type:String,
				required:true
			},
			messageType:{
				type:Number,
				required:true
			},
			avatarUrl:{
				type:String,
				default:''
			},
			isMe:{
				type:Boolean,
				default:false
			},
			voiceTime:{
				type:Number,
				default:0
			},
			isNotRead:{
				type:Boolean,
				default:false
			}
			
		},
		data() {
			return {
				isPlayVoice :false,
				avatar_pic_hendle
			};
		},
		methods:{
			/**
			 * @description 点击播放语音
			 */
			onVoicePlayClick(){
				if (this.isPlayVoice) {
					innerAudioContext.stop()
					this.isPlayVoice = false
				} else {
					innerAudioContext.src = this.chatText
					innerAudioContext.play()
					this.isPlayVoice = true
					innerAudioContext.onEnded(() => {
					this.isPlayVoice = false
					})
				}
			},
			/**
			 * @description 长按消息时
			 */
			onLongPress(){
				this.$emit('onLongPress')
			},
			/**
			 * @description 点击图片时
			 */
			onImageClick(){
				uni.previewImage({ urls: [this.chatText], current:this.chatText })
			}
		}
	}
</script>

<style lang="scss">
	.chat-avatar{
		height: 80rpx;
		width: 80rpx;
		border-radius: 40rpx;
		background-color:#46C7DC ;
	}
.chat-item-content{
    width: 94%;
    height: fit-content;
    display: flex;
	flex-direction: row;
    margin: 2%;
	.text-blank{
	        flex-grow: 1;
	    }
	    .chat-text{
	        margin-left: 20rpx;
	        margin-right: 20%;
	        width: fit-content;
	        background-color: #ffffff;
	        color: #646464;
	        padding: 10rpx;
	        border-radius: 0px 20rpx 20rpx 20rpx;
	        position: relative;
	        display: flex;
	        align-items: center;
	        justify-content: center;
	    }
	.chat-image{
	    width: fit-content;
	    height: fit-content;
	    line-height: 0rpx;
	    display: inline-block;
	    border-radius: 10rpx;
	    overflow: hidden;
	}
	.chat-voice{
	    min-width: 200rpx;
	    max-width: 450rpx;
	    display: flex;
	    color: #adadad;
	    text-align: left;
	    .voice-play-tips{
	        flex-grow: 1;
	        text-align: left;
	    }
	}
	.message-withdraw{
	    width: 100%;
	    text-align: center;
	    padding:25rpx 5rpx;
	    font-size: small;
	    color: #c7c7c7;
	}
    
}
.chat-item-me-content{
    width: 94%;
    height: fit-content;
    display: flex;
	flex-direction: row-reverse;
    margin: 2%;
    .text-blank{
            flex-grow: 1;
        }
        .chat-text{
            margin-left: 20%;
            margin-right: 20rpx;
            width: fit-content;
            background-color:#61f5dc;
            color: #646464;
            padding: 10rpx;
            border-radius: 20rpx 0rpx 20rpx 20rpx;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .is-not-read-ponit{
            position: absolute;
            width: 10rpx;
            height: 10rpx;
            background-color: #04e2bd;
            border-radius: 5rpx;
            left: -15rpx;
            bottom: 0rpx;
        }
    .chat-image{
        width: fit-content;
        height: fit-content;
        line-height: 0rpx;
        display: inline-block;
        border-radius: 10rpx;
        overflow: hidden;
    }
    .chat-voice{
        min-width: 200rpx;
        max-width: 450rpx;
        display: flex;
        color: #adadad;
        text-align: left;
        .voice-play-tips{
            flex-grow: 1;
            text-align: left;
        }
    }

}
.message-withdraw{
    width: 100%;
    text-align: center;
    padding:25px 5px;
    font-size: small;
    color: #c7c7c7;
}
</style>
