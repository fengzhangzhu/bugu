import CryptoJS from "crypto-js";

let aesPrivateKey = "f0HtUct3NPlDVuIW"
function aesEncrypt (encryptString) {
    var key = CryptoJS.enc.Utf8.parse(aesPrivateKey);
    var srcs = CryptoJS.enc.Utf8.parse(encryptString);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Iso10126});
    return encrypted.toString();
}
/**
 * AES 解密
 * @param decryptString 要解密的字符串
 * @returns {string} 解密后的字符串
 */
function aesDecrypt (decryptString) {
    var key = CryptoJS.enc.Utf8.parse(aesPrivateKey);
    var decrypt = CryptoJS.AES.decrypt(decryptString, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Iso10126});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * 解密结果处理，将json转为js对象
 */
function json_parse(decrypted) {
    decrypted = decrypted.replace(decrypted.split("}")[decrypted.split("}").length - 1], "");
    //decrypted = decrypted.replace(/\ +/g, "");
    decrypted = decrypted.replace(/[\r\n]/g, "");
    decrypted = decrypted.replace(/\ufeff/g, "");
    if (!decrypted.replace(" ", "")) decrypted = "{}";
    return JSON.parse(decrypted);
}
let aes = {
    encrypt:aesEncrypt,
    decrypt: aesDecrypt,
    json_parse: json_parse
}
export default aes