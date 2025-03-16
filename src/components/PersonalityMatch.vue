<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <PersonalityIncompleteDialog v-model="showIncompleteDialog" />
    <!-- 背景装饰 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- 主要内容区 -->
    <div class="container mx-auto px-4 py-8 relative">
      

      <!-- 标题区 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-4">性格匹配</h1>
        <p class="text-black/70 dark:text-white/70 text-lg">选择双方性格类型，点击设置完成按钮，即可开启互动场景</p>
      </div>

      <!-- 选择区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- 左侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
             :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': activeArea === 'left'}"
             @mouseenter="activeArea = 'left'"
             @mouseleave="activeArea = null">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-black dark:text-white">您的性格类型</h2>
            <el-tag v-if="isFirstPersonComplete" type="success" effect="light" class="ml-2">已完成</el-tag>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-black/70 dark:text-white/70 mb-4">
              DIY类型
              <span v-if="person1.customType" class="ml-2 text-blue-500">
                {{ person1.customType }}
                <el-icon class="ml-1 cursor-pointer hover:text-red-500" @click="clearCustomType(1)"><Delete /></el-icon>
              </span>
            </h3>
            <div class="flex space-x-3">
              <el-input
                v-model="customType1"
                placeholder="输入自定义类型..."
                class="!bg-white/60 dark:!bg-gray-700/60 !rounded-xl"
                @keyup.enter="applyCustomType(1)"
              >
                <template #append>
                  <el-button @click="applyCustomType(1)">确定</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-black/70 dark:text-white/70 mb-4">其他类型</h3>
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="type in otherTypes" 
                :key="type.id"
                @click="toggleOtherType(1, type.id)"
                :class="[
                  'p-2 rounded-lg transition-all duration-200',
                  person1.otherTypes.includes(type.id)
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white'
                ]"
              >
                <div class="text-sm font-medium">{{ type.name }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧选择区 -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
             :class="{'ring-2 ring-blue-500 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-800': activeArea === 'right'}"
             @mouseenter="activeArea = 'right'"
             @mouseleave="activeArea = null">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-black dark:text-white">对方的性格类型</h2>
            <el-tag v-if="isSecondPersonComplete" type="success" effect="light" class="ml-2">已完成</el-tag>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-black/70 dark:text-white/70 mb-4">
              DIY类型
              <span v-if="person2.customType" class="ml-2 text-blue-500">
                {{ person2.customType }}
                <el-icon class="ml-1 cursor-pointer hover:text-red-500" @click="clearCustomType(2)"><Delete /></el-icon>
              </span>
            </h3>
            <div class="flex space-x-3">
              <el-input
                v-model="customType2"
                placeholder="输入自定义类型..."
                class="!bg-white/60 dark:!bg-gray-700/60 !rounded-xl"
                @keyup.enter="applyCustomType(2)"
              >
                <template #append>
                  <el-button @click="applyCustomType(2)">确定</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-black/70 dark:text-white/70 mb-4">其他类型</h3>
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="type in otherTypes" 
                :key="type.id"
                @click="toggleOtherType(2, type.id)"
                :class="[
                  'p-2 rounded-lg transition-all duration-200',
                  person2.otherTypes.includes(type.id)
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white'
                ]"
              >
                <div class="text-sm font-medium">{{ type.name }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置完成按钮 -->
      <div class="flex justify-center mt-4 space-x-4">
        <el-button
          @click="resetSelection"
          class="flex items-center space-x-2 !bg-gray-500 hover:!bg-gray-600 border-none !text-white px-8 py-2 text-base !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          size="large"
        >
          <el-icon class="text-lg"><Refresh /></el-icon>
          <span class="text-base">重置性格</span>
        </el-button>

        <el-button
          @click="saveAndRedirect"
          class="flex items-center space-x-2 !bg-gradient-to-r from-blue-500 to-purple-500 hover:!opacity-90 border-none !text-white px-8 py-2 text-base !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          :disabled="!isFirstPersonComplete || !isSecondPersonComplete"
          size="large"
        >
          <el-icon class="text-lg"><Check /></el-icon>
          <span class="text-base">设置完成</span>
        </el-button>
      </div>

      <!-- 结果展示区 -->
      <div v-if="showResult" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-black dark:text-white">匹配分析报告</h2>
            <el-button circle @click="closeResult">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <div class="p-8">
            <!-- 结果头部 -->
            <div class="text-center mb-8">
              <div class="flex items-center justify-center space-x-8">
                <div class="text-center">
                  <div class="text-sm text-black/70 dark:text-white/70 mb-2">您的类型</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person1) }}</div>
                  <div class="mt-2 text-sm text-black/50 dark:text-white/50">{{ getTypeDescription(person1) }}</div>
                </div>
                <div class="relative">
                  <el-progress
                    type="dashboard"
                    :percentage="matchPercentage"
                    :stroke-width="12"
                    :width="180"
                    :format="(percentage: number) => `${percentage}%`"
                    class="animate__animated animate__zoomIn"
                  />
                  <div class="mt-2 text-sm text-black/70 dark:text-white/70">匹配度</div>
                </div>
                <div class="text-center">
                  <div class="text-sm text-black/70 dark:text-white/70 mb-2">对方类型</div>
                  <div class="text-2xl font-bold text-blue-500">{{ getFullType(person2) }}</div>
                  <div class="mt-2 text-sm text-black/50 dark:text-white/50">{{ getTypeDescription(person2) }}</div>
                </div>
              </div>
            </div>

            <!-- 分析内容 -->
            <div class="space-y-6">
              <div v-if="parsedDescription.overall" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><InfoFilled /></el-icon>
                  总体评价
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.overall }}</p>
              </div>

              <div v-if="parsedDescription.communication" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-1s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><ChatDotRound /></el-icon>
                  沟通方式
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.communication }}</p>
              </div>

              <div v-if="parsedDescription.values" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-2s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Connection /></el-icon>
                  共同价值观
                </h3>
                <p class="text-black/70 dark:text-white/70 leading-relaxed">{{ parsedDescription.values }}</p>
              </div>

              <div v-if="parsedDescription.challenges?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-3s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Warning /></el-icon>
                  可能存在的挑战
                </h3>
                <ul class="space-y-3">
                  <li v-for="(challenge, index) in parsedDescription.challenges" :key="index"
                    class="flex items-start text-black/70 dark:text-white/70">
                    <span class="text-blue-500 mr-2">•</span>
                    {{ challenge }}
                  </li>
                </ul>
              </div>

              <div v-if="parsedDescription.suggestions?.length" class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 animate__animated animate__fadeIn animate__delay-4s">
                <h3 class="text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
                  <el-icon class="mr-2"><Sunny /></el-icon>
                  改善建议
                </h3>
                <ul class="space-y-3">
                  <li v-for="(suggestion, index) in parsedDescription.suggestions" :key="index"
                    class="flex items-start text-black/70 dark:text-white/70">
                    <span class="text-blue-500 mr-2">{{ index + 1 }}.</span>
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-center space-x-4 mt-8">
              <el-button type="primary" @click="resetSelection">
                重新匹配
              </el-button>
              <el-button @click="exportReport">
                导出报告
              </el-button>
              <el-button @click="shareResult">
                分享结果
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能选择弹框 -->
      <div v-if="showFunctionDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate__animated animate__fadeIn">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[70vh] overflow-y-auto animate__animated animate__fadeIn">
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">选择功能</h2>
            <el-button circle @click="closeFunctionDialog" class="hover:bg-gray-100 dark:hover:bg-gray-700 !w-8 !h-8">
              <el-icon class="!text-lg"><Close /></el-icon>
            </el-button>
          </div>
          
          <div class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate__animated animate__fadeInUp">
              <!-- MBTI匹配 -->
              <router-link to="/mbti" 
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
                <div class="relative">
                  <el-icon class="text-4xl mb-4 text-black dark:text-white"><UserFilled /></el-icon>
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">MBTI匹配</h3>
                  <p class="text-black/70 dark:text-white/70">探索性格类型的完美匹配</p>
                </div>
              </router-link>

              <!-- 虚拟互动 -->
              <router-link to="/virtual-interaction"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300"></div>
                <div class="relative">
                  <el-icon class="text-4xl mb-4 text-black dark:text-white"><Avatar /></el-icon>
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">虚拟互动</h3>
                  <p class="text-black/70 dark:text-white/70">智能虚拟伙伴陪伴交流</p>
                </div>
              </router-link>

              <!-- 活动策划 -->
              <router-link to="/event-planner"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 rounded-2xl transition-all duration-300"></div>
                <div class="relative">
                  <el-icon class="text-4xl mb-4 text-black dark:text-white"><Calendar /></el-icon>
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">活动策划</h3>
                  <p class="text-black/70 dark:text-white/70">基于性格特征的个性化活动方案</p>
                </div>
              </router-link>

              <!-- 心理健康 -->
              <router-link to="/mental-health"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
                <div class="relative">
                  <el-icon class="text-4xl mb-4 text-black dark:text-white"><Sunny /></el-icon>
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">心理健康</h3>
                  <p class="text-black/70 dark:text-white/70">专业的心理健康评估与建议</p>
                </div>
              </router-link>

              <!-- 沟通指导 -->
              <router-link to="/communication-guide"
                class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div class="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 rounded-2xl transition-all duration-300"></div>
                <div class="relative">
                  <el-icon class="text-4xl mb-4 text-black dark:text-white"><ChatDotRound /></el-icon>
                  <h3 class="text-2xl font-semibold text-black dark:text-white mb-3">沟通指导</h3>
                  <p class="text-black/70 dark:text-white/70">提升沟通技巧的智能助手</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { 
  InfoFilled, 
  ChatDotRound, 
  Connection, 
  Warning, 
  Sunny, 
  Back,
  Close,
  Plus,
  Delete,
  UserFilled,
  Avatar,
  Calendar,
  Check,
  Refresh
} from '@element-plus/icons-vue'
import 'animate.css'
import PersonalityIncompleteDialog from './PersonalityIncompleteDialog.vue'
import { useRouter } from 'vue-router'
import { typeTranslations } from '../config/personalityTypes'
import { checkForbiddenWords, getForbiddenWordType } from '../config/forbiddenWords'
import { personalityApi } from '../utils/personalityApi'

