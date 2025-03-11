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
        <h2>匹配结果</h2>
        <div class="personality-types">
          <span class="type">{{ getFullType(person1) }}</span>
          <el-progress 
            type="circle" 
            :percentage="matchPercentage"
            :stroke-width="10"
            :width="200"
            class="animate__animated animate__zoomIn">
          </el-progress>
          <span class="type">{{ getFullType(person2) }}</span>
        </div>
        <div class="match-description">
          <p>{{ matchDescription }}</p>
        </div>
        <el-button @click="resetSelection" class="reset-button">重新匹配</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.result-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 600px;
  width: 90%;
}

.personality-types {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
}

.type {
  font-size: 2rem;
  font-weight: bold;
  color: #409EFF;
}

.match-description {
  margin: 2rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.reset-button {
  margin-top: 1rem;
  padding: 12px 30px;
}
</style> 