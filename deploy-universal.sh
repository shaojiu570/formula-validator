#!/bin/bash

echo "🚀 开始通用部署脚本..."

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 构建项目
echo "🔨 构建项目..."
npm run build

# 3. 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 构建成功！"
echo "📁 构建文件："
ls -la dist/

echo "🌐 部署选项："
echo "1. GitHub Pages: 推送到 GitHub 仓库，GitHub Actions 会自动部署"
echo "2. Vercel: 连接 GitHub 仓库到 Vercel 项目"
echo "3. 手动部署: 将 dist/ 目录内容上传到任何静态托管服务"

echo ""
echo "📋 部署后访问地址："
echo "- GitHub Pages: https://shaojiu570.github.io/formula-validator/"
echo "- Vercel: https://your-project.vercel.app/"

echo ""
echo "🔧 如果遇到空白页面，检查："
echo "1. 浏览器开发者工具的 Console 和 Network 标签"
echo "2. 确保所有资源文件路径正确"
echo "3. 检查 base URL 配置是否匹配部署平台"