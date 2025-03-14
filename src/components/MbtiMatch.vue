<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主要内容区 -->
    <div class="container mx-auto px-4 py-8 relative">
      <!-- 返回按钮 -->
      <router-link to="/" class="absolute left-4 top-4">
        <el-button class="flex items-center space-x-2 !bg-white/80 dark:!bg-gray-800/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <el-icon><Back /></el-icon>
          <span>返回首页</span>
        </el-button>
      </router-link>

      <!-- 标题区 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">MBTI 性格匹配分析</h1>
        <p class="text-black/70 dark:text-white/70 text-lg">探索不同性格类型之间的互动与和谐</p>
      </div>

      <!-- 步骤指示器 -->
      <div class="max-w-4xl mx-auto mb-8">
        <el-steps :active="currentStep" finish-status="success" process-status="process" align-center>
          <el-step title="选择第一个人" description="设置第一个人的MBTI类型" />
          <el-step title="选择第二个人" description="设置第二个人的MBTI类型" />
          <el-step title="查看匹配结果" description="分析两种性格类型的匹配度" />
        </el-steps>
      </div>

      <!-- 选择区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- 左侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
             :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': currentStep === 1}">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-black dark:text-white">第一个人的性格类型</h2>
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
                    person1[key] === option.value
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

        <!-- 右侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
             :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': currentStep === 2}">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-black dark:text-white">第二个人的性格类型</h2>
            <el-tag v-if="isSecondPersonComplete" type="success" effect="light" class="ml-2">已完成</el-tag>
          </div>
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
                    person2[key] === option.value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-between" v-if="currentStep === 2">
            <el-button @click="previousStep">上一步</el-button>
            <el-button type="primary" @click="calculateMatch" :disabled="!isSecondPersonComplete">
              开始分析
            </el-button>
          </div>
        </div>
      </div>

      <!-- 快速选择区 -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-black dark:text-white mb-4">快速选择常见类型</h3>
          <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
            <button
              v-for="type in commonTypes"
              :key="type"
              @click="quickSelect(type)"
              class="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </div>

      <!-- 结果展示区 -->
      <div v-if="showResult" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-black dark:text-white">匹配分析报告</h2>
            <el-button circle @click="closeResult">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <div class="p-8">
            <!-- 结果头部 -->
            <div class="text-center mb-8">
              <div class="flex items-center justify-center space-x-8">
                <div class="text-center">
                  <div class="text-sm text-black/70 dark:text-white/70 mb-2">性格类型一</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person1) }}</div>
                  <div class="mt-2 text-sm text-black/50 dark:text-white/50">{{ getTypeDescription(person1) }}</div>
                </div>
                <div class="relative">
                  <el-progress
                    type="dashboard"
                    :percentage="matchPercentage"
                    :stroke-width="12"
                    :width="180"
                    :format="(percentage) => `${percentage}%`"
                    class="animate__animated animate__zoomIn"
                  />
                  <div class="mt-2 text-sm text-black/70 dark:text-white/70">匹配度</div>
                </div>
                <div class="text-center">
                  <div class="text-sm text-black/70 dark:text-white/70 mb-2">性格类型二</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person2) }}</div>
                  <div class="mt-2 text-sm text-black/50 dark:text-white/50">{{ getTypeDescription(person2) }}</div>
                </div>
              </div>
            </div>

            <!-- 分析内容 -->
            <div class="space-y-6">
              <div v-if="parsedDescription.overall" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><InfoFilled /></el-icon>
                  总体评价
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.overall }}</p>
              </div>

              <div v-if="parsedDescription.communication" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-1s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><ChatDotRound /></el-icon>
                  沟通方式
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.communication }}</p>
              </div>

              <div v-if="parsedDescription.values" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-2s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Connection /></el-icon>
                  共同价值观
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.values }}</p>
              </div>

              <div v-if="parsedDescription.challenges?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-3s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Warning /></el-icon>
                  可能存在的挑战
                </h3>
                <ul class="space-y-3">
                  <li v-for="(challenge, index) in parsedDescription.challenges" :key="index"
                    class="flex items-start text-black/70 dark:text-white/70">
                    <span class="text-blue-500 mr-2">•</span>
                    {{ challenge }}
                  </li>
                </ul>
              </div>

              <div v-if="parsedDescription.suggestions?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-4s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Sunny /></el-icon>
                  改善建议
                </h3>
                <ul class="space-y-3">
                  <li v-for="(suggestion, index) in parsedDescription.suggestions" :key="index"
                    class="flex items-start text-black/70 dark:text-white/70">
                    <span class="text-blue-500 mr-2">{{ index + 1 }}.</span>
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-center space-x-4 mt-8">
              <el-button type="primary" @click="resetSelection">
                重新匹配
              </el-button>
              <el-button @click="exportReport">
                导出报告
              </el-button>
              <el-button @click="shareResult">
                分享结果
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { 
  InfoFilled, 
  ChatDotRound, 
  Connection, 
  Warning, 
  Sunny, 
  Back,
  Close
} from '@element-plus/icons-vue'
import 'animate.css'

