package com.living.activity.service;

import com.living.activity.mapper.ActivityDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 项目启动时启动自动减少热度定时任务
 */
@Slf4j
@Component
public class ReduceHotService implements ApplicationRunner {

  private static int hot = 5;

  @Resource(name = "reduceHot")
  private ScheduledExecutorService reduceHot;

  @Autowired
  private ActivityDao activityDao;


  @Override
  public void run(ApplicationArguments args) throws Exception {
   reduceHot();
  }

  public void reduceHot(){
    reduceHot.scheduleAtFixedRate(this::autoReduceHot,0,1, TimeUnit.HOURS);
  }

  public void autoReduceHot(){
    log.info("开始减少热度榜前十热度");
    List<Integer> hotActivityId = activityDao.getHotActivityId();
    activityDao.reduceHotActivityHot(hotActivityId,hot);
  }

  public static int getHot() {
    return hot;
  }

  public static void setHot(int hot) {
    ReduceHotService.hot = hot;
  }
}
