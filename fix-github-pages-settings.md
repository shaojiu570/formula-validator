# 🔧 修复 GitHub Pages 设置

## 🚨 问题诊断

当前错误：`GET https://shaojiu570.github.io/src/main.js net::ERR_ABORTED 404`

**原因**: GitHub Pages 设置配置为从源码部署，而不是从 GitHub Actions 部署。

## ✅ 解决步骤

### 1. 修改 GitHub Pages 设置
1. 访问: https://github.com/shaojiu570/formula-validator/settings/pages
2. 在 "Source" 部分，选择 **"GitHub Actions"** 而不是 "Deploy from a branch"
3. 保存设置

### 2. 触发重新部署
推送任何小的更改来触发 GitHub Actions：

```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

### 3. 验证部署
1. 访问 https://github.com/shaojiu570/formula-validator/actions
2. 等待 "Deploy to GitHub Pages" 工作流完成
3. 访问 https://shaojiu570.github.io/formula-validator/

## 🔍 如何确认设置正确

正确设置后，GitHub Pages 应该：
- 使用 `dist/index.html` (构建后的文件)
- 加载路径如: `/formula-validator/assets/index-*.js`
- 而不是: `/src/main.js`

## 📋 备用方案

如果 GitHub Actions 方式有问题，可以使用传统的分支部署：

1. 创建 `gh-pages` 分支
2. 将 `dist/` 内容推送到该分支
3. 在 Pages 设置中选择 "Deploy from a branch" → "gh-pages"

---
*这个问题很常见，主要是 GitHub Pages 设置的配置问题*