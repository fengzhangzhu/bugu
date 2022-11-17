"use strict";var e=require("../../common/vendor.js"),t=require("../../common/constants.js"),i=require("../../utils/request.js"),o=require("../../common/storageFunctions.js"),n=require("../../utils/dateUtils.js"),s=require("../../common/requestFunctions.js");require("../../common/storageKeys.js");const a={data:()=>({isDelete:!1,article:{},myId:0,myUserInfo:{},isMe:!1,commentDatas:[],page:1,haveMoreData:!0,showBottomLoading:!1,refreshCommentId:0,isRefresh:!1,scrollInto:"",isReplyComment:!1,inputFocus:!1,sendText:"",buttonIsLoading:!1,keyboardHeight:0,emojiContentHeight:300,showEmojiPicker:!1,commentSelected:{},commentMoreSelected:{},contentHeight:0,navHeight:0,isIOS:!1}),onReady(){let t=this;e.index.getSystemInfo({success(e){t.contentHeight=e.windowHeight,t.isIOS=-1!=e.system.indexOf("iOS")}}),e.index.createSelectorQuery().select(".activity-info-scroll").boundingClientRect((e=>{t.navHeight=e.top})).exec()},async onLoad(t){e.index.onKeyboardHeightChange((async e=>{0!=e.height?(this.keyboardHeight=e.height,this.emojiContentHeight=e.height,this.showEmojiPicker=!1):this.keyboardHeight=0}));let i=t.activityId;if(this.showBottomLoading=!0,await this.getArticleInfo(i),this.article.publisher){let e=await o.getMyUserInfo();this.myId=e.id,this.myUserInfo=e,this.isMe=this.article.publisher.id==e.id}this.commentDatas=await this.getActivtyComments(i,this.page),this.commentDatas.length<=0&&(this.haveMoreData=!1),this.showBottomLoading=!1},computed:{placeholder(){return this.isReplyComment?`回复${this.commentSelected.toUsername}`:"回复作者"},scollerHeight(){return this.contentHeight-this.navHeight}},onShareAppMessage(){let e="";this.article.pic.length>0&&(e=1==this.article.video?this.article.pic[0]+"?vframe/jpg/offset/0":this.article.pic[0]);let t="";return 1==this.article.isAnonymity?t="匿名用户":this.article.publisher&&(t=this.article.publisher.username),{title:`${t}发布了一条动态，快来看看ta说了什么`,path:`/pages/activity-info/activity-info?activityId=${this.article.id}`,imageUrl:e}},onShareTimeline(){let e="";this.article.pic.length>0&&(e=1==this.article.video?this.article.pic[0]+"?vframe/jpg/offset/0":this.article.pic[0]);let t="";return 1==this.article.isAnonymity?t="匿名用户":this.article.publisher&&(t=this.article.publisher.username),{title:`${t}发布了一条动态，快来看看ta说了什么`,path:`/pages/activity-info/activity-info?activityId=${this.article.id}`,imageUrl:e}},methods:{onNarLeftClick(){e.index.navigateBack({delta:1})},onActivityItemClick(){this.inputFocus?this.inputFocus=!1:this.inputFocus=!0,this.isReplyComment=!1},onCommentTextareaInput(e){this.sendText=e.detail.value},onCommentTextareaFocus(){this.inputFocus=!0},onCommentTextareaBlur(){setTimeout((()=>{this.inputFocus=!1}),100)},onEmojiIconClick(){this.showEmojiPicker=!this.showEmojiPicker},async onSendButtonClick(){if(this.sendText.length<=0)return;if(this.buttonIsLoading)return;this.refreshCommentId=0,this.buttonIsLoading=!0,this.scrollInto="";let e=!1;e=this.isReplyComment?await s.ReplyComments(this.commentSelected.commentId,this.sendText,0,this.commentSelected.toUserId):await s.commentActivity(this.article.id,this.sendText,0),this.buttonIsLoading=!1,this.showEmojiPicker=!1,-1!==e&&(this.isReplyComment?this.refreshCommentId=this.commentSelected.commentId:(this.scrollInto="comment-item-newest",this.commentDatas.push({father:{content:this.sendText,createTime:n.getTime(),id:e,isDeleted:0,likeSum:0,isLiked:0,publisher:{id:this.myUserInfo.id,username:this.myUserInfo.username,avatar:this.myUserInfo.avatar},responseSum:0,type:0},sons:[]})),this.sendText="")},setEmoj(e){this.sendText=this.sendText+e},async onRefresh(){this.isRefresh=!0;let e=this.article.id;await this.getArticleInfo(e),this.page=1,this.haveMoreData=!0,this.commentDatas=await this.getActivtyComments(e,this.page),setTimeout((()=>{this.isRefresh=!1}),700)},async onScrollToLower(){if(this.haveMoreData){this.showBottomLoading=!0;let e=this.article.id;this.page=this.page+1;let t=await this.getActivtyComments(e,this.page);t.length>0?this.commentDatas=this.commentDatas.concat(t):this.haveMoreData=!1,this.showBottomLoading=!1}},onActivityPopupMoreClick(){this.$refs.articleActionPopup.open()},onActivityPopupReportClick(i){e.index.navigateTo({url:`/pages/setting/report-user/report-user?objectId=${i.id}&objectType=${t.reportObjectType.activity}`}),this.$refs.articleActionPopup.close()},onActivityPopupDeleteClick(){let t=this;e.index.showModal({title:"删除动态",content:"你确定要删除这个动态吗",success:async function(i){i.confirm&&await s.deleteMyArticle(t.article.id)&&(t.isDelete=!0,t.$refs.articleActionPopup.close(),e.index.showToast({title:"删除成功",icon:"success"}))}})},onCommentPopupReportClick(i){i.isReply?e.index.navigateTo({url:`/pages/setting/report-user/report-user?objectId=${i.replyId}&objectType=${t.reportObjectType.commentResponse}`}):e.index.navigateTo({url:`/pages/setting/report-user/report-user?objectId=${i.commentId}&objectType=${t.reportObjectType.comment}`}),this.$refs.commentActionPopup.close()},onCommentPopupDeleteClick(t){let i=this;e.index.showModal({title:"删除评论",content:"你确定删除这条评论吗？",success:async function(o){if(o.confirm){let o=!1;if(i.refreshCommentId=0,t.isReply)o=await s.DeleteReply(t.replyId),o&&(i.refreshCommentId=t.commentId);else{o=await s.DeleteComments(t.commentId);let e=i.commentDatas;for(let i=0;i<e.length;i++)if(e[i].father.id==t.commentId){e[i].father.isDeleted=1;break}i.commentDatas=e}o&&(e.index.showToast({title:"删除成功"}),i.$refs.commentActionPopup.close())}}})},async onCancelFollow(t){if(!t.publisher)return;let i=this;e.index.showModal({title:"取消关注",content:`你确定要取消关注${t.publisher.username}`,success:async function(o){o.confirm&&t.publisher&&await s.cancelAttention(t.publisher.id)&&(i.article.publisher.isAttention=0,i.$refs.articleActionPopup.close(),e.index.showToast({title:"取消关注",icon:"success"}))}})},async onFollow(t){if(!t.publisher)return;let i=this;await s.followUser(t.publisher.id)&&(i.article.publisher.isAttention=1,i.$refs.articleActionPopup.close(),e.index.showToast({title:"关注成功",icon:"success"}))},onCommentClick(e){this.isReplyComment=!0,this.inputFocus=!0,this.commentSelected={toUsername:e.publisher.username,toUserId:0,commentId:e.id}},onCommentMoreClick(e){this.commentMoreSelected={commentId:e.id,replyId:0,fromUserId:e.publisher.id,isReply:!1},this.$refs.commentActionPopup.open()},onShowAllClick(t){e.index.navigateTo({url:`/pages/activity-info/comment-info?commentData=${JSON.stringify(t)}&authorId=${this.article.publisher?this.article.publisher.id:0}`})},onReplyClick(e,t,i){this.inputFocus=!0,this.isReplyComment=!0,this.commentSelected={commentId:e.id,replyId:t.id,toUsername:t.fromUsername,toUserId:0==t.fromUserId?-1:t.fromUserId}},onReplyMoreClick(e,t){this.commentMoreSelected={commentId:e.id,replyId:t.id,fromUserId:t.fromUserId,isReply:!0},this.$refs.commentActionPopup.open()},async getArticleInfo(o){e.index.showLoading({title:"加载中"});let n=await i.request({data:{method:"GET",group:"activity",action:`${o}/info`,data:{id:o},header:{"content-type":"application/x-www-form-urlencoded"}}});e.index.hideLoading(),n.data.code===t.REQUEST_SUCCEEDED_CODE?this.article=n.data.data:"A0201"===n.data.code&&(this.isDelete=!0)},async getActivtyComments(e,o){let n=await i.request({data:{method:"GET",group:"activity",action:`${e}/commentList`,data:{id:e,father_pageSize:10,father_startPage:o,son_pageSize:3,son_startPage:1},header:{"content-type":"application/x-www-form-urlencoded"}}});if(setTimeout((()=>{this.isRefresh=!1}),700),n.data.code===t.REQUEST_SUCCEEDED_CODE){return n.data.data}return[]}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("activity-item")+e.resolveComponent("comment-item")+e.resolveComponent("uni-load-more")+e.resolveComponent("activity-skeleton")+e.resolveComponent("emoji")+e.resolveComponent("uni-transition")+e.resolveComponent("action-sheet-item")+e.resolveComponent("action-sheet"))()}Math||((()=>"../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../components/activity-item/activity-item.js")+(()=>"../../components/comment-item/comment-item.js")+(()=>"../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js")+(()=>"../../components/activity-skeleton/activity-skeleton.js")+(()=>"../../components/emoji/emoji.js")+(()=>"../../uni_modules/uni-transition/components/uni-transition/uni-transition.js")+(()=>"../../components/action-sheet-item/action-sheet-item.js")+(()=>"../../components/action-sheet/action-sheet.js"))();var r=e._export_sfc(a,[["render",function(t,i,o,n,s,a){return e.e({a:e.o((e=>a.onNarLeftClick())),b:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:s.isDelete},s.isDelete?{}:e.e({d:s.article.id},s.article.id?{e:e.o((e=>a.onFollow(s.article))),f:e.o((e=>a.onActivityPopupMoreClick(s.article))),g:e.o((e=>a.onActivityItemClick())),h:e.p({isMe:s.isMe,needShowAll:!0,articleItem:s.article}),i:e.f(s.commentDatas,((t,i,o)=>({a:t.father.id,b:e.o((e=>a.onCommentClick(t.father)),t.father.id),c:e.o((e=>a.onShowAllClick(t.father)),t.father.id),d:e.o((e=>a.onCommentMoreClick(t.father)),t.father.id),e:e.o(a.onReplyClick,t.father.id),f:e.o(a.onReplyMoreClick,t.father.id),g:"5f0a26cc-2-"+o,h:e.p({commentData:t.father,replyData:t.sons,authorId:s.article.isAnonymity?0:s.article.publisher.id,needRefresh:s.refreshCommentId==t.father.id})}))),j:e.p({status:s.haveMoreData?s.showBottomLoading?"loading":"more":"noMore",contentText:{contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:0==s.haveMoreData&&s.commentDatas.length<=0?"还没有评论，快来抢沙发吧~":"没有更多评论了"},iconType:"circle"})}:{}),{k:s.isRefresh,l:e.o((e=>a.onRefresh())),m:e.o((e=>a.onScrollToLower())),n:s.scrollInto,o:a.scollerHeight+"px",p:s.isIOS},s.isIOS?{q:a.placeholder,r:s.inputFocus,s:e.o(((...e)=>a.onCommentTextareaFocus&&a.onCommentTextareaFocus(...e))),t:e.o(((...e)=>a.onCommentTextareaBlur&&a.onCommentTextareaBlur(...e))),v:s.sendText,w:e.o((e=>s.sendText=e.detail.value))}:{x:a.placeholder,y:s.inputFocus,z:e.o(((...e)=>a.onCommentTextareaFocus&&a.onCommentTextareaFocus(...e))),A:e.o(((...e)=>a.onCommentTextareaBlur&&a.onCommentTextareaBlur(...e))),B:s.sendText,C:e.o((e=>s.sendText=e.detail.value))},{D:e.o((e=>a.onEmojiIconClick())),E:e.t(s.buttonIsLoading?"发送中":"发送"),F:e.o((e=>a.onSendButtonClick())),G:s.showEmojiPicker,H:e.o(a.setEmoj),I:e.p({contentHeight:s.emojiContentHeight}),J:e.p({"mode-class":"slide-bottom",show:s.showEmojiPicker}),K:s.showEmojiPicker?s.emojiContentHeight+"px":s.keyboardHeight+"px",L:s.commentMoreSelected.fromUserId},s.commentMoreSelected.fromUserId?e.e({M:s.myId==s.commentMoreSelected.fromUserId},s.myId==s.commentMoreSelected.fromUserId?{N:e.o((e=>a.onCommentPopupDeleteClick(s.commentMoreSelected))),O:e.p({icon:"icon-delete",title:"删除"})}:e.e({P:e.o((e=>a.onCommentPopupReportClick(s.commentMoreSelected))),Q:e.p({icon:"icon-alert",title:"举报"}),R:s.article.publisher&&s.article.publisher.id==s.myId},s.article.publisher&&s.article.publisher.id==s.myId?{S:e.o((e=>a.onCommentPopupDeleteClick(s.commentMoreSelected))),T:e.p({icon:"icon-delete",title:"删除"})}:{})):{},{U:e.sr("commentActionPopup","5f0a26cc-7"),V:e.p({needHead:!0,title:"评论选择",needCancelButton:!0}),W:s.article.id},s.article.id?e.e({X:s.article.isAnonymity},s.article.isAnonymity?{Y:e.o((e=>a.onActivityPopupReportClick(s.article))),Z:e.p({icon:"icon-alert",title:"举报"})}:e.e({aa:s.article.publisher.id==s.myId},s.article.publisher.id==s.myId?{ab:e.o(a.onActivityPopupDeleteClick),ac:e.p({icon:"icon-delete",title:"删除"})}:e.e({ad:1==s.article.publisher.isAttention},1==s.article.publisher.isAttention?{ae:e.o((e=>a.onCancelFollow(s.article))),af:e.p({icon:"icon-quxiaoguanzhu",title:"取消关注"})}:{ag:e.o((e=>a.onFollow(s.article))),ah:e.p({icon:"icon-guanzhu",title:"关注"})},{ai:e.p({icon:"icon-message",title:"私聊"}),aj:e.o((e=>a.onActivityPopupReportClick(s.article))),ak:e.p({icon:"icon-alert",title:"举报"})}))):{},{al:e.sr("articleActionPopup","5f0a26cc-11"),am:e.p({needHead:!0,title:"动态选择",needCancelButton:!0})})}]]);a.__runtimeHooks=6,wx.createPage(r);