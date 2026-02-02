@echo off
chcp 65001 >nul

echo 🔧 修复GitHub Pages部署问题...

REM 1. 清理之前的构建
echo 🧹 清理构建缓存...
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

REM 2. 重新安装依赖
echo 📦 重新安装依赖...
npm install

if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 3. 构建项目
echo 🔨 构建项目...
set NODE_ENV=production
npm run build

if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 4. 检查构建结果
if exist "dist" (
    echo ✅ 构建成功！
    echo 📁 构建文件：
    dir dist
    
    REM 检查关键文件
    if exist "dist\index.html" (
        echo ✅ index.html 存在
    ) else (
        echo ❌ index.html 不存在
    )
    
    if exist "dist\favicon.ico" (
        echo ✅ favicon.ico 存在
    ) else (
        echo ❌ favicon.ico 不存在
    )
    
    REM 检查assets目录
    if exist "dist\assets" (
        echo ✅ assets 目录存在
        echo 📄 assets 文件：
        dir dist\assets
    ) else (
        echo ❌ assets 目录不存在
    )
) else (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

REM 5. 提交更改
echo 📝 提交更改...
git add .
git commit -m "Fix: 修复GitHub Pages路径配置问题"

REM 6. 推送到GitHub
echo ⬆️ 推送到GitHub...
git push origin main

echo 🎉 修复完成！
echo 🌐 请等待几分钟，然后访问：
echo    https://shaojiu570.github.io/formula-validator/

pause