# AiMatch - MBTI 性格匹配系统

一个基于 MBTI 性格类型的匹配分析系统。

## 环境要求

- Node.js >= 14
- npm >= 6

## 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/your-username/AiMatch.git
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

4. 启动服务：
```bash
# 启动后端服务
cd server
npm run dev

# 启动前端服务（新终端）
cd ..
npm run dev
```

## 安全注意事项

- 不要将 `.env` 文件提交到代码仓库
- 保护好你的 API 密钥
- 在生产环境中使用更安全的密钥管理方式

## 技术栈

- 前端：Vue 3 + Vite
- 后端：Express.js
- API：Deepseek API

## 项目描述
AiMatch 是一个基于 MBTI 性格理论的 Web 应用程序，用于计算和展示两个人的性格匹配度。应用采用 Vue 3 开发，提供左右对分的界面布局，每边包含 MBTI 四组性格维度的选择按钮（内向/外向、感觉/直觉、思维/感觉、判断/知觉），选择完成后通过动画展示两人的性格匹配结果。
