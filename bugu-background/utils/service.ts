import { message } from 'antd';
import { REQUEST_SUCCEEDED_CODE } from './constants';
import request, { servicePath } from './request';

export interface LabelItem {
    id: number;
    content: string;
    icon: string;
    hot: number;
    isRecommended: number;
}
const ipurl = '/api/'
enum paths {
    getLabelList = 'living/Manager/label/list',
    updateLabelInfo = 'living/Manager/label/update',
    getRecommendedLabel = 'living/Manager/label/recommended/list',
    searchLabel = 'living/Manager/label/search',
    getUploadToken = 'living/Manager/label/getToken',
}

export const getLabelList = async (page = 1): Promise<LabelItem[]> =>{
    const res = await request({
        method: 'GET',
        url: paths.getLabelList,
        data: {
            page
        }
    })
    if(res.code === REQUEST_SUCCEEDED_CODE){
        return res.data.list as LabelItem[];
    }else{
        message.error(res.userMsg??'请求出错');
        return [];
    }
}
export const uploadLabelInfo = async (data:LabelItem)=>{
    const res = await request({
        method: 'POST',
        url:paths.updateLabelInfo,
        data
    })
    if(res.code === REQUEST_SUCCEEDED_CODE){
        return true;
    }else{
        message.error(res.userMsg??'请求出错');
        return false;
    }
}
export const getRecommendedLabelList = async (): Promise<LabelItem[]> =>{
    const res = await request({
        method: 'GET',
        url: paths.getRecommendedLabel,
        data: {
        }
    })
    if(res.code === REQUEST_SUCCEEDED_CODE){
        return res.data as LabelItem[];
    }else{
        message.error(res.userMsg??'请求出错');
        return [];
    }
}
export const getIconUploadToken = async ()=>{
    const res = await request({
        method: 'GET',
        url: paths.getUploadToken,
        data: {
        }
    })
    if(res.code === REQUEST_SUCCEEDED_CODE){
        return res.data;
    }else{
        message.error(res.userMsg??'请求出错');
        return null;
    }
}

export const uploadIconFile = async (file:string,key:string,token:string)=>{
    return new Promise((resolve,reject) => {
        const formData = new FormData();
        formData.append('file',file);
        formData.append('key', key);
        formData.append('token', token);
        request({
            url: '/upload',
            method: 'POST',
            data: formData,
        }).then(data => {
            resolve(data)
        },()=>{
            reject('上传失败');
        })
    })
}

//删除标签
export const deleteActivityLabel = async (id:number)=>{
    const data = await request({
        method: 'DELETE',
        url: servicePath.LabelAction + `${id}/delete`,
        data: {
            id: id,
        }
    })
    if (data.code === REQUEST_SUCCEEDED_CODE) {
        
        message.success('删除成功')
        return true
    } else {
        message.error("请求失败")
        return false
    }
    
}