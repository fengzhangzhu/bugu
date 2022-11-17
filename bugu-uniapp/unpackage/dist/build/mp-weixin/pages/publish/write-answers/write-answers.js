"use strict";var e=require("../../../common/vendor.js"),i=require("../../../common/storageFunctions.js"),t=require("../../../utils/aes/export.js"),n=require("../../../common/constants.js"),o=require("../../../utils/request.js");require("../../../common/storageKeys.js");const s={data:()=>({questionTitle:"",questionId:0,answerText:"",imageFiles:[],videoFiles:[],isAnonymity:0,isShowAnonymity:!1,buttonIsLoading:!1}),async onLoad(e){this.isShowAnonymity=await this.getAnonymityState(),this.questionTitle=JSON.parse(JSON.parse(decodeURIComponent(e.questionTitle))),this.questionId=e.questionId},methods:{onNarLeftClick(){e.index.navigateBack({delta:1})},onTextareaInput(e){this.answerText=e.detail.value},onImageFilesSelect(e){let i=this.imageFiles;e.tempFilePaths.forEach(((t,n)=>{i.push({url:t,file:e.tempFiles[n]})})),this.imageFiles=i},onSwitchClick(){this.isAnonymity=1==this.isAnonymity?0:1},onImageIconClick(){if(this.videoFiles.length>0)return void e.index.showModal({title:"无法选择图片",content:"一个动态不支持同时发布视频和图片哦~"});let i=this,t=9-this.imageFiles.length;t<=0?e.index.showToast({title:"最多选择9张哦~",icon:"none"}):e.index.chooseImage({count:t,sizeType:["original","compressed"],sourceType:["album"],success:function(e){let t=i.imageFiles;Array.isArray(e.tempFilePaths)&&e.tempFilePaths.forEach(((i,n)=>{t.push({url:i,file:e.tempFiles[n]})})),i.imageFiles=t}})},onCameraIconClick(){let i=this;9-this.imageFiles.length<=0?e.index.showToast({title:"最多选择9张哦~",icon:"none"}):e.index.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["camera"],success:function(e){var t=i.imageFiles;Array.isArray(e.tempFilePaths)&&(e.tempFilePaths.forEach(((i,n)=>{t.push({url:i,file:e.tempFiles[n]})})),i.imageFiles=t)}})},async onVideoIconClick(){let t=await i.getMyUserInfo();t?1==t.isVerify&&t.vip&&t.vip.remainDays>0?this.videoFiles.length>=1?e.index.showModal({title:"无法选择视频",content:"一个回答只能选择一个视频"}):e.index.chooseVideo({sourceType:["camera","album"],maxDuration:60,camera:"back",success:i=>{i.duration>210?e.index.showModal({title:"选择失败",content:"只能选择3分30秒以下的视屏哦~"}):this.videoFiles=[{url:i.tempFilePath}]}}):e.index.showModal({title:"选择失败",content:"只有实名认证并且为vip用户才能发布视频哦~"}):e.index.showModal({title:"无法选择",content:"您还未登录，请先登录",success:function(i){i.confirm&&e.index.navigateTo({url:"../login/login"})}})},async getAnonymityState(){let e=await o.request({data:{method:"GET",group:"activity",action:"anonymity/state",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});return e.data.code===n.REQUEST_SUCCEEDED_CODE&&e.data.data},async prepareBeforePublic(){if(!(await i.getMyUserInfo()))return void e.index.showModal({title:"发布失败",content:"您还未登录，请先登录",success:function(i){i.confirm&&e.index.navigateTo({url:"../login/login"})}});if(this.answerText.length<=0&&this.imageFiles.length<=0&&this.videoFiles.length<=0)return void e.index.showToast({title:"请先输入内容",icon:"none"});e.index.showLoading({title:"正在发布"}),this.buttonIsLoading=!0;var s=this;let a=[],l=[],r=0;if(this.imageFiles.length>0&&this.videoFiles.length>0)return void e.index.showModal({title:"发布失败",content:"一个回答不能同时发布视频和图片"});this.videoFiles.length>0&&(r=1);let c=0===r?this.imageFiles:this.videoFiles;if(c.length>0){let i=c.length,t=await o.request({data:{method:"GET",group:"answer",action:"publish/getToken",data:{sum:i},header:{"content-type":"application/x-www-form-urlencoded"}}});if(t.data.code!==n.REQUEST_SUCCEEDED_CODE)return void e.index.showToast({title:t.data.userMsg,icon:"none"});l=t.data.data,l.forEach((e=>{a.push(e.fileName)}))}c.length<1?this.publishAnswer(this.questionId,this.answerText,[],this.isAnonymity,0):c.forEach((async(i,o)=>{e.index.uploadFile({url:n.UploadUrl,filePath:i.url,name:"file",formData:{key:l[o].fileName,token:t.aes.decrypt(l[o].token)},success(e){o===c.length-1&&s.publishAnswer(s.questionId,s.answerText,a,s.isAnonymity,r)}})}))},async publishAnswer(i,t,s,a,l){let r=await o.request({data:{method:"POST",group:"answer",action:"publish",data:{questionId:i,text:t,pic:JSON.stringify(s),isVideo:l,isAnonymity:a},header:{"content-type":"application/x-www-form-urlencoded"}}});e.index.hideLoading(),this.buttonIsLoading=!1,r.data.code===n.REQUEST_SUCCEEDED_CODE&&(e.index.showToast({title:"发布成功",icon:"success"}),this.answerText="",this.imageFiles=[],this.videoFiles=[],e.index.navigateBack())}}};if(!Array){(e.resolveComponent("uni-nav-bar")+e.resolveComponent("uni-file-picker"))()}Math||((()=>"../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js")+(()=>"../../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js"))();var a=e._export_sfc(s,[["render",function(i,t,n,o,s,a){return e.e({a:e.o((e=>a.onNarLeftClick())),b:e.p({"left-icon":"back",fixed:"true",backgroundColor:"#fff",color:"#808080",statusBar:"true"}),c:e.t(s.questionTitle),d:s.answerText,e:e.o(((...e)=>a.onTextareaInput&&a.onTextareaInput(...e))),f:s.imageFiles.length>0},s.imageFiles.length>0?{g:e.o(a.onImageFilesSelect),h:e.o((e=>s.imageFiles=e)),i:e.p({fileMediatype:"image",mode:"grid",limit:"9",modelValue:s.imageFiles})}:{},{j:e.f(s.videoFiles,((e,i,t)=>({a:`video_${i}`,b:e.url,c:i}))),k:s.isShowAnonymity},s.isShowAnonymity?{l:1==s.isAnonymity,m:e.o((e=>a.onSwitchClick()))}:{},{n:e.o((e=>a.onImageIconClick())),o:e.o((e=>a.onCameraIconClick())),p:e.o((e=>a.onVideoIconClick())),q:e.t(s.answerText.length),r:e.o((e=>a.prepareBeforePublic())),s:s.buttonIsLoading})}]]);wx.createPage(a);
