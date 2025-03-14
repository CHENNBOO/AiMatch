<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主要内容区 -->
    <div class="relative container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <router-link to="/" class="absolute left-4 top-4">
        <el-button class="flex items-center space-x-2 !bg-white/80 dark:!bg-gray-800/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <el-icon><Back /></el-icon>
          <span>返回首页</span>
        </el-button>
      </router-link>

      <!-- 标题区 -->
      <div class="text-center mb-12 mt-8">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">虚拟互动</h1>
        <p class="text-xl text-black/70 dark:text-white/70">智能对话体验</p>
      </div>

      <!-- 聊天区域 -->
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- 聊天记录 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
          <div class="chat-container h-[400px] overflow-y-auto pr-4" ref="chatContainer">
            <div v-for="(msg, index) in messages" :key="index" 
                 :class="['flex mb-4', msg.isUser ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[80%] p-4 rounded-2xl shadow-md backdrop-blur-xl',
                msg.isUser ? 'bg-blue-500 text-white' : 'bg-white/60 dark:bg-gray-700/60 text-black dark:text-white'
              ]">
                <div class="whitespace-pre-wrap">{{ msg.content }}</div>
              </div>
            </div>
            <div v-if="isLoading" class="flex justify-start mb-4">
              <div class="bg-white/60 dark:bg-gray-700/60 max-w-[80%] p-4 rounded-2xl shadow-md backdrop-blur-xl">
                <div class="flex items-center space-x-2">
                  <span class="text-black/70 dark:text-white/70">正在输入</span>
                  <span class="loading-dots"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
          <el-input
            v-model="userMessage"
            type="textarea"
            :rows="3"
            placeholder="输入你想说的话..."
            :disabled="isLoading"
            @keyup.enter.ctrl="sendMessage"
            class="!bg-white/60 dark:!bg-gray-700/60 !rounded-xl !mb-4"
          />
          <div class="flex justify-end">
            <el-button 
              type="primary"
              @click="sendMessage"
              :loading="isLoading"
              class="!px-8 !py-3 !text-lg !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !bg-gradient-to-r from-blue-500 to-blue-600"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import axios from 'axios'

interface Message {
  content: string
  isUser: boolean
}

const messages = ref<Message[]>([])
const userMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const sendMessage = async () => {
  if (!userMessage.value.trim() || isLoading.value) return
  
  const message = userMessage.value.trim()
  userMessage.value = ''
  
  messages.value.push({
    content: message,
    isUser: true
  })
  
  isLoading.value = true
  scrollToBottom()
  
  try {
    const response = await axios.post('/api/chat', {
      message,
      history: messages.value
    })
    
    messages.value.push({
      content: response.data.message,
      isUser: false
    })
  } catch (error) {
    ElMessage.error('发送消息失败，请重试')
    console.error('Error sending message:', error)
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      chatContainer.value!.scrollTop = chatContainer.value!.scrollHeight
    }, 100)
  }
}

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 暗色模式滚动条 */
.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 加载动画 */
.loading-dots::after {
  content: '...';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-select-dropdown) {
  @apply !bg-white/90 dark:!bg-gray-800/90 !backdrop-blur-xl !border-none !shadow-lg;
}

:deep(.el-select-dropdown__item) {
  @apply !text-black dark:!text-white;
}

:deep(.el-select-dropdown__item.hover) {
  @apply !bg-blue-500/10;
}

:deep(.el-select-dropdown__item.selected) {
  @apply !text-blue-500;
}

:deep(.el-input__wrapper) {
  @apply !shadow-none !border !border-gray-200 dark:!border-gray-700 !rounded-xl;
}

:deep(.el-input__inner) {
  @apply !text-black dark:!text-white;
}

:deep(.el-textarea__inner) {
  @apply !bg-transparent !text-black dark:!text-white !border-gray-200 dark:!border-gray-700;
}

:deep(.el-loading-mask) {
  @apply !bg-white/50 dark:!bg-black/50 !backdrop-blur-sm;
}
</style> 