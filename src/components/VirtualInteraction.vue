<template>
  <div class="virtual-interaction">
    <div class="setup-section">
      <el-form :model="form" label-width="120px">
        <el-form-item label="你的MBTI类型">
          <el-select v-model="form.selfProfile.mbtiType" placeholder="请选择你的MBTI类型">
            <el-option
              v-for="type in mbtiTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="对方的类型">
          <el-select v-model="form.partnerProfile.mbtiType" placeholder="请选择对方的类型">
            <el-option-group label="MBTI类型">
              <el-option
                v-for="type in mbtiTypes"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-option-group>
            <el-option-group label="特殊人格">
              <el-option
                v-for="type in specialPersonalities"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="互动场景">
          <el-select v-model="form.selectedScenario" placeholder="请选择互动场景">
            <el-option
              v-for="(scenario, key) in scenarios"
              :key="key"
              :label="scenario.title"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="!isReady" class="setup-prompt">
      <el-empty description="请完成以上设置">
        <template #description>
          <div class="setup-items">
            <div class="setup-item" :class="{ 'is-done': form.selfProfile.mbtiType }">
              1. 选择你的MBTI类型
            </div>
            <div class="setup-item" :class="{ 'is-done': form.partnerProfile.mbtiType }">
              2. 选择对方的MBTI类型
            </div>
            <div class="setup-item" :class="{ 'is-done': form.selectedScenario }">
              3. 选择互动场景
            </div>
          </div>
        </template>
      </el-empty>
    </div>

    <div v-else>
      <div class="chat-container" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.isUser ? 'user' : 'ai']">
          {{ msg.content }}
        </div>
        <div v-if="isLoading" class="message ai loading">
          <span>正在输入</span>
          <span class="dots">...</span>
        </div>
      </div>
      
      <div class="input-container">
        <el-input
          v-model="userMessage"
          type="textarea"
          :rows="3"
          placeholder="输入你想说的话..."
          :disabled="isLoading"
          @keyup.enter.ctrl="sendMessage"
        />
        <div class="button-container">
          <el-button type="primary" @click="sendMessage" :loading="isLoading">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface Message {
  content: string
  isUser: boolean
}

interface Profile {
  mbtiType: string
  traits: string[]
  interests: string[]
}

interface Scenario {
  title: string
  focus: string[]
}

const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
]

const specialPersonalities = [
  '超雄人格',
  '贴吧老哥人格',
  '反社会人格'
]

const scenarios: Record<string, Scenario> = {
  work: {
    title: '工作交流',
    focus: ['团队协作', '任务分配', '会议沟通', '反馈传达']
  },
  relationship: {
    title: '人际关系',
    focus: ['建立联系', '维护关系', '表达需求', '共情理解']
  },
  conflict: {
    title: '冲突处理',
    focus: ['矛盾化解', '立场调和', '情绪管理', '解决方案']
  },
  emotion: {
    title: '情绪管理',
    focus: ['情绪觉察', '压力缓解', '自我调节', '积极表达']
  }
}

const messages = ref<Message[]>([])
const userMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const form = ref({
  selfProfile: {
    mbtiType: '',
    traits: [] as string[],
    interests: [] as string[]
  },
  partnerProfile: {
    mbtiType: '',
    traits: [] as string[],
    interests: [] as string[]
  },
  selectedScenario: ''
})

const isReady = computed(() => {
  return !!(form.value.selfProfile.mbtiType && 
    form.value.partnerProfile.mbtiType && 
    form.value.selectedScenario)
})

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      chatContainer.value!.scrollTop = chatContainer.value!.scrollHeight
    }, 100)
  }
}

const sendMessage = async () => {
  if (!isReady.value) {
    ElMessage.warning('请先完成所有设置')
    return
  }

  if (!userMessage.value.trim() || isLoading.value) return

  const message = userMessage.value.trim()
  messages.value.push({
    content: message,
    isUser: true
  })
  
  userMessage.value = ''
  scrollToBottom()

  isLoading.value = true
  try {
    const response = await axios.post('/api/virtual-interaction', {
      selfProfile: form.value.selfProfile,
      partnerProfile: form.value.partnerProfile,
      scenario: form.value.selectedScenario,
      message,
      isInitial: false
    })

    if (response.data.status === 'success') {
      messages.value.push({
        content: response.data.data,
        isUser: false
      })
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('生成回应时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const initializeChat = async () => {
  if (!isReady.value) return

  isLoading.value = true
  try {
    const response = await axios.post('/api/virtual-interaction', {
      selfProfile: form.value.selfProfile,
      partnerProfile: form.value.partnerProfile,
      scenario: form.value.selectedScenario,
      isInitial: true
    })

    if (response.data.status === 'success') {
      messages.value = [{
        content: response.data.data,
        isUser: false
      }]
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('初始化对话时出现错误，请重试')
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => isReady.value,
  (newVal) => {
    if (newVal) {
      messages.value = []
      initializeChat()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.virtual-interaction {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.setup-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.setup-prompt {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
}

.setup-items {
  margin-top: 20px;
  text-align: left;
}

.setup-item {
  margin: 10px 0;
  color: #909399;
  font-size: 14px;
}

.setup-item.is-done {
  color: #67c23a;
}

.setup-item.is-done::before {
  content: '✓';
  margin-right: 5px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  margin-bottom: 20px;
  max-height: 600px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.message {
  margin: 16px 0;
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 85%;
  word-break: break-word;
  position: relative;
  line-height: 1.5;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.message.user {
  background: linear-gradient(135deg, #409eff, #3a8ee6);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.user::before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  background: #3a8ee6;
  border-radius: 50% 50% 0 50%;
  transform: translate(50%, 50%);
}

.message.ai {
  background: white;
  color: #333;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message.ai::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50% 50% 50% 0;
  transform: translate(-50%, 50%);
}

.loading {
  background: #f0f2f5;
  box-shadow: none;
}

.loading::before {
  display: none;
}

.dots {
  display: inline-block;
  animation: dots 1.5s infinite;
  color: #909399;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.input-container {
  margin-top: auto;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.message {
  white-space: pre-wrap;
}

/* 添加滚动条样式 */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 