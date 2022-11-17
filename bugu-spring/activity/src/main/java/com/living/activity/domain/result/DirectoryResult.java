package com.living.activity.domain.result;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Set;

/**
 * @author lizijian
 */
@ApiModel(value = "文件夹信息",description = "包含子文件和子文件夹名，以及存储地址")
@Data
@AllArgsConstructor
public class DirectoryResult {
  private String url;
  private List<String> directory;
  private Set<String> file;
}
