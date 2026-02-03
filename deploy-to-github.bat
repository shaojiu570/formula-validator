@echo off
echo ========================================
echo   GitHub Pages 部署脚本
echo ========================================
echo.

REM 1. 构建项目（使用 GitHub Pages 配置）
echo [1/4] 构建项目...
call npx vite build --config vite.config.github.js
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)
echo 构建完成！
echo.

REM 2. 进入构建目录
echo [2/4] 准备部署文件...
cd dist
if errorlevel 1 (
    echo dist 目录不存在！
    pause
    exit /b 1
)

REM 3. 初始化 git 并提交
echo [3/4] 初始化 Git...
git init
git config user.name "shaojiu570"
git config user.email "shaojiu570@example.com"
git add -A
git commit -m "Deploy to GitHub Pages"

REM 4. 推送到 gh-pages 分支
echo [4/4] 推送到 GitHub...
git push -f https://github.com/shaojiu570/formula-validator.git master:gh-pages

cd ..
echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 请访问: https://shaojiu570.github.io/formula-validator/
echo.
echo 注意：GitHub Pages 需要几分钟时间生效
echo.
pause