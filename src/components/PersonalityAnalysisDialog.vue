<template>
  <el-dialog
    v-model="dialogVisible"
    title="性格匹配分析"
    width="80%"
    :close-on-click-modal="false"
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
        <div class="text-center mb-12 animate__animated animate__fadeInUp animate__delay-4s">
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
        <div class="space-y-6 animate__animated animate__fadeInUp animate__delay-5s">
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
            <h4 class="text-xl font-bold text-black dark:text-white mb-4 flex items-center">
              <el-icon class="mr-2"><Connection /></el-icon>
              匹配分析
            </h4>
            <p class="text-black/70 dark:text-white/70 leading-relaxed">
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
import 'animate.css'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 从localStorage读取数据
const person1Type = ref('')
const person1OtherTypes = ref<string[]>([])
const person1CustomType = ref('')
const person2Type = ref('')
const person2OtherTypes = ref<string[]>([])
const person2CustomType = ref('')
const matchPercentage = ref(0)
const analysisResult = ref('')

// 计算匹配度和分析结果
const calculateMatch = () => {
  // 这里可以添加更复杂的匹配算法
  matchPercentage.value = Math.floor(Math.random() * 40) + 60 // 60-100之间的随机数
  
  // 生成分析结果
  analysisResult.value = '基于双方的性格类型分析，你们具有很强的互补性。在沟通方式上可能存在一些差异，但这些差异恰恰能够促进双方的成长和理解。建议在日常互动中多关注对方的需求，适当调整自己的表达方式，这样能够建立更加和谐的关系。'
}

// 初始化数据
const initializeData = () => {
  // 读取第一个人的数据
  const p1Type = localStorage.getItem('person1Type')
  const p1OtherTypes = localStorage.getItem('person1OtherTypes')
  const p1CustomType = localStorage.getItem('person1CustomType')
  
  person1Type.value = p1Type || ''
  person1OtherTypes.value = p1OtherTypes ? JSON.parse(p1OtherTypes) : []
  person1CustomType.value = p1CustomType || ''

  // 读取第二个人的数据
  const p2Type = localStorage.getItem('person2Type')
  const p2OtherTypes = localStorage.getItem('person2OtherTypes')
  const p2CustomType = localStorage.getItem('person2CustomType')
  
  person2Type.value = p2Type || ''
  person2OtherTypes.value = p2OtherTypes ? JSON.parse(p2OtherTypes) : []
  person2CustomType.value = p2CustomType || ''

  // 计算匹配度
  calculateMatch()
}

// 监听弹框显示
watch(() => dialogVisible.value, (newVal) => {
  if (newVal) {
    initializeData()
  }
})
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
</style> 