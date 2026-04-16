package com.menurandomizer.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.menurandomizer.entity.Menu;
import com.menurandomizer.mapper.MenuMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService extends ServiceImpl<MenuMapper, Menu> {
    public List<Menu> getByCategory(String category) {
        return baseMapper.selectByCategory(category);
    }
    
    public Menu getRandom() {
        return baseMapper.selectRandom();
    }
    
    public Menu getRandomByCategory(String category) {
        return baseMapper.selectRandomByCategory(category);
    }
}