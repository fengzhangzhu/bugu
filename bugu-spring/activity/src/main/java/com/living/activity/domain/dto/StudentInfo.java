package com.living.activity.domain.dto;

import lombok.Data;

/**
 * @author lizijian
 */
@Data
public class StudentInfo {

    /**
     * 班级
     */
    private String studentClass;
    /**
     * 学号
     */
    private String studentId;
    /**
     * 姓名
     */
    private String name;

    /**
     * 性别
     */
    private String sex;
    /**
     * 民族
     */
    private String nation;
    /**
     * 学院
     */
    private String college;
    /**
     * 专业
     */
    private String major;

    public StudentInfo(String studentClass, String studentId, String name, String sex, String nation, String college, String major) {
        this.studentClass = studentClass;
        this.studentId = studentId;
        this.name = name;
        this.sex = sex;
        this.nation = nation;
        this.college = college;
        this.major = major;
    }

    public StudentInfo(){}
}
