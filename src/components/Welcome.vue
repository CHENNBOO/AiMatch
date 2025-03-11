<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1>欢迎使用 AiMatch</h1>
      <p>一个基于 MBTI 性格理论的智能匹配系统</p>
      <el-button type="primary" size="large" @click="goToMbti" class="start-button">
        开始使用
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goToMbti = () => {
  router.push('/mbti')
}
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.welcome-content {
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #409EFF;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  color: #606266;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.start-button {
  padding: 12px 36px;
  font-size: 1.1rem;
}
</style> 