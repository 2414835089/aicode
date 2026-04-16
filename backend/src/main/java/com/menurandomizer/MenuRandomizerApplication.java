package com.menurandomizer;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.menurandomizer.mapper")
public class MenuRandomizerApplication {
    public static void main(String[] args) {
        SpringApplication.run(MenuRandomizerApplication.class, args);
    }
}