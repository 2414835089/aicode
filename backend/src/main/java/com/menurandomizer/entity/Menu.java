package com.menurandomizer.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Menu {
    private Integer id;
    private String name;
    private String category;
    private String description;
    private String image;
    private String ingredients;
    private String steps;
    private String nutrition;
    private LocalDateTime createdAt;
}