# 📐 公式验证器

一个基于Vue 3的公式验证和计算系统，支持多种结果类型的验证和统计分析。

## ✨ 功能特性

### 🔧 核心功能
- **公式验证**: 支持7种结果类型（尾数类、头数类、合数类、波色类、五行类、肖位类、码类）
- **四层统计显示**: 
  - 第一层：公式列表展示
  - 第二层：近期开出次数统计
  - 第三层：按结果类型分组统计
  - 第四层：全部公式号码汇总
- **公式库管理**: 内置公式库，支持分类管理
- **搜索公式生成**: 自动生成所有可能的元素组合
- **设置管理**: 支持补偿值、期数、左右扩展等参数设置
- **收藏功能**: 支持公式收藏和历史记录

### 📊 支持的公式类型
- **尾数类**: `[D尾数类]期数合+总分合=15`
- **头数类**: `[L头数类]期数尾+总分尾=15`
- **波色类**: `[D波色类]期数合+总分合=15`
- **码类**: `[L码类]平1号+平2号=15左1右1`
- **五行类**: `[D五行类]特号+平3号=15`
- **肖位类**: `[L肖位类]期数+总分=15`
- **合数类**: `[D合数类]期数合+总分合=15`

### 🎯 元素系统
- **期数系列**: 期数、期数尾、期数合、期数合尾
- **总分系列**: 总分、总分尾、总分合、总分合尾
- **平码系列**: 平1号-平6号，每个支持10种属性
- **特码系列**: 特号、特头、特尾等10种属性

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 7.0+
- Git

### 本地开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/formula-validator.git
cd formula-validator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### GitHub Pages部署

#### 方法一：自动部署（推荐）
1. Fork或创建仓库到GitHub
2. 推送代码到main分支
3. 在仓库Settings → Pages中选择"GitHub Actions"
4. 每次推送代码会自动部署

#### 方法二：一键部署脚本
**Linux/Mac:**
```bash
chmod +x deploy-github.sh
./deploy-github.sh
```

**Windows:**
```cmd
deploy-github.bat
```

#### 方法三：手动部署
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm run deploy
```

**部署后访问地址：** `https://YOUR_USERNAME.github.io/formula-validator/`

详细部署指南请查看：[GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md)

## 📁 项目结构

```
formula-validator/
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue组件
│   │   ├── FormulaLibrary.vue    # 公式库
│   │   ├── SearchFormula.vue     # 搜索公式
│   │   ├── SettingsPanel.vue     # 设置面板
│   │   ├── FavoritesPanel.vue    # 收藏面板
│   │   └── ...
│   ├── stores/            # Pinia状态管理
│   │   └── formula.js     # 公式验证逻辑
│   ├── styles/            # 样式文件
│   ├── views/             # 页面组件
│   │   └── MainView.vue   # 主页面
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── deploy.sh              # Linux/Mac部署脚本
├── deploy.bat             # Windows部署脚本
├── package.json           # 项目配置
└── vite.config.js         # Vite配置
```

## 🎮 使用说明

### 基本操作
1. **输入公式**: 在公式输入区输入要验证的公式
2. **开始验证**: 点击"▶️开始验证"按钮
3. **查看结果**: 在结果展示区查看四层统计结果
4. **调整设置**: 点击"⚙️设置"调整验证参数

### 公式格式
```
[规则类型]表达式=期数[左扩展右扩展]

示例:
[D尾数类]期数合+总分合=15
[L头数类]期数尾+总分尾+5=20左1右2
[D码类]平1号+平2号=15左1右1
```

### 设置参数
- **补偿值**: -999 到 999，支持0值
- **验证期数**: 1 到 100，最小值为1
- **左右扩展**: 0 到 20，支持0值

## 🔧 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **样式**: CSS3 + CSS Variables
- **图标**: Element Plus Icons

## 📱 响应式设计

项目支持多种设备：
- 桌面端 (1200px+)
- 平板端 (768px - 1199px)
- 移动端 (< 768px)

## 🚀 部署选项

### 静态文件服务器
将`dist`目录上传到任何支持静态文件的服务器：
- Nginx
- Apache
- IIS
- 简单HTTP服务器

### 云平台部署
- **Vercel**: 连接Git仓库自动部署
- **Netlify**: 拖拽dist目录部署
- **GitHub Pages**: 通过Actions自动部署
- **阿里云OSS**: 静态网站托管

### 本地服务器
```bash
# 使用Node.js简单服务器
npx serve dist

# 使用Python服务器
cd dist
python -m http.server 8080
```

## 🔍 故障排除

### 常见问题

**1. 页面空白**
- 检查浏览器控制台错误
- 确认所有依赖已正确安装
- 检查构建是否成功

**2. 公式验证失败**
- 检查公式格式是否正确
- 确认历史数据是否加载
- 查看错误提示信息

**3. 设置不生效**
- 确认点击了"应用到所有公式"
- 检查参数值是否在有效范围内
- 重新验证公式

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📞 支持

如有问题，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者

---

**公式验证器** - 让公式验证更简单、更准确！