<template>
  <div class="mbti-match-container">
    <!-- 左侧选择区 -->
    <div class="personality-selector left-side">
      <h2>第一个人的性格类型</h2>
      <div class="mbti-buttons">
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person1.EI === 'I' }" 
              @click="person1.EI = 'I'">内向 (I)</el-button>
            <el-button 
              :class="{ active: person1.EI === 'E' }" 
              @click="person1.EI = 'E'">外向 (E)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person1.SN === 'S' }" 
              @click="person1.SN = 'S'">感觉 (S)</el-button>
            <el-button 
              :class="{ active: person1.SN === 'N' }" 
              @click="person1.SN = 'N'">直觉 (N)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person1.TF === 'T' }" 
              @click="person1.TF = 'T'">思维 (T)</el-button>
            <el-button 
              :class="{ active: person1.TF === 'F' }" 
              @click="person1.TF = 'F'">感觉 (F)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person1.JP === 'J' }" 
              @click="person1.JP = 'J'">判断 (J)</el-button>
            <el-button 
              :class="{ active: person1.JP === 'P' }" 
              @click="person1.JP = 'P'">知觉 (P)</el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 右侧选择区 -->
    <div class="personality-selector right-side">
      <h2>第二个人的性格类型</h2>
      <div class="mbti-buttons">
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person2.EI === 'I' }" 
              @click="person2.EI = 'I'">内向 (I)</el-button>
            <el-button 
              :class="{ active: person2.EI === 'E' }" 
              @click="person2.EI = 'E'">外向 (E)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person2.SN === 'S' }" 
              @click="person2.SN = 'S'">感觉 (S)</el-button>
            <el-button 
              :class="{ active: person2.SN === 'N' }" 
              @click="person2.SN = 'N'">直觉 (N)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person2.TF === 'T' }" 
              @click="person2.TF = 'T'">思维 (T)</el-button>
            <el-button 
              :class="{ active: person2.TF === 'F' }" 
              @click="person2.TF = 'F'">感觉 (F)</el-button>
          </el-button-group>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button 
              :class="{ active: person2.JP === 'J' }" 
              @click="person2.JP = 'J'">判断 (J)</el-button>
            <el-button 
              :class="{ active: person2.JP === 'P' }" 
              @click="person2.JP = 'P'">知觉 (P)</el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 中央匹配按钮 -->
    <div class="match-button-container" v-if="!showResult">
      <el-button 
        type="primary" 
        size="large" 
        :disabled="!isSelectionComplete"
        @click="calculateMatch"
        class="match-button animate__animated animate__pulse animate__infinite">
        开始匹配
      </el-button>
    </div>

    <!-- 结果展示区 -->
    <div v-if="showResult" class="result-container animate__animated animate__fadeIn">
      <div class="result-card">
        <div class="result-header">
          <h2>匹配分析报告</h2>
          <div class="personality-types">
            <div class="type-card">
              <span class="type-label">性格类型一</span>
              <span class="type-value">{{ getFullType(person1) }}</span>
            </div>
            <div class="match-percentage">
              <el-progress 
                type="dashboard"
                :percentage="matchPercentage"
                :stroke-width="12"
                :width="180"
                class="animate__animated animate__zoomIn"
                :format="(percentage) => `${percentage}% 匹配度`">
              </el-progress>
            </div>
            <div class="type-card">
              <span class="type-label">性格类型二</span>
              <span class="type-value">{{ getFullType(person2) }}</span>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="match-analysis">
          <div v-if="parsedDescription.overall" class="analysis-section">
            <h3><el-icon><InfoFilled /></el-icon> 总体评价</h3>
            <p>{{ parsedDescription.overall }}</p>
          </div>
          
          <div v-if="parsedDescription.communication" class="analysis-section">
            <h3><el-icon><ChatDotRound /></el-icon> 沟通方式</h3>
            <p>{{ parsedDescription.communication }}</p>
          </div>
          
          <div v-if="parsedDescription.values" class="analysis-section">
            <h3><el-icon><Connection /></el-icon> 共同价值观</h3>
            <p>{{ parsedDescription.values }}</p>
          </div>
          
          <div v-if="parsedDescription.challenges" class="analysis-section">
            <h3><el-icon><Warning /></el-icon> 潜在挑战</h3>
            <ul>
              <li v-for="(challenge, index) in parsedDescription.challenges" :key="index">
                {{ challenge }}
              </li>
            </ul>
          </div>
          
          <div v-if="parsedDescription.suggestions" class="analysis-section">
            <h3><el-icon><Sunny /></el-icon> 改善建议</h3>
            <ul>
              <li v-for="(suggestion, index) in parsedDescription.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
        
        <div class="action-buttons">
          <el-button type="primary" @click="resetSelection" class="reset-button">
            重新匹配
          </el-button>
          <el-button @click="exportReport" class="export-button">
            导出报告
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { InfoFilled, ChatDotRound, Connection, Warning, Sunny } from '@element-plus/icons-vue'
import 'animate.css'

