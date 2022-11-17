import { REQUEST_SUCCEEDED_CODE } from "./constants";
import { 
QuestionMessageList,
LabelItem, 
 UserInfo } from "./dataClass";
import { request } from "@/utils/request";
import {
	ChatUserInfo,
} from '@/utils/messageUtils/model'
import {
getMyUserInfo,

} from "@/common/storageFunctions";

/**
   * 
   * @description 获取最新的个人信息
   * @param userId {用户的id} 
   * @returns {UserInfo}用户的详细信息
   */
export async function getUserinfo(userId:number){
    let res = await request({
      data: {
        method: 'GET',
        group: 'user',
        action: `${userId}/info`,
        data: {
          userId: userId,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',// 默认值
          
        },
      }
    });
    
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
      return res.data.data as UserInfo
    } else {
      return 
    }
}


/**
   * @description 关注指定id的用户
   * @param userId {用户的id} 
   * @returns {boolean} 是否关注成功
   */
export async function followUser(userId:number) {
    let res = await request({
        data: {
            method: 'POST',
            group: 'social',
            action: `attention/${userId}`,
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',// 默认值
           
            },
        }
    });
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
        return true
    } else {
        console.log(res)
        return false
    }
}
/**
   * @description 取消关注指定id的用户
   * @param userId {用户的id} 
   * @returns {boolean} 是否取消关注成功
   */
export async function  cancelAttention(userId:number){
    let res = await request({
        data: {
            method: 'DELETE',
            group: 'social',
            action: `removeAttention/${userId}`,
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',// 默认值
            },
        }
    });
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
       return true
    } else {
        console.log(res)
        return false
    }
}
/**
   * @description 取消点赞动态
   * @param id 动态的id
   * @returns {boolean} 是否取消点赞成功
   */
export async function CancleLikeArticle(id:number) {
    let res = await request({
        data: {
            method: 'POST',
            group: 'activity',
            action: `${id}/like/remove`,
            data: {
                id:id
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
   * @description 点赞动态
   * @param id 动态的id
   * @returns {boolean} 是否点赞成功
   */
export async function LikeThisArtice(id:number) {
   
    let res = await request({
        data: {
            method: 'POST',
            group: 'activity',
            action: `${id}/like`,
            data: {
                id: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',// 默认值
            },
        }
    });
	console.log(res.data)
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
        return true
    } else {
        return false
    }
}
/**
   * @description 获取指定id用户的在线状态
   * @param userId 用户的id
   * @returns {boolean} 在线状态
   */
export async function GetonlineState(userId:number){
    let res = await request({
        data: {
            method: 'GET',
            group: 'message',
            action: `onlineState`,
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',// 默认值
            },
        }
    });
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
        
        return res.data.data as boolean
    } else {
        return false
    }
}
/**
   * @description 删除我的动态
   * @param id 动态的id
   * @returns {boolean} 是否删除成功
   */
export async function deleteMyArticle(id) {
    let res = await request({
      data: {
        method: 'DELETE',
        group: 'activity',
        action: `${id}/delete`,
        data: {
          id: id
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
   * @description 获取动态标签
   * @param page 页数
   */
export async  function getHotLabels(page: number = 1) {
    let res = await request({
      data: {
        method: 'GET',
        group: 'activity',
        action: 'label/list',
        data: {
          page: page
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
        },
      }
    });
    if (res.data.code === REQUEST_SUCCEEDED_CODE) {
      let Labels: LabelItem[] = res.data.data.list
      return Labels
    } else {
      return []
    }
  }
/**
 * @description 获取邀请码
 * @returns {string}
 */
export  async function getInviteUserCode():Promise<string>{
	let res = await request({
		data: {
		  method: 'GET',
		  group: 'user',
		  action: 'invite',
		  data: {
		  },
		  header: {
			'content-type': 'application/x-www-form-urlencoded', // 默认值
		  },
		}
	  });
	if(res.data.code===REQUEST_SUCCEEDED_CODE){
	   return res.data.data
	}else{
	   return ''
	}
}

/**
 * @description 更新用户信息
 * @returns {Promise<ChatUserInfo[]>}
 */
export async function updateUserInfo (userIds: number[]):Promise<ChatUserInfo[]> {
	if (!userIds || userIds.length <= 0) {
	  return []
	}
	let res = await request({
	  data: {
		method: 'GET',
		group: 'message',
		action: 'users/info',
		data: {
		  userIds: userIds
		},
		header: {
		  'content-type': 'application/x-www-form-urlencoded' // 默认值
		},
	  }
	});
	let userInfos: ChatUserInfo[] = []
	if (res.data.code === REQUEST_SUCCEEDED_CODE) {
	  userInfos = res.data.data as ChatUserInfo[]
	} else {
	  console.log(res.data)
	}
	return userInfos
}			





/**
 * @description 评论动态
 * @param {number} id 动态的id
 * @param {string} content 评论内容
 * @param {number} 成功返回id 失败返回-1
 */
export async function commentActivity(id: number, content: string, type: number) {
	let res = await request({
		data: {
			method: 'POST',
			group: 'activity',
			action: `${id}/comment`,
			data: {
				id: id,
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
 * @description 回复评论
 * @param id 评论的Id
 * @param content 回复内容
 * @param type 回复类型
 * @param toUserId 对象的Id 为0时不回复任何人 为-1时回复匿名用户
 * @return {number} 成功返回id 失败返回-1
 */
export async function ReplyComments(id: number, content: string, type: number, toUserId: number = 0) {
	  let res = await request({
		data: {
		  method: 'POST',
		  group: 'activity/comment',
		  action: `${id}/response`,
		  data: {
			id: id,
			content: content,
			toUserId: toUserId,
			type: type
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
 * @description 删除评论
 * @param {number} id 评论的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function DeleteComments(id:number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'activity/comment',
		action: `${id}/delete`,
		data: {
		  id: id
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
 * @description 删除回复
 * @param {number} id 回复的id
 * @return {boolean} 成功返回true 失败返回false
 */
export async function DeleteReply(id: number) {
	let res = await request({
	  data: {
		method: 'DELETE',
		group: 'activity/comment',
		action: `response/${id}/delete`,
		data: {
		  id: id
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



