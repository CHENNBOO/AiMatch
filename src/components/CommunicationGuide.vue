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
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">沟通指导</h1>
        <p class="text-xl text-black/70 dark:text-white/70">基于MBTI性格特征的个性化沟通建议</p>
      </div>

      <!-- MBTI类型选择卡片 -->
      <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <el-icon class="text-2xl text-black dark:text-white"><ChatDotRound /></el-icon>
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

      <!-- 沟通场景选择卡片 -->
      <div v-if="selectedType" class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg mb-8">
        <div class="flex items-center space-x-3 mb-6">
          <el-icon class="text-2xl text-black dark:text-white"><Connection /></el-icon>
          <h2 class="text-2xl font-semibold text-black dark:text-white">沟通场景</h2>
        </div>
        
        <!-- 场景选择 -->
        <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6 mb-6">
          <el-radio-group v-model="selectedScenario" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <el-radio 
              v-for="(label, value) in {
                work: '工作交流',
                relationship: '人际关系',
                conflict: '冲突处理',
                emotion: '情绪管理'
              }"
              :key="value"
              :label="value"
              class="!flex !items-center !h-12 !m-0 !p-4 !bg-white/60 dark:!bg-gray-800/60 !rounded-xl !shadow-sm hover:!shadow-md transition-all duration-300"
            >
              {{ label }}
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 对方MBTI类型选择 -->
        <div v-if="selectedScenario" class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
          <h3 class="text-xl font-semibold text-black dark:text-white mb-4">对方的MBTI类型（可选）</h3>
          <el-select 
            v-model="targetType" 
            placeholder="选择对方的MBTI类型（可选）" 
            clearable
            class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
            <el-option
              v-for="type in mbtiTypes"
              :key="type"
              :label="type"
              :value="type">
            </el-option>
          </el-select>
        </div>

        <!-- 生成按钮 -->
        <div class="text-center mt-8">
          <el-button 
            type="primary" 
            @click="generateGuidance"
            class="!px-12 !py-3 !text-lg !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !bg-gradient-to-r from-blue-500 to-blue-600">
            获取沟通指导
          </el-button>
        </div>
      </div>

      <!-- 指导建议卡片 -->
      <div v-if="showResult" class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
        <div class="flex items-center space-x-3 mb-8">
          <el-icon class="text-2xl text-black dark:text-white"><Reading /></el-icon>
          <h2 class="text-2xl font-semibold text-black dark:text-white">AI指导建议</h2>
        </div>
        <div class="guidance-content min-h-[200px]" v-loading="loading">
          <template v-if="!loading">
            <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
              <div class="text-black/70 dark:text-white/70 whitespace-pre-wrap leading-relaxed">{{ guidance }}</div>
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
import { ChatDotRound, Connection, Reading, Back } from '@element-plus/icons-vue'
import axios from 'axios'

const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const selectedType = ref('')
const selectedScenario = ref('')
const targetType = ref('')
const showResult = ref(false)
const loading = ref(false)
const guidance = ref('')

const handleTypeChange = () => {
  showResult.value = false
}

const generateGuidance = async () => {
  if (!selectedType.value || !selectedScenario.value) {
    ElMessage.warning('请选择MBTI类型和沟通场景')
    return
  }

  loading.value = true
  showResult.value = true

  try {
    const response = await axios.post('/api/communication-guide', {
      userType: selectedType.value,
      targetType: targetType.value,
      scenario: selectedScenario.value
    })

    if (response.data.status === 'success') {
      guidance.value = response.data.data
    } else {
      throw new Error('生成指导建议失败')
    }
  } catch (error) {
    ElMessage.error('生成沟通指导时出现错误，请稍后重试')
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

:deep(.el-radio) {
  @apply !m-0;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  @apply !bg-blue-500 !border-blue-500;
}

:deep(.el-radio__label) {
  @apply !text-black dark:!text-white;
}

:deep(.el-loading-mask) {
  @apply !bg-white/50 dark:!bg-black/50 !backdrop-blur-sm;
}
</style> 