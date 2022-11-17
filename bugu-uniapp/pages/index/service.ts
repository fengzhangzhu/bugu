import { request } from "@/utils/request";
import { REQUEST_SUCCEEDED_CODE } from "@/common/constants";

export interface RecommendedLabelItem{
	id:number;
	content:string;
	icon:string;
	hot:number
}
enum paths{
	getRecommendedLabels = 'living/activity/label/recommended'
}
export const getRecommendedLabels = async ():Promise<RecommendedLabelItem[]>=> {
	let res = await request({
	  data: {
	    method: 'GET',
	    group: 'activity',
	    action: `label/recommended`,
	    data: {
	    },
	    header: {
	      'content-type': 'application/x-www-form-urlencoded',// 默认值
	      
	    },
	  }
	});
	
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return res.data.data as RecommendedLabelItem[]
	} else {
	  return []
	}
}