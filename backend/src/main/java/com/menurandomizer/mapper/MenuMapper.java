package com.menurandomizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.menurandomizer.entity.Menu;
import java.util.List;

public interface MenuMapper extends BaseMapper<Menu> {
    List<Menu> selectByCategory(String category);
    Menu selectRandom();
    Menu selectRandomByCategory(String category);
}