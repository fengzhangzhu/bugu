package com.living.activity.domain.result;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * 聊天记录日期按月份分类
 */
@Data
@AllArgsConstructor
public class MessageHistoryDateResult {
    private String month;
    private List<String> day;
}
