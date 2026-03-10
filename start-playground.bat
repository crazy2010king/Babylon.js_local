@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==============================================
echo Babylon.js Playground 启动脚本
echo ==============================================

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js，请先安装 Node.js v20/v22
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查Node.js版本
for /f "tokens=1 delims=v" %%a in ('node -v') do set NODE_VERSION=%%a
for /f "tokens=1 delims=." %%a in ("%NODE_VERSION%") do set NODE_MAJOR=%%a
echo 当前Node.js版本: v%NODE_VERSION%
if %NODE_MAJOR% GEQ 23 (
    echo ⚠️  警告: Babylon.js 官方支持 Node.js v20-22，当前版本 v%NODE_VERSION% 可能存在兼容性问题
    echo 建议使用 nvm 切换到 Node.js v20 或 v22 以获得最佳兼容性
    echo.
    pause
)

:: 检查npm是否可用
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: npm不可用，请检查Node.js安装
    pause
    exit /b 1
)

:: 先停止可能正在运行的服务
echo.
echo 🧹 先清理正在运行的服务...
call stop-playground.bat >nul 2>&1

:: 检查是否已安装依赖
if not exist node_modules (
    echo.
    echo 📦 安装项目依赖（首次运行需要较长时间，请耐心等待）...
    call npm install --legacy-peer-deps --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接或Node版本
        echo 建议切换到Node.js v20 LTS版本
        pause
        exit /b 1
    )
)

:: 检查是否已构建工具
if not exist packages/dev/build-tools/dist (
    echo.
    echo 🔨 构建开发工具...
    call npm run build:tools
    if %errorlevel% neq 0 (
        echo ❌ 工具构建失败
        pause
        exit /b 1
    )
)

:: 检查是否已构建核心库
if not exist packages/dev/core/dist (
    echo.
    echo 🏗️  构建核心库...
    call npm run build:core
    if %errorlevel% neq 0 (
        echo ❌ 核心库构建失败
        pause
        exit /b 1
    )
)

:: 启动Playground服务
echo.
echo 🚀 启动Playground开发服务器...
echo ==============================================
echo 服务地址: http://localhost:1338
echo 示例首页: http://localhost:1338/
echo 示例详情页示例: http://localhost:1338/example/PG9V6Y
echo 原有编辑器: http://localhost:1338/editor
echo ==============================================
echo 按 Ctrl+C 停止服务
echo.
cd packages/tools/playground
call npm run serve

if %errorlevel% neq 0 (
    echo.
    echo ❌ 服务启动失败
    echo 常见解决方案:
    echo 1. 运行 stop-playground.bat 清理残留进程
    echo 2. 检查端口1338是否被其他程序占用
    echo 3. 删除 node_modules 文件夹后重新运行脚本
    echo 4. 切换到Node.js v20 LTS版本
    pause
)

cd /d "%~dp0"
