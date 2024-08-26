# Douyin AI Wenan

## 项目描述

Douyin AI Wenan 是一个基于`Vue 3`和`coze`的智能文案处理工作流。

它能够自动修正从抖音视频中提取的文本,处理同音字错误,并优化标点符号使用。

获取到修正文本之后,可以推送到Memos在线备忘录，方便后续继续学习。

## 功能特点

- 自动处理抖音视频分享文本
- 使用new-api/one-api进行智能文本修正
- 支持多个AI模型,自动切换以确保可靠性
- 实时流式响应,提供即时反馈
- 可自定义API设置
- 美观的UI设计,包括毛玻璃效果和响应式布局
- 支持Markdown格式的输出
- 支持一键推送到Memos

## 部署

**注意，你需要有一个可以提供`coze`以及大语言模型的api**

可以参考这个[帖子](https://linux.do/t/topic/125956)搭建

点击下面的按钮可以快速将项目部署到Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffangyuan99%2Fdouyin-ai-wenan&env=VITE_API_KEY&env=VITE_API_URL&env=VITE_DEFAULT_MODEL1&env=VITE_DEFAULT_MODEL2&env=VITE_WALLPAPER_URL&env=VITE_MEMOS_URL&env=VITE_MEMOS_KEY&project-name=douyin-ai-wenan&repository-name=douyin-ai-wenan)

设置环境变量

| 环境变量                   | 描述                                                         |
|------------------------|------------------------------------------------------------|
| VITE_API_KEY           | OpenAI API密钥                                               |
| VITE_API_URL           | OpenAI API的URL,如: `https://api.openai.com/v1/chat/completions` |
| VITE_DEFAULT_MODEL1    | 第一组模型,用于获取抖音文案,用逗号分隔,如: `coze`                             |
| VITE_DEFAULT_MODEL2    | 第二组模型,用于修正文案,用逗号分隔,如: `gpt-4,gpt-4o-mini`                  |
| VITE_MEMOS_URL(可选)     | Memos的主URL，如: `https://demo.usememos.com`                  |
| VITE_MEMOS_KEY(可选)     | Memos的账号信息里面申请token(ey开头),如: `eyJhbGc...`                  |
| VITE_WALLPAPER_URL(可选) | 背景壁纸的URL(注意要支持CORS跨域，否则不能下载)                               |

这里提供了一个公共账号用于测试，**推荐使用自建**

Memos文档:
[What is Memos - Memos](https://www.usememos.com/docs)

Memos仓库:
[usememos/memos: An open source, lightweight note-taking service. Easily capture and share your great thoughts.](https://github.com/usememos/memos)
```
账号:
DouyinAIWenan
KEY: 
eyJhbGciOiJIUzI1NiIsImtpZCI6InYxIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiRG91eWluQUlXZW5hbiIsImlzcyI6Im1lbW9zIiwic3ViIjoiMTIiLCJhdWQiOlsidXNlci5hY2Nlc3MtdG9rZW4iXSwiaWF0IjoxNzI0NjgzNDAxfQ.yAiBw0oDxWuRgyEUGUcEM_fKomlL8TnPoNHindICAUU
```

## 技术栈

- Vue 3
- Tailwind CSS
- Ant Design Vue
- OpenAI API
- Memos API

## 从源码编译

1. 克隆仓库：
git clone https://github.com/fangyuan99/douyin-ai-wenan.git


2. 进入项目目录：
cd douyin-ai-wenan


3. 安装依赖：
pnpm install


4. 创建`.env`文件并设置必要的环境变量（参考`.env.production`）


## 使用方法

1. 启动开发服务器：
pnpm run dev


2. 在浏览器中打开显示的URL（通常是 `http://localhost:5173`）

3. 在输入框中粘贴抖音视频的分享文本

4. 点击发送按钮或按回车键

5. 等待AI处理并返回修正后的文本

6. 使用`Copy Markdown`按钮复制修正后的文本,使用`Push to Memos`按钮将文本推送到Memos

## 自定义设置

点击设置图标可以自定义以下选项：
- API URL
- API Key
- Model 1 和 Model 2 的选项列表


## 贡献

欢迎提交问题和拉取请求。对于重大更改,请先开issue讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
