import { request } from "@/utils/request";
import { REQUEST_SUCCEEDED_CODE } from "@/common/constants";
/**
 * @description 点赞问题
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function likeQuestion(id: number) {
	let res = await request({
	  data: {
		method: 'POST',
		group: 'question',
		action: `${id}/like`,
		data: {
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded',// 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return true
	} else {
		if(res.data.errMsg==="请勿重复点赞"){
			return true 
		}else{
			return false
		}
	  
	}
}
/**
 * @description 关注问题
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function collectQuestion(id: number) {
	let res = await request({
	  data: {
		method: 'POST',
		group: 'question',
		action: `${id}/collect`,
		data: {
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded',// 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return true
	} else {
		if(res.data.errMsg==="请勿重复点赞"){
			return true 
		}else{
			return false
		}
	  
	}
}
/**
 * @description 取消点赞/关注问题
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function cancelLikeQuestion(id: number) {
  	let res = await request({
  	  data: {
  		method: 'POST',
  		group: 'question',
  		action: `${id}/like/remove`,
  		data: {
  		},
  		header: {
  		  'content-type': 'application/x-www-form-urlencoded',// 默认值
  		},
  	  }
  	});
  	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
  	  return true
  	} else {
  	  return false
  	}
}
/**
 * @description 取消收藏问题
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function cancelCollectQuestion(id: number) {
	let res = await request({
	  data: {
		method: 'POST',
		group: 'question',
		action: `${id}/collect/remove`,
		data: {
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded',// 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return true
	} else {
		
	  return false
	}
}
/**
 * @description 删除回答
 * @param {number} comment_id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function deleteAnswer(issue_id:number,comment_id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'helping',
		action: `{id}/delete`,
		data: {
		  issue_id,
		  comment_id
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded',// 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return true
	} else {
	  return false
	}
}
/**
 * @description 删除问题
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function deleteQuestion(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'question',
		action: `${id}/delete`,
		data: {
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded',// 默认值
		},
	  }
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  return true
	} else {
	  return false
	}
  }