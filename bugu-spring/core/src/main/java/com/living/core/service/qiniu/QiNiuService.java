package com.living.core.service.qiniu;


import com.google.gson.Gson;

import com.living.core.config.qiniu.QiNiuConfig;
import com.qiniu.common.QiniuException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 七牛云对象存储的相关服务
 * @author lizijian
 */
@Service
@Slf4j
public class QiNiuService {

  @Autowired
  private Gson gson;

//  @Autowired
//  private ManagerService managerService;


  protected String getUploadToken(String fileName){
    return QiNiuConfig.auth.uploadToken(QiNiuConfig.BUCKET, fileName);
  }

//  /**
//   * 删除json数组格式的文件
//   * @param picJson
//   * @throws QiniuException
//   */
//  public void deleteFileJson(String picJson) throws QiniuException {
//    if(picJson!=null){
//      String[] pics = gson.fromJson(picJson, String[].class);
//      for (String pic : pics) {
//        managerService.deleteFile(pic);
//      }
//    }
//  }


  /**
   * 删除指定文件名的文件
   * @param fileName
   * @throws QiniuException
   */
  public void deleteFile(String fileName) throws QiniuException {
    try{
      QiNiuConfig.bucketManager.delete(QiNiuConfig.BUCKET, fileName);
    }catch (Exception e){
      log.error(fileName+"-文件删除失败");
    }
  }



}
