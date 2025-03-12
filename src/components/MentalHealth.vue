<template>
  <div class="mental-health-container">
    <!-- MBTI类型选择区域 -->
    <el-card class="mbti-section">
      <template #header>
        <div class="card-header">
          <h3><el-icon><UserFilled /></el-icon> 您的MBTI类型</h3>
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

    <!-- 心理状态评估区域 -->
    <el-card class="assessment-section" v-if="selectedType">
      <template #header>
        <div class="card-header">
          <h3><el-icon><DataLine /></el-icon> 心理状态评估</h3>
        </div>
      </template>
      <div class="mood-tracker">
        <h4>今日心情</h4>
        <el-rate
          v-model="moodRating"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          :texts="['低落', '一般', '不错', '开心', '非常好']"
          show-text>
        </el-rate>
      </div>
      <div class="stress-level">
        <h4>压力水平</h4>
        <el-slider
          v-model="stressLevel"
          :marks="{
            0: '无压力',
            25: '轻度',
            50: '中度',
            75: '较重',
            100: '严重'
          }"
          :step="25">
        </el-slider>
      </div>
      <div class="symptoms-checklist">
        <h4>近期症状（可多选）</h4>
        <el-checkbox-group v-model="selectedSymptoms">
          <el-checkbox label="睡眠问题">睡眠问题</el-checkbox>
          <el-checkbox label="注意力难以集中">注意力难以集中</el-checkbox>
          <el-checkbox label="情绪波动">情绪波动</el-checkbox>
          <el-checkbox label="焦虑感">焦虑感</el-checkbox>
          <el-checkbox label="疲惫感">疲惫感</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button type="primary" @click="generateAnalysis" class="analysis-button">
        生成分析报告
      </el-button>
    </el-card>

    <!-- 分析结果和建议展示区域 -->
    <el-card class="result-section" v-if="showResult">
      <template #header>
        <div class="card-header">
          <h3><el-icon><ChatLineRound /></el-icon> AI分析与建议</h3>
        </div>
      </template>
      <div class="analysis-content" v-loading="loading">
        <template v-if="!loading">
          <div class="content" style="white-space: pre-wrap;">{{ analysis }}</div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, DataLine, ChatLineRound } from '@element-plus/icons-vue'
import axios from 'axios'

const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const selectedType = ref('')
const moodRating = ref(3)
const stressLevel = ref(25)
const selectedSymptoms = ref([])
const showResult = ref(false)
const loading = ref(false)
const analysis = ref('')

const handleTypeChange = () => {
  showResult.value = false
}

const generateAnalysis = async () => {
  if (!selectedType.value) {
    ElMessage.warning('请先选择您的MBTI类型')
    return
  }

  loading.value = true
  showResult.value = true

  try {
    const response = await axios.post('/api/mental-health-analysis', {
      mbtiType: selectedType.value,
      moodRating: moodRating.value,
      stressLevel: stressLevel.value,
      symptoms: selectedSymptoms.value
    })

    if (response.data.status === 'success') {
      analysis.value = response.data.data
    } else {
      throw new Error('分析失败')
    }
  } catch (error) {
    ElMessage.error('生成分析报告时出现错误，请稍后重试')
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mental-health-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.mbti-section,
.assessment-section,
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

.mbti-selector {
  display: flex;
  justify-content: center;
}

.mood-tracker,
.stress-level,
.symptoms-checklist {
  margin-bottom: 24px;
}

h4 {
  color: #606266;
  margin-bottom: 12px;
}

.analysis-button {
  width: 100%;
  margin-top: 20px;
}

.analysis-content {
  min-height: 200px;
}

.summary-section,
.personality-insights,
.recommendations {
  margin-bottom: 20px;
}

:deep(.el-checkbox-group) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

:deep(.el-collapse-item__header) {
  font-weight: bold;
  color: #409EFF;
}

:deep(.el-collapse-item__content) {
  padding: 16px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .mental-health-container {
    padding: 10px;
  }

  :deep(.el-checkbox-group) {
    grid-template-columns: 1fr;
  }
}
</style> 