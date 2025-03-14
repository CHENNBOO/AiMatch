<template>
  <div class="event-planner-container">
    <div class="planner-header">
      <h2>活动策划</h2>
      <p class="subtitle">基于MBTI性格特征为您定制专属活动方案</p>
    </div>

    <!-- 性格类型选择区 -->
    <div class="personality-section">
      <div class="type-selector">
        <h3>您的性格类型</h3>
        <el-select v-model="person1Type" placeholder="请选择您的MBTI类型">
          <el-option
            v-for="type in mbtiTypes"
            :key="type"
            :label="type"
            :value="type">
          </el-option>
        </el-select>
      </div>
      <div class="type-selector">
        <h3>伴侣的性格类型</h3>
        <el-select v-model="person2Type" placeholder="请选择伴侣的MBTI类型">
          <el-option
            v-for="type in mbtiTypes"
            :key="type"
            :label="type"
            :value="type">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 活动类型选择 -->
    <div class="event-type-section">
      <h3>活动类型</h3>
      <el-radio-group v-model="eventType">
        <el-radio-button label="date">约会</el-radio-button>
        <el-radio-button label="travel">旅行</el-radio-button>
        <el-radio-button label="activity">日常活动</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 偏好设置 -->
    <div class="preferences-section">
      <h3>偏好设置</h3>
      <el-form :model="preferences" label-position="top">
        <el-form-item label="预算范围">
          <el-select v-model="preferences.budget">
            <el-option label="经济实惠 (¥0-300)" value="low"></el-option>
            <el-option label="中等消费 (¥300-800)" value="medium"></el-option>
            <el-option label="高端体验 (¥800+)" value="high"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时长">
          <el-select v-model="preferences.duration">
            <el-option label="2-3小时" value="short"></el-option>
            <el-option label="半天" value="half_day"></el-option>
            <el-option label="一整天" value="full_day"></el-option>
            <el-option label="多天" value="multiple_days"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动场景">
          <el-select v-model="preferences.scene" multiple>
            <el-option label="户外自然" value="outdoor"></el-option>
            <el-option label="文化艺术" value="culture"></el-option>
            <el-option label="美食探索" value="food"></el-option>
            <el-option label="运动健身" value="sports"></el-option>
            <el-option label="休闲放松" value="relaxation"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 生成按钮 -->
    <div class="generate-section">
      <el-button 
        type="primary" 
        :loading="isGenerating"
        :disabled="!canGenerate"
        @click="generatePlan"
        size="large">
        生成活动方案
      </el-button>
    </div>

    <!-- 结果展示区 -->
    <div v-if="planResult" class="result-section">
      <el-card class="plan-card">
        <template #header>
          <div class="card-header">
            <h3>为您定制的活动方案</h3>
          </div>
        </template>
        <div class="plan-content">
          <div class="plan-overview">
            <h4>方案概述</h4>
            <p>{{ planResult.overview }}</p>
          </div>
          <div class="plan-details">
            <h4>具体安排</h4>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in planResult.activities"
                :key="index"
                :timestamp="activity.time">
                <h5>{{ activity.title }}</h5>
                <p>{{ activity.description }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div class="plan-tips">
            <h4>贴心建议</h4>
            <ul>
              <li v-for="(tip, index) in planResult.tips" :key="index">
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// MBTI类型列表
const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

// 响应式状态
const person1Type = ref('')
const person2Type = ref('')
const eventType = ref('date')
const preferences = ref({
  budget: '',
  duration: '',
  scene: []
})
const isGenerating = ref(false)
const planResult = ref(null)

// 计算属性：是否可以生成方案
const canGenerate = computed(() => {
  return person1Type.value && 
         person2Type.value && 
         preferences.value.budget && 
         preferences.value.duration && 
         preferences.value.scene.length > 0
})

// 生成活动方案
const generatePlan = async () => {
  isGenerating.value = true
  try {
    const response = await axios.post('/api/event-plan', {
      person1Type: person1Type.value,
      person2Type: person2Type.value,
      eventType: eventType.value,
      preferences: preferences.value
    })
    
    planResult.value = response.data
    ElMessage.success('活动方案生成成功！')
  } catch (error) {
    ElMessage.error('生成方案时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.event-planner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.planner-header {
  text-align: center;
  margin-bottom: 3rem;
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.personality-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.type-selector {
  flex: 1;
}

.event-type-section {
  margin-bottom: 2rem;
}

.preferences-section {
  margin-bottom: 2rem;
}

.generate-section {
  text-align: center;
  margin: 2rem 0;
}

.result-section {
  margin-top: 3rem;
}

.plan-card {
  margin-bottom: 2rem;
}

.plan-content {
  padding: 1rem;
}

.plan-overview, .plan-details, .plan-tips {
  margin-bottom: 2rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

h4 {
  color: #409EFF;
  margin-bottom: 1rem;
}

.el-timeline-item h5 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.plan-tips ul {
  list-style-type: none;
  padding: 0;
}

.plan-tips li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.plan-tips li::before {
  content: "•";
  color: #409EFF;
  position: absolute;
  left: 0;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-radio-group) {
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .personality-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .event-planner-container {
    padding: 1rem;
  }
}
</style> 