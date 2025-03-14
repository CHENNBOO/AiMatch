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
        <p class="text-xl text-black/70 dark:text-white/70">可DIY的智能对话体验</p>
      </div>

      <!-- 设置区域 -->
      <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <el-form :model="form" class="space-y-8">
          <!-- MBTI类型选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">您的MBTI类型</h3>
            <el-select 
              v-model="form.selfProfile.mbtiType" 
              placeholder="请选择您的MBTI类型"
              class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
              <el-option
                v-for="type in mbtiTypes"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
          </div>

          <!-- 对方类型选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">对方的类型</h3>
            <el-select 
              v-model="form.partnerProfile.mbtiType" 
              placeholder="请选择对方的类型"
              class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
              <el-option-group label="MBTI类型">
                <el-option
                  v-for="type in mbtiTypes"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-option-group>
              <el-option-group label="特殊人格">
                <el-option
                  v-for="type in specialPersonalities"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-option-group>
            </el-select>
          </div>

          <!-- 互动场景选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">互动场景</h3>
            <el-select 
              v-model="form.selectedScenario" 
              placeholder="请选择互动场景"
              class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
              <el-option
                v-for="(scenario, key) in scenarios"
                :key="key"
                :label="scenario.title"
                :value="key"
              />
            </el-select>
          </div>
        </el-form>
      </div>

      <!-- 未完成设置提示 -->
      <div v-if="!isReady" class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg text-center">
        <el-empty description="请完成以上设置">
          <template #description>
            <div class="space-y-4 mt-4">
              <div class="flex items-center space-x-2" :class="{ 'text-blue-500': form.selfProfile.mbtiType, 'text-black/50 dark:text-white/50': !form.selfProfile.mbtiType }">
                <el-icon><CircleCheck v-if="form.selfProfile.mbtiType" /><CircleClose v-else /></el-icon>
                <span>选择您的MBTI类型</span>
              </div>
              <div class="flex items-center space-x-2" :class="{ 'text-blue-500': form.partnerProfile.mbtiType, 'text-black/50 dark:text-white/50': !form.partnerProfile.mbtiType }">
                <el-icon><CircleCheck v-if="form.partnerProfile.mbtiType" /><CircleClose v-else /></el-icon>
                <span>选择对方的类型</span>
              </div>
              <div class="flex items-center space-x-2" :class="{ 'text-blue-500': form.selectedScenario, 'text-black/50 dark:text-white/50': !form.selectedScenario }">
                <el-icon><CircleCheck v-if="form.selectedScenario" /><CircleClose v-else /></el-icon>
                <span>选择互动场景</span>
              </div>
            </div>
          </template>
        </el-empty>
      </div>

      <!-- 聊天区域 -->
      <div v-else class="max-w-4xl mx-auto space-y-8">
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
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Back, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import axios from 'axios'

interface Message {
  content: string
  isUser: boolean
}

interface Profile {
  mbtiType: string
  traits: string[]
  interests: string[]
}

interface Scenario {
  title: string
  focus: string[]
}

const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const specialPersonalities = [
  '超雄人格',
  '贴吧老哥人格',
  '反社会人格'
]

const scenarios: Record<string, Scenario> = {
  work: {
    title: '工作交流',
    focus: ['团队协作', '任务分配', '会议沟通', '反馈传达']
  },
  relationship: {
    title: '人际关系',
    focus: ['建立联系', '维护关系', '表达需求', '共情理解']
  },
  conflict: {
    title: '冲突处理',
    focus: ['矛盾化解', '立场调和', '情绪管理', '解决方案']
  },
  emotion: {
    title: '情绪管理',
    focus: ['情绪觉察', '压力缓解', '自我调节', '积极表达']
  }
}

const messages = ref<Message[]>([])
const userMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const form = ref({
  selfProfile: {
    mbtiType: '',
    traits: [] as string[],
    interests: [] as string[]
  },
  partnerProfile: {
    mbtiType: '',
    traits: [] as string[],
    interests: [] as string[]
  },
  selectedScenario: ''
})

const isReady = computed(() => {
  return !!(form.value.selfProfile.mbtiType && 
    form.value.partnerProfile.mbtiType && 
    form.value.selectedScenario)
})

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      chatContainer.value!.scrollTop = chatContainer.value!.scrollHeight
    }, 100)
  }
}

const sendMessage = async () => {
  if (!isReady.value) {
    ElMessage.warning('请先完成所有设置')
    return
  }

  if (!userMessage.value.trim() || isLoading.value) return

  const message = userMessage.value.trim()
  messages.value.push({
    content: message,
    isUser: true
  })
  
  userMessage.value = ''
  scrollToBottom()

  isLoading.value = true
  try {
    const response = await axios.post('/api/virtual-interaction', {
      selfProfile: form.value.selfProfile,
      partnerProfile: form.value.partnerProfile,
      scenario: form.value.selectedScenario,
      message,
      isInitial: false
    })

    if (response.data.status === 'success') {
      messages.value.push({
        content: response.data.data,
        isUser: false
      })
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('生成回应时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const initializeChat = async () => {
  if (!isReady.value) return

  isLoading.value = true
  try {
    const response = await axios.post('/api/virtual-interaction', {
      selfProfile: form.value.selfProfile,
      partnerProfile: form.value.partnerProfile,
      scenario: form.value.selectedScenario,
      isInitial: true
    })

    if (response.data.status === 'success') {
      messages.value = [{
        content: response.data.data,
        isUser: false
      }]
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('初始化对话时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => isReady.value,
  (newVal) => {
    if (newVal) {
      messages.value = []
      initializeChat()
    }
  },
  { immediate: true }
)
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