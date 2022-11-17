import md5 from "js-md5";
import {
    Protocol,
    REQUEST_SUCCEEDED_CODE,
    ServerDomain,
    OtherServerDomain,
    random16String,
    timestamp,
    key,
} from "../common/constants";
export type Method =
    | "GET"
    | "DELETE"
    | "HEAD"
    | "OPTIONS"
    | "POST"
    | "PUT"
    | "TRACE"
    | "CONNECT";

export interface Request<D> {
    header?: any;
    data: D;
}

export interface Response<D> {
    msg: string;
    code: number;
    data: D;
}

// 带签名校验的安全请求方法
export interface ApiBody {
    modular?: string;
    group: string;
    action: string;
    data: any;
    header: any;
    method: Method;
    uuid?: string;
}
let showModel = true;
/**
 * @function 获取天气
 * @returns {Promise<any>}
 */
export async function getWeatherInfo(
    latitude: number,
    longitude: number
): Promise<any> {
    return new Promise((resolve, reject) => {
        uni.request({
            method: "GET",
            url: "https://your_url.example/living/weather/now",
            data: {
                latitude,
                longitude,
            },
            header: {
                "content-type": "application/x-www-form-urlencoded", // 默认值
            },
            success: function (result) {
                // resolve调用后，即可传递到调用方使用then或者async+await同步方式进行处理逻辑
                resolve(result);
            },
            fail: function (e) {
                console.log("error in...");
                // reject调用后，即可传递到调用方使用catch或者async+await同步方式进行处理逻辑
                reject(e);
            },
        });
    });
}

/**
 * @function 封装后的请求
 * @param req 请求参数
 * @returns {Promise<RequestSuccessCallbackResult>}
 */
export async function request(req: Request<ApiBody>): Promise<any> {
    let token = "";
    try {
        token = uni.getStorageSync("token");
    } catch {}
    if (!token) {
        console.log("未登錄");
    }
    let random16 = random16String();
    let time = timestamp;
    let header = {
        ...req.data.header,
        t: time,
        r: random16,
        s: md5(time + random16 + key),
        token: token,
    };

    return new Promise((resolve, reject) => {
        uni.request({
            method: req.data.method,
            url: `${Protocol}://${ServerDomain}${
                req.data.modular ? "/" + req.data.modular : ""
            }/living/${req.data.group}/${req.data.action}`,
            data: req.data.data,
            header: header,
            success: function (result) {
                // resolve调用后，即可传递到调用方使用then或者async+await同步方式进行处理逻辑
                resolve(result);

                let data = result.data as any;
                let resCode = data.code;
                let userMsg = data.userMsg;
                if (resCode != REQUEST_SUCCEEDED_CODE) {
                    console.log(result.data);
                    if (resCode === "A0001" || resCode === "A0005") {
                        uni.showToast({
                            title: "登录过期，请重新登录",
                            icon: "none",
                        });
                        // uni.showModal({
                        // 	title: '登录过期',
                        // 	content: '登录过期请重新登录',
                        // 	success: function(res) {
                        // 		if (res.confirm) {
                        // 			uni.setStorage({
                        // 				key: 'token',
                        // 				data: null
                        // 			})
                        // 			uni.navigateTo({
                        // 				url: '/pages/login/login'
                        // 			})
                        // 			showModel = true
                        // 		}else{
                        // 			showModel = true
                        // 		}
                        // 	}
                        // })
                    } else {
                        if (result.data.data === "用户未认证,请先认证") {
                            uni.showModal({
                                title: "未实名认证",
                                content: "发布内容需要实名认证哦~",
                                success: function (res) {
                                    if (res.confirm) {
                                        uni.navigateTo({
                                            url: "/pages/setting/setting?open_real_name_authentication=true",
                                        });
                                        showModel = true;
                                    } else {
                                        showModel = true;
                                    }
                                },
                            });
                            return result;
                        }
                        if (data.errMsg == "用户未认证,请先认证") {
                            uni.showModal({
                                title: "未实名认证",
                                content: "发布内容需要实名认证哦~",
                                success: function (res) {
                                    if (res.confirm) {
                                        uni.navigateTo({
                                            url: "/pages/setting/setting?open_real_name_authentication=true",
                                        });
                                        showModel = true;
                                    } else {
                                        showModel = true;
                                    }
                                },
                            });
                            return result;
                        }

                        uni.showToast({
                            title: userMsg ? userMsg : "网络异常",
                            icon: "none",
                        });
                    }
                }
                return result;
            },
            fail: function (e) {
                console.log("error in...");
                // reject调用后，即可传递到调用方使用catch或者async+await同步方式进行处理逻辑
                msag(e);
                reject(e);
            },
        });
    });
}

//失败提示
function msag(err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                uni.showToast({
                    title: err.response.data.error.details,
                    icon: "none",
                });
                break;
            case 401:
                uni.showToast({
                    title: "未授权，请登录",
                    icon: "none",
                });
                break;

            case 403:
                uni.showToast({
                    title: "拒绝访问",
                    icon: "none",
                });
                break;

            case 404:
                uni.showToast({
                    title: "请求地址出错",
                    icon: "none",
                });
                break;

            case 408:
                uni.showToast({
                    title: "请求超时",
                    icon: "none",
                });
                break;

            case 500:
                uni.showToast({
                    title: "服务器内部错误",
                    icon: "none",
                });
                break;

            case 501:
                uni.showToast({
                    title: "服务未实现",
                    icon: "none",
                });
                break;

            case 502:
                uni.showToast({
                    title: "网关错误",
                    icon: "none",
                });
                break;
            case 503:
                uni.showToast({
                    title: "服务不可用",
                    icon: "none",
                });
                break;

            case 504:
                uni.showToast({
                    title: "网关超时",
                    icon: "none",
                });
                break;

            case 505:
                uni.showToast({
                    title: "HTTP版本不受支持",
                    icon: "none",
                });
                break;
            default:
        }
    }
}
