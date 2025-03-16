<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    <PersonalitySettingsDialog v-model="showDialog" />
    <PersonalityAnalysisDialog v-model="showAnalysisDialog" />
    <PersonalityIncompleteDialog v-model="showIncompleteDialog" />
    <VirtualInteractionDialog v-if="showVirtualInteractionDialog" v-model="showVirtualInteractionDialog" />
    <PersonalityProfileDialog v-model="showPersonalityProfileDialog" />
    
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主要内容 -->
    <div class="relative container mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
      <!-- 标题区域 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-black dark:text-white mb-6 animate__animated animate__fadeInDown">
          AiMatch
        </h1>
        <p class="text-xl text-black/70 dark:text-white/70 animate__animated animate__fadeIn animate__delay-1s">
          探索人际关系的智能助手
        </p>
      </div>

      <!-- 功能按钮网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- 性格档案 -->
        <div 
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s cursor-pointer"
          @click="showPersonalityProfileDialog = true"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Document /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">性格档案</h3>
            <p class="text-black/70 dark:text-white/70">查看和管理您的个人性格档案信息</p>
          </div>
        </div>

        <!-- 性格匹配分析 -->
        <div 
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s cursor-pointer"
          @click="(e: MouseEvent) => handleFeatureClick(e, '/personality-analysis')"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Connection /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">性格匹配分析</h3>
            <p class="text-black/70 dark:text-white/70">深入分析不同性格类型的匹配程度</p>
          </div>
        </div>

        <!-- 虚拟互动 -->
        <div
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s cursor-pointer"
          @click="(e: MouseEvent) => handleFeatureClick(e, '/virtual-interaction')"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Avatar /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">虚拟互动</h3>
            <p class="text-black/70 dark:text-white/70">智能虚拟伙伴陪伴交流</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Avatar, Connection, Document } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PersonalitySettingsDialog from './PersonalitySettingsDialog.vue'
import PersonalityAnalysisDialog from './PersonalityAnalysisDialog.vue'
import PersonalityIncompleteDialog from './PersonalityIncompleteDialog.vue'
import VirtualInteractionDialog from './VirtualInteractionDialog.vue'
import PersonalityProfileDialog from './PersonalityProfileDialog.vue'
import { personalityApi } from '../utils/personalityApi'
import { ElMessage } from 'element-plus'
import 'animate.css'

const router = useRouter()
const showDialog = ref(false)
const showAnalysisDialog = ref(false)
const showIncompleteDialog = ref(false)
const showVirtualInteractionDialog = ref(false)
const showPersonalityProfileDialog = ref(false)

const handleFeatureClick = async (e: MouseEvent, path: string) => {
  e.preventDefault()
  
  try {
    // 从localStorage获取用户ID
    const userId = localStorage.getItem('userId')
    if (!userId) {
      ElMessage.error('未找到用户信息，请重新登录')
      return
    }

    // 根据路径打开对应的对话框
    if (path === '/personality-analysis') {
      showAnalysisDialog.value = true
    } else if (path === '/virtual-interaction') {
      showVirtualInteractionDialog.value = true
    } else {
      router.push(path)
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const closeDialog = () => {
  showDialog.value = false
}

const goToPersonalitySettings = () => {
  showDialog.value = false
  router.push('/personality')
}

onMounted(() => {
  // 移除原有的checkPersonalitySettings调用
})
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

/* Element Plus Dialog 样式覆盖 */
:deep(.el-dialog) {
  @apply bg-transparent shadow-none;
}

:deep(.el-dialog__header) {
  @apply hidden;
}

:deep(.el-dialog__body) {
  @apply p-0;
}

:deep(.el-dialog__wrapper) {
  @apply backdrop-blur-sm;
}

:deep(.el-dialog) {
  @apply rounded-2xl overflow-hidden;
}

:deep(.el-dialog__body) {
  @apply max-h-[80vh] overflow-y-auto;
}
</style> 