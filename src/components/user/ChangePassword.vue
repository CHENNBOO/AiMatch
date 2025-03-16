<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
      <h2 class="text-2xl font-semibold text-center text-black">修改密码</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-black mb-1">原密码</label>
          <input 
            v-model="formData.oldPassword"
            type="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入原密码"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black mb-1">新密码</label>
          <input 
            v-model="formData.newPassword"
            type="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入新密码"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-black mb-1">确认新密码</label>
          <input 
            v-model="formData.confirmPassword"
            type="password"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请再次输入新密码"
          />
        </div>
      </div>

      <div class="pt-2">
        <button 
          @click="handleChangePassword"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          确认修改
        </button>
      </div>

      <div class="text-center">
        <router-link to="/" class="text-sm text-black hover:text-blue-600">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { put } from '@/utils/request'
import { API_CONFIG, API_PATHS } from '@/config/api.config'

const router = useRouter()

const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleChangePassword = async () => {
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    alert('两次输入的新密码不一致')
    return
  }

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      alert('请先登录')
      router.push('/login')
      return
    }

    const response = await put(
      API_CONFIG.SERVICES.UAA,
      API_PATHS.UAA.UPDATE_PASSWORD,
      null,
      {
        params: {
          userId: user.id,
          oldPassword: formData.value.oldPassword,
          newPassword: formData.value.newPassword
        }
      }
    )
    
    if (response.code === 200) {
      alert('密码修改成功，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    } else {
      alert(response.message)
    }
  } catch (error) {
    alert(error.message || '修改密码失败')
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