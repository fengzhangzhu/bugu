package com.living.activity.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.living.activity.domain.dao.BlindBox;
import com.living.activity.domain.dao.BlindBoxTicket;
import com.living.activity.domain.dto.BlindBoxCollectLog;
import com.living.activity.domain.dto.BoxInfo;
import com.living.activity.domain.helper.BlindBoxTicketHelper;
import com.living.activity.domain.result.*;
import com.living.activity.mapper.BlindBoxDao;
import com.living.core.domain.dao.User;
import com.living.core.domain.result.PageResult;
import com.living.core.exception.NoPermissionException;
import com.living.core.exception.ResourseNotExistException;
import com.living.core.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BlindBoxService {

  @Autowired
  private BlindBoxDao blindBoxDao;

  public void deliver(String text,short sex) throws NoPermissionException {
    User user = UserUtil.getUser();
    int myId = user.getId();
    if(user.getSex()==null){
      throw new NoPermissionException("请设置性别后再使用此功能");
    }
    if(sex != user.getSex()){
      if(user.getSex()==1){
        throw new NoPermissionException("小哥哥,请投放到男盒");
      }else {
        throw new NoPermissionException("小姐姐,请投放到女盒");
      }
    }
    Integer todayBoxId = blindBoxDao.getTodayBox(myId);
    if(todayBoxId!=null){
      throw new NoPermissionException("今日已投送");
    }
    blindBoxDao.putBox(myId,text,sex);
    Integer boxCollectChanceLogSum = blindBoxDao.getBoxCollectChanceWeekSum(myId);
    /**
     * 如果本周获取抽取盲盒机会次数少于两次，赠送抽取盲盒机会
     */
    if(boxCollectChanceLogSum==null||boxCollectChanceLogSum<2){
      blindBoxDao.addBoxCollectChance(myId);
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public BlindBoxResult collectBox(short sex)
      throws NoPermissionException, ResourseNotExistException {
    User my = UserUtil.getUser();
    if(my.getSex()==null){
      throw new NoPermissionException("请设置性别后再使用此功能");
    }
    if(my.getSex()==sex){
      throw new NoPermissionException("只可获取异性盲盒");
    }
    if(blindBoxDao.subBoxCollectChance(my.getId())<=0){
      throw new NoPermissionException("盲盒券已用完");
    }
    if(blindBoxDao.getBoxTodayCollectLog(my.getId())!=null){
      throw new NoPermissionException("今日已获取");
    }
    List<Integer> boxIds = blindBoxDao.getBoxIds(sex);
    int size = boxIds.size();
    if(size==0){
      throw new ResourseNotExistException("目前没有盲盒");
    }
    Random random=new Random();
    int index = random.nextInt(size);
    Integer boxId = boxIds.get(index);
    BlindBox box = blindBoxDao.getBoxById(boxId);
    /**
     * 盲盒标记已被收取
     */
    blindBoxDao.markCollect(boxId);
    /**
     * 插入盲盒收取记录
     */
    blindBoxDao.addBoxCollectLog(my.getId(),boxId);
    return new BlindBoxResult(box);
  }


  public PageResult<BlindBoxTicketResult> collectTicketList(int page){
    PageHelper.startPage(page,5);
    List<BlindBoxTicket> ticketList = blindBoxDao.getTicketList(UserUtil.getUserId());
    int availableTicketSum = blindBoxDao.getAvailableTicketSum(UserUtil.getUserId());
    PageInfo<BlindBoxTicket> pageInfo = new PageInfo<>(ticketList);
    return new PageResult<>(pageInfo,new BlindBoxTicketResult(availableTicketSum,ticketList.stream().map(BlindBoxTicketHelper::new).collect(Collectors.toList())));
  }

  public PageResult<List<BlindBoxCollectLogResult>> collectLog(int page){
    PageHelper.startPage(page,5);
    List<BlindBoxCollectLog> collectLog = blindBoxDao.getCollectLog(UserUtil.getUserId());
    PageInfo<BlindBoxCollectLog> pageInfo = new PageInfo<>(collectLog);
    return new PageResult<>(pageInfo,collectLog.stream().map(BlindBoxCollectLogResult::new).collect(Collectors.toList()));
  }


  public PageResult<List<BlindBoxDeliverLogResult>> deliverLog(int page){
    PageHelper.startPage(page,5);
    List<BlindBox> deliverLog = blindBoxDao.getDeliverLog(UserUtil.getUserId());
    PageInfo<BlindBox> pageInfo = new PageInfo<>(deliverLog);
    return new PageResult<>(pageInfo,deliverLog.stream().map(BlindBoxDeliverLogResult::new).collect(
        Collectors.toList()));
  }

  public void deleteBox(int boxId) throws ResourseNotExistException, NoPermissionException {
    BlindBox box = blindBoxDao.getBoxById(boxId);
    if(box==null){
      throw new ResourseNotExistException("盲盒不存在");
    }
    if(box.getUserId()!=UserUtil.getUserId()){
      throw new NoPermissionException("没有权限删除");
    }
    blindBoxDao.deleteBox(boxId);
  }

  public BoxInfo info(){
    return blindBoxDao.getInfo();
  }
}
