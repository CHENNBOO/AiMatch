<template>
  <el-dialog
    v-model="dialogVisible"
    title="性格匹配分析"
    width="80%"
    :close-on-click-modal="false"
    :before-close="handleClose"
    class="personality-analysis-dialog"
    destroy-on-close
  >
    <div class="min-h-[600px] relative">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <!-- 主要内容 -->
      <div class="relative z-10">
        <!-- AI分析动画 -->
        <div v-if="isAnalyzing" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-20 animate__animated animate__fadeIn">
          <div class="text-center">
            <div class="relative w-24 h-24 mb-4">
              <div class="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping"></div>
              <div class="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p class="text-lg font-medium text-black dark:text-white mb-2">AI正在分析中</p>
            <p class="text-sm text-black/60 dark:text-white/60">请稍候，正在为您生成匹配分析...</p>
          </div>
        </div>

        <!-- 人物类型对比区域 -->
        <div class="grid grid-cols-2 gap-8 mb-12">
          <!-- 第一个人 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg animate__animated animate__fadeInLeft">
            <h3 class="text-2xl font-bold text-black dark:text-white mb-6">您的性格类型</h3>
            
            <!-- MBTI类型 -->
            <div v-if="person1Type" class="mb-6 animate__animated animate__fadeIn animate__delay-1s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">MBTI类型</div>
              <div class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {{ person1Type }}
              </div>
            </div>

            <!-- 其他类型 -->
            <div v-if="person1OtherTypes?.length" class="mb-6 animate__animated animate__fadeIn animate__delay-2s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">其他类型</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="type in person1OtherTypes" 
                  :key="type"
                  class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm"
                >
                  {{ type }}
                </span>
              </div>
            </div>

            <!-- 自定义类型 -->
            <div v-if="person1CustomType" class="animate__animated animate__fadeIn animate__delay-3s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">自定义类型</div>
              <div class="text-lg font-medium text-black dark:text-white">
                {{ person1CustomType }}
              </div>
            </div>
          </div>

          <!-- 第二个人 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg animate__animated animate__fadeInRight">
            <h3 class="text-2xl font-bold text-black dark:text-white mb-6">对方的性格类型</h3>
            
            <!-- MBTI类型 -->
            <div v-if="person2Type" class="mb-6 animate__animated animate__fadeIn animate__delay-1s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">MBTI类型</div>
              <div class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                {{ person2Type }}
              </div>
            </div>

            <!-- 其他类型 -->
            <div v-if="person2OtherTypes?.length" class="mb-6 animate__animated animate__fadeIn animate__delay-2s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">其他类型</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="type in person2OtherTypes" 
                  :key="type"
                  class="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-sm"
                >
                  {{ type }}
                </span>
              </div>
            </div>

            <!-- 自定义类型 -->
            <div v-if="person2CustomType" class="animate__animated animate__fadeIn animate__delay-3s">
              <div class="text-sm text-black/50 dark:text-white/50 mb-2">自定义类型</div>
              <div class="text-lg font-medium text-black dark:text-white">
                {{ person2CustomType }}
              </div>
            </div>
          </div>
        </div>

        <!-- 匹配度展示 -->
        <div class="text-center mb-12 animate__animated animate__fadeInUp animate__delay-2s">
          <div class="inline-block relative">
            <el-progress
              type="dashboard"
              :percentage="matchPercentage"
              :width="200"
              :stroke-width="15"
              class="transform scale-150"
            >
              <template #default="{ percentage }">
                <div class="text-center">
                  <div class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {{ percentage }}%
                  </div>
                  <div class="text-sm text-black/50 dark:text-white/50 mt-2">匹配度</div>
                </div>
              </template>
            </el-progress>
          </div>
        </div>

        <!-- 分析结果 -->
        <div class="space-y-6 animate__animated animate__fadeInUp animate__delay-3s">
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
            <h4 class="text-xl font-bold text-black dark:text-white mb-4 flex items-center">
              <el-icon :class="{ 'animate-spin': isAnalyzing }" class="mr-2"><Connection /></el-icon>
              {{ isAnalyzing ? 'AI正在分析匹配结果...' : '匹配分析' }}
            </h4>
            <div v-if="isAnalyzing" class="flex justify-center items-center py-8">
              <div class="animate-pulse text-center">
                <el-icon class="text-4xl text-blue-500 mb-4"><Connection /></el-icon>
                <p class="text-gray-500">正在进行深度分析，请稍候...</p>
              </div>
            </div>
            <p v-else class="text-black/70 dark:text-white/70 leading-relaxed">
              {{ analysisResult }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Connection } from '@element-plus/icons-vue'
import { translatePersonalityType } from '../config/personalityTypes'
import 'animate.css'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { removeJsonMarkers,removeMarkdown } from '../utils/stringUtils'
import { personalityApi } from '../utils/personalityApi'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLoading = ref(false)
const isAnalyzing = ref(false)

// 从localStorage读取数据
const person1Type = ref('')
const person1OtherTypes = ref<string[]>([])
const person1CustomType = ref('')
const person2Type = ref('')
const person2OtherTypes = ref<string[]>([])
const person2CustomType = ref('')
const matchPercentage = ref(0)
const analysisResult = ref('')

// 获取匹配结果
const getMatchResult = async () => {
  isAnalyzing.value = true
  // 重置数据
  person1Type.value = ''
  person2Type.value = ''
  person1OtherTypes.value = []
  person2OtherTypes.value = []
  person1CustomType.value = ''
  person2CustomType.value = ''
  matchPercentage.value = 0
  analysisResult.value = ''
  
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      ElMessage.error('用户ID不存在')
      analysisResult.value = '获取用户信息失败，请重新登录'
      return
    }
    
    // 添加延迟以模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟数据
    person1Type.value = 'INFJ'
    person2Type.value = 'ENFP'
    matchPercentage.value = 85
    analysisResult.value = '基于AI分析，你们的性格类型具有很高的互补性。INFJ的深度思考与ENFP的创造力能够完美配合，形成良好的沟通与理解。建议在日常交往中，INFJ可以帮助ENFP更好地规划和组织，而ENFP则可以带给INFJ更多活力和新鲜视角。'
    
  } catch (error) {
    console.error('分析过程出现错误:', error)
    ElMessage.error('分析过程出现错误，请稍后重试')
    analysisResult.value = '分析过程出现错误，请稍后重试'
  } finally {
    // 添加延迟以确保动画效果完整显示
    await new Promise(resolve => setTimeout(resolve, 1000))
    isAnalyzing.value = false
  }
}

// 监听弹框显示
watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    // 弹框打开时获取数据
    await getMatchResult()
  }
}, { immediate: true })

// 确保弹框可以正常关闭
const handleClose = () => {
  emit('update:modelValue', false)
  isAnalyzing.value = false
}
</script>

<style scoped>
.personality-analysis-dialog {
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

  :deep(.el-progress-bar__outer) {
    @apply !bg-gray-200 dark:!bg-gray-700;
  }

  :deep(.el-progress-bar__inner) {
    @apply !bg-gradient-to-r !from-blue-500 !to-purple-500;
  }

  :deep(.el-progress__text) {
    @apply !text-2xl !font-bold;
  }
}

/* 动画持续时间 */
.animate__animated {
  --animate-duration: 800ms;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style> 