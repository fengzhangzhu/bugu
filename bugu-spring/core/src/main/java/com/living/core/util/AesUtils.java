package com.living.core.util;


import org.springframework.util.Base64Utils;
import org.springframework.util.StringUtils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.SecretKeySpec;


/**
 * aes加解密工具类
 * @author copy from csdn
 */
public class AesUtils {

  // AES加密要求key必须要128个比特位（这里需要长度为16，否则会报错）
  private static final String KEY = "YOUR KEY";


  private static final String ALGORITHMSTR = "AES/ECB/ISO10126Padding";


  /**
   * 44      * base 64 encode 45      * @param bytes 待编码的byte[] 46      * @return 编码后的base 64 code
   * 47
   */
  private static String base64Encode(byte[] bytes) {
    return Base64Utils.encodeToString(bytes);
  }

  /**
   * 53      * base 64 decode 54      * @param base64Code 待解码的base 64 code 55      * @return
   * 解码后的byte[] 56      * @throws Exception 抛出异常 57
   */
  private static byte[] base64Decode(String base64Code) {
    return StringUtils.isEmpty(base64Code) ? null : Base64Utils.decodeFromString(base64Code);
  }


  /**
   * 64      * AES加密 65      * @param content 待加密的内容 66      * @param encryptKey 加密密钥 67      *
   *
   * @return 加密后的byte[] 68
   */
  private static byte[] aesEncryptToBytes(String content) throws Exception {
    KeyGenerator kgen = null;
    kgen = KeyGenerator.getInstance("AES");
    kgen.init(128);
    Cipher cipher = Cipher.getInstance(ALGORITHMSTR);
    cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(KEY.getBytes(), "AES"));
    return cipher.doFinal(content.getBytes("utf-8"));
  }


  /**
   * 80      * AES加密为base 64 code 81      * 82      * @param content 待加密的内容 83      * @param
   * encryptKey 加密密钥 84      * @return 加密后的base 64 code 85
   */
  public static String encrypt(String content) throws Exception {
    return base64Encode(aesEncryptToBytes(content));
  }

  /**
   * 91      * AES解密 92      * 93      * @param encryptBytes 待解密的byte[] 94      * @param decryptKey
   * 解密密钥 95      * @return 解密后的String
   */
  private static String aesDecryptByBytes(byte[] encryptBytes) throws Exception {

    KeyGenerator kgen = KeyGenerator.getInstance("AES");
    kgen.init(128);
    Cipher cipher = Cipher.getInstance(ALGORITHMSTR);
    cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(KEY.getBytes(), "AES"));
    byte[] decryptBytes = cipher.doFinal(encryptBytes);
    return new String(decryptBytes);
  }

  public static String decrypt(String encryptStr) throws Exception {
    return StringUtils.isEmpty(encryptStr) ? null : aesDecryptByBytes(base64Decode(encryptStr));
  }

  public static void main(String[] args) throws Exception {
    String encrypt = encrypt("123456");
    System.out.println(encrypt);
    System.out.println(decrypt(encrypt));
  }


}


