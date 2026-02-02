#!/bin/bash

# GitHub Pages 部署脚本
echo "🚀 开始部署到GitHub Pages..."

# 检查是否在Git仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是Git仓库"
    echo "请先运行: git init"
    exit 1
fi

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 错误: 未设置远程仓库"
    echo "请先添加远程仓库:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/formula-validator.git"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 构建项目
echo "🔨 构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 检查dist目录
if [ ! -d "dist" ]; then
    echo "❌ 构建目录不存在"
    exit 1
fi

# 提交当前更改
echo "📝 提交当前更改..."
git add .
git commit -m "Update: 准备部署到GitHub Pages" || echo "没有新的更改需要提交"

# 推送到main分支
echo "⬆️ 推送到GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ 推送失败，请检查GitHub仓库设置"
    exit 1
fi

echo "✅ 代码已推送到GitHub"

# 检查是否安装了gh-pages
if ! npm list -g gh-pages > /dev/null 2>&1; then
    echo "📦 安装gh-pages工具..."
    npm install -g gh-pages
fi

# 部署到gh-pages分支
echo "🚀 部署到GitHub Pages..."
npx gh-pages -d dist

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo "🎉 部署完成！"
echo ""
echo "📍 您的网站将在几分钟内可用："
echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
echo ""
echo "💡 提示："
echo "   1. 首次部署可能需要等待几分钟"
echo "   2. 如果使用GitHub Actions，请在仓库Settings → Pages中设置Source为'GitHub Actions'"
echo "   3. 确保仓库是公开的（Public）"
echo ""
echo "🔧 GitHub Pages设置："
echo "   1. 进入仓库 Settings → Pages"
echo "   2. Source选择 'Deploy from a branch'"
echo "   3. Branch选择 'gh-pages'"
echo "   4. 或者选择 'GitHub Actions' 使用自动部署"