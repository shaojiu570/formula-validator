# 🚀 GitHub Pages 部署指南

本指南将帮助您将公式验证器部署到GitHub Pages。

## 📋 部署前准备

### 1. 创建GitHub仓库
1. 登录GitHub
2. 创建新仓库，命名为 `formula-validator`
3. 设置为Public（GitHub Pages免费版需要公开仓库）

### 2. 上传代码到GitHub
```bash
# 初始化Git仓库
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/formula-validator.git

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 公式验证器项目"

# 推送到GitHub
git push -u origin main
```

## 🔧 自动部署配置

### 方法一：GitHub Actions自动部署（推荐）

项目已包含GitHub Actions配置文件 `.github/workflows/deploy.yml`，会自动执行以下步骤：

1. **启用GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source选择 "GitHub Actions"
   - 保存设置

2. **自动部署**：
   - 每次推送到main分支时自动触发部署
   - 构建完成后自动发布到GitHub Pages

3. **访问网站**：
   - 部署完成后，访问：`https://YOUR_USERNAME.github.io/formula-validator/`

### 方法二：手动部署

如果不想使用GitHub Actions，可以手动部署：

```bash
# 安装gh-pages工具
npm install -g gh-pages

# 构建并部署
npm run deploy
```

## 🌐 访问地址

部署成功后，您的公式验证器将在以下地址可用：
```
https://YOUR_USERNAME.github.io/formula-validator/
```

## 🔧 配置说明

### Vite配置
项目已配置GitHub Pages的base路径：
```javascript
// vite.config.js
base: process.env.NODE_ENV === 'production' ? '/formula-validator/' : '/'
```

### SPA路由支持
- 添加了`public/404.html`处理SPA路由
- 在`index.html`中添加了路由重定向脚本

### 构建优化
- 启用了代码分割
- 配置了资源缓存
- 优化了构建输出

## 📊 部署状态检查

### 1. 检查GitHub Actions
- 进入仓库的 Actions 标签页
- 查看部署工作流状态
- 如有错误，查看详细日志

### 2. 检查Pages设置
- Settings → Pages
- 确认Source设置正确
- 查看部署状态和URL

### 3. 测试功能
部署完成后测试以下功能：
- [ ] 页面正常加载
- [ ] 公式验证功能正常
- [ ] 四层统计显示正确
- [ ] 设置面板工作正常
- [ ] 公式库可以打开
- [ ] 搜索公式生成正常

## 🔍 常见问题

### 1. 页面显示404
**原因**：base路径配置错误
**解决**：检查vite.config.js中的base配置是否正确

### 2. 资源文件404
**原因**：资源路径不正确
**解决**：确保所有资源使用相对路径

### 3. 路由不工作
**原因**：SPA路由配置问题
**解决**：检查404.html和index.html中的路由脚本

### 4. Actions部署失败
**原因**：权限或配置问题
**解决**：
- 检查仓库Settings → Actions → General权限设置
- 确保Pages设置为"GitHub Actions"
- 查看Actions日志详细错误信息

### 5. 构建失败
**原因**：依赖或代码问题
**解决**：
- 本地运行`npm run build`测试
- 检查package.json依赖版本
- 查看构建错误日志

## 🔄 更新部署

### 自动更新
使用GitHub Actions时，只需推送代码即可自动部署：
```bash
git add .
git commit -m "更新功能"
git push
```

### 手动更新
```bash
npm run deploy
```

## 🎯 自定义域名（可选）

如果您有自定义域名：

1. **添加CNAME文件**：
```bash
echo "your-domain.com" > public/CNAME
```

2. **配置DNS**：
在域名提供商处添加CNAME记录：
```
CNAME  www  YOUR_USERNAME.github.io
```

3. **更新GitHub设置**：
- Settings → Pages → Custom domain
- 输入您的域名
- 启用"Enforce HTTPS"

## 📈 性能优化

### 1. 启用缓存
GitHub Pages自动启用静态资源缓存

### 2. 压缩优化
构建时自动启用Gzip压缩和代码压缩

### 3. 代码分割
配置了vendor和elementPlus的代码分割

## 🔒 安全考虑

### 1. HTTPS
GitHub Pages自动提供HTTPS支持

### 2. 内容安全
- 不在前端存储敏感信息
- 使用安全的第三方依赖

## 📞 技术支持

如果部署过程中遇到问题：

1. **检查GitHub状态**：https://www.githubstatus.com/
2. **查看官方文档**：https://docs.github.com/en/pages
3. **检查Actions日志**：仓库 → Actions → 查看失败的工作流
4. **本地测试**：确保`npm run build`和`npm run preview`正常工作

## 🎉 部署完成

恭喜！您的公式验证器现在已经部署到GitHub Pages，全世界都可以访问了！

访问地址：`https://YOUR_USERNAME.github.io/formula-validator/`

---

**记住替换 `YOUR_USERNAME` 为您的GitHub用户名**