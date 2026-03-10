@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo ==============================================
echo Babylon.js Playground 调试启动脚本
echo ==============================================
echo [1/8] 环境预检查
echo ==============================================

:: 检查Node.js
echo 🔍 检查Node.js安装...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1 delims=v" %%a in ('node -v') do set NODE_VERSION=%%a
    echo ✅ Node.js 已安装: v!NODE_VERSION!
) else (
    echo ❌ Node.js 未安装，请先安装 Node.js v20/v22
    pause
    exit /b 1
)

:: 检查npm
echo 🔍 检查npm安装...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('npm -v') do set NPM_VERSION=%%a
    echo ✅ npm 已安装: v!NPM_VERSION!
) else (
    echo ❌ npm 不可用，请检查Node.js安装
    pause
    exit /b 1
)

:: 检查端口占用
echo 🔍 检查端口1338占用...
netstat -ano | findstr :1338 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口1338已被占用，正在自动清理...
    call stop-playground.bat >nul 2>&1
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr :1338 | findstr LISTENING >nul 2>&1
    if %errorlevel% equ 0 (
        echo ❌ 端口清理失败，请手动关闭占用1338端口的程序
        netstat -ano | findstr :1338
        pause
        exit /b 1
    ) else (
        echo ✅ 端口1338已释放
    )
) else (
    echo ✅ 端口1338可用
)

:: 检查package.json
echo 🔍 检查项目配置...
if exist package.json (
    echo ✅ 项目配置文件存在
) else (
    echo ❌ package.json 不存在，请确认是否在项目根目录
    pause
    exit /b 1
)

echo.
echo ==============================================
echo [2/8] 清理环境
echo ==============================================
call stop-playground.bat >nul 2>&1
echo ✅ 已清理残留进程

echo.
echo ==============================================
echo [3/8] 依赖检查
echo ==============================================
if exist node_modules (
    echo ✅ 依赖文件夹已存在
    echo 🔍 验证依赖完整性...
    npm ls react-router-dom >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ react-router-dom 已安装
    ) else (
        echo ⚠️  缺少react-router-dom，正在安装...
        npm install react-router-dom --legacy-peer-deps --no-audit --no-fund
    )
) else (
    echo 📦 开始安装全部依赖...
    echo ⏱️  首次安装预计需要10-15分钟，请耐心等待...
    call npm install --legacy-peer-deps --no-audit --no-fund
    if %errorlevel% equ 0 (
        echo ✅ 依赖安装成功
    ) else (
        echo ❌ 依赖安装失败
        echo 💡 解决方案:
        echo    1. 检查网络连接，尝试使用npm淘宝源: npm config set registry https://registry.npmmirror.com
        echo    2. 删除node_modules文件夹和package-lock.json后重试
        echo    3. 切换到Node.js v20 LTS版本
        pause
        exit /b 1
    )
)

echo.
echo ==============================================
echo [4/8] 构建工具检查
echo ==============================================
if exist packages/dev/build-tools/dist (
    echo ✅ 构建工具已编译
) else (
    echo 🔨 开始构建开发工具...
    call npm run build:tools
    if %errorlevel% equ 0 (
        echo ✅ 构建工具编译成功
    ) else (
        echo ❌ 构建工具编译失败
        echo 💡 请检查是否已安装Visual Studio Build Tools和Python
        pause
        exit /b 1
    )
)

echo.
echo ==============================================
echo [5/8] 核心库检查
echo ==============================================
if exist packages/dev/core/dist (
    echo ✅ 核心库已编译
) else (
    echo 🏗️  开始构建核心库...
    call npm run build:core
    if %errorlevel% equ 0 (
        echo ✅ 核心库编译成功
    ) else (
        echo ❌ 核心库编译失败
        pause
        exit /b 1
    )
)

echo.
echo ==============================================
echo [6/8] Playground 配置检查
echo ==============================================
cd packages/tools/playground
if exist package.json (
    echo ✅ Playground配置存在
) else (
    echo ❌ Playground目录不存在，请检查项目结构
    pause
    exit /b 1
)

echo 🔍 检查react-router-dom依赖...
npm ls react-router-dom >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ react-router-dom 已在playground中可用
) else (
    echo ⚠️  正在安装playground依赖...
    npm install --legacy-peer-deps --no-audit --no-fund
)

echo 🔍 检查webpack配置...
if exist webpack.config.js (
    echo ✅ webpack配置存在
    findstr "historyApiFallback" webpack.config.js >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ SPA路由配置已正确添加
    ) else (
        echo ❌ webpack缺少SPA路由配置，请检查webpack.config.js
        pause
        exit /b 1
    )
) else (
    echo ❌ webpack.config.js不存在
    pause
    exit /b 1
)

echo.
echo ==============================================
echo [7/8] 启动服务
echo ==============================================
echo 🚀 正在启动开发服务器...
echo 📍 服务地址: http://localhost:1338
echo 📍 示例首页: http://localhost:1338/
echo 📍 示例详情: http://localhost:1338/example/PG9V6Y
echo 📍 编辑器: http://localhost:1338/editor
echo ==============================================
echo 🔍 服务器启动中，请等待显示 "compiled successfully" 后再访问
echo 🔍 如果5分钟后仍无法访问，请查看下面的错误信息
echo ==============================================
echo.

call npm run serve

:: 服务启动失败后的诊断
echo.
echo ==============================================
echo ❌ 服务启动失败诊断信息
echo ==============================================
echo 🔍 检查端口占用:
netstat -ano | findstr :1338
echo.
echo 🔍 检查Node进程:
tasklist | findstr node.exe
echo.
echo 💡 常见解决方案:
echo 1. 运行 stop-playground.bat 清理所有进程后重试
echo 2. 删除 packages/tools/playground/node_modules 后重试
echo 3. 检查是否有杀毒软件/防火墙阻止端口访问
echo 4. 尝试修改webpack.config.js中的端口号

pause
cd /d "%~dp0"
