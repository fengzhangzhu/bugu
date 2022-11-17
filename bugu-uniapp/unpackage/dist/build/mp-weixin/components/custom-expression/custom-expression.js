"use strict";var e=require("../../common/vendor.js"),t=require("../../common/constants.js"),s=require("../../utils/request.js");const o={name:"custom-expression",props:{contentHeight:{type:Number,required:!0}},data:()=>({haveMore:!0,page:1,expressions:[],editExpression:{},editIndex:0}),async created(){this.expressions=await this.getExpressions(this.page)},methods:{onExpressionItemClick(e,t){this.$emit("onItemClick",e,t)},onLongPress(e,t){this.editExpression=e,this.editIndex=t,this.$refs.expressionItemActionPopup.open()},onDeleteTextClick(){this.deleteExpression(this.editExpression.id,this.editIndex),this.$refs.expressionItemActionPopup.close()},async refresh(){this.page=1,this.expressions=await this.getExpressions(this.page)},async onScroolToLower(){if(this.haveMore){this.page=this.page+1;let e=await this.getExpressions(this.page),t=this.expressions;t=t.concat(e),this.expressions=t}},async getExpressions(e){let o=await s.request({data:{method:"GET",group:"message",action:"emoticon/list",data:{page:e},header:{"content-type":"application/x-www-form-urlencoded"}}});if(o.data.code===t.REQUEST_SUCCEEDED_CODE){let t=o.data.data.list;return console.log("expressionList",t),o.data.data.pageSum<=e&&(this.haveMore=!1),t}return[]},async deleteExpression(o,i){if((await s.request({data:{method:"DELETE",group:"message",action:"emoticon/delete",data:{id:o},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===t.REQUEST_SUCCEEDED_CODE){let t=this.expressions;return t.splice(i,1),this.expressions=t,e.index.showToast({title:"删除成功",icon:"success"}),!0}return!1}}};if(!Array){(e.resolveComponent("action-sheet-item")+e.resolveComponent("action-sheet"))()}Math||((()=>"../action-sheet-item/action-sheet-item.js")+(()=>"../action-sheet/action-sheet.js"))();var i=e._export_sfc(o,[["render",function(t,s,o,i,n,r){return e.e({a:e.f(n.expressions,((t,s,o)=>({a:e.o((e=>r.onExpressionItemClick(t,s))),b:e.o((e=>r.onLongPress(t,s))),c:t.url,d:t.id}))),b:n.expressions.length<1},(n.expressions.length,{}),{c:o.contentHeight?o.contentHeight+"px":"300px",d:e.o(((...e)=>r.onScroolToLower&&r.onScroolToLower(...e))),e:n.editExpression.id},n.editExpression.id?{f:e.o(r.onDeleteTextClick),g:e.p({title:"删除"})}:{},{h:e.sr("expressionItemActionPopup","06f6d1f4-0"),i:e.p({needHead:!0,title:"设置消息",needCancelButton:!0})})}]]);wx.createComponent(i);
