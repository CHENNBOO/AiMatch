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
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">MBTI 性格匹配分析</h1>
        <p class="text-gray-600 dark:text-gray-300 text-lg">探索不同性格类型之间的互动与和谐</p>
      </div>

      <!-- 选择区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- 左侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">第一个人的性格类型</h2>
          <div class="space-y-6">
            <div v-for="(dimension, key) in dimensions" :key="key" class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ dimension.label }}</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="option in dimension.options"
                  :key="option.value"
                  @click="person1[key] = option.value"
                  :class="[
                    'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    person1[key] === option.value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">第二个人的性格类型</h2>
          <div class="space-y-6">
            <div v-for="(dimension, key) in dimensions" :key="key" class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ dimension.label }}</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="option in dimension.options"
                  :key="option.value"
                  @click="person2[key] = option.value"
                  :class="[
                    'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    person2[key] === option.value
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 匹配按钮 -->
      <div class="text-center mb-12">
        <button
          @click="calculateMatch"
          :disabled="!isSelectionComplete"
          :class="[
            'px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105',
            isSelectionComplete
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          开始匹配分析
        </button>
      </div>

      <!-- 结果展示区 -->
      <div v-if="showResult" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-8">
            <!-- 结果头部 -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">匹配分析报告</h2>
              <div class="flex items-center justify-center space-x-8">
                <div class="text-center">
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">性格类型一</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person1) }}</div>
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
                </div>
                <div class="text-center">
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">性格类型二</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person2) }}</div>
                </div>
              </div>
            </div>

            <!-- 分析内容 -->
            <div class="space-y-6">
              <div v-if="parsedDescription.overall" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><InfoFilled /></el-icon>
                  总体评价
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ parsedDescription.overall }}</p>
              </div>

              <div v-if="parsedDescription.communication" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><ChatDotRound /></el-icon>
                  沟通方式
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ parsedDescription.communication }}</p>
              </div>

              <div v-if="parsedDescription.values" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Connection /></el-icon>
                  共同价值观
                </h3>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ parsedDescription.values }}</p>
              </div>

              <div v-if="parsedDescription.challenges?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Warning /></el-icon>
                  可能存在的挑战
                </h3>
                <ul class="space-y-3">
                  <li v-for="(challenge, index) in parsedDescription.challenges" :key="index"
                    class="flex items-start text-gray-700 dark:text-gray-300">
                    <span class="text-blue-500 mr-2">•</span>
                    {{ challenge }}
                  </li>
                </ul>
              </div>

              <div v-if="parsedDescription.suggestions?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Sunny /></el-icon>
                  改善建议
                </h3>
                <ul class="space-y-3">
                  <li v-for="(suggestion, index) in parsedDescription.suggestions" :key="index"
                    class="flex items-start text-gray-700 dark:text-gray-300">
                    <span class="text-blue-500 mr-2">{{ index + 1 }}.</span>
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-center space-x-4 mt-8">
              <button
                @click="resetSelection"
                class="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                重新匹配
              </button>
              <button
                @click="exportReport"
                class="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                导出报告
              </button>
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
import { InfoFilled, ChatDotRound, Connection, Warning, Sunny, Back } from '@element-plus/icons-vue'
import 'animate.css'

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

interface MatchResult {
  description: string;
  percentage: number;
}

const showResult = ref(false)
const matchPercentage = ref(0)
const matchResult = ref<MatchResult | null>(null)

interface MatchSections {
  overall: string;
  communication: string;
  values: string;
  challenges: string;
  suggestions: string;
  summary: string;
}

const matchDescription = computed<MatchSections | null>(() => {
  if (!matchResult.value) return null

  const sections: MatchSections = {
    overall: '',
    communication: '',
    values: '',
    challenges: '',
    suggestions: '',
    summary: ''
  }

  const lines = matchResult.value.description.split('\n')
  let currentSection: keyof MatchSections = 'overall'

  lines.forEach(line => {
    if (line.includes('总体评价')) {
      currentSection = 'overall'
    } else if (line.includes('沟通方式')) {
      currentSection = 'communication'
    } else if (line.includes('共同价值观')) {
      currentSection = 'values'
    } else if (line.includes('可能存在的挑战')) {
      currentSection = 'challenges'
    } else if (line.includes('改善建议')) {
      currentSection = 'suggestions'
    } else if (line.includes('总结')) {
      currentSection = 'summary'
    } else if (line.trim()) {
      let cleanLine = line.trim()
      if (currentSection === 'challenges' || currentSection === 'suggestions') {
        cleanLine = cleanLine.replace(/^[\d、.]+/, '').trim()
      }
      sections[currentSection] += cleanLine + '\n'
    }
  })

  return sections
})

const isLoading = ref(false)

const isSelectionComplete = computed(() => {
  return Object.values(person1.value).every(v => v !== '') &&
         Object.values(person2.value).every(v => v !== '')
})

const getFullType = (person: PersonType) => {
  return person.EI + person.SN + person.TF + person.JP
}

const calculateMatch = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在分析性格匹配度...',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  
  try {
    const type1 = getFullType(person1.value)
    const type2 = getFullType(person2.value)
    
    const response = await axios.post('/api/mbti-match', {
      type1,
      type2
    })
    
    const { matchPercentageValue, description } = response.data
    
    showResult.value = true
    matchPercentage.value = matchPercentageValue
    matchResult.value = { description, percentage: matchPercentageValue }
  } catch (error) {
    ElMessage.error('抱歉，分析过程出现错误，请稍后重试')
    console.error('Error:', error)
  } finally {
    loadingInstance.close()
  }
}

const parsedDescription = computed(() => {
  if (!matchDescription.value) {
    return {
      overall: '',
      communication: '',
      values: '',
      challenges: [],
      suggestions: []
    }
  }

  return {
    overall: matchDescription.value.overall,
    communication: matchDescription.value.communication,
    values: matchDescription.value.values,
    challenges: matchDescription.value.challenges.split('\n').filter(line => line.trim()),
    suggestions: matchDescription.value.suggestions.split('\n').filter(line => line.trim())
  }
})

const exportReport = () => {
  const reportContent = `
MBTI 性格匹配分析报告

性格类型一：${getFullType(person1.value)}
性格类型二：${getFullType(person2.value)}
匹配度：${matchPercentage.value}%

${matchResult.value?.description}

生成时间：${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `MBTI匹配报告_${getFullType(person1.value)}_${getFullType(person2.value)}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const resetSelection = () => {
  person1.value = { EI: '', SN: '', TF: '', JP: '' }
  person2.value = { EI: '', SN: '', TF: '', JP: '' }
  showResult.value = false
  matchPercentage.value = 0
  matchResult.value = null
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
</style> 