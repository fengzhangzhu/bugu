package com.living.activity.service;

import com.living.activity.domain.dto.StudentInfo;
import com.living.activity.exception.PasswordErrorException;
import com.living.core.domain.dao.UserVerify;
import com.living.core.exception.ActionErrorException;
import com.living.core.mapper.VerifyDao;
import com.living.core.result.ApiResult;
import com.living.core.util.LogUtil;
import com.living.core.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author lizijian
 */
@Service
@Slf4j
public class VerifyService {

  @Autowired
  private VerifyDao verifyDao;

  private static final String TITLE = "湖北工业大学 -- 统一身份认证";

  private static final String LOGIN_SSO_URL = "https://sso.hbut.edu.cn:7002/cas/login?service=http://run.hbut.edu.cn/Account/sso";

  private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36";

  private static final String OWN_INFO_URL = "http://run.hbut.edu.cn/T_Student/OwnInfo";

  /**
   * 设置请求参数
   */
  private Map<String, String> getDataMapForSso(String username, String password, String lt) {
    Map<String, String> dateMap = new HashMap<>(16);
    dateMap.put("_eventId", "submit");
    dateMap.put("lt", lt);
    dateMap.put("loginType", "0");
    dateMap.put("username", username);
    dateMap.put("password", password);
    dateMap.put("j_digitPicture", "");
    return dateMap;
  }

  /**
   * 登陆湖工大首页
   */
  private  Map<String, String> loginSso(String username, String password) throws IOException, PasswordErrorException {
    Connection.Response response = Jsoup.connect(LOGIN_SSO_URL).ignoreContentType(true).method(Connection.Method.GET).timeout(10000).execute();
    Document document = response.parse();
    Elements input = document.select("input");
    String lt = input.attr("value");
    Map<String, String> data = getDataMapForSso(username, password, lt);
    Connection.Response response2 = Jsoup.connect(LOGIN_SSO_URL).ignoreContentType(true).method(Connection.Method.POST).data(data).cookies(response.cookies()).timeout(10000).execute();
    Document document2 = response2.parse();
    String title = document2.title();
    log.info(LogUtil.getMessage("title:"+title));
    if(TITLE.equals(title)){
      throw new PasswordErrorException();
    }
    return response2.cookies();
  }
  /**
   * 使用cookie获取指定url的doc
   *
   * @param url 获取doc的url
   * @return doc
   * @throws IOException
   */
  private  Document getDocWithCookie(String url, Map<String, String> cookie) throws IOException {
    if (cookie != null) {
      Document document = Jsoup.connect(url).cookies(cookie).header("User-Agent", USER_AGENT).timeout(10000).get();
      //登录成功
      if (!"登录页面".equals(document.select("title").text())) {
        return document;
      }
    }
    return null;
  }
  /**
   * 获取个人信息doc
   */
  private  Document getStuInfoDoc(String username, String password) throws PasswordErrorException, IOException {
    Map<String, String> cookie = loginSso(username, password);
    return getDocWithCookie(OWN_INFO_URL, cookie);
  }

  /**
   * 获取个人信息
   */
  public StudentInfo getStuInfo(String username, String password)
      throws PasswordErrorException, IOException {
    Document document = getStuInfoDoc(username, password);
    Elements td = document.select("td");
    StudentInfo studentInfo = new StudentInfo(
        td.get(0).html(),
        td.get(1).html(),
        td.get(2).html(),
        td.get(4).html(),
        td.get(5).html(),
        td.get(6).html(),
        td.get(7).html()
    );
    return studentInfo;
  }

  public ApiResult<?> verify(String username,String password)
      throws PasswordErrorException, IOException, ActionErrorException {
    int myId = UserUtil.getUserId();
    UserVerify verifyByUserId = verifyDao.getVerifyByUserId(myId);
    if(verifyByUserId!=null&&verifyByUserId.getIsPassed()==0){
      throw new ActionErrorException("您的实名认证正在审核中");
    }
    if(verifyByUserId!=null&&verifyByUserId.getIsPassed()==1){
      throw new ActionErrorException("您已通过实名认证");
    }
    UserVerify verify = verifyDao.getVerifyByStuId(username);
    if(verify!=null&&verify.getIsPassed()==0){
      throw new ActionErrorException("该学号正在实名认证中,如果被他人使用请联系管理员");
    }
    if(verify!=null&&verify.getIsPassed()==1){
      throw new ActionErrorException("该学号已被实名认证,如果被他人使用请联系管理员");
    }
    StudentInfo stuInfo = getStuInfo(username, password);
    short sex = 0;
    if("男".equals(stuInfo.getSex())){
      sex=1;
    }
    verifyDao.addVerify(stuInfo.getStudentId(),myId,sex,(short) 1);
    return ApiResult.success();
  }

}
