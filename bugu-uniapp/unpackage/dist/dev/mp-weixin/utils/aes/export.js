"use strict";
var common_vendor = require("../../common/vendor.js");
let aesPrivateKey = "f0HtUct3NPlDVuIW";
function aesEncrypt(encryptString) {
  var key = common_vendor.cryptoJs.exports.enc.Utf8.parse(aesPrivateKey);
  var srcs = common_vendor.cryptoJs.exports.enc.Utf8.parse(encryptString);
  var encrypted = common_vendor.cryptoJs.exports.AES.encrypt(srcs, key, { mode: common_vendor.cryptoJs.exports.mode.ECB, padding: common_vendor.cryptoJs.exports.pad.Iso10126 });
  return encrypted.toString();
}
function aesDecrypt(decryptString) {
  var key = common_vendor.cryptoJs.exports.enc.Utf8.parse(aesPrivateKey);
  var decrypt = common_vendor.cryptoJs.exports.AES.decrypt(decryptString, key, { mode: common_vendor.cryptoJs.exports.mode.ECB, padding: common_vendor.cryptoJs.exports.pad.Iso10126 });
  return common_vendor.cryptoJs.exports.enc.Utf8.stringify(decrypt).toString();
}
function json_parse(decrypted) {
  decrypted = decrypted.replace(decrypted.split("}")[decrypted.split("}").length - 1], "");
  decrypted = decrypted.replace(/[\r\n]/g, "");
  decrypted = decrypted.replace(/\ufeff/g, "");
  if (!decrypted.replace(" ", ""))
    decrypted = "{}";
  return JSON.parse(decrypted);
}
const aes = {
  encrypt: aesEncrypt,
  decrypt: aesDecrypt,
  json_parse
};
exports.aes = aes;