// 类型定义
interface PersonType {
  otherTypes: string[]
  customType?: string
}

// 其他类型定义
const otherTypes = ref(
  Object.entries(typeTranslations).map(([id, name]) => ({
    id,
    name: `${name}`
  }))
)

// 定义 emit
const emit = defineEmits(['close'])

// 状态管理
const person1 = ref<PersonType>({
  otherTypes: [],
  customType: ''
})
const person2 = ref<PersonType>({
  otherTypes: [],
  customType: ''
})
const showResult = ref(false)
const matchPercentage = ref(0)
const parsedDescription = ref({
  overall: '',
  communication: '',
  values: '',
  challenges: [] as string[],
  suggestions: [] as string[]
})
const customType1 = ref('')
const customType2 = ref('')
const showFunctionDialog = ref(false)
const activeArea = ref<'left' | 'right' | null>(null)
const showIncompleteDialog = ref(false)

const router = useRouter()

// 计算属性
const isFirstPersonComplete = computed(() => {
  return person1.value.customType || person1.value.otherTypes.length > 0
})

const isSecondPersonComplete = computed(() => {
  return person2.value.customType || person2.value.otherTypes.length > 0
})

// 方法定义
const toggleOtherType = (person: number, type: string) => {
  if (person === 1) {
    if (person1.value.otherTypes.includes(type)) {
      person1.value.otherTypes = person1.value.otherTypes.filter(t => t !== type)
    } else {
      person1.value.otherTypes.push(type)
    }
  } else {
    if (person2.value.otherTypes.includes(type)) {
      person2.value.otherTypes = person2.value.otherTypes.filter(t => t !== type)
    } else {
      person2.value.otherTypes.push(type)
    }
  }
}

