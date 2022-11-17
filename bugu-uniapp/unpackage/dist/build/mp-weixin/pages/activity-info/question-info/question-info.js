"use strict";var e=require("../../../common/vendor.js"),t=require("../../../services/questionServices.js"),i=require("../../../services/answerServices.js"),s=require("../../../utils/request.js"),n=require("../../../common/constants.js"),o=require("../../../common/storageFunctions.js");require("../../../common/storageKeys.js");const a={data:()=>({questionData:{},answers:[],editAnswerItem:{},havaMoreData:!0,bottomLoading:!1,showAllDescription:!1,questionLoading:!0,contentHeight:0,navHeight:0,page:1,myId:-1,myUserInfo:{},isRefresh:!1}),computed:{questionDescription(){if(!this.questionData.id)return"";let e=this.questionData.text;if(this.showAllDescription)return e;{let t=58,i=58,s=0,n=0,o=e.match(/\n/gi);if(o&&(s=o.length),s<=0)n=e.length;else if(n=e.length+19*s,n>i){let s=e.indexOf("\n"),n=s,o=s,a=e;for(;n<i&&(a=e.slice(o+1),-1!=a.indexOf("\n"));)n=n+20+a.indexOf("\n"),o=o+1+a.indexOf("\n");t=o}return n<=t?this.questionData.text:this.questionData.text.slice(0,t)+"..."}},showUnfoldButton(){if(this.questionData.id){if(this.questionData.pics||this.questionData.video)return!0;let e=this.questionData.text,t=40,i=0,s=0,n=e.match(/\n/gi);return n&&(s=n.length),i=s<=0?e.length:e.length+19*s,!(i<t)}return!1},scollerHeight(){return this.contentHeight-this.navHeight}},onReady(){let t=this;e.index.getSystemInfo({success(e){t.contentHeight=e.windowHeight}}),e.index.createSelectorQuery().select("#question-content").boundingClientRect((e=>{t.navHeight=e.top})).exec()},async onLoad(e){this.questionId=e.questionId,this.getQuetionsInfo(this.questionId),this.getAnswers(this.questionId,1);let t=await o.getMyUserInfo();t&&(this.myId=t.id,this.myUserInfo=t)},onShareAppMessage(){let e="";return this.questionData.video?e=this.questionData.video[0]+"?vframe/jpg/offset/0":this.questionData.issue.imgs&&(e=this.questionData.pics[0]),{title:`${this.myUserInfo.username.length>7?this.myUserInfo.username.slice(0,7):this.myUserInfo.username}邀请您回答问题“${this.questionData.title}”`,path:`/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,imageUrl:e}},onShareTimeline(){let e="";return this.questionData.video?e=this.questionData.video[0]+"?vframe/jpg/offset/0":this.questionData.pics&&(e=this.questionData.pics[0]),{title:`${this.myUserInfo.username.length>7?this.myUserInfo.username.slice(0,7):this.myUserInfo.username}邀请您回答问题“${this.questionData.title}”`,path:`/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,imageUrl:e}},methods:{onNarLeftClick(){e.index.navigateBack({delta:1})},onQuestionLabelClick(t){e.index.navigateTo({url:`/pages/label-activity/label-question/label-question?labelId=${t.id}&labelContent=${t.content}`})},onUnfoldClick(){this.showAllDescription=!this.showAllDescription},onWriteAnswerClick(){let t=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)));e.index.navigateTo({url:`/pages/publish/write-answers/write-answers?questionTitle=${t}&questionId=${this.questionData.id}`})},async onLikeButtonClick(){0===this.questionData.isLiked?(this.questionData.isLiked=1,this.questionData.likeSum=this.questionData.likeSum+1,await t.likeQuestion(this.questionData.id)?e.index.showToast({title:"点赞成功",icon:"success"}):(this.questionData.isLiked=0,this.questionData.likeSum=this.questionData.likeSum-1,e.index.showToast({title:"点赞失败",icon:"error"}))):1===this.questionData.isLiked&&(this.questionData.isLiked=0,this.questionData.likeSum=this.questionData.likeSum-1,await t.cancelLikeQuestion(this.questionData.id)?e.index.showToast({title:"取消成功",icon:"success"}):(this.questionData.isLiked=1,this.questionData.likeSum=this.questionData.likeSum+1,e.index.showToast({title:"取消失败",icon:"error"})))},async onCollectButtonClick(){0===this.questionData.isCollected?(this.questionData.isCollected=1,this.questionData.collectSum=this.questionData.collectSum+1,await t.collectQuestion(this.questionData.id)?e.index.showToast({title:"收藏成功",icon:"success"}):(this.questionData.isCollected=0,this.questionData.collectSum=this.questionData.collectSum-1,e.index.showToast({title:"关注失败",icon:"error"}))):1==this.questionData.isCollected&&(this.questionData.isCollected=0,this.questionData.collectSum=this.questionData.collectSum-1,await t.cancelCollectQuestion(this.questionData.id)?e.index.showToast({title:"取消成功",icon:"success"}):(this.questionData.isCollected=1,this.questionData.collectSum=this.questionData.collectSum+1,e.index.showToast({title:"取消失败",icon:"error"})))},async onAnswerIsRefresh(){this.isRefresh=!0,this.page=1,await this.getAnswers(this.questionData.id,this.page),setTimeout((()=>{this.isRefresh=!1}),700)},onAnswerClick(t){let i=encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title))),s=this.questionData.id;e.index.navigateTo({url:`/pages/activity-info/answer-info/answer-info?questionTitle=${i}&questionId=${s}&answerId=${t.id}`})},onAnswerMoreClick(e){this.editAnswerItem=e,this.$refs.answerActionPopup.open()},onAnswerReportClick(t){e.index.navigateTo({url:`/pages/setting/report-user/report-user?objectId=${t}&objectType=${n.reportObjectType.answer}&modular=question`}),this.$refs.answerActionPopup.close()},onAnswerDeleteClick(t){let s=this;e.index.showModal({title:"删除回答",content:"你确定要删除这个回答吗",success:async function(n){if(n.confirm)if(await i.deleteAnswer(t)){let i=s.answers;for(let e=0;e<i.length;e++)if(i[e].id==t){i.splice(e,1);break}s.answers=i,s.$refs.answerActionPopup.close(),e.index.showToast({title:"删除成功",icon:"success"})}else e.index.showToast({title:"删除失败",icon:"error"})}})},async getQuetionsInfo(e){let t=await s.request({data:{method:"GET",group:"question",action:`${e}/detail`,header:{"content-type":"application/x-www-form-urlencoded"}}});t.data.code===n.REQUEST_SUCCEEDED_CODE&&(this.questionData=t.data.data,this.questionLoading=!1)},async getAnswers(e,t){let i=await s.request({data:{method:"GET",group:"answer",action:"all",data:{questionId:e,page:t},header:{"content-type":"application/x-www-form-urlencoded"}}});if(i.data.code===n.REQUEST_SUCCEEDED_CODE){let e=i.data.data,s=e.list;if(this.haveMoreData=e.hasNext,1===t)this.answers=s,this.scrollInto="";else{let e=this.answers.concat(s);this.answers=e}}}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("question-skeleton")+e.resolveComponent("uni-icons")+e.resolveComponent("View")+e.resolveComponent("answer-item")+e.resolveComponent("action-sheet-item")+e.resolveComponent("action-sheet"))()}Math||((()=>"../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../../components/question-skeleton/question-skeleton.js")+(()=>"../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js")+(()=>"../../../components/answer-item/answer-item.js")+(()=>"../../../components/action-sheet-item/action-sheet-item.js")+(()=>"../../../components/action-sheet/action-sheet.js"))();var l=e._export_sfc(a,[["render",function(t,i,s,n,o,a){return e.e({a:e.o((e=>a.onNarLeftClick())),b:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:o.questionLoading},o.questionLoading?{}:e.e({d:e.f(o.questionData.labels,((t,i,s)=>({a:e.t(t.content),b:"label"+t.id,c:e.o((e=>a.onQuestionLabelClick(t)),"label"+t.id)}))),e:e.t(o.questionData.title),f:o.questionData.pics.length>0&&!o.showAllDescription},o.questionData.pics.length>0&&!o.showAllDescription?{g:o.questionData.pics[0]}:{},{h:o.questionData.video.length>0&&!o.showAllDescription},o.questionData.video.length>0&&!o.showAllDescription?{i:o.questionData.video[0]+"?vframe/jpg/offset/0",j:e.p({customPrefix:"customicons",type:"videocam-filled",color:"#c5c5c5dc",size:"70"}),k:!t.playVideo}:{},{l:e.t(a.questionDescription),m:e.f(o.questionData.pics,((e,t,i)=>({a:e,b:e}))),n:o.questionData.pics.length>0&&o.showAllDescription,o:e.f(o.questionData.video,((e,t,i)=>({a:e,b:`video_${t}`,c:e}))),p:o.questionData.video.length>0&&o.showAllDescription,q:a.showUnfoldButton},a.showUnfoldButton?e.e({r:o.showAllDescription},(o.showAllDescription,{}),{s:e.o((e=>a.onUnfoldClick()))}):{},{t:e.t(o.questionData.answerSum),v:e.t(o.questionData.viewSum),w:e.p({type:"hand-up",color:1==o.questionData.isLiked?"#04543B":"#838383",size:"20"}),x:e.t(o.questionData.likeSum),y:e.o(((...e)=>a.onLikeButtonClick&&a.onLikeButtonClick(...e))),z:e.n("is-liked-"+o.questionData.isLiked)}),{A:e.p({type:"personadd-filled",color:"#626262",size:"23"}),B:e.p({type:"compose",color:"#626262",size:"23"}),C:e.o((e=>a.onWriteAnswerClick())),D:e.p({type:1==o.questionData.isCollected?"star-filled":"star",color:"#626262",size:"23"}),E:e.t(1==o.questionData.isCollected?"已收藏":"收藏问题"),F:e.o(((...e)=>a.onCollectButtonClick&&a.onCollectButtonClick(...e))),G:o.questionData.issue},o.questionData.issue?{H:e.t(o.questionData.answerSum)}:{},{I:e.f(o.answers,((t,i,s)=>({a:e.o((e=>a.onAnswerClick(t))),b:e.o((e=>a.onAnswerMoreClick(t))),c:"7249bc6e-8-"+s,d:e.p({answerData:t}),e:t.id}))),J:a.scollerHeight+"px",K:o.isRefresh,L:e.o((e=>a.onAnswerIsRefresh())),M:o.editAnswerItem.id},o.editAnswerItem.id?e.e({N:o.editAnswerItem.publisher&&o.editAnswerItem.publisher.id==o.myId},o.editAnswerItem.publisher&&o.editAnswerItem.publisher.id==o.myId?{O:e.o((e=>a.onAnswerDeleteClick(o.editAnswerItem.id))),P:e.p({icon:"icon-delete",title:"删除"})}:{Q:e.o((e=>a.onAnswerReportClick(o.editAnswerItem.id))),R:e.p({icon:"icon-alert",title:"举报"})}):{},{S:e.sr("answerActionPopup","7249bc6e-9"),T:e.p({needHead:!0,title:"回答选择",needCancelButton:!0})})}]]);a.__runtimeHooks=6,wx.createPage(l);