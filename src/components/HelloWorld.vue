<template>
  <div class="container mx-auto max-w-[800px] px-4">
    <div class="header mt-5 bg-white bg-opacity-20 backdrop-blur-lg p-4 mb-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-4">
        Douyin AI Wenan
      </h1>
      <div class="flex justify-center space-x-4">
        <a-button
            @click="downloadWallpaper"
            type="default"
            size="small"
        >
          下载壁纸
        </a-button>
        <a-button
            @click="toggleApiSettings"
            type="default"
            size="small"
        >
          设置
        </a-button>
        <a-button @click="showHelpModal" type="default"
                  size="small">
          帮助
        </a-button>
      </div>
    </div>

    <a-card v-if="showApiSettings" class="settings-card mb-8 bg-white bg-opacity-80 backdrop-blur-sm">
      <a-form layout="vertical">
        <a-form-item label="API URL">
          <a-input v-model:value="apiUrl" placeholder="Enter OpenAI API URL" />
        </a-form-item>
        <a-form-item label="API Key">
          <a-input-password
              v-model:value="apiKey"
              placeholder="Enter OpenAI API Key"
          />
        </a-form-item>
        <a-form-item label="Model 1 (Lists split using ,)">
          <a-input
              v-model:value="model1"
              placeholder="Enter Model 1 (Lists split using ,)"
          />
        </a-form-item>
        <a-form-item label="Model 2 (Lists split using ,)">
          <a-input
              v-model:value="model2"
              placeholder="Enter Model 2 (Lists split using ,)"
          />
        </a-form-item>
      </a-form>
    </a-card>

    <div class="messages-container space-y-4">
      <a-card
          v-for="message in messages"
          :key="message.id"
          class="message-card mb-4 bg-white bg-opacity-80 backdrop-blur-sm"
      >
        <template #title>
          <span v-if="message.type === 'user'" class="font-bold text-blue-600">User</span>
          <span v-else class="font-bold text-green-600">AI ({{ message.model }})</span>
        </template>
        <div
            v-html="
            message.type === 'ai' ? renderMarkdown(message.text) : message.text
          "
            class="mb-2 message-content"
        ></div>
        <a-button
            v-if="message.type === 'ai'"
            @click="copyMarkdown(message.text)"
            size="small"
            class="mt-2"
        >Copy Markdown</a-button>
      </a-card>
    </div>

    <div class="footer-container fixed bottom-0 left-0 right-0  rounded-lg p-4">
      <div class="input-wrapper flex items-center max-w-[800px] mx-auto bg-white rounded-full shadow-lg overflow-hidden ">
        <a-button size="large" @click="pasteClipboard" class="mb-1 ml-2 bg-transparent border-none hover:bg-gray-100">
          <template #icon><CopyOutlined class="text-gray-500" /></template>
        </a-button>
        <a-input
            v-model:value="userInput"
            placeholder="抖音链接或者分享口令"
            @pressEnter="sendMessage"
            class="flex-grow border-none focus:ring-0"
        />
        <a-button size="large"  @click="sendMessage" :loading="isLoading" class="mb-1 bg-transparent border-none">
          <template #icon><SendOutlined class="text-purple-600" /></template>
        </a-button>
      </div>
    </div>
    <a-modal v-model:visible="helpModalVisible" title="如何使用" @ok="helpModalVisible = false">
      <p>1. 在输入框中粘贴或输入抖音视频的分享文本。如:</p>
      <p>6.66 srE:/ 08/27 s@E.UL 游戏里的你再强大也是假的 # 闪耀优俊少女 # 诗歌剧 # 傻了吧唧 # 成龙 # 成龙说  https://v.douyin.com/iM4P1HTY/ 复制此链接，打开Dou音搜索，直接观看视频！</p>
      <p>https://v.douyin.com/iM4P1HTY/</p>
      <p>2. 点击发送按钮或按回车键发送消息。</p>
      <p>3. AI 将处理文本并返回修正后的版本。</p>
      <p>4. 您可以复制 AI 返回的 Markdown 格式文本。</p>
      <p>5. 使用设置按钮可以配置 API URL 和 Key。</p>
      <p>6. 点击下载按钮可以保存当前的背景图片。</p>
    </a-modal>
  </div>
</template>

<style>

.message-content {
  @apply break-words;
}

/* 自定义滚动条样式 */
.messages-container {
  @apply max-h-[calc(100vh-225px)] overflow-y-auto;
}


.messages-container::-webkit-scrollbar-track {
  @apply bg-gray-200 rounded-full;
}

.messages-container::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
.footer-container {
  @apply transition-all duration-300 ease-in-out;
}

.footer-container::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  //height: 20px;
  background: linear-gradient(to top, rgba(147, 51, 234, 0.1), transparent);
}

.input-wrapper {
  @apply transition-all duration-300 ease-in-out;
}

.input-wrapper:hover {
  @apply shadow-xl;
}

</style>
<script setup>
import { ref, onMounted,h } from 'vue';
import { message } from 'ant-design-vue';
import { SettingOutlined, CopyOutlined, SendOutlined, DownloadOutlined,QuestionCircleOutlined,SearchOutlined  } from '@ant-design/icons-vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const userInput = ref("");
const messages = ref([]);
const apiKey = ref(import.meta.env.VITE_API_KEY);
const apiUrl = ref(import.meta.env.VITE_API_URL);
const showApiSettings = ref(false);
const isLoading = ref(false);
const model1 = ref(import.meta.env.VITE_DEFAULT_MODEL1);
const model2 = ref(import.meta.env.VITE_DEFAULT_MODEL2);
const wallpaperBase64 = ref('');
const helpModalVisible = ref(false);
const systemPrompt = `### 角色和能力
你是一名中文文案修正大师，擅长处理同音不同字、标点符号错误等问题。
### 上下文说明
我将提供一段从视频转文字获取的文案，这段文案由于识别精度的问题，存在一些同音不同字的错误。
### 任务陈述
1. 识别并修正文案中的同音不同字问题，添加正确的标点符号。
2. 保持原文内容的完整性，不主观增删内容。
3. 将文案进行合理分段，如果你主观增删内容，你会被殴打，如果没有，你会得到100美元小费
4. 如果你确定这是两个人对话，可以标注人名，从上下文中获取人名`

