package com.living.activity.config.swagger;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

import javax.servlet.ServletContext;

/**
 * @author lizijian
 */
@Configuration
@EnableSwagger2WebMvc
public class Swagger2 {
    @Bean
    public Docket createMainRestApi(ServletContext servletContext) {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("主模块")
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.living.activity.controller"))
                .paths(PathSelectors.any())
                .build();
    }
    @Bean
    public Docket createQuestionRestApi(ServletContext servletContext) {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("问答模块")
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.living.question.controller"))
                .paths(PathSelectors.any())
                .build();
    }
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("湖工living api")
                .description("")
                .version("1.0")
                .build();
    }
}
