"use strict";
function textFilter(text) {
  let re = /中国猪|台湾猪|贱人|大sb|sb|傻逼|S B|SB|s b|傻 逼|傻b|煞逼|煞笔|刹笔|傻比|沙比|欠干|婊子养的|我日你|我操|我草|卧艹|卧槽|爆你菊|艹你|cao你|你他妈|真他妈|别他吗|草你吗|草你丫|操你妈|擦你妈|操你娘|操他妈|日你妈|干你妈|干你娘|娘西皮|狗操|狗草|狗杂种|狗日的|操你祖宗|操你全家|操你大爷|妈逼|你麻痹|麻痹的|妈了个逼|马勒|狗娘养|贱比|贱b|下贱|死全家|全家死光|全家不得好死|全家死绝|白痴|无耻|sb|杀b|你吗b|你妈的|婊子|贱货|人渣|混蛋|性伴侣|精子|射精|诱奸|强奸|做爱|性爱|发生关系|屌|屁股|下体|a片|咪咪|发情|呻吟|sm|阉割|高潮|裸露|干你|干死|我干/gi;
  let output = text.replace(re, function(sMatch) {
    return sMatch.replace(/./g, "*");
  });
  return output;
}
exports.textFilter = textFilter;
