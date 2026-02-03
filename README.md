# 📐 公式验证器

专业的公式验证计算系统，支持78个固定元素的组合计算。

## ✨ 功能特点

- 🔢 支持78个固定元素的公式验证
- 📊 四层统计显示结构
- 🔍 智能公式搜索生成
- ⭐ 收藏夹和历史记录
- ⚙️ 灵活的参数设置
- 💾 本地数据存储

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建后的文件在 `dist/` 目录，可以直接部署到任何静态服务器。

## 📦 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Element Plus - Vue 3 组件库
- Pinia - Vue 状态管理
- Vue Router - 路由管理

## 📖 使用说明

### 公式格式

支持多种公式格式：
- `01,02,03` - 基本格式
- `01-02-03` - 横杠分隔
- `01 02 03` - 空格分隔

### 统计显示

四层显示结构：
1. 公式列表 - 显示命中模式
2. 近期命中统计 - 最近N期的开出次数
3. 结果类型分组 - 按类型统计
4. 码类汇总 - 所有公式号码结果

### 参数设置

- 验证期数：设置要验证的历史期数
- 命中期数：设置命中次数阈值
- 显示期数：设置统计显示的期数

## 📝 项目结构

```
formula-validator/
├── src/
│   ├── components/     # 组件
│   ├── stores/         # 状态管理
│   ├── views/          # 页面
│   ├── router/         # 路由
│   ├── styles/         # 样式
│   └── main.js         # 入口文件
├── public/             # 静态资源
├── index.html          # HTML 模板
├── vite.config.js      # Vite 配置
└── package.json        # 项目配置
```

## 🔧 维护说明

### 添加新元素

在 `src/stores/formula.js` 中修改 `elements` 数组。

### 修改验证逻辑

在 `src/stores/formula.js` 中的 `validateFormula` 方法。

### 调整界面样式

在 `src/styles/global.css` 中修改全局样式。

## 📄 许可证

MIT License

---

**纯前端应用，无需后端，开箱即用！**