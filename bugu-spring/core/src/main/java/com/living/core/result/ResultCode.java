package com.living.core.result;

/**
 * @author lizijian
 */
public class ResultCode {

  public static final String SUCCESS = "00000";

  /**
   * 请求错误
   */
  public static final String INVALID_PARAM = "A0001";

  public static final String MISSING_PARAM = "A0002";

  public static final String INVALID_REQUEST = "A0003";

  public static final String WRONG_ACTION = "A0004";

  public static final String TOKEN_ERROR="A0005";

  /**
   * 用户错误
   */
  public static final String PASSWORD_WRONG = "A0100";

  public static final String USERNAME_OR_PASSWORD_WRONG="A0101";

  /**
   * 资源访问错误
   */
  public static final String RESOURCE_NOT_EXIST="A0201";

  public static final String RESOURCE_EXIST="A0202";

  public static final String NO_PERMISSION="A0203";



  /**
   * 后端错误
   */
  public static final String INTERNAL_SERVER_ERROR = "B0001";


}
