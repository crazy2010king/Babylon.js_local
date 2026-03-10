@echo off
chcp 65001 >nul
echo ==============================================
echo Node.js 版本切换脚本 - 切换到 22.0 版本
echo ==============================================
echo.

:: 检查是否已安装nvm
nvm version >nul 2>&1
if %errorlevel% equ 0 (
    echo 检测到已安装 nvm-windows
    echo.

    :: 检查是否已安装Node 22
    nvm list | findstr "22\." >nul 2>&1
    if %errorlevel% equ 0 (
        echo Node.js 22 版本已安装，正在切换...
        nvm use 22.0.0
    ) else (
        echo 正在安装 Node.js 22.0.0...
        nvm install 22.0.0
        echo 安装完成，正在切换到 22.0.0...
        nvm use 22.0.0
    )

    echo.
    echo 当前Node.js版本：
    node -v
    echo 当前npm版本：
    npm -v

    echo.
    echo ==============================================
    echo 版本切换完成！现在重新安装项目依赖：
    echo ==============================================
    echo 执行命令：npm install
    echo.

    pause
    exit /b 0
)

:: 如果没有安装nvm，引导用户安装
echo 未检测到 nvm-windows（推荐的Node版本管理工具）
echo.
echo 请选择安装方式：
echo [1] 自动下载安装 nvm-windows（推荐）
echo [2] 直接下载安装 Node.js 22.0 覆盖现有版本
echo [3] 退出
echo.
set /p choice=请输入选项 (1/2/3):

if "%choice%"=="1" (
    echo.
    echo 正在下载 nvm-windows 安装程序...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.exe' -OutFile '%TEMP%\nvm-setup.exe'"
    echo 下载完成，启动安装程序...
    echo 安装完成后请重新运行此脚本！
    start %TEMP%\nvm-setup.exe
    pause
    exit /b 0
)

if "%choice%"=="2" (
    echo.
    echo 正在下载 Node.js 22.0.0 安装程序...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/download/release/v22.0.0/node-v22.0.0-x64.msi' -OutFile '%TEMP%\node-v22.0.0-x64.msi'"
    echo 下载完成，启动安装程序...
    start %TEMP%\node-v22.0.0-x64.msi
    pause
    exit /b 0
)

echo 退出脚本
pause
