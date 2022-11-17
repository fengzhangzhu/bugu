package com.living.activity.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * 日期工具类
 */
public class DateUtil {

  public static String todayBegin(){
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    return simpleDateFormat.format(new Date())+" 00:00:00";
  }

  public static String todayEnd(){
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    return simpleDateFormat.format(new Date())+" 23:59:59";
  }

  public static String sevenDaysAgo(){
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    String format = simpleDateFormat.format(
        new Date(System.currentTimeMillis() - TimeUnit.DAYS.toMillis(6)));
    String sevenDaysAgo=format+" 00:00:00";
    return sevenDaysAgo;
  }
}
