export interface User {
    Id: String;
    Username: string;
    School: string;
    SchoolId: string;
    RealName: string;
    SchoolClass: string;
    MyClass: string;
    Committee: string;
    FirstWeek: string;
    Dorm: string;
    Email: string;
}
export const SECRET_KEY = {
    asskey: "your asskey",
};
export const localMode = true;
export const debugMode = true;
export const key = "your key";
export const timestamp = new Date().getTime() * 1000; //获取当前时间戳
export function random16String() {
    //生成一个长度为16的随机字符串
    let len = 16;
    let $chars = "your chars";
    let maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export const REQUEST_SUCCEEDED_CODE = "00000";
export const ImageFatherPath = "http://r073vi5gy.hd-bkt.clouddn.com/";
