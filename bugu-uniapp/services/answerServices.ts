import { request } from "@/utils/request";
import { REQUEST_SUCCEEDED_CODE } from "@/common/constants";

const COMMENT_GROUP = 'answer/comment'
/**
 * @description 删除回答
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function deleteAnswer(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'answer',
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

/**
 * @description 赞同回答
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function agreeAnswer(id: number) {
	let res = await request({
	  data: {
		method: 'POST',
		group: 'answer',
		action: `${id}/agree`,
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
 * @description 取消赞同回答
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function cancelAgreeAnswer(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'answer',
		action: `${id}/agree/remove`,
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
 * @description 反对回答
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function opposeAnswer(id: number) {
	let res = await request({
	  data: {
		method: 'POST',
		group: 'answer',
		action: `${id}/oppose`,
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
 * @description 取消反对回答
 * @param {number} id 问题的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function cancelOpposeAnswer(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'answer',
		action: `${id}/oppose/remove`,
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
 * @description 评论回答
 * @param {number} id 回答的id
 * @param {string} content 评论内容
 * @param type 回复类型
 * @param {number} 成功返回id 失败返回-1
 */
export async function commentAnswer(id: number, content: string, type: number) {
	let res = await request({
		data: {
			method: 'POST',
			group: COMMENT_GROUP,
			action: `${id}`,
			data: {
				id,
				content: content,
				type: type
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded', // 默认值
			},
		}
	});
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
		return res.data.data
	} else {
		return -1
	}
}
/**
 * @description 回复回答的评论
 * @param id 评论的Id
 * @param content 回复内容
 * @param type 回复类型
 * @param toUserId 对象的Id 为0时不回复任何人 为-1时回复匿名用户
 * @return {number} 成功返回id 失败返回-1
 */
export async function ReplyAnswerComments(id: number, content: string, type: number, toUserId: number = 0) {
	  let res = await request({
		data: {
		  method: 'POST',
		  group: COMMENT_GROUP,
		  action: `comment/${id}/response`,
		  data: {
			id,
			content: content,
			toUserId,
			type
		  },
		  header: {
			'content-type': 'application/x-www-form-urlencoded',// 默认值
		  },
		}
	  });
	  
	  if (res.data.code === REQUEST_SUCCEEDED_CODE) {
		return res.data.data
		} else {
			return -1
		}
}

/**
 * @description 点赞回答的评论
 * @param {number} id 评论的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function likeAnwserComment(id: number) {
	let res = await request({
	  data: {
		method: 'PUT',
		group: COMMENT_GROUP,
		action: `comment/${id}/like`,
		data: {
		  id
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
 * @description 取消点赞回答的评论
 * @param {number} id 评论的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function cancelLikeAnwserComment(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: COMMENT_GROUP,
		action: `comment/${id}/like/remove`,
		data: {
		  id
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
 * @description 删除回答的评论
 * @param {number} id 评论的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function deleteAnswerComment(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: COMMENT_GROUP,
		action: `comment/${id}/delete`,
		data: {
		 id
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
 * @description 删除回答评论的回复
 * @param {number} id 回答评论的回复的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function deleteAnswerCommentReply(id:number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: COMMENT_GROUP,
		action: `comment/response/${id}/delete`,
		data: {
			id
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