const getFullType = (person: PersonType) => {
  if (person.customType) {
    return person.customType
  }
  return person.otherTypes.map(type => typeTranslations[type]).join('、')
}

const getTypeDescription = (person: PersonType) => {
  return '点击了解更多'
}

const calculateMatch = () => {
  if (!checkPersonalityComplete()) return
  
  // 保存到localStorage
  localStorage.setItem('person1Type', JSON.stringify(person1.value))
  localStorage.setItem('person2Type', JSON.stringify(person2.value))
  
  showFunctionDialog.value = true
}

const resetSelection = async () => {
  try {
    // 获取用户ID
    const userId = Number(localStorage.getItem('userId')) || 1

    // 调用API保存空的性格匹配数据
    await personalityApi.createInitialMatch({
      userId,
      personalityText1: '',
      personalityText2: ''
    })

    // 重置状态
    person1.value = {
      otherTypes: [],
      customType: ''
    }
    person2.value = {
      otherTypes: [],
      customType: ''
    }
    showResult.value = false
    matchPercentage.value = 0
    parsedDescription.value = {
      overall: '',
      communication: '',
      values: '',
      challenges: [],
      suggestions: []
    }
    customType1.value = ''
    customType2.value = ''

    // 清空 localStorage 中的所有性格相关数据
    localStorage.removeItem('person1OtherTypes')
    localStorage.removeItem('person1CustomType')
    localStorage.removeItem('person2OtherTypes')
    localStorage.removeItem('person2CustomType')

    // 显示重置成功提示
    ElMessage.success('性格设置已重置')
  } catch (error) {
    console.error('重置性格匹配数据失败：', error)
    ElMessage.error('重置性格匹配数据失败，请重试')
  }
}

const closeResult = () => {
  showResult.value = false
}

const exportReport = () => {
  ElMessage.success('报告已导出')
}

