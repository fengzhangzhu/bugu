"use strict";var e=require("../../common/vendor.js");const o={name:"action-sheet",props:{title:{type:String,required:!1},needHead:{type:Boolean,default:!1},needCancelButton:{type:Boolean,default:!1}},data:()=>({}),methods:{close(){this.$refs.actionPopup.close()},open(){this.$refs.actionPopup.open()}}};if(!Array){(e.resolveComponent("uni-icons")+e.resolveComponent("uni-popup"))()}Math||((()=>"../../uni_modules/uni-icons/components/uni-icons/uni-icons.js")+(()=>"../../uni_modules/uni-popup/components/uni-popup/uni-popup.js"))();var n=e._export_sfc(o,[["render",function(o,n,t,p,s,c){return e.e({a:t.needHead},t.needHead?{b:e.t(t.title),c:e.o((e=>c.close())),d:e.p({customPrefix:"customicons",type:"closeempty",color:"#000000",size:"25"})}:{},{e:t.needCancelButton},t.needCancelButton?{f:e.o((e=>c.close()))}:{},{g:e.sr("actionPopup","005ca9ca-0"),h:e.p({backgroundColor:"#ffffff00","safe-area":!0,type:"bottom"})})}]]);wx.createComponent(n);