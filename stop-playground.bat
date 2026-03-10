@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==============================================
echo 停止 Babylon.js Playground 服务
echo ==============================================

:: 查找并杀掉占用1338端口的进程
echo 🔍 查找端口1338占用的进程...
for /f "tokens=*" %%a in ('netstat -ano ^| findstr /r /c:":1338.*LISTENING"') do (
    for %%b in (%%a) do set PID=%%b
)
if defined PID (
    echo 正在终止进程 PID: %PID%
    taskkill /F /PID %PID% >nul 2>&1
) else (
    echo 端口1338未被占用
)

:: 查找并杀掉相关的node进程
echo 🔍 查找Playground相关Node.js进程...
powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'node' -and $_.MainModule.FileName -like '*Babylon.js*' -or $_.CommandLine -like '*webpack*' -or $_.CommandLine -like '*playground*'} | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue; Write-Host '正在终止Node.js进程 PID:' $_.Id }"

echo.
echo ✅ 服务已停止，所有相关进程已清理
echo 提示: 如仍有端口占用，请打开任务管理器手动结束node.exe进程
pause
