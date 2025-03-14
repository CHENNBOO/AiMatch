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
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">活动策划</h1>
        <p class="text-xl text-black/70 dark:text-white/70">基于MBTI性格特征为您定制专属活动方案</p>
      </div>

      <!-- 主要内容卡片 -->
      <div class="max-w-6xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
        <!-- 性格类型选择区 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-black dark:text-white">您的性格类型</h3>
            <el-select 
              v-model="person1Type" 
              placeholder="请选择您的MBTI类型"
              class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
              <el-option
                v-for="type in mbtiTypes"
                :key="type"
                :label="type"
                :value="type">
              </el-option>
            </el-select>
          </div>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-black dark:text-white">伴侣的性格类型</h3>
            <el-select 
              v-model="person2Type" 
              placeholder="请选择伴侣的MBTI类型"
              class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
              <el-option
                v-for="type in mbtiTypes"
                :key="type"
                :label="type"
                :value="type">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 活动类型选择 -->
        <div class="mb-12">
          <h3 class="text-xl font-semibold text-black dark:text-white mb-4">活动类型</h3>
          <el-radio-group v-model="eventType" class="flex flex-wrap gap-4">
            <el-radio-button label="date" class="!rounded-xl !shadow-md hover:!shadow-lg transition-shadow">约会</el-radio-button>
            <el-radio-button label="travel" class="!rounded-xl !shadow-md hover:!shadow-lg transition-shadow">旅行</el-radio-button>
            <el-radio-button label="activity" class="!rounded-xl !shadow-md hover:!shadow-lg transition-shadow">日常活动</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 偏好设置 -->
        <div class="space-y-8 mb-12">
          <h3 class="text-xl font-semibold text-black dark:text-white">偏好设置</h3>
          <el-form :model="preferences" label-position="top" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <el-form-item label="预算范围" class="!mb-0">
              <el-select v-model="preferences.budget" class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
                <el-option label="经济实惠 (¥0-300)" value="low"></el-option>
                <el-option label="中等消费 (¥300-800)" value="medium"></el-option>
                <el-option label="高端体验 (¥800+)" value="high"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时长" class="!mb-0">
              <el-select v-model="preferences.duration" class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
                <el-option label="2-3小时" value="short"></el-option>
                <el-option label="半天" value="half_day"></el-option>
                <el-option label="一整天" value="full_day"></el-option>
                <el-option label="多天" value="multiple_days"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动场景" class="!mb-0 md:col-span-2">
              <el-select v-model="preferences.scene" multiple class="w-full !bg-white/60 dark:!bg-gray-700/60 backdrop-blur-xl rounded-xl">
                <el-option label="户外自然" value="outdoor"></el-option>
                <el-option label="文化艺术" value="culture"></el-option>
                <el-option label="美食探索" value="food"></el-option>
                <el-option label="运动健身" value="sports"></el-option>
                <el-option label="休闲放松" value="relaxation"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 生成按钮 -->
        <div class="text-center">
          <el-button 
            type="primary"
            :loading="isGenerating"
            :disabled="!canGenerate"
            @click="generatePlan"
            class="!px-12 !py-3 !text-lg !rounded-xl !shadow-lg hover:!shadow-xl transition-all duration-300 !bg-gradient-to-r from-blue-500 to-blue-600">
            生成活动方案
          </el-button>
        </div>
      </div>

      <!-- 结果展示区 -->
      <div v-if="planResult" class="mt-8 max-w-6xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg">
        <h2 class="text-2xl font-bold text-black dark:text-white mb-8 text-center">为您定制的活动方案</h2>
        
        <div class="space-y-8">
          <!-- 方案概述 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">方案概述</h3>
            <p class="text-black/70 dark:text-white/70">{{ planResult.overview }}</p>
          </div>

          <!-- 具体安排 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">具体安排</h3>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in planResult.activities"
                :key="index"
                :timestamp="activity.time"
                class="!text-black dark:!text-white">
                <h4 class="text-lg font-medium text-black dark:text-white mb-2">{{ activity.title }}</h4>
                <p class="text-black/70 dark:text-white/70">{{ activity.description }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>

          <!-- 贴心建议 -->
          <div class="bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-xl p-6">
            <h3 class="text-xl font-semibold text-black dark:text-white mb-4">贴心建议</h3>
            <ul class="space-y-3">
              <li v-for="(tip, index) in planResult.tips" :key="index" 
                  class="flex items-start text-black/70 dark:text-white/70">
                <span class="text-blue-500 mr-2">•</span>
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'

// MBTI类型列表
const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

// 响应式状态
const person1Type = ref('')
const person2Type = ref('')
const eventType = ref('date')
const preferences = ref({
  budget: '',
  duration: '',
  scene: []
})
const isGenerating = ref(false)
const planResult = ref(null)

// 计算属性：是否可以生成方案
const canGenerate = computed(() => {
  return person1Type.value && 
         person2Type.value && 
         preferences.value.budget && 
         preferences.value.duration && 
         preferences.value.scene.length > 0
})

// 生成活动方案
const generatePlan = async () => {
  isGenerating.value = true
  try {
    const response = await axios.post('/api/event-plan', {
      person1Type: person1Type.value,
      person2Type: person2Type.value,
      eventType: eventType.value,
      preferences: preferences.value
    })
    
    planResult.value = response.data
    ElMessage.success('活动方案生成成功！')
  } catch (error) {
    ElMessage.error('生成方案时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isGenerating.value = false
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

:deep(.el-radio-button__inner) {
  @apply !border-none !shadow-none;
}

:deep(.el-timeline-item__node) {
  @apply !bg-blue-500;
}

:deep(.el-timeline-item__wrapper) {
  @apply !text-black dark:!text-white;
}

:deep(.el-timeline-item__timestamp) {
  @apply !text-black/60 dark:!text-white/60;
}

:deep(.el-form-item__label) {
  @apply !text-black dark:!text-white;
}
</style> 