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

      <!-- 步骤指示器 -->
      <div class="max-w-4xl mx-auto mb-8">
        <el-steps :active="currentStep" finish-status="success" process-status="process" align-center>
          <el-step title="选择您的类型" description="设置您的MBTI类型" />
          <el-step title="选择对方类型" description="设置对方的性格类型" />
          <el-step title="开始对话" description="与虚拟角色互动交流" />
        </el-steps>
      </div>

      <!-- 设置区域 -->
      <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <el-form :model="form" class="space-y-8">
          <!-- MBTI类型选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6"
               :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': currentStep === 1}">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-black dark:text-white">您的MBTI类型</h3>
              <el-tag v-if="isFirstPersonComplete" type="success" effect="light" class="ml-2">已完成</el-tag>
            </div>
            <div class="space-y-6">
              <div v-for="(dimension, key) in dimensions" :key="key" class="space-y-3">
                <label class="block text-sm font-medium text-black/70 dark:text-white/70">{{ dimension.label }}</label>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    v-for="option in dimension.options"
                    :key="option.value"
                    @click="selectPersonality(1, key, option.value)"
                    :class="[
                      'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      getDimensionValue(1, key) === option.value
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-600'
                    ]"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end" v-if="isFirstPersonComplete">
              <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
          </div>

          <!-- 对方类型选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6"
               :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': currentStep === 2}">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-black dark:text-white">对方的类型</h3>
              <el-tag v-if="isSecondPersonComplete" type="success" effect="light" class="ml-2">已完成</el-tag>
            </div>
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">MBTI维度选择</h4>
                <div class="space-y-6">
                  <div v-for="(dimension, key) in dimensions" :key="key" class="space-y-3">
                    <label class="block text-sm font-medium text-black/70 dark:text-white/70">{{ dimension.label }}</label>
                    <div class="grid grid-cols-2 gap-4">
                      <button
                        v-for="option in dimension.options"
                        :key="option.value"
                        @click="selectPersonality(2, key, option.value)"
                        :class="[
                          'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                          getDimensionValue(2, key) === option.value
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-600'
                        ]"
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">特殊人格</h4>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="type in specialPersonalities"
                    :key="type"
                    @click="form.partnerProfile.mbtiType = type"
                    :class="[
                      'p-3 rounded-xl transition-all duration-300 text-sm font-medium',
                      form.partnerProfile.mbtiType === type
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white/60 dark:bg-gray-600/60 text-gray-700 dark:text-gray-200 hover:bg-blue-500/10 dark:hover:bg-blue-500/10'
                    ]"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>

              <!-- 自定义类型输入区域 -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">自定义类型</h4>
                <div class="flex space-x-3">
                  <el-input
                    v-model="customType"
                    placeholder="输入自定义类型..."
                    class="!bg-white/60 dark:!bg-gray-700/60 !rounded-xl"
                    @keyup.enter="applyCustomType"
                  >
                    <template #append>
                      <el-button @click="applyCustomType">确定</el-button>
                    </template>
                  </el-input>
                </div>
              </div>

            </div>
            <div class="mt-6 flex justify-between" v-if="currentStep === 2">
              <el-button @click="previousStep">上一步</el-button>
              <el-button type="primary" @click="nextStep" :disabled="!isSecondPersonComplete">
                开始对话
              </el-button>
            </div>
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
            </div>
          </template>
        </el-empty>
      </div>

      <!-- 聊天区域 -->
      <div v-if="currentStep === 3" class="max-w-4xl mx-auto space-y-8">
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

interface DimensionOption {
  label: string
  value: string
}

interface Dimension {
  label: string
  options: DimensionOption[]
}

interface Dimensions {
  EI: Dimension
  SN: Dimension
  TF: Dimension
  JP: Dimension
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

const messages = ref<Message[]>([])
const userMessage = ref('')
const customType = ref('')
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
  }
})

const isReady = computed(() => {
  return !!(form.value.selfProfile.mbtiType && 
    form.value.partnerProfile.mbtiType)
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
    if (newVal && currentStep.value === 3) {
      messages.value = []
      initializeChat()
    }
  }
)

// 常量定义
const dimensions: Dimensions = {
  EI: {
    label: '外向 (E) / 内向 (I)',
    options: [
      { label: '外向 (E)', value: 'E' },
      { label: '内向 (I)', value: 'I' }
    ]
  },
  SN: {
    label: '感觉 (S) / 直觉 (N)',
    options: [
      { label: '感觉 (S)', value: 'S' },
      { label: '直觉 (N)', value: 'N' }
    ]
  },
  TF: {
    label: '思维 (T) / 情感 (F)',
    options: [
      { label: '思维 (T)', value: 'T' },
      { label: '情感 (F)', value: 'F' }
    ]
  },
  JP: {
    label: '判断 (J) / 知觉 (P)',
    options: [
      { label: '判断 (J)', value: 'J' },
      { label: '知觉 (P)', value: 'P' }
    ]
  }
}

const selectPersonality = (person: number, key: keyof PersonType, value: string) => {
  if (person === 1) {
    form.value.selfProfile.mbtiType = updateMbtiType(form.value.selfProfile.mbtiType, key, value)
  } else {
    form.value.partnerProfile.mbtiType = updateMbtiType(form.value.partnerProfile.mbtiType, key, value)
  }
}

const getDimensionValue = (person: number, key: keyof PersonType) => {
  const type = person === 1 ? form.value.selfProfile.mbtiType : form.value.partnerProfile.mbtiType
  const index = {
    EI: 0,
    SN: 1,
    TF: 2,
    JP: 3
  }[key]
  return type[index] || ''
}

const updateMbtiType = (currentType: string, key: keyof PersonType, value: string) => {
  const index = {
    EI: 0,
    SN: 1,
    TF: 2,
    JP: 3
  }[key]
  
  let newType = currentType.split('')
  if (newType.length !== 4) {
    newType = ['', '', '', '']
  }
  newType[index] = value
  return newType.join('')
}

interface PersonType {
  EI: string
  SN: string
  TF: string
  JP: string
}

const currentStep = ref(1)
const isFirstPersonComplete = computed(() => {
  return form.value.selfProfile.mbtiType.length === 4
})

const isSecondPersonComplete = computed(() => {
  return form.value.partnerProfile.mbtiType.length >= 3
})

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 添加应用自定义类型的方法
const applyCustomType = () => {
  if (customType.value.trim()) {
    form.value.partnerProfile.mbtiType = customType.value.trim()
    customType.value = ''  // 清空输入框
  }
}
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