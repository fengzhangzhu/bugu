package com.living.core.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.Data;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * jwt工具类
 *
 * @author lizijian
 */
@Data
public class JwtUtil {

  private static String secret = "YOUR secret";

  /**
   * token过期时间15天
   */
  private static long expireTime = TimeUnit.DAYS.toMillis(15);

  public static String createManagerToken(int id, String username, String password) {
    String token = JWT.create().withExpiresAt(new Date(System.currentTimeMillis() + expireTime))
        .withClaim("id", id)
        .withClaim("username", username)
        .withClaim("password", password).sign(Algorithm.HMAC256(secret));
    return token;
  }

  public static String createUserToken(int id) {
    String token = JWT.create().withExpiresAt(new Date(System.currentTimeMillis() + expireTime))
        .withClaim("id", id)
        .sign(Algorithm.HMAC256(secret));
    return token;
  }


  public static Map<String, Claim> verify(String token){
    DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
    return decodedJWT.getClaims();
  }

}
