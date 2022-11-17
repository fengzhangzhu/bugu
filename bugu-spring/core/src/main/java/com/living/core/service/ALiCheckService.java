package com.living.core.service;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.imageaudit.model.v20191230.ScanImageRequest;
import com.aliyuncs.imageaudit.model.v20191230.ScanImageResponse;
import com.aliyuncs.profile.DefaultProfile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @Author mulan
 * @Date 2022/7/18 22:32
 * @PackageName:com.living.bugu.core.service
 * @ClassName: ALiCheckService
 * @Description: TODO
 * @Version 1.0
 */
@Service
@Slf4j
public class ALiCheckService {
    private static IAcsClient client = null;

    @Autowired
    protected OfficialMessageService officialMessageService;
    static {
        DefaultProfile profile = DefaultProfile.getProfile(
                "cn-shanghai",             //默认
                "LTAI4G8cPfqJhf2Pu8u7SNjw",         //您的AccessKeyID
                "a2mzvA3Tk8kcqYJU6ZGIf8kIQE3USU");    //您的AccessKeySecret

        client = new DefaultAcsClient(profile);
    }
    /**
     * 获取阿里云审核结果
     */
    protected   boolean getCheckResult(String url) throws ClientException {
        ScanImageRequest req = new ScanImageRequest();
        List<String> scenes = new ArrayList<String>();
        scenes.add("porn");
        scenes.add("terrorism");
        req.setScenes(scenes);
        List<ScanImageRequest.Task> tasks = new ArrayList<ScanImageRequest.Task>();
        com.aliyuncs.imageaudit.model.v20191230.ScanImageRequest.Task task = new ScanImageRequest.Task();
        task.setDataId(UUID.randomUUID().toString());
        task.setImageURL(url);
        tasks.add(task);
        req.setTasks(tasks);
        ScanImageResponse resp = client.getAcsResponse(req);
        List<ScanImageResponse.Data.Result.SubResult> subResults = resp.getData().getResults().get(0).getSubResults();
        for (ScanImageResponse.Data.Result.SubResult subResult : subResults) {
            if(!"pass".equals(subResult.getSuggestion())){
                return false;
            }
        }
        return true;
    }

}
