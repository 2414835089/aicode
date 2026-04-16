package com.menurandomizer.controller;

import com.menurandomizer.entity.Menu;
import com.menurandomizer.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/menus")
@CrossOrigin(origins = "*")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public List<Menu> getAll() {
        return menuService.list();
    }
    
    @GetMapping("/category/{category}")
    public List<Menu> getByCategory(@PathVariable String category) {
        return menuService.getByCategory(category);
    }
    
    @GetMapping("/random")
    public Menu getRandom() {
        return menuService.getRandom();
    }
    
    @GetMapping("/random/{category}")
    public Menu getRandomByCategory(@PathVariable String category) {
        return menuService.getRandomByCategory(category);
    }
    
    @GetMapping("/{id}")
    public Menu getById(@PathVariable Integer id) {
        return menuService.getById(id);
    }
    
    @PostMapping
    public Menu add(@RequestBody Menu menu) {
        menuService.save(menu);
        return menu;
    }
}