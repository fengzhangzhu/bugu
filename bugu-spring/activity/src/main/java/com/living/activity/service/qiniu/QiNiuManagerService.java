package com.living.activity.service.qiniu;

import com.living.core.domain.result.QiNiuTokenResult;
import com.living.core.service.qiniu.QiNiuService;
import com.living.core.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 08月10日 15:02:30
 */
@Service
public class QiNiuManagerService extends QiNiuService {
    private static final String USER_LABEL_DIRECTORY="user/label/";


    private String createActivityFileName(){
        return USER_LABEL_DIRECTORY+new Date().getTime()+"-"+ UUID.randomUUID();
    }


    public QiNiuTokenResult getLabelIconTokenResults() throws Exception {
        String fileName = createActivityFileName();
        return new QiNiuTokenResult(getUploadToken(fileName),fileName);
    }
}
