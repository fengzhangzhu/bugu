package com.living.core.result;



import com.living.core.util.LogUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author shadowfish
 */
@Data
@NoArgsConstructor
@Slf4j
public class ApiResult<T> {

    /**
     * 状态代码
     */
    private String code;

    /**
     * debug报错提示信息
     */
    private String errMsg;

    /**
     * 用户提示信息
     */
    private String userMsg;


    private String taskId;

    /**
     * 数据
     */
    private T data;

    public static ApiResult<?> success() {
        return new ApiResult<>(ResultCode.SUCCESS, "success");
    }



    public static <W> ApiResult<W> fail(String code, String errMsg, String userMsg) {
        return new ApiResult<>(code,errMsg,userMsg,null);
    }
    public static <W> ApiResult<W> fail(String code, String errMsg) {
        return new ApiResult<>(code,errMsg,null,null);
    }

    public static <W> ApiResult<W> fail(String code, String errMsg, String userMsg, W data) {
        return new ApiResult<>(code,errMsg,userMsg,data);
    }

    public static <W> ApiResult<W> success(W data) {
        return new ApiResult<>(ResultCode.SUCCESS, "success", data);
    }

    public ApiResult(String code) {
        this(code, null, null);
    }

    public ApiResult(String code, String errorMsg) {
        this(code, errorMsg, null);
    }

    public ApiResult(String code, String errorMsg, T data) {
        this.code = code;
        this.errMsg = errorMsg;
        this.data = data;
        this.taskId = LogUtil.getTaskId();
    }

    public ApiResult(String code, String errMsg, String userMsg, T data) {
        this.code = code;
        this.errMsg = errMsg;
        this.userMsg = userMsg;
        this.data = data;
        this.taskId = LogUtil.getTaskId();
    }
}
