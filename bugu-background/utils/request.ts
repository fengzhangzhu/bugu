/* eslint-disable import/no-anonymous-default-export */
/**
 * 网络请求配置
 */
import { message } from "antd";
import axios from "axios";
import  Router  from "next/router";
import Qs from 'querystring'
import { key, random16String, REQUEST_SUCCEEDED_CODE, timestamp } from "./constants";
import md5 from 'js-md5'
export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'
interface Requset{
    method:Method,
    url:string
    data?:any

}

 axios.defaults.timeout = 100000;
 const ipurl = '/api/'
export const servicePath={
  // 文件管理
     CeartDirectory:'living/Manager/directory/new',
     GetFile:'living/Manager/directory/show',
     DeleteFile:'living/Manager/file/delete',
     RenameFile:'living/Manager/file/rename',
     UploadFile:'living/Manager/file/upload',
     DeleteFloder:'living/Manager/directory/delete',
     Login:'living/Manager/login',
     //动态审核
     ArticleReview:'living/Manager/audit/getNotAudit',
     ArticlePassed:'living/Manager/audit/pass',
     OnlineNumber:'living/Manager/monitor/online',
     PassArticle:'living/Manager/audit/pass/',
     DeleteArticle:'living/Manager/audit/delete/',
     //apilog日志
      ApiLogGroup:'living/Manager/log/result/group',
      ApiLogGroupList:'living/Manager/log/result/group/list',
      ApiLogList:'living/Manager/log/result/list',
      ApiErrorLogGroup:'living/Manager/log/error/group',
      ApiErrorLogGroupList:'living/Manager/log/error/group/list',
      ApiErrorLogList:'living/Manager/log/error/list',
      //头像审核
      AvatarReview:'living/Manager/audit/avatar/list',
      AvatarPass:'living/Manager/audit/avatar/pass',
      AvatarDelete:'living/Manager/audit/avatar/delete',
      //标签审核
      LabelReview:'living/Manager/audit/label/list',
      LabelAction:'living/Manager/audit/label/',
      //实名认证审核
      AuthenticationReview:'living/Manager/verifyRequest/list',
      AuthenticationAction:'/living/Manager/verifyRequest/',
      //用户举报
      UserReportList:'living/Manager/userComplain/list',
      PunishUser:'living/Manager/punish',
      //官方发布消息
      OfficialNewsList:'living/Manager/officialMessage/list',
      OfficialNewsAction:'living/Manager/officialMessage',
      //盲盒
      getBoxOpenState:'living/Manager/blindBoxOpenState',
      blindBoxControl:'living/Manager/blindBoxControl',
      //首页banner
      getBannerList:'living/Manager/banner/list',
      deleteBannerItem:'living/Manager/banner/delete',
      addBannerItem:'living/Manager/banner/add',
      //热门动态
      getHotActivitiesList:'living/Manager/hotActivityList',
      getAutoReduceHotState:'living/Manager/autoReduceHot/state',
      setAutoReduceHot:'living/Manager/autoReduceHot/setHot',
      getAutoReduceHot:'living/Manager/autoReduceHot/getHot',
      openAutoReduceHot:'living/Manager/autoReduceHot/open',
      closeAutoReduceHot:'living/Manager/autoReduceHot/close',
      //控制匿名
      getAnonymityState:'living/Manager/anonymity/state',
      openAnonymity:'living/Manager/anonymity/open',
      closeAnonymity:'living/Manager/anonymity/close',
      //问题审核
      QuestionReview:'living/Manager/audit/getNotAuditQuestion',
      PassQuestion:'living/Manager/audit/question/pass/',
      DeletQuestion:'living/Manager/audit/question/delete/',
      //回答审核
      AnswerReview:'living/Manager/audit/getNotAuditAnswer',
      PassAnswer:'living/Manager/audit/answer/pass/',
      DeletAnswer:'living/Manager/audit/answer/delete/',
      //问题的标签
      QuestionLabelReview:'living/Manager/audit/question/label/list',
      PassQuestionLabel:'living/Manager/audit/question/label/',
      DeletQuestionLabel:'living/Manager/audit/question/label/',
}


 //统一接口处理，返回数据
 export default function (req:Requset) {
   return new Promise<any>((resolve, reject) => {
    let url:string
    let data=req.data
    let token = localStorage.getItem('hbutback-token')
    let random16 = random16String()
    let time = timestamp
     if(req.method==='GET'){
      url = ipurl+req.url+'?'+Qs.stringify(req.data)
      data = Qs.stringify(req.data)
     }else if(req.url=='/upload'){
      url = req.url
     }else{
      url = ipurl+req.url
      data = Qs.stringify(req.data)
     }
    console.log(Qs.stringify(req.data))
    axios({
        method:req.method,
        url:url,//跨域标识，访问时会去掉ipurl
        data:data,
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded',
                    'token':token,
                    't':time,
                    'r':random16,
                    's':md5(time+random16+key)
      },
    }).then(res=>{
            if(res.data.code!=REQUEST_SUCCEEDED_CODE){
              message.error(res.data.userMsg)
            }
            resolve(res.data)
    }).catch(err=>{
        msag(err)
        reject(err)      
  })
   });
 }
 
 //失败提示
 function msag(err) {
   if (err && err.response) {
     switch (err.response.status) {
       case 400:
         alert(err.response.data.error.details);
         break;
       case 401:
         alert("未授权，请登录");
         break;
 
       case 403:
         alert("拒绝访问");
         break;
 
       case 404:
         alert("请求地址出错");
         break;
 
       case 408:
         alert("请求超时");
         break;
 
       case 500:
         alert("服务器内部错误");
         break;
 
       case 501:
         alert("服务未实现");
         break;
 
       case 502:
         alert("网关错误");
         break;
 
       case 503:
         alert("服务不可用");
         break;
 
       case 504:
         alert("网关超时");
         break;
 
       case 505:
         alert("HTTP版本不受支持");
         break;
       default:
     }
   }
 }
 
