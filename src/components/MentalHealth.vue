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
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">心理健康评估</h1>
        <p class="text-xl text-black/70 dark:text-white/70">基于MBTI性格特征的个性化心理分析</p>
      </div>

      <!-- MBTI类型选择卡片 -->
      <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <el-icon class="text-2xl text-black dark:text-white"><UserFilled /></el-icon>
          <h2 class="text-2xl font-semibold text-black dark:text-white">您的MBTI类型</h2>
        </div>
        <el-select 
          v-model="selectedType" 
          placeholder="请选择您的MBTI类型" 
          @change="handleTypeChange"
          class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
          <el-option
            v-for="type in mbtiTypes"
            :key="type"
            :label="type"
            :value="type">
          </el-option>
        </el-select>
      </div>

      <!-- 心理状态评估卡片 -->
      <div v-if="selectedType" class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <div class="flex items-center space-x-3 mb-8">
          <el-icon class="text-2xl text-black dark:text-white"><DataLine /></el-icon>
          <h2 class="text-2xl font-semibold text-black dark:text-white">心理状态评估</h2>
        </div>

        <!-- 心情评分 -->
        <div class="space-y-8">
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">今日心情</h3>
            <el-rate
              v-model="moodRating"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :texts="['低落', '一般', '不错', '开心', '非常好']"
              show-text
              class="flex justify-center">
            </el-rate>
          </div>

          <!-- 压力水平 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">压力水平</h3>
            <el-slider
              v-model="stressLevel"
              :marks="{
                0: '无压力',
                25: '轻度',
                50: '中度',
                75: '较重',
                100: '严重'
              }"
              :step="25"
              class="max-w-2xl mx-auto">
            </el-slider>
          </div>

          <!-- 症状选择 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">近期症状（可多选）</h3>
            <el-checkbox-group v-model="selectedSymptoms" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <el-checkbox label="睡眠问题" class="!text-black dark:!text-white">睡眠问题</el-checkbox>
              <el-checkbox label="注意力难以集中" class="!text-black dark:!text-white">注意力难以集中</el-checkbox>
              <el-checkbox label="情绪波动" class="!text-black dark:!text-white">情绪波动</el-checkbox>
              <el-checkbox label="焦虑感" class="!text-black dark:!text-white">焦虑感</el-checkbox>
              <el-checkbox label="疲惫感" class="!text-black dark:!text-white">疲惫感</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="text-center mt-8">
          <el-button 
            type="primary" 
            @click="generateAnalysis"
            class="!px-12 !py-3 !text-lg !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !bg-gradient-to-r from-blue-500 to-blue-600">
            生成分析报告
          </el-button>
        </div>
      </div>

      <!-- 分析结果卡片 -->
      <div v-if="showResult" class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
        <div class="flex items-center space-x-3 mb-8">
          <el-icon class="text-2xl text-black dark:text-white"><ChatLineRound /></el-icon>
          <h2 class="text-2xl font-semibold text-black dark:text-white">AI分析与建议</h2>
        </div>
        <div class="analysis-content min-h-[200px]" v-loading="loading">
          <template v-if="!loading">
            <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
              <div class="text-black/70 dark:text-white/70 whitespace-pre-wrap leading-relaxed">{{ analysis }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, DataLine, ChatLineRound, Back } from '@element-plus/icons-vue'
import axios from 'axios'

const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const selectedType = ref('')
const moodRating = ref(3)
const stressLevel = ref(25)
const selectedSymptoms = ref([])
const showResult = ref(false)
const loading = ref(false)
const analysis = ref('')

const handleTypeChange = () => {
  showResult.value = false
}

const generateAnalysis = async () => {
  if (!selectedType.value) {
    ElMessage.warning('请先选择您的MBTI类型')
    return
  }

  loading.value = true
  showResult.value = true

  try {
    const response = await axios.post('/api/mental-health-analysis', {
      mbtiType: selectedType.value,
      moodRating: moodRating.value,
      stressLevel: stressLevel.value,
      symptoms: selectedSymptoms.value
    })

    if (response.data.status === 'success') {
      analysis.value = response.data.data
    } else {
      throw new Error('分析失败')
    }
  } catch (error) {
    ElMessage.error('生成分析报告时出现错误，请稍后重试')
    console.error('Error:', error)
  } finally {
    loading.value = false
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

:deep(.el-rate__text) {
  @apply !text-black/70 dark:!text-white/70;
}

:deep(.el-slider__marks-text) {
  @apply !text-black/70 dark:!text-white/70;
}

:deep(.el-slider__runway) {
  @apply !bg-black/10 dark:!bg-white/10;
}

:deep(.el-slider__bar) {
  @apply !bg-blue-500;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  @apply !bg-blue-500 !border-blue-500;
}

:deep(.el-checkbox__label) {
  @apply !text-black dark:!text-white;
}

:deep(.el-loading-mask) {
  @apply !bg-white/50 dark:!bg-black/50 !backdrop-blur-sm;
}
</style> 