const shareResult = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const applyCustomType = (person: number) => {
  const type = person === 1 ? customType1 : customType2
  if (type.value.trim()) {
    // 检查违禁词
    if (checkForbiddenWords(type.value.trim())) {
      const forbiddenTypes = getForbiddenWordType(type.value.trim())
      ElMessage.error(`输入内容包含违禁词：${forbiddenTypes.join('、')}，请重新输入`)
      return
    }

    if (person === 1) {
      person1.value = {
        otherTypes: [],
        customType: type.value.trim()
      }
      customType1.value = ''
    } else {
      person2.value = {
        otherTypes: [],
        customType: type.value.trim()
      }
      customType2.value = ''
    }
  }
}

const clearCustomType = (person: number) => {
  if (person === 1) {
    person1.value.customType = ''
  } else {
    person2.value.customType = ''
  }
}

const closeFunctionDialog = () => {
  showFunctionDialog.value = false
}

const checkPersonalityComplete = () => {
  if (!isFirstPersonComplete.value || !isSecondPersonComplete.value) {
    showIncompleteDialog.value = true
    return false
  }
  return true
}

// 保存并跳转函数
const saveAndRedirect = async () => {
  if (!isFirstPersonComplete.value || !isSecondPersonComplete.value) {
    showIncompleteDialog.value = true
    return
  }

  try {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录后再进行性格匹配')
      router.push('/login')
      return
    }

    // 获取用户ID
    const userId = Number(localStorage.getItem('userId'))
    if (!userId) {
      ElMessage.error('用户信息获取失败，请重新登录')
      router.push('/login')
      return
    }

    // 构建性格描述文本
    const getPersonalityText = (person: PersonType) => {
      if (person.customType) {
        return person.customType
      }
      return person.otherTypes.map(type => typeTranslations[type]).join('、')
    }

    const personalityText1 = getPersonalityText(person1.value)
    const personalityText2 = getPersonalityText(person2.value)

    // 调用API保存性格匹配数据
    await personalityApi.createInitialMatch({
      userId,
      personalityText1,
      personalityText2
    })

    // 保存第一个人的类型
    localStorage.setItem('person1OtherTypes', JSON.stringify(person1.value.otherTypes))
    if (person1.value.customType) {
      localStorage.setItem('person1CustomType', person1.value.customType)
    }

    // 保存第二个人的类型
    localStorage.setItem('person2OtherTypes', JSON.stringify(person2.value.otherTypes))
    if (person2.value.customType) {
      localStorage.setItem('person2CustomType', person2.value.customType)
    }

    ElMessage.success('性格匹配数据保存成功')
    
    // 触发关闭事件
    emit('close')
  } catch (error) {
    console.error('保存性格匹配数据失败：', error)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error('保存性格匹配数据失败，请重试')
    }
  }
}

// 初始化函数
const initializeFromLocalStorage = () => {
  // 读取第一个人的设置
  const person1OtherTypesStr = localStorage.getItem('person1OtherTypes')
  const person1CustomTypeStr = localStorage.getItem('person1CustomType')

  if (person1OtherTypesStr) {
    person1.value.otherTypes = JSON.parse(person1OtherTypesStr)
  }

  if (person1CustomTypeStr) {
    person1.value.customType = person1CustomTypeStr
    customType1.value = person1CustomTypeStr
  }

  // 读取第二个人的设置
  const person2OtherTypesStr = localStorage.getItem('person2OtherTypes')
  const person2CustomTypeStr = localStorage.getItem('person2CustomType')

  if (person2OtherTypesStr) {
    person2.value.otherTypes = JSON.parse(person2OtherTypesStr)
  }

  if (person2CustomTypeStr) {
    person2.value.customType = person2CustomTypeStr
    customType2.value = person2CustomTypeStr
  }
}

onMounted(() => {
  initializeFromLocalStorage()
})
</script>

<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 暗色模式滚动条 */
.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Element Plus 进度条样式覆盖 */
:deep(.el-progress-bar__outer) {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
}

:deep(.el-progress-bar__inner) {
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: width 0.6s ease;
}

:deep(.el-progress__text) {
  font-size: 1.5rem !important;
  font-weight: bold;
  color: #3b82f6;
}

/* Element Plus Steps 样式覆盖 */
:deep(.el-step__title) {
  @apply text-black/70 dark:text-white/70;
}

:deep(.el-step__description) {
  @apply text-black/50 dark:text-white/50;
}

:deep(.el-step__head.is-process) {
  @apply text-blue-500 border-blue-500;
}

:deep(.el-step__head.is-finish) {
  @apply text-green-500 border-green-500;
}

/* Element Plus 按钮样式覆盖 */
:deep(.el-button) {
  @apply !text-blue-500 hover:!text-white;
}

:deep(.el-button--primary) {
  @apply !text-blue-500 hover:!text-white;
}

:deep(.el-button--primary.is-disabled) {
  @apply !text-gray-400;
}

:deep(.el-button.is-disabled) {
  @apply !text-gray-400;
}

/* 动画过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>