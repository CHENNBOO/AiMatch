# AiMatch - MBTI 性格匹配系统
![image-20241211153716532](https://gitee.com/CHENNBOO/AiMatch/raw/master/img/1.png)
一个基于 MBTI 性格类型的匹配分析系统。
## 技术栈

- 前端：Vue 3 + Vite
- 后端：Express.js
- API：Deepseek API

## 项目描述
AiMatch 是一个基于 MBTI 性格理论的 Web 应用程序，用于计算和展示两个人的性格匹配度。应用采用 Vue 3 开发，提供左右对分的界面布局，每边包含 MBTI 四组性格维度的选择按钮（内向/外向、感觉/直觉、思维/感觉、判断/知觉），选择完成后调用Ai大模型进行分析，通过动画展示两人的性格匹配结果。

## 启动服务：
```bash
# 启动后端服务
# 确保没有遗留的 Node.js 进程：
taskkill /F /IM node.exe
# 先启动后端服务：
cd server; npm run dev
# 启动前端服务（新终端）：
cd ..
npm run dev
```

## 使用方法
项目的前后端服务都已启动：
后端服务运行在 http://localhost:3000
前端服务运行在 http://localhost:5173
你现在可以：
在浏览器中访问 http://localhost:5173 来使用应用
选择两个 MBTI 性格类型进行匹配分析
点击"开始匹配"按钮查看分析结果

## 环境要求

- Node.js >= 14
- npm >= 6

## 安装步骤

1. 克隆仓库：
```bash
git clone https://gitee.com/CHENNBOO/AiMatch
cd AiMatch
```

2. 安装依赖：
```bash
npm install
cd server
npm install
```

3. 配置环境变量：
   - 复制 `server/.env.example` 到 `server/.env`
   - 在 `.env` 文件中填入你的 Deepseek API 密钥
```bash
cp server/.env.example server/.env
```





