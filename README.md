# AiMatch - MBTI 性格匹配系统
#系统访问地址
http://117.72.43.183/

## 项目简介

AiMatch 是一个创新的性格匹配分析系统，它结合了人工智能，为用户提供专业的性格匹配分析服务。系统通过直观的界面让用户选择性格类型，并利用 AI 大模型进行深度分析，给出详细的匹配报告。除了性格匹配分析外，系统还提供了独特的虚拟聊天功能，让用户能够与不同性格类型的AI角色进行对话交流，帮助用户更深入地理解不同性格特征的思维方式和沟通模式。



## 核心功能

- 📊 性格类型选择与展示
- 🤖 AI 驱动的性格匹配分析
- 💬 AI 虚拟角色聊天互动
- 💫 动态匹配结果展示
- 📱 响应式界面设计
- 🎨 现代化 UI/UX 体验

## 系统页面预览

![系统界面预览](img/1.png)
![系统界面预览](img/2.png)
![系统界面预览](img/3.png)
![系统界面预览](img/4.png)
![系统界面预览](img/5.png)

## 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Tailwind CSS - 实用优先的 CSS 框架

### 后端
- Express.js - Node.js Web 应用框架
- Deepseek API - AI 分析引擎

## 系统要求

- Node.js >= 14
- npm >= 6
- 现代浏览器（Chrome、Firefox、Safari、Edge 等）

## 快速开始

### 1. 克隆项目
```bash
git clone https://gitee.com/CHENNBOO/AiMatch
cd AiMatch
```

### 2. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 3. 环境配置
```bash
# 配置后端环境变量
cp server/.env.example server/.env
```
在 `server/.env` 文件中配置以下信息：
- DEEPSEEK_API_KEY：你的 Deepseek API 密钥

### 4. 启动服务

```bash
# 终端 1：启动后端服务
# 清理可能存在的 Node.js 进程
taskkill /F /IM node.exe
cd server
npm run dev

# 终端 2：启动前端服务
cd ..
npm run dev
```

服务启动后：
- 前端服务：http://localhost:5173
- 后端服务：http://localhost:3000

## 使用指南

1. 访问系统主页 http://localhost:5173
2. 在左右两侧面板分别选择两个人的 MBTI 性格类型
3. 点击"开始匹配"按钮
4. 等待 AI 分析完成，查看详细的匹配报告

