#!/bin/bash

echo "🔧 修复GitHub Pages部署问题..."

# 1. 清理之前的构建
echo "🧹 清理构建缓存..."
rm -rf dist/
rm -rf node_modules/.vite/

# 2. 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 3. 构建项目
echo "🔨 构建项目..."
NODE_ENV=production npm run build

# 4. 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件："
    ls -la dist/
    
    # 检查关键文件
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html 存在"
    else
        echo "❌ index.html 不存在"
    fi
    
    if [ -f "dist/favicon.ico" ]; then
        echo "✅ favicon.ico 存在"
    else
        echo "❌ favicon.ico 不存在"
    fi
    
    # 检查assets目录
    if [ -d "dist/assets" ]; then
        echo "✅ assets 目录存在"
        echo "📄 assets 文件："
        ls -la dist/assets/
    else
        echo "❌ assets 目录不存在"
    fi
else
    echo "❌ 构建失败！"
    exit 1
fi

# 5. 提交更改
echo "📝 提交更改..."
git add .
git commit -m "Fix: 修复GitHub Pages路径配置问题"

# 6. 推送到GitHub
echo "⬆️ 推送到GitHub..."
git push origin main

echo "🎉 修复完成！"
echo "🌐 请等待几分钟，然后访问："
echo "   https://shaojiu570.github.io/formula-validator/"