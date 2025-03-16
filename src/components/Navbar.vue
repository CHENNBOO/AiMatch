<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-[1920px] mx-auto px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo区域 -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-black text-2xl font-light tracking-wider hover:opacity-75 transition-opacity">
            AiUnity
          </router-link>
          
          <!-- 主导航链接 -->
          <div class="flex items-center space-x-12">
            <template v-for="(item, index) in navItems" :key="index">
              <router-link
                v-if="!item.disabled"
                :to="item.path"
                class="relative py-2 text-black/75 hover:text-black transition-colors duration-300 text-sm tracking-wide"
                :class="{ 'nav-active': route.path === item.path }"
              >
                {{ item.name }}
              </router-link>
              <span
                v-else
                class="relative py-2 text-gray-400 text-sm tracking-wide cursor-not-allowed"
              >
                {{ item.name }}
              </span>
            </template>
          </div>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-6">
          <!-- 搜索按钮 -->
          <button class="p-2 text-black/75 hover:text-black transition-colors duration-300">
            <i class="ri-search-line text-xl"></i>
          </button>

          <!-- 用户信息和操作按钮 -->
          <template v-if="isLoggedIn">
            <span class="text-black/75 text-sm tracking-wide">欢迎，{{ username }}</span>
            <button
              @click="handleLogout"
              class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full 
                     hover:shadow-lg transition-shadow duration-300 text-sm tracking-wide"
            >
              退出登录
            </button>
          </template>
          <template v-else>
            <button
              @click="goToLogin"
              class="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-full 
                     hover:shadow-lg transition-shadow duration-300 text-sm tracking-wide"
            >
              登录
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- 占位符，防止内容被导航栏遮挡 -->
  <div class="h-20"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = ref('')
const isLoggedIn = ref(false)

const navItems = [
  { name: 'AiMatch', path: '/' },
  { name: '更多功能敬请期待', path: '/coming-soon', disabled: true }
]

// 退出登录
const handleLogout = async () => {
  await router.push('/login')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  username.value = ''
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    username.value = user.username
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
    username.value = ''
  }
}

// 监听路由变化
watch(() => route.path, () => {
  getUserInfo()
})

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.nav-active {
  @apply text-black;
}

.nav-active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full;
  animation: navLineIn 0.3s ease forwards;
}

@keyframes navLineIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* 引入 Remix Icon */
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
</style> 