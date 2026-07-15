# TravelMate AI · 智能旅行规划助手

![Vue3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![LangChain](https://img.shields.io/badge/LangChain-0.1-1C3C3C?logo=langchain)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

## ✨ 项目简介

**TravelMate AI** 是一款基于大语言模型的智能旅行规划助手，帮助用户快速生成个性化、结构化的城市旅游行程。只需输入目的地、预算和天数，系统即可自动规划每日景点安排、预算分配、交通建议及实用贴士。同时内置 AI 聊天功能，支持实时问答，让旅行准备变得更轻松、更高效。

项目采用 **Vue 3 + Vite** 构建响应式移动端界面，**Node.js + Express** 提供 RESTful API，通过 **LangChain** 接入 DeepSeek 大模型实现智能内容生成，并利用 Server-Sent Events (SSE) 实现流式对话体验。整体设计兼顾了良好的用户体验与可扩展的后端架构，适合作为开源展示或技术作品集项目。

---

## 🧩 功能模块

| 模块 | 说明 |
|------|------|
| 🗺 **智能行程规划** | 根据城市、预算、天数自动生成包含每日上午/下午/晚上景点安排的完整行程 |
| 💬 **AI 实时聊天** | 基于大模型的旅游问答助手，支持流式输出，可随时咨询景点、美食、交通等问题 |
| 📊 **预算明细展示** | 自动拆解住宿、餐饮、交通、门票及其他费用，并汇总总预算 |
| 🏷 **快捷问题与热门城市** | 首页提供常见问题和热门城市标签，一键快速发起规划或对话 |
| 📱 **移动优先 UI** | 基于 Vant 组件库，适配手机端操作，界面简洁清晰 |
| 🔗 **行程详情与聊天联动** | 从行程详情页可一键跳转至 AI 聊天，并自动带入城市信息 |

---

## 项目截图

<img width="686" height="1211" alt="屏幕截图 2026-07-02 173522" src="https://github.com/user-attachments/assets/a84662d1-64a6-43b2-8fb1-b0ca1581f9ac" />
<img width="703" height="1198" alt="屏幕截图 2026-07-01 182213" src="https://github.com/user-attachments/assets/fe888866-891f-4d59-8f0b-c7c3755de357" />
<img width="751" height="1199" alt="屏幕截图 2026-07-02 173513" src="https://github.com/user-attachments/assets/c55fcb56-dfc7-4208-968e-da339bfb2beb" />
<img width="653" height="1162" alt="屏幕截图 2026-07-02 173128" src="https://github.com/user-attachments/assets/9deaca59-15ed-4653-ab2d-4196e2848493" />
<img width="647" height="1149" alt="屏幕截图 2026-07-02 173437" src="https://github.com/user-attachments/assets/8ad38c89-4c9b-4e16-aa8c-9c84a49c5a98" />
<img width="814" height="717" alt="屏幕截图 2026-07-02 173447" src="https://github.com/user-attachments/assets/d573edfd-fc3b-4809-8210-95af1625f5a1" />
<img width="686" height="1190" alt="屏幕截图 2026-07-02 173450" src="https://github.com/user-attachments/assets/3c1ab20b-1c06-4f5c-a544-1deb23fb0f91" />
<img width="778" height="1081" alt="屏幕截图 2026-07-02 173455" src="https://github.com/user-attachments/assets/56534299-e296-4fa0-b8fe-3297d2b601dd" />

---

## 🛠 技术栈

### 前端
- **Vue 3** – 渐进式 JavaScript 框架，组合式 API 编写
- **Vite** – 极速构建工具，开发热更新
- **Vue Router** – 前端路由管理（首页、聊天、我的、详情）
- **Vant 4** – 移动端 UI 组件库，提供丰富的交互组件
- **Axios** – 封装 HTTP 请求，处理流式响应

### 后端
- **Node.js + Express** – 搭建 RESTful API 服务，处理路由和中间件
- **LangChain** – 统一封装大模型调用，支持流式输出
- **DeepSeek API** – 提供大语言模型能力（可替换为 OpenAI 或其他兼容接口）
- **dotenv** – 环境变量管理

### 数据流与通信
- **SSE (Server-Sent Events)** – 实现 AI 对话的流式传输，提升用户体验
- **CORS** – 跨域资源共享配置

---

## 🏗 系统架构

```text
[ 浏览器 / 移动端 ]
       │
       ▼
  Vue 3 前端界面
  (Vant UI + Vue Router)
       │
       │ HTTP / SSE
       ▼
  Express 后端服务
  - 路由层 (chat / recommend)
  - 服务层 (TravelService)
  - 流式工具 (StreamUtils)
       │
       ▼
  LangChain 封装
       │
       ▼
  DeepSeek API (大模型)
```

**数据流说明**：
1. 用户在首页填写目的地、预算、天数，点击“开始规划”；
2. 前端通过 `POST /api/travel/recommend` 发送表单数据；
3. 后端调用 `TravelService.recommend()`，构造提示词请求大模型；
4. 大模型返回 JSON 格式的行程规划，后端直接透传给前端；
5. 前端解析并渲染行程详情（折叠面板、预算表格、温馨提示等）；
6. 聊天功能通过 `POST /api/travel/chat` 发起，后端以 SSE 流式返回 AI 回复片段，前端实时更新对话气泡。

---

## 🌟 项目亮点

- **AI 驱动行程生成** – 利用大模型理解自然语言需求，输出结构化、可执行的旅行计划，而非简单模板。
- **流式对话体验** – 聊天回复采用 SSE 逐字输出，模拟真人打字效果，交互更自然。
- **模块化组件设计** – 封装 `SpotItem`、`BudgetTable`、`ChatBubble` 等可复用组件，代码清晰易维护。
- **移动端适配** – 基于 Vant 组件和自定义样式，完美适配手机屏幕，并保留底部 TabBar 导航。
- **全栈一体化** – 前后端分离但紧密协作，展示完整的全栈开发能力。
- **易于扩展** – 后端采用服务类设计，支持快速替换 AI 供应商或增加更多功能。

---

## 📦 项目安装与运行

### 前置条件
- Node.js 18+ 
- npm 或 yarn
- DeepSeek API Key（或 OpenAI 兼容密钥）

### 克隆与安装
```bash
# 克隆仓库
git clone https://github.com/coco1112-art/travelmate-ai.git
cd travelmate-ai
```

### 后端配置
```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 复制环境变量模板
cp .env.example .env

# 编辑 .env，填入你的 API Key 和端口
# PROVIDER=DEEPSEEK
# DEEPSEEK_API_KEY=sk-xxxxx
# DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
# DEEPSEEK_MODEL=deepseek-chat
# PORT=3300
```

### 启动后端
```bash
npm run dev   # 使用 nodemon 热重载
# 或
node index.js
```

### 前端配置与启动
```bash
# 回到项目根目录，进入前端目录（若前后端分离）
cd ../client   # 假设前端在 client 文件夹

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 访问 http://localhost:5173 (Vite 默认端口)
```

**注意**：前端 `request.js` 中 `baseURL` 默认指向 `http://127.0.0.1:3300/api/travel/`，请确保后端端口一致或修改为实际地址。

---

## 🚀 未来优化方向

- **用户系统** – 增加登录/注册，保存个人行程记录与收藏
- **多语言支持** – 国际用户友好，适配英文界面
- **地图集成** – 接入高德或 Google Maps API，可视化路线和景点位置
- **酒店/机票预订** – 与第三方 API 对接，提供一键预订服务
- **更丰富的提示工程** – 针对不同旅行风格（穷游/豪华/亲子）定制生成逻辑
- **缓存机制** – 对热门城市行程进行缓存，减少 API 调用成本
- **PWA 支持** – 将应用转为渐进式 Web 应用，支持离线使用

---

## 👥 适用人群

- **自由行游客** – 快速获取行程建议，节省做攻略时间
- **旅行规划爱好者** – 探索不同城市的玩法，获取灵感
- **全栈开发者** – 学习 Vue 3 + Node.js 整合，以及大模型 API 的实际应用
- **开源贡献者** – 可参与项目迭代，共建功能模块
- **学生/求职者** – 作为个人作品集展示全栈 + AI 集成能力

---

**TravelMate AI – 让每一次旅行都充满灵感与便捷。**
