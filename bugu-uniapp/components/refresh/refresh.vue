<template>
	<view>
		
		<view   @touchstart="test.touchstart" @touchmove="test.touchmove" 
		:change:prop="test.end" :prop="propValue"
		@touchend="test.touchend"  id="refresh-container" 
		 
		 >
		
		<!-- 起始会隐藏在导航栏里 -->
		<view class="flex-row-center" :style="{height:heightRh,width: '750rpx'}">
			<image :src="image" mode="aspectFit" :style="{width:widthImg}" id="lot" ></image>
			<text v-show="msgShow" style="color: #93c6ad;font-size: 20rpx;padding-left: 20rpx;">{{refreshText}}</text>
		</view>
		<view class="slot-content">
			<!-- 后续内容 -->
			<slot ></slot>
		</view>
		</view>
	</view>
</template>



<script>
	
	export default {
		name:"refresh",
		props:{
			widthImg:{
				type:String,
				default:"40rpx"
			},
			heightRh:{
				type:String,
				default:"0rpx"
			},
			msgShow:{
				type:Boolean,
				default:true
			},
			image:{
				type:String,
				default:"../../static/lt1.png"
			}
				
		},	
		created() {
		   uni.$on('reMsg',(data)=>{
				this.propValue=!this.propValue
			})
		},
		data() {
			return {
				refreshText:"下拉刷新",
				propValue:true,
			}
		},
		methods: {
			refresh(i){
				if(i==0){
					this.refreshText="松开刷新"
				}else if(i==1){
					// 这里写刷新业务
					this.refreshText="正在刷新"
					this.$emit('down',1)
				}else if(i==2){
					this.refreshText="下拉刷新"
				}
			}
		}
	}
</script>

<script module="test" lang="wxs" >
    var startY = 0
	var top=0
	var code=0
	var mit=0
    function touchstart(event, ins) {
        if(code==0){
			mit=0
			ins.callMethod('refresh',2);
			var touch = event.touches[0] || event.changedTouches[0]
			startY = touch.pageY
        } 
    }
	function end(newValue, oldValue, ownerInstance, instance) {
		if(newValue-oldValue>0){
			console.log(newValue-oldValue)
			ownerInstance.selectComponent('#refresh-container').setStyle({
				'transform': 'translateY(0)',
				'transition': 'ease 0.3s'
			})
			 ownerInstance.selectComponent('#lot').removeClass('turn-load')
			code=0
		}
		
	}
	function touchend(event, ins) {
	  if(code==0){
		  if(top<60){
			  ins.selectComponent('#refresh-container').setStyle({
				'transform': 'translateY(0)',
				'transition': 'ease 0.3s'
			  })
		  }else{
			  top=0
			  ins.callMethod('refresh',1);
			  code=1			 
			  ins.selectComponent('#refresh-container').setStyle({
				'transform': 'translateY(60px)',
				'transition': 'ease 0.3s'
			  })		

			  ins.selectComponent('#lot').addClass('turn-load')

		  }
	    }
	}
    function touchmove(event, ins) {
	  if(code==0){	
		  var touch = event.touches[0] || event.changedTouches[0]
		  var pageY = touch.pageY
		  var vew=ins.selectComponent('#refresh-container')
		  var dataset = vew.getDataset();
		  top = pageY - startY
		  console.log(top)
			  if(top>60){
				  if(mit==0){
					ins.callMethod('refresh',0);
				  }
				  mit=1				  
			  }
			  vew.setStyle({
				'transform': 'translateY(' + (top) + 'px)'
			  })	  
			  ins.selectComponent('#lot').setStyle({
				'transform': 'rotate(' + (top*6) + 'deg)'
			  })
		  }else{
			  startY=pageY
		  }
    }
    module.exports = {
	  end:end,
      touchend: touchend,
      touchstart: touchstart,
      touchmove: touchmove
    }
</script>
<style>

 .flex-row-center{
		transform: translateY(-50rpx);
		 display: flex;
		 flex-direction: row;
		 justify-content: center;
		 align-items: center;
	 }
/* 转圈动画 */
.turn-load{
  animation:turnmy 0.6s linear infinite;      
}
.slot-content{
	/* overflow: auto; */
}
@keyframes turnmy{
  from{transform:rotate(0deg);}
  to{transform:rotate(360deg);}
}
</style>
