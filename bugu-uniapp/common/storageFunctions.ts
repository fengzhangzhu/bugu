import { USER_INFO,
		} from "./storageKeys";

import {USER_MESSAGE,InteractiveType} from "@/common/constants";
import {getUserinfo} from "@/common/requestFunctions"
/**
 * @function 从缓存获取我的个人信息
 * @returns {UserInfo} 个人信息
 */
export async function getMyUserInfo() {
  let userInfo = uni.getStorageSync( USER_INFO ) as UserInfo
  return userInfo
}