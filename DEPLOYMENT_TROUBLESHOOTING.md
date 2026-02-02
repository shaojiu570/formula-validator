# 🔧 部署问题诊断指南

## 🚨 当前问题状态

### GitHub Pages 问题
- **症状**: 网页空白，main.js 404 错误
- **原因**: GitHub Pages 可能还未完成部署，或者分支配置问题

### Vercel 问题  
- **症状**: 构建失败，terser 未找到错误
- **解决方案**: 已修改为使用 esbuild 替代 terser

## 🔍 诊断步骤

### 1. 检查 GitHub Pages 设置
1. 访问 https://github.com/shaojiu570/formula-validator/settings/pages
2. 确保 Source 设置为 "GitHub Actions"
3. 检查 Actions 标签页的部署状态

### 2. 检查 GitHub Actions 工作流
1. 访问 https://github.com/shaojiu570/formula-validator/actions
2. 查看最新的工作流运行状态
3. 如果失败，查看错误日志

### 3. 本地测试构建
```bash
# 测试构建
npm run build

# 本地预览
npm run preview
```

## 🛠️ 解决方案

### 方案 1: GitHub Pages (推荐)
1. 确保代码已推送到 main 分支
2. 等待 GitHub Actions 完成部署 (通常需要 2-5 分钟)
3. 访问 https://shaojiu570.github.io/formula-validator/

### 方案 2: Vercel 部署
1. 使用 Vercel 专用配置：
```bash
# 复制 Vercel 配置
cp vite.config.vercel.js vite.config.js

# 构建项目
npm run build
```

2. 在 Vercel 中连接 GitHub 仓库
3. 设置构建命令: `npm run build`
4. 设置输出目录: `dist`

### 方案 3: 手动部署
1. 运行 `npm run build`
2. 将 `dist/` 目录内容上传到任何静态托管服务
3. 确保服务器支持 SPA 路由重定向

## 📋 文件清单

### 核心文件
- ✅ `package.json` - 依赖配置
- ✅ `vite.config.js` - GitHub Pages 配置
- ✅ `vite.config.vercel.js` - Vercel 配置
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `.github/workflows/deploy.yml` - GitHub Actions

### 部署脚本
- ✅ `deploy-universal.sh` - Unix 部署脚本
- ✅ `deploy-universal.bat` - Windows 部署脚本

## 🔧 常见问题修复

### 问题 1: 404 错误
**原因**: 资源路径不匹配
**解决**: 检查 `vite.config.js` 中的 `base` 配置

### 问题 2: 空白页面
**原因**: JavaScript 加载失败
**解决**: 
1. 检查浏览器控制台错误
2. 确认所有资源文件存在
3. 验证路径配置

### 问题 3: Terser 错误
**原因**: Vercel 不安装 devDependencies
**解决**: 已改用 esbuild (内置于 Vite)

## 📞 获取帮助

如果问题仍然存在：
1. 检查浏览器开发者工具的 Console 和 Network 标签
2. 提供具体的错误信息
3. 说明使用的部署平台 (GitHub Pages/Vercel/其他)

---
*更新时间: 2026-02-03*