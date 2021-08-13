> *Read this in another language: [English](README.md)*


## 概览

### 使用的 SDK

- agora-rtc-sdk（声网 RTC Web SDK）
- agora-rtm-sdk（声网实时消息 Web SDK）
- white-web-sdk（Netless 官方白板 sdk）
- 声网云录制 （建议在服务端集成）

### 使用的技术
- typescript 3.8.3
- react & react hooks & mobx
- Agora 云服务

## 准备工作

- 重命名 `.env.example` 为 `.env`，并配置以下参数：

   ```bash
   SKIP_PREFLIGHT_CHECK=true
   REACT_APP_AGORA_APP_ID=<YOUR APP_ID>
   REACT_APP_AGORA_APP_SDK_DOMAIN=https://api.agora.io
   REACT_APP_AGORA_APP_CERTIFICATE=<YOUR APP_CERTIFICATE>
   REACT_APP_AGORA_APP_RECORD_URL=<YOUR RECORD_URL>
   ```

## 运行和发布 Web demo

1. 安装 npm

   ```
   npm install
   ```

2. 本地运行 Web demo

   ```
   npm run dev
   ```
3. 发布 

   ```
   npm run build
   ```

