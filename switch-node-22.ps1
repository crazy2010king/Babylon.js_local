<#
.SYNOPSIS
切换Node.js到22.0版本，适配Babylon.js开发环境
#>

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "Node.js 版本切换脚本 - 切换到 22.0 版本" -ForegroundColor Cyan
Write-Host "==============================================`n" -ForegroundColor Cyan

# 检查管理员权限
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Warning "检测到未使用管理员权限运行，部分操作可能会失败"
    $choice = Read-Host "是否继续运行？(Y/N)"
    if ($choice -notmatch "^[Yy]$") {
        Write-Host "退出脚本" -ForegroundColor Yellow
        exit 0
    }
}

# 检查是否已安装nvm
$nvmExists = $null -ne (Get-Command "nvm" -ErrorAction SilentlyContinue)

if ($nvmExists) {
    Write-Host "✅ 检测到已安装 nvm-windows`n" -ForegroundColor Green

    # 检查是否已安装Node 22
    $node22Installed = nvm list | Select-String "22\."

    if ($node22Installed) {
        Write-Host "🔄 Node.js 22 版本已安装，正在切换..." -ForegroundColor Yellow
        nvm use 22.0.0
    } else {
        Write-Host "📥 正在安装 Node.js 22.0.0..." -ForegroundColor Yellow
        nvm install 22.0.0
        Write-Host "✅ 安装完成，正在切换到 22.0.0..." -ForegroundColor Green
        nvm use 22.0.0
    }

    Write-Host "`n📋 当前环境版本信息：" -ForegroundColor Cyan
    Write-Host "Node.js: $(node -v)"
    Write-Host "npm: $(npm -v)`n"

    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "✅ 版本切换完成！建议重新安装项目依赖：" -ForegroundColor Green
    Write-Host "执行命令：npm install`n"
    Write-Host "如果安装依赖出现问题，可尝试删除node_modules和package-lock.json后重新安装" -ForegroundColor Yellow

    Read-Host "按回车键退出"
    exit 0
}

# 没有安装nvm的情况
Write-Warning "⚠️  未检测到 nvm-windows（推荐的Node版本管理工具）`n"

Write-Host "请选择安装方式："
Write-Host "[1] 自动下载安装 nvm-windows（推荐，可以同时管理多个Node版本）"
Write-Host "[2] 直接下载安装 Node.js 22.0 覆盖现有版本"
Write-Host "[3] 退出`n"

$choice = Read-Host "请输入选项 (1/2/3)"

if ($choice -eq "1") {
    Write-Host "`n📥 正在下载 nvm-windows 安装程序..." -ForegroundColor Yellow
    $installerPath = Join-Path $env:TEMP "nvm-setup.exe"
    Invoke-WebRequest -Uri "https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.exe" -OutFile $installerPath

    Write-Host "✅ 下载完成，启动安装程序..." -ForegroundColor Green
    Write-Host "安装完成后请重新运行此脚本！`n" -ForegroundColor Yellow
    Start-Process $installerPath -Wait

    Read-Host "按回车键退出"
    exit 0
}

if ($choice -eq "2") {
    Write-Host "`n📥 正在下载 Node.js 22.0.0 安装程序..." -ForegroundColor Yellow
    $installerPath = Join-Path $env:TEMP "node-v22.0.0-x64.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/download/release/v22.0.0/node-v22.0.0-x64.msi" -OutFile $installerPath

    Write-Host "✅ 下载完成，启动安装程序..." -ForegroundColor Green
    Start-Process msiexec.exe -ArgumentList "/i", $installerPath -Wait

    Write-Host "`n✅ Node.js 22.0.0 安装完成！" -ForegroundColor Green
    Write-Host "请重启终端后运行 node -v 确认版本`n" -ForegroundColor Yellow

    Read-Host "按回车键退出"
    exit 0
}

Write-Host "`n👋 退出脚本" -ForegroundColor Yellow
