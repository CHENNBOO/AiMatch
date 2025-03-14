<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
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
        <!-- MBTI匹配 -->
        <router-link to="/mbti" 
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><UserFilled /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">MBTI匹配</h3>
            <p class="text-black/70 dark:text-white/70">探索性格类型的完美匹配</p>
          </div>
        </router-link>
        <!-- 虚拟互动 -->
        <router-link to="/virtual-interaction"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Avatar /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">虚拟互动</h3>
            <p class="text-black/70 dark:text-white/70">智能虚拟伙伴陪伴交流</p>
          </div>
        </router-link>
        <!-- 活动策划 -->
        <router-link to="/event-planner"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Calendar /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">活动策划</h3>
            <p class="text-black/70 dark:text-white/70">基于性格特征的个性化活动方案</p>
          </div>
        </router-link>

        <!-- 心理健康 -->
        <router-link to="/mental-health"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><Sunny /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">心理健康</h3>
            <p class="text-black/70 dark:text-white/70">专业的心理健康评估与建议</p>
          </div>
        </router-link>

        <!-- 沟通指导 -->
        <router-link to="/communication-guide"
          class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__delay-2s">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 rounded-2xl transition-all duration-300"></div>
          <div class="relative">
            <el-icon class="text-4xl mb-4 text-black dark:text-white"><ChatDotRound /></el-icon>
            <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">沟通指导</h3>
            <p class="text-black/70 dark:text-white/70">提升沟通技巧的智能助手</p>
          </div>
        </router-link>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled, Calendar, Sunny, ChatDotRound, Avatar } from '@element-plus/icons-vue'
import 'animate.css'
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