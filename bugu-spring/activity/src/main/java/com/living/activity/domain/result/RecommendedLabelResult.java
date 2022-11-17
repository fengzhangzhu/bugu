package com.living.activity.domain.result;

import com.living.activity.domain.dao.Label;
import com.living.core.config.qiniu.QiNiuConfig;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author mulan
 * @version 1.0
 * @description TODO
 * @date 2022年 08月09日 17:32:18
 */
@Data
@AllArgsConstructor
public class RecommendedLabelResult {
    private int id;
    private int hot;
    private String icon;
    private String content;

    public RecommendedLabelResult(Label label){
        this.id = label.getId();
        this.hot = label.getHot();
        this.content = label.getContent();
        this.icon  = QiNiuConfig.URL+label.getIcon();
    }
}
