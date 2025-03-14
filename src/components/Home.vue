<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    <PersonalitySettingsDialog v-model="showDialog" />
    <PersonalityAnalysisDialog v-model="showAnalysisDialog" />
    <PersonalityIncompleteDialog v-model="showIncompleteDialog" />
    <VirtualInteractionDialog v-model="showVirtualInteractionDialog" />
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
        <!-- 性格设置 -->
        <router-link to="/personality" 
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><UserFilled /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">性格设置</h3>
            <p class="text-black/70 dark:text-white/70">设置性格类型，探索性格人群的互动场景</p>
          </div>
        </router-link>

        <!-- 性格匹配分析 -->
        <router-link to="#" 
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s"
          @click="(e) => handleFeatureClick(e, '/personality-analysis')"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Connection /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">性格匹配分析</h3>
            <p class="text-black/70 dark:text-white/70">深入分析不同性格类型的匹配程度</p>
          </div>
        </router-link>

        <!-- 虚拟互动 -->
        <router-link to="#"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s"
          @click="(e) => handleFeatureClick(e, '/virtual-interaction')"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Avatar /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">虚拟互动</h3>
            <p class="text-black/70 dark:text-white/70">智能虚拟伙伴陪伴交流</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Avatar, Connection } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PersonalitySettingsDialog from './PersonalitySettingsDialog.vue'
import PersonalityAnalysisDialog from './PersonalityAnalysisDialog.vue'
import PersonalityIncompleteDialog from './PersonalityIncompleteDialog.vue'
import VirtualInteractionDialog from './VirtualInteractionDialog.vue'
import 'animate.css'

const router = useRouter()
const showDialog = ref(false)
const showAnalysisDialog = ref(false)
const showIncompleteDialog = ref(false)
const showVirtualInteractionDialog = ref(false)

const checkPersonalitySettings = () => {
  // 检查第一个人的设置
  const person1Type = localStorage.getItem('person1Type')
  const person1OtherTypes = localStorage.getItem('person1OtherTypes')
  const person1CustomType = localStorage.getItem('person1CustomType')
  
  // 检查第二个人的设置
  const person2Type = localStorage.getItem('person2Type')
  const person2OtherTypes = localStorage.getItem('person2OtherTypes')
  const person2CustomType = localStorage.getItem('person2CustomType')

  // 检查第一个人是否有任何类型设置
  const hasPerson1Settings = person1Type || 
    (person1OtherTypes && JSON.parse(person1OtherTypes).length > 0) || 
    person1CustomType

  // 检查第二个人是否有任何类型设置
  const hasPerson2Settings = person2Type || 
    (person2OtherTypes && JSON.parse(person2OtherTypes).length > 0) || 
    person2CustomType

  return hasPerson1Settings && hasPerson2Settings
}

const handleFeatureClick = (e: Event, path: string) => {
  e.preventDefault()
  if (!checkPersonalitySettings()) {
    showIncompleteDialog.value = true
  } else {
    if (path === '/personality-analysis') {
      showAnalysisDialog.value = true
    } else if (path === '/virtual-interaction') {
      showVirtualInteractionDialog.value = true
    } else {
      router.push(path)
    }
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
  checkPersonalitySettings()
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
</style> 