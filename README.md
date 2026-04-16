# React + Vite + Tailwind CSS 项目

这是一个使用 React、Vite 和 Tailwind CSS 构建的现代化前端项目模板。

## 技术栈

- **React 18** - 用户界面库
- **Vite** - 快速的前端构建工具
- **Tailwind CSS 3** - 实用优先的 CSS 框架
- **React Router DOM** - 客户端路由
- **Supabase** - 后端即服务（BaaS）

## 项目结构

```
/workspace
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 通用组件
│   ├── hooks/           # 自定义 React 钩子
│   ├── lib/             # 库配置（Supabase）
│   ├── pages/           # 页面组件
│   │   ├── Home.jsx     # 首页
│   │   ├── Login.jsx    # 登录页
│   │   └── Register.jsx # 注册页
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 主应用组件（路由配置）
│   ├── main.jsx         # 应用入口
│   └── index.css        # 全局样式（Tailwind）
├── .env.example         # 环境变量示例
├── .gitignore           # Git 忽略文件
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── postcss.config.js    # PostCSS 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── vite.config.js       # Vite 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填入您的 Supabase 配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的 Supabase URL 和 Anon Key：

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 功能特性

- ✅ 现代化的 React 18 架构
- ✅ 快速的 Vite 开发体验
- ✅ Tailwind CSS 实用类样式
- ✅ 客户端路由（React Router）
- ✅ Supabase 集成
- ✅ 响应式设计
- ✅ 预设登录、注册和首页

## License

MIT
