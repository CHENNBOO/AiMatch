<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
      <h2 class="text-2xl font-semibold text-center text-black">登录</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-black mb-1">用户名</label>
          <input 
            v-model="formData.username"
            type="text"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入用户名"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black mb-1">密码</label>
          <input 
            v-model="formData.password"
            type="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入密码"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black mb-1">手机号</label>
          <input 
            v-model="formData.phone"
            type="text"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入手机号"
          />
        </div>
      </div>

      <div class="pt-2">
        <button 
          @click="handleLogin"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          登录
        </button>
      </div>

      <div class="text-center">
        <router-link to="/register" class="text-sm text-black hover:text-blue-600">
          还没有账号？立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'
import { API_CONFIG, API_PATHS } from '@/config/api.config'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  phone: ''
})

const handleLogin = async () => {
  try {
    const response = await post(
      API_CONFIG.SERVICES.UAA,
      API_PATHS.UAA.LOGIN,
      formData.value
    )
    
    if (response.code === 200) {
      // 存储token和用户信息
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // 跳转到首页
      router.push('/')
    } else {
      alert(response.message)
    }
  } catch (error) {
    alert(error.message || '登录失败')
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 