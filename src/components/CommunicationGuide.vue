<template>
  <div class="communication-guide-container">
    <!-- MBTI类型选择区域 -->
    <el-card class="mbti-section">
      <template #header>
        <div class="card-header">
          <h3><el-icon><ChatDotRound /></el-icon> 日常沟通指导</h3>
        </div>
      </template>
      <div class="mbti-selector">
        <el-select v-model="selectedType" placeholder="请选择您的MBTI类型" @change="handleTypeChange">
          <el-option
            v-for="type in mbtiTypes"
            :key="type"
            :label="type"
            :value="type">
          </el-option>
        </el-select>
      </div>
    </el-card>

    <!-- 沟通场景选择 -->
    <el-card class="scenario-section" v-if="selectedType">
      <template #header>
        <div class="card-header">
          <h3><el-icon><Connection /></el-icon> 沟通场景</h3>
        </div>
      </template>
      <div class="scenario-selector">
        <el-radio-group v-model="selectedScenario">
          <el-radio label="work">工作交流</el-radio>
          <el-radio label="relationship">人际关系</el-radio>
          <el-radio label="conflict">冲突处理</el-radio>
          <el-radio label="emotion">情绪管理</el-radio>
        </el-radio-group>
      </div>
      <div class="target-type" v-if="selectedScenario">
        <h4>对方的MBTI类型（可选）</h4>
        <el-select v-model="targetType" placeholder="选择对方的MBTI类型（可选）" clearable>
          <el-option
            v-for="type in mbtiTypes"
            :key="type"
            :label="type"
            :value="type">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="generateGuidance" class="guidance-button">
        获取沟通指导
      </el-button>
    </el-card>

    <!-- 指导建议展示区域 -->
    <el-card class="result-section" v-if="showResult">
      <template #header>
        <div class="card-header">
          <h3><el-icon><Reading /></el-icon> AI指导建议</h3>
        </div>
      </template>
      <div class="guidance-content" v-loading="loading">
        <template v-if="!loading">
          <div class="content" style="white-space: pre-wrap;">{{ guidance }}</div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Connection, Reading } from '@element-plus/icons-vue'
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

<style scoped>
.communication-guide-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.mbti-section,
.scenario-section,
.result-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #409EFF;
}

.mbti-selector,
.scenario-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.target-type {
  margin-top: 20px;
}

h4 {
  color: #606266;
  margin-bottom: 12px;
}

.guidance-button {
  width: 100%;
  margin-top: 20px;
}

.guidance-content {
  min-height: 200px;
}

:deep(.el-radio-group) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

@media (max-width: 768px) {
  .communication-guide-container {
    padding: 10px;
  }

  :deep(.el-radio-group) {
    grid-template-columns: 1fr;
  }
}
</style> 