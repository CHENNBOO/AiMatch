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
          <el-card class="analysis-section" v-if="parsedDescription.overall">
            <template #header>
              <div class="card-header">
                <h3><el-icon><InfoFilled /></el-icon> 总体匹配度</h3>
              </div>
            </template>
            <p>{{ parsedDescription.overall }}</p>
          </el-card>
          
          <el-card class="analysis-section" v-if="parsedDescription.communication">
            <template #header>
              <div class="card-header">
                <h3><el-icon><ChatDotRound /></el-icon> 沟通方式的兼容性</h3>
              </div>
            </template>
            <p>{{ parsedDescription.communication }}</p>
          </el-card>
          
          <el-card class="analysis-section" v-if="parsedDescription.values">
            <template #header>
              <div class="card-header">
                <h3><el-icon><Connection /></el-icon> 共同价值观</h3>
              </div>
            </template>
            <p>{{ parsedDescription.values }}</p>
          </el-card>
          
          <el-card class="analysis-section" v-if="parsedDescription.challenges">
            <template #header>
              <div class="card-header">
                <h3><el-icon><Warning /></el-icon> 可能存在的挑战</h3>
              </div>
            </template>
            <p>{{ parsedDescription.challenges }}</p>
          </el-card>
          
          <el-card class="analysis-section" v-if="parsedDescription.suggestions">
            <template #header>
              <div class="card-header">
                <h3><el-icon><Sunny /></el-icon> 改善建议</h3>
              </div>
            </template>
            <p>{{ parsedDescription.suggestions }}</p>
          </el-card>

          <el-card class="analysis-section" v-if="parsedDescription.summary">
            <template #header>
              <div class="card-header">
                <h3><el-icon><DocumentCopy /></el-icon> 总结</h3>
              </div>
            </template>
            <p>{{ parsedDescription.summary }}</p>
          </el-card>
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
import { InfoFilled, ChatDotRound, Connection, Warning, Sunny, DocumentCopy } from '@element-plus/icons-vue'
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
  console.log('开始请求=====calculateMatch');
  
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

    
    
//模拟发起请求，返回数据
// console.log('模拟请求===111==calculateMatch');
// const response = {  
//   data: {
//     "matchPercentageValue": 65,
//     "description": "### 1. 总体匹配度  \nISTJ和ENFP的总体匹配度为 **65%**。  \nISTJ（内向、实感、思维、判断）和ENFP（外向、直觉、情感、感知）在认知功能上差异较大，ISTJ注重细节、结构和责任，而ENFP则偏好创新、自由和情感表达。这种差异可能导致互补，但也可能引发冲突。匹配度中等偏上，但需要双方努力调和差异。\n\n---\n\n### 2. 沟通方式的兼容性  \n**优势：**  \n- ISTJ的条理性和ENFP的创意性可以互补。ISTJ能为ENFP提供实际支持，而ENFP能为ISTJ带来新视角。  \n- ENFP的开放性有助于ISTJ尝试新事物，ISTJ的稳定性则能为ENFP提供安全感。  \n\n**挑战：**  \n- ISTJ倾向于直接、逻辑化的沟通，而ENFP更注重情感和抽象表达，可能导致误解。  \n- ENFP的跳跃性思维可能让ISTJ感到混乱，而ISTJ的严谨性可能让ENFP感到束缚。  \n\n---\n\n### 3. 共同价值观  \n**契合点：**  \n- 双方都重视承诺和责任感，尽管表达方式不同。ISTJ通过行动体现，ENFP通过情感投入体现。  \n- 在长期目标上，ISTJ和ENFP都希望建立稳定且有意义的亲密关系。  \n\n**差异点：**  \n- ISTJ倾向于传统和规则，ENFP则更注重自由和灵活性。  \n- ISTJ偏好计划性和可预测性，而ENFP更喜欢即兴和变化。  \n\n---\n\n### 4. 可能存在的挑战  \n1. **生活方式冲突：** ISTJ喜欢规律和计划，ENFP则倾向于随性和多变。  \n2. **情感表达差异：** ISTJ可能显得冷漠，ENFP则可能觉得情感需求未被满足。  \n3. **决策方式不同：** ISTJ基于逻辑和事实，ENFP则更依赖直觉和情感。  \n\n---\n\n### 5. 改善建议  \n1. **建立沟通规则：** ISTJ可以尝试倾听ENFP的情感表达，ENFP则需注意逻辑性和条理性，避免过度跳跃。  \n2. **平衡计划与灵活性：** ISTJ可以适当放松计划，ENFP则需尊重ISTJ对稳定性的需求，共同制定折中方案。  \n3. **定期情感交流：** 双方可以每周安排固定时间进行深度沟通，ISTJ表达感受，ENFP提供情感支持，增进理解。  \n\n---\n\n总结：ISTJ和ENFP的匹配度为65%，双方在沟通、价值观和生活方式上存在显著差异，但通过努力调和，可以建立互补且稳定的关系。"
//   }
// }
    

    const { matchPercentageValue, description } = response.data
    console.log('response.data====请求结束====',response.data);
    
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
  overall: string
  communication: string
  values: string
  challenges: string
  suggestions: string
  summary: string
}

const parsedDescription = computed(() => {
  const description: AnalysisDescription = {
    overall: '',
    communication: '',
    values: '',
    challenges: '',
    suggestions: '',
    summary: ''
  }

  if (!matchDescription.value) return description

  const cleanText = (text: string) => {
    // 移除特殊字符和数字编号，但保留基本标点符号
    return text
      .replace(/[#*`]/g, '')
      .replace(/^\d+[.、]\s*/gm, '')
      .replace(/^[-•]\s*/gm, '')
      .trim()
  }

  const sections = matchDescription.value.split('\n\n')
  
  sections.forEach(section => {
    if (section.includes('总体匹配度')) {
      const lines = section.split('\n').slice(1)
      description.overall = cleanText(lines.join(' '))
    } else if (section.includes('沟通方式的兼容性')) {
      const lines = section.split('\n').filter(line => 
        !line.includes('沟通方式的兼容性') && 
        !line.includes('优势：') && 
        !line.includes('挑战：')
      )
      description.communication = cleanText(lines.join(' '))
    } else if (section.includes('共同价值观')) {
      const lines = section.split('\n').filter(line => 
        !line.includes('共同价值观') && 
        !line.includes('契合点：') && 
        !line.includes('差异点：')
      )
      description.values = cleanText(lines.join(' '))
    } else if (section.includes('可能存在的挑战')) {
      const lines = section.split('\n').filter(line => 
        !line.includes('可能存在的挑战')
      )
      description.challenges = cleanText(lines.join(' '))
    } else if (section.includes('改善建议')) {
      const lines = section.split('\n').filter(line => 
        !line.includes('改善建议')
      )
      description.suggestions = cleanText(lines.join(' '))
    } else if (section.includes('总结：')) {
      description.summary = cleanText(section.replace('总结：', ''))
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analysis-section {
  margin-bottom: 0;
}

:deep(.el-card) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

:deep(.el-card__body) {
  padding: 20px;
}

.analysis-section h4 {
  color: #409EFF;
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
}

.analysis-section p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0.5rem 0;
  text-align: justify;
}

.analysis-section div + div {
  margin-top: 1.5rem;
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

  .match-analysis {
    padding: 0.5rem;
    gap: 1rem;
  }

  :deep(.el-card__header) {
    padding: 12px 15px;
  }

  :deep(.el-card__body) {
    padding: 15px;
  }

  .card-header h3 {
    font-size: 1.1rem;
  }
}
</style> 