interface PersonType {
  EI: string
  SN: string
  TF: string
  JP: string
}

const person1 = ref<PersonType>({
  EI: '',
  SN: '',
  TF: '',
  JP: ''
})

const person2 = ref<PersonType>({
  EI: '',
  SN: '',
  TF: '',
  JP: ''
})

const showResult = ref(false)
const matchPercentage = ref(0)
const matchDescription = ref('')
const isLoading = ref(false)

const isSelectionComplete = computed(() => {
  return Object.values(person1.value).every(v => v !== '') &&
         Object.values(person2.value).every(v => v !== '')
})

const getFullType = (person: PersonType) => {
  return person.EI + person.SN + person.TF + person.JP
}

const calculateMatch = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在分析性格匹配度...',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  
  try {
    const type1 = getFullType(person1.value)
    const type2 = getFullType(person2.value)
    
    const response = await axios.post('/api/mbti-match', {
      type1,
      type2
    })
    
    const { matchPercentageValue, description } = response.data
    
    showResult.value = true
    matchPercentage.value = matchPercentageValue
    matchDescription.value = description
  } catch (error) {
    ElMessage.error('抱歉，分析过程出现错误，请稍后重试')
    console.error('Error:', error)
  } finally {
    loadingInstance.close()
  }
}

const resetSelection = () => {
  person1.value = { EI: '', SN: '', TF: '', JP: '' }
  person2.value = { EI: '', SN: '', TF: '', JP: '' }
  showResult.value = false
  matchPercentage.value = 0
  matchDescription.value = ''
}

interface AnalysisDescription {
  overall?: string
  communication?: string
  values?: string
  challenges?: string[]
  suggestions?: string[]
}

const parsedDescription = computed(() => {
  const description: AnalysisDescription = {
    overall: '',
    communication: '',
    values: '',
    challenges: [],
    suggestions: []
  }

  if (!matchDescription.value) return description

  const sections = matchDescription.value.split('\n\n')
  
  sections.forEach(section => {
    if (section.includes('总体匹配度')) {
      description.overall = section
    } else if (section.includes('沟通方式')) {
      description.communication = section.replace('沟通方式：', '').trim()
    } else if (section.includes('共同价值观')) {
      description.values = section.replace('共同价值观：', '').trim()
    } else if (section.includes('可能存在的挑战')) {
      description.challenges = section
        .split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.replace('-', '').trim())
    } else if (section.includes('改善建议')) {
      description.suggestions = section
        .split('\n')
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
    }
  })

  return description
})

const exportReport = () => {
  const reportContent = `
MBTI 性格匹配分析报告

性格类型一：${getFullType(person1.value)}
性格类型二：${getFullType(person2.value)}
匹配度：${matchPercentage.value}%

${matchDescription.value}

生成时间：${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `MBTI匹配报告_${getFullType(person1.value)}_${getFullType(person2.value)}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.mbti-match-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.personality-selector {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.left-side {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.mbti-buttons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.button-group {
  display: flex;
  justify-content: center;
}

:deep(.el-button) {
  padding: 12px 24px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

:deep(.el-button.active) {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.match-button-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.match-button {
  padding: 20px 40px;
  font-size: 1.2rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.result-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 1000px;
  margin: auto;
  overflow-y: auto;
  max-height: 90vh;
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.personality-types {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
}

.type-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
}

.type-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.type-value {
  font-size: 2rem;
  font-weight: bold;
  color: #409EFF;
}

.match-percentage {
  position: relative;
}

.match-analysis {
  padding: 1rem;
}

.analysis-section {
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.analysis-section h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.analysis-section p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.analysis-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-section li {
  color: #4a5568;
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
}

.analysis-section li::before {
  content: "•";
  color: #409EFF;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.reset-button, .export-button {
  min-width: 120px;
}

:deep(.el-progress__text) {
  font-size: 1rem !important;
  font-weight: bold;
  color: #409EFF;
}

@media (max-width: 768px) {
  .result-card {
    width: 95%;
    padding: 1rem;
  }

  .personality-types {
    flex-direction: column;
    gap: 1rem;
  }

  .type-card {
    width: 100%;
  }

  .match-percentage {
    margin: 2rem 0;
  }
}
</style> 