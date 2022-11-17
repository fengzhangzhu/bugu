package com.living.activity.util;

import com.vdurmont.emoji.EmojiManager;

/**
 * 字符串工具类
 * @author lizijian
 */
public class StringUtil {

  /**
   * 判断字符串中是否含有表情
   * @param source
   * @return
   */
  public static boolean containsEmoji(String source) {
    if(EmojiManager.containsEmoji(source)){
      return true;
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(containsEmoji("你好哈哈"));
  }
}
