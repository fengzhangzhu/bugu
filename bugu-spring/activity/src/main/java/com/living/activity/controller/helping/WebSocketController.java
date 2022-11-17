package com.living.activity.controller.helping;

import com.living.core.websocket.WebSocket;
import com.living.core.result.ApiResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.Session;

/**
 * <P>
 *     负责将当前在线用户信息传输给互助模块
 * </P>
 * @author 大忽悠
 * @create 2022/2/18 13:45
 */
@RestController
@RequestMapping("/livingAndHelping")
public class WebSocketController {

    @GetMapping("/userIsOnline")
    public ApiResult<Session> userIsOnline(@RequestParam Integer uid)
    {
        return ApiResult.success(WebSocket.getSessionByUserId(uid));
    }

}