function showHelpModal() {
  helpModalVisible.value = true;
}

onMounted(() => {
  loadApiSettings();
  // fetchAndSetBackgroundImage();
  setBackgroundImage(import.meta.env.VITE_WALLPAPER_URL)
  //移除所有span的anticon类
});

async function fetchAndSetBackgroundImage() {
  const wallpaperUrl = import.meta.env.VITE_WALLPAPER_URL;
  try {
    const response = await fetch(wallpaperUrl);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    wallpaperBase64.value = base64;
    setBackgroundImage(base64);
  } catch (error) {
    console.error('Failed to fetch and set background image:', error);
    // 直接给body设置背景图片
    setBackgroundImage(wallpaperUrl)
    // message.error('Failed to load background image');
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function setBackgroundImage(url) {
  document.body.style.backgroundImage = `url(${url})`;
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundSize = 'cover';
}


function renderMarkdown(text) {
  return md.render(text);
}

function toggleApiSettings() {
  showApiSettings.value = !showApiSettings.value;
  saveApiSettings();
}

function saveApiSettings() {
  localStorage.setItem("apiKey", apiKey.value);
  localStorage.setItem("apiUrl", apiUrl.value);
  localStorage.setItem("model1", model1.value);
  localStorage.setItem("model2", model2.value);
}

function loadApiSettings() {
  const savedApiKey = localStorage.getItem("apiKey");
  const savedApiUrl = localStorage.getItem("apiUrl");
  const savedModel1 = localStorage.getItem("model1");
  const savedModel2 = localStorage.getItem("model2");
  if (savedApiKey) apiKey.value = savedApiKey;
  if (savedApiUrl) apiUrl.value = savedApiUrl;
  if (savedModel1) model1.value = savedModel1;
  if (savedModel2) model2.value = savedModel2;
}

function copyMarkdown(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success("复制成功");
    })
    .catch((err) => {
      message.error(`写入剪贴板失败\n${err}`);
    });
}

async function pasteClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    userInput.value = text;
  } catch (err) {
    message.error(`粘贴失败\n${err}`);
  }
}

const downloadWallpaper = () => {
  // if (!wallpaperBase64.value) {
  //   message.error('壁纸加载失败，或CORS跨域错误');
  //   return;
  // }

  const link = document.createElement('a');
  link.href = import.meta.env.VITE_WALLPAPER_URL;
  link.download = 'wallpaper.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  message.success('Wallpaper download started');
};
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  isLoading.value = true;
  messages.value.push({
    id: Date.now(),
    text: userInput.value,
    type: "user",
  });
  const userMessage = userInput.value;
  userInput.value = "";

  const models1 = model1.value.split(",").map((m) => m.trim());
  const models2 = model2.value.split(",").map((m) => m.trim());

  try {
    // First request: non-streaming
    let response1, model1Used;
    for (const model of models1) {
      try {
        const payload1 = {
          model: model,
          messages: [{ role: "user", content: userMessage }],
        };

        const headers = {
          Authorization: `Bearer ${apiKey.value}`,
          "Content-Type": "application/json",
        };

        response1 = await fetch(apiUrl.value, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload1),
        });

        if (response1.ok) {
          model1Used = model;
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
      }
    }

    if (!response1 || !response1.ok) {
      throw new Error("All models for the first request failed");
    }

    const responseData1 = await response1.json();
    const resultContent = responseData1.choices[0].message.content;

    // Extract the specific part from the result
    const extractedContent = resultContent
      .split('content":"**')[1]
      .split("**视频或图片OCR文本")[0];

    // Second request: streaming
    let model2Used;
    for (const model of models2) {
      try {
        const payload2 = {
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            { role: "user", content: extractedContent },
          ],
          stream: true,
        };

        const headers = {
          Authorization: `Bearer ${apiKey.value}`,
          "Content-Type": "application/json",
        };

        const response2 = await fetch(apiUrl.value, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload2),
        });

        if (response2.ok) {
          model2Used = model;
          const reader = response2.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let aiMessage = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value);
            const lines = textChunk
              .split("\n")
              .filter((line) => line.trim() !== "");

            for (const line of lines) {
              if (line.trim() === "data: [DONE]") return;

              const json = JSON.parse(line.replace(/^data: /, ""));
              const content = json.choices[0].delta.content;
              if (content) {
                aiMessage += content;
                if (
                  messages.value.length > 0 &&
                  messages.value[messages.value.length - 1].type === "ai"
                ) {
                  messages.value[messages.value.length - 1].text = aiMessage;
                } else {
                  messages.value.push({
                    id: Date.now(),
                    text: aiMessage,
                    type: "ai",
                    model: `${model1Used} -> ${model2Used}`,
                  });
                }
              }
            }
          }
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
      }
    }

    if (!model2Used) {
      throw new Error("All models for the second request failed");
    }
  } catch (error) {
    console.error("Failed to send message:", error);
    messages.value.push({
      id: Date.now(),
      text: "Error: Could not get a response from OpenAI.",
      type: "ai",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

