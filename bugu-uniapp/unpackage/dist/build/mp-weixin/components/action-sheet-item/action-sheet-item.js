"use strict";var e=require("../../common/vendor.js");const t={name:"action-sheet-item",props:{title:{type:String,required:!0},icon:{type:String,required:!1}},data:()=>({}),methods:{click(e){this.$emit("click")}}};var c=e._export_sfc(t,[["render",function(t,c,i,n,r,o){return e.e({a:i.icon},i.icon?{b:e.n("iconfont "+i.icon)}:{},{c:e.t(i.title),d:i.icon?"left":"center",e:e.o(((...e)=>o.click&&o.click(...e)))})}]]);wx.createComponent(c);