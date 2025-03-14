<template>
  <el-dialog
    v-model="dialogVisible"
    title="虚拟互动"
    width="80%"
    :close-on-click-modal="false"
    class="virtual-interaction-dialog"
    destroy-on-close
  >
    <div class="min-h-[600px] relative">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <!-- 聊天区域 -->
      <div class="relative z-10 h-[500px] flex flex-col">
        <!-- 聊天记录 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6" ref="chatContainer">
          <div v-for="(message, index) in messages" :key="index" 
            :class="['flex items-start gap-4', message.type === 'user' ? 'flex-row-reverse' : 'flex-row']">
            <!-- AI头像 -->
            <div v-if="message.type === 'ai'" class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <el-icon class="text-white text-xl"><Avatar /></el-icon>
            </div>
            <!-- 用户头像 -->
            <div v-else class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <el-icon class="text-white text-xl"><UserFilled /></el-icon>
            </div>
            
            <!-- 消息内容 -->
            <div :class="[
              'max-w-[70%] rounded-2xl p-4 shadow-sm',
              message.type === 'user' 
                ? 'bg-gradient-to-br from-pink-500 to-orange-500 text-white' 
                : 'bg-white/80 dark:bg-gray-800/80 text-black dark:text-white'
            ]">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm opacity-70">
                  {{ message.type === 'user' ? '你' : 'AI助手' }}
                </span>
              </div>
              <div class="text-base leading-relaxed">
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div class="flex gap-3">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="2"
              placeholder="输入消息..."
              @keyup.enter.ctrl="sendMessage"
              @keyup.enter.exact.prevent="sendMessage"
              resize="none"
              class="flex-1"
            />
            <el-button 
              type="primary" 
              :icon="Promotion"
              @click="sendMessage"
              :loading="isLoading"
              class="!px-4 text-blue-500 hover:text-white"
            >
              点击发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { Promotion, Avatar, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

interface Message {
  type: 'user' | 'ai'
  content: string
  isStreaming?: boolean
}

const messages = ref<Message[]>([
  { type: 'ai', content: '你好！我是你的AI伙伴，很高兴和你聊天。', isStreaming: true }
])
const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// 获取对方性格描述
const getPersonalityDescription = () => {
  const person2Type = localStorage.getItem('person2Type') || ''
  const person2OtherTypes = JSON.parse(localStorage.getItem('person2OtherTypes') || '[]')
  const person2CustomType = localStorage.getItem('person2CustomType') || ''
  
  let personality = `MBTI类型：${person2Type}`
  if (person2OtherTypes.length > 0) {
    personality += `\n其他特征：${person2OtherTypes.join('、')}`
  }
  if (person2CustomType) {
    personality += `\n自定义特征：${person2CustomType}`
  }
  
  return personality
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  messages.value.push({ type: 'user', content: userMessage })
  inputMessage.value = ''
  isLoading.value = true

  try {
    const personality = getPersonalityDescription()
    const response = await axios.post('http://localhost:3000/api/virtual-interaction', {
      message: userMessage,
      personality: personality
    })
    
    messages.value.push({ type: 'ai', content: response.data.reply })
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时初始化AI欢迎语
onMounted(async () => {
  try {
    const personality = getPersonalityDescription()
    const response = await axios.post('http://localhost:3000/api/virtual-interaction', {
      message: '你好，请介绍一下你自己',
      personality: personality
    })
    
    messages.value[0].content = response.data.reply
  } catch (error) {
    console.error('初始化AI欢迎语失败:', error)
    ElMessage.error('初始化失败，请刷新页面重试')
  }
})

// 监听消息变化，自动滚动到底部
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })
</script>

<style scoped>
.virtual-interaction-dialog {
  :deep(.el-dialog) {
    @apply !bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800;
    @apply !rounded-3xl;
    @apply !border-none;
    @apply !shadow-2xl;
    @apply overflow-hidden;
  }

  :deep(.el-dialog__header) {
    @apply !border-b !border-gray-200 dark:!border-gray-700;
    @apply !bg-white/80 dark:!bg-gray-800/80;
    @apply !backdrop-blur-xl;
    @apply !p-6;
  }

  :deep(.el-dialog__title) {
    @apply !text-2xl !font-bold !text-black dark:!text-white;
  }

  :deep(.el-dialog__body) {
    @apply !p-8;
  }

  :deep(.el-textarea__inner) {
    @apply !bg-white/80 dark:!bg-gray-800/80;
    @apply !border-gray-200 dark:!border-gray-700;
    @apply !text-black dark:!text-white;
    @apply !rounded-xl;
    @apply !resize-none;
    @apply !shadow-sm;
  }

  :deep(.el-button) {
    @apply !rounded-full;
    @apply !shadow-sm;
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* 打字机光标效果 */
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 