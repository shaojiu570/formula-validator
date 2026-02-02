# 📱 离线部署指南

本指南帮助您在没有网络连接的环境中部署公式验证器。

## 🎯 离线部署方案

### 方案一：完整离线包
适用于完全没有网络的环境。

#### 准备工作（需要网络环境）
1. 在有网络的机器上完成构建：
```bash
npm install
npm run build
```

2. 打包离线文件：
```bash
# 创建离线包目录
mkdir formula-validator-offline
cp -r dist/ formula-validator-offline/
cp README.md formula-validator-offline/
cp offline-setup.md formula-validator-offline/
```

3. 压缩打包：
```bash
tar -czf formula-validator-offline.tar.gz formula-validator-offline/
# 或使用zip
zip -r formula-validator-offline.zip formula-validator-offline/
```

#### 离线部署步骤
1. 将压缩包传输到目标机器
2. 解压文件：
```bash
tar -xzf formula-validator-offline.tar.gz
# 或
unzip formula-validator-offline.zip
```

3. 部署到Web服务器：
```bash
# 复制到Web服务器目录
cp -r formula-validator-offline/dist/* /var/www/html/
# 或其他Web服务器目录
```

### 方案二：本地HTTP服务器
适用于有本地服务器环境的情况。

#### 使用Python服务器
```bash
cd formula-validator-offline/dist
python3 -m http.server 8080
# 或Python 2
python -m SimpleHTTPServer 8080
```

#### 使用Node.js服务器
```bash
# 安装serve（需要一次性网络连接）
npm install -g serve

# 启动服务
cd formula-validator-offline/dist
serve -s . -p 8080
```

#### 使用PHP服务器
```bash
cd formula-validator-offline/dist
php -S localhost:8080
```

## 🖥️ 各平台部署指南

### Windows系统

#### IIS部署
1. 启用IIS功能：
   - 控制面板 → 程序 → 启用或关闭Windows功能
   - 勾选"Internet Information Services"

2. 配置网站：
   - 打开IIS管理器
   - 右键"网站" → 添加网站
   - 物理路径指向dist目录

3. 配置MIME类型（如需要）：
   - 添加`.js`文件类型：`application/javascript`
   - 添加`.css`文件类型：`text/css`

#### 使用HFS (HTTP File Server)
1. 下载HFS软件
2. 添加dist目录为虚拟文件夹
3. 启动服务器

### Linux系统

#### Nginx部署
1. 安装Nginx：
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. 配置网站：
```bash
# 复制文件
sudo cp -r dist/* /var/www/html/

# 或创建新的站点配置
sudo nano /etc/nginx/sites-available/formula-validator
```

3. 配置文件示例：
```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache部署
1. 安装Apache：
```bash
# Ubuntu/Debian
sudo apt install apache2

# CentOS/RHEL
sudo yum install httpd
```

2. 复制文件：
```bash
sudo cp -r dist/* /var/www/html/
```

3. 创建.htaccess文件：
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### macOS系统

#### 使用内置Apache
1. 启动Apache：
```bash
sudo apachectl start
```

2. 复制文件：
```bash
sudo cp -r dist/* /usr/local/var/www/
```

#### 使用Homebrew Nginx
```bash
# 安装
brew install nginx

# 复制文件
cp -r dist/* /usr/local/var/www/

# 启动
brew services start nginx
```

## 🔧 离线配置优化

### 缓存配置
为了更好的离线体验，建议配置适当的缓存策略：

#### Nginx缓存配置
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

#### Apache缓存配置
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### 压缩配置
启用Gzip压缩减少文件大小：

#### Nginx Gzip
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### Apache Gzip
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🚀 快速启动脚本

### start-server.sh (Linux/Mac)
```bash
#!/bin/bash
echo "🚀 启动公式验证器本地服务器..."

# 检查Python
if command -v python3 &> /dev/null; then
    echo "使用Python3启动服务器..."
    cd dist
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "使用Python启动服务器..."
    cd dist
    python -m SimpleHTTPServer 8080
else
    echo "❌ 未找到Python，请安装Python或使用其他Web服务器"
    exit 1
fi
```

### start-server.bat (Windows)
```batch
@echo off
echo 🚀 启动公式验证器本地服务器...

python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到Python，请安装Python或使用IIS
    pause
    exit /b 1
)

cd dist
echo 🌐 服务器启动在: http://localhost:8080
echo 按Ctrl+C停止服务器
python -m http.server 8080
pause
```

## 📋 部署检查清单

- [ ] 构建文件完整（dist目录包含所有文件）
- [ ] Web服务器正确配置
- [ ] 端口可访问（防火墙设置）
- [ ] MIME类型配置正确
- [ ] 缓存策略配置（可选）
- [ ] 压缩配置启用（可选）
- [ ] 错误页面配置（可选）

## 🔍 故障排除

### 常见问题

**1. 页面无法访问**
- 检查Web服务器是否启动
- 确认端口是否被占用
- 检查防火墙设置

**2. 资源文件404错误**
- 检查文件路径是否正确
- 确认MIME类型配置
- 检查文件权限

**3. 页面刷新404错误**
- 配置URL重写规则
- 确保SPA路由正确处理

**4. 样式或脚本不加载**
- 检查Content-Type头
- 确认文件完整性
- 检查浏览器控制台错误

## 📞 技术支持

如果在离线部署过程中遇到问题，请：
1. 检查浏览器开发者工具的控制台错误
2. 查看Web服务器错误日志
3. 确认所有文件都已正确复制
4. 验证服务器配置文件语法

---

**离线部署完成后，您就可以在没有网络的环境中使用公式验证器了！**