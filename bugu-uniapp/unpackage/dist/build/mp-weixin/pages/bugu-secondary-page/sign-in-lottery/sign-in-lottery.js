"use strict";var n=require("../../../common/vendor.js"),t=require("../../../utils/request.js"),e=require("../../../common/constants.js");const a={data:()=>({signInfo:{signInDays:0,signInToday:!1,getGiftToday:!1}}),methods:{onNarLeftClick(){n.index.navigateBack({delta:1})},async onSignButtonClick(){if(this.signInfo.signInDays>=7)this.signInfo.getGiftToday?n.index.showToast({title:"奖品已领取",icon:"none"}):async function(){(await t.request({data:{method:"POST",group:"signIn",action:"getGift",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===e.REQUEST_SUCCEEDED_CODE&&n.index.showToast({title:"奖品领取成功"})}();else if(!this.signInfo.signInToday){await async function(){return(await t.request({data:{method:"PUT",group:"signIn",action:"signIn",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===e.REQUEST_SUCCEEDED_CODE&&(n.index.showToast({title:"签到成功",icon:"success"}),!0)}()&&(this.signInfo=await o())}}},async mounted(){this.signInfo=await o()}};async function o(){let n=await t.request({data:{method:"GET",group:"signIn",action:"info",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});if(n.data.code===e.REQUEST_SUCCEEDED_CODE){return n.data.data}return{signInDays:0,signInToday:!1,getGiftToday:!1}}if(!Array){n.resolveComponent("uni-nav-bar")()}Math;var i=n._export_sfc(a,[["render",function(t,e,a,o,i,s){return{a:n.o((n=>s.onNarLeftClick())),b:n.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:i.signInfo.signInDays/7*100+"%",d:n.t(i.signInfo.signInDays),e:n.f([1,2,3,4,5,6],((t,e,a)=>({a:n.t(e+1),b:n.t(e+1),c:e<i.signInfo.signInDays?"linear-gradient(to bottom, #42e1e3, #40e399);":"#ffe6cb",d:e,e:(e+1)%3==2?"center":(e+1)%3==0?"flex-end":"flex-start",f:(e+1)%3==2?"center":(e+1)%3==0?"flex-end":"left"}))),f:i.signInfo.signInDays>=7?"linear-gradient(to bottom, #42e1e3, #40e399);":"#ffe6cb",g:n.t(i.signInfo.signInDays>=7?i.signInfo.getGiftToday?"奖品已经领取":"领取奖品":i.signInfo.signInToday?"今日已签到":"签到"),h:n.o((n=>s.onSignButtonClick()))}}]]);wx.createPage(i);
