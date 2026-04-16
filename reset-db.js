// 重置数据库初始化状态
const fs = require('fs');

// 模拟 localStorage
const localStorage = {
  data: {},
  getItem(key) {
    return this.data[key];
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// 读取 mockDatabase.js
const mockDatabase = require('./src/lib/mockDatabase');

// 重置数据库
console.log('重置数据库...');
mockDatabase.resetDatabase();

console.log('数据库重置完成！');
console.log('课程数据已重新初始化。');