// 类型定义
interface PersonType {
  EI: string
  SN: string
  TF: string
  JP: string
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

const commonTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

// 状态管理
const currentStep = ref(1)
const person1 = ref<PersonType>({
  EI: '',
  SN: '',
  TF: '',
  JP: ''
})
const person2 = ref<PersonType>({
  EI: '',
  SN: '',
  TF: '',
  JP: ''
})
const showResult = ref(false)
const matchPercentage = ref(0)
const parsedDescription = ref({
  overall: '',
  communication: '',
  values: '',
  challenges: [] as string[],
  suggestions: [] as string[]
})

// 计算属性
const isFirstPersonComplete = computed(() => {
  return Object.values(person1.value).every(v => v !== '')
})

const isSecondPersonComplete = computed(() => {
  return Object.values(person2.value).every(v => v !== '')
})

const isSelectionComplete = computed(() => {
  return isFirstPersonComplete.value && isSecondPersonComplete.value
})

// 方法定义
const selectPersonality = (person: number, key: keyof PersonType, value: string) => {
  if (person === 1) {
    person1.value[key] = value
  } else {
    person2.value[key] = value
  }
}

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

const quickSelect = (type: string) => {
  if (currentStep.value === 1) {
    person1.value = {
      EI: type[0],
      SN: type[1],
      TF: type[2],
      JP: type[3]
    }
    nextStep()
  } else if (currentStep.value === 2) {
    person2.value = {
      EI: type[0],
      SN: type[1],
      TF: type[2],
      JP: type[3]
    }
    calculateMatch()
  }
}

const getFullType = (person: PersonType) => {
  return Object.values(person).join('')
}

const getTypeDescription = (person: PersonType) => {
  return '点击了解更多'
}

const calculateMatch = async () => {
  if (!isSelectionComplete.value) {
    ElMessage.warning('请完成所有性格类型的选择')
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: '正在分析匹配度...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const type1 = getFullType(person1.value)
    const type2 = getFullType(person2.value)
    
    const response = await axios.post('/api/mbti-match', {
      type1,
      type2
    })

    // 解析返回的数据
    const sections = response.data.description.split('\n\n')
    const parsedDesc = {
      overall: '',
      communication: '',
      values: '',
      challenges: [] as string[],
      suggestions: [] as string[]
    }

    sections.forEach(section => {
      if (section.startsWith('总体匹配度')) {
        parsedDesc.overall = section.replace('总体匹配度\n', '').trim()
      } else if (section.startsWith('沟通方式')) {
        parsedDesc.communication = section.replace('沟通方式的兼容性\n', '').trim()
      } else if (section.startsWith('共同价值观')) {
        parsedDesc.values = section.replace('共同价值观\n', '').trim()
      } else if (section.startsWith('可能存在的挑战')) {
        parsedDesc.challenges = section
          .replace('可能存在的挑战\n', '')
          .split('\n')
          .map(challenge => challenge.replace(/^\d+、/, '').trim())
          .filter(Boolean)
      } else if (section.startsWith('改善建议')) {
        parsedDesc.suggestions = section
          .replace('改善建议\n', '')
          .split('\n')
          .map(suggestion => suggestion.replace(/^\d+、/, '').trim())
          .filter(Boolean)
      }
    })

    matchPercentage.value = response.data.matchPercentageValue
    parsedDescription.value = parsedDesc
    currentStep.value = 3
    showResult.value = true
  } catch (error) {
    ElMessage.error('分析过程中出现错误，请重试')
    console.error('Error:', error)
  } finally {
    loading.close()
  }
}

const resetSelection = () => {
  person1.value = {
    EI: '',
    SN: '',
    TF: '',
    JP: ''
  }
  person2.value = {
    EI: '',
    SN: '',
    TF: '',
    JP: ''
  }
  showResult.value = false
  currentStep.value = 1
  matchPercentage.value = 0
  parsedDescription.value = {
    overall: '',
    communication: '',
    values: '',
    challenges: [],
    suggestions: []
  }
}

const closeResult = () => {
  showResult.value = false
}

const exportReport = () => {
  ElMessage.success('报告已导出')
}

const shareResult = () => {
  ElMessage.success('分享链接已复制到剪贴板')
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

/* Element Plus 进度条样式覆盖 */
:deep(.el-progress-bar__outer) {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
}

:deep(.el-progress-bar__inner) {
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: width 0.6s ease;
}

:deep(.el-progress__text) {
  font-size: 1.5rem !important;
  font-weight: bold;
  color: #3b82f6;
}

/* Element Plus Steps 样式覆盖 */
:deep(.el-step__title) {
  @apply text-black/70 dark:text-white/70;
}

:deep(.el-step__description) {
  @apply text-black/50 dark:text-white/50;
}

:deep(.el-step__head.is-process) {
  @apply text-blue-500 border-blue-500;
}

:deep(.el-step__head.is-finish) {
  @apply text-green-500 border-green-500;
}

/* 动画过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>