package com.living.core.service;


import com.living.core.domain.dao.OfficeMessage;
import com.living.core.mapper.OfficialMessageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 官方消息服务类
 */
@Component
public class OfficialMessageService {

  @Autowired
  private OfficialMessageDao officialMessageDao;


  public void sendOfficialMessage(String text,String pic,int userId,String messageType){
    OfficeMessage officeMessage = OfficeMessage.create(text, pic,messageType);
    officialMessageDao.addOfficeMessage(officeMessage);
    officialMessageDao.addOfficeMessageObject(officeMessage.getId(), userId);
  }
}
