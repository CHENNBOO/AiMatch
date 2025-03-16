<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6">
      <h2 class="text-2xl font-semibold text-center text-black">注册</h2>
      
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
          @click="handleRegister"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          注册
        </button>
      </div>

      <div class="text-center">
        <router-link to="/login" class="text-sm text-black hover:text-blue-600">
          已有账号？立即登录
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

const handleRegister = async () => {
  // 表单验证
  if (!formData.value.username || !formData.value.password || !formData.value.phone) {
    alert('请填写完整的注册信息')
    return
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.value.phone)) {
    alert('请输入正确的手机号格式')
    return
  }

  try {
    console.log('开始注册请求，请求数据:', {
      username: formData.value.username,
      password: '******', // 出于安全考虑不打印密码
      phone: formData.value.phone
    })

    const response = await post(
      API_CONFIG.SERVICES.UAA,
      API_PATHS.UAA.REGISTER,
      formData.value
    )
    
    console.log('注册请求成功，响应数据:', response)

    if (response.code === 200) {
      alert('注册成功！请使用账号密码登录')
      // 清空表单数据
      formData.value = {
        username: '',
        password: '',
        phone: ''
      }
      // 跳转到登录页面
      router.push('/login')
    } else {
      alert(response.message || '注册失败，请稍后重试')
    }
  } catch (error) {
    console.error('注册请求失败:', error.response?.data || error.message)
    
    // 根据错误类型显示不同的错误信息
    if (error.response?.status === 409) {
      alert('用户名或手机号已存在')
    } else if (error.response?.status === 400) {
      alert(error.response.data.message || '请求参数错误')
    } else {
      alert(error.message || '注册失败，请稍后重试')
    }
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