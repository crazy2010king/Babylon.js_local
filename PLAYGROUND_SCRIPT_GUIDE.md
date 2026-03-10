# Babylon.js Playground 启动脚本使用指南

## 📁 脚本文件说明
```
Babylon.js_local/
├── start-playground.bat   # 启动脚本（自动完成依赖安装、构建、服务启动）
├── stop-playground.bat    # 停止脚本（清理所有相关进程和端口占用）
└── PLAYGROUND_SCRIPT_GUIDE.md  # 使用说明
```

## 🚀 快速启动
1. **第一次运行**: 双击 `start-playground.bat`
   - 自动检查并安装所有依赖
   - 自动构建工具和核心库
   - 自动启动开发服务器
   - 首次运行可能需要10-15分钟，请耐心等待

2. **后续运行**: 直接双击 `start-playground.bat`
   - 自动跳过已完成的构建步骤
   - 快速启动服务（通常1分钟内）

3. **访问服务**: 浏览器打开 `http://localhost:1338`
   - `/` 路径: 我们新开发的示例首页
   - `/example/[snippetId]` 路径: 示例详情页
   - `/editor` 或旧路径: 原有Playground编辑器

## ⏹️ 停止服务
1. 在运行窗口按 `Ctrl+C` 正常停止
2. 如果服务异常卡住或端口被占用:
   - 双击运行 `stop-playground.bat`
   - 自动清理所有相关进程和端口占用

## ⚠️ 注意事项
### 环境要求
- Node.js 版本: **v20.x - v22.x**（官方支持版本）
  - 如果使用v23+版本，脚本会给出警告，可能存在兼容性问题
  - 推荐使用 [nvm-windows](https://github.com/coreybutler/nvm-windows) 管理Node版本
- 磁盘空间: 至少10GB空闲空间用于构建和依赖

### 常见问题
#### 1. 依赖安装失败
```
解决方案:
1. 运行 stop-playground.bat
2. 删除 node_modules 文件夹
3. 重新运行 start-playground.bat
4. 如仍失败，尝试切换Node版本到v20 LTS
```

#### 2. 端口1338被占用
```
解决方案:
1. 关闭所有正在运行的Node.js窗口
2. 运行 stop-playground.bat 清理残留进程
3. 重新启动服务
```

#### 3. 构建失败
```
解决方案:
1. 确保已安装完整的Windows开发环境（Visual Studio Build Tools）
2. 删除 packages/dev/build-tools/dist 和 packages/dev/core/dist 文件夹
3. 重新运行 start-playground.bat
```

## 🎯 功能说明
### 新功能
- ✅ 示例首页: 分类导航、搜索功能、卡片式展示
- ✅ 示例详情页: 三种布局模式、实时预览、只读代码查看
- ✅ 一键跳转到Playground编辑器编辑

### 向后兼容
- 所有原有Playground功能完全保留
- 旧URL `/#[snippetId]` 自动重定向到新的详情页
- 可通过 `/editor` 路径直接访问原编辑器
