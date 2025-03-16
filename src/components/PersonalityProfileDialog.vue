<template>
  <el-dialog
    v-model="dialogVisible"
    title="性格档案"
    :width="'80%'"
    :destroy-on-close="true"
  >
    <div class="personality-profile-container bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <!-- 背景装饰 -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- 主要内容区 -->
      <div class="container mx-auto px-4 py-8 relative">
        <!-- 标题区 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-black dark:text-white mb-4">性格档案</h1>
          <p class="text-black/70 dark:text-white/70 text-lg">查看和管理您的性格特征信息</p>
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
                
                <span v-if="person1.customType" class="ml-2 text-blue-500">
                  {{ person1.customType }}
                  <el-icon class="ml-1 cursor-pointer hover:text-red-500" @click="clearCustomType(1)"><Delete /></el-icon>
                </span>
              </h3>
              <div class="flex space-x-3">
                <el-input
                  v-model="customType1"
                  type="textarea"
                  :rows="3"
                  placeholder="输入性格类型..."
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
                
                <span v-if="person2.customType" class="ml-2 text-blue-500">
                  {{ person2.customType }}
                  <el-icon class="ml-1 cursor-pointer hover:text-red-500" @click="clearCustomType(2)"><Delete /></el-icon>
                </span>
              </h3>
              <div class="flex space-x-3">
                <el-input
                  v-model="customType2"
                  type="textarea"
                  :rows="3"
                  placeholder="输入性格类型..."
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

        <!-- 操作按钮 -->
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
            @click="saveProfile"
            class="flex items-center space-x-2 !bg-gradient-to-r from-blue-500 to-purple-500 hover:!opacity-90 border-none !text-white px-8 py-2 text-base !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="large"
          >
            <el-icon class="text-lg"><Check /></el-icon>
            <span class="text-base">保存更改</span>
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Refresh, Delete } from '@element-plus/icons-vue'
import { typeTranslations } from '../config/personalityTypes'
import { personalityApi } from '../utils/personalityApi'
import type { PersonalityMatch } from '../utils/personalityApi'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 添加activeArea状态
const activeArea = ref<'left' | 'right' | null>(null)

// 性格类型数据
interface PersonType {
  otherTypes: string[]
  customType?: string
}

const person1 = ref<PersonType>({
  otherTypes: [],
  customType: ''
})

const person2 = ref<PersonType>({
  otherTypes: [],
  customType: ''
})

const customType1 = ref('')
const customType2 = ref('')

const isFirstPersonComplete = computed(() => {
  return person1.value.otherTypes.length > 0 || person1.value.customType
})

const isSecondPersonComplete = computed(() => {
  return person2.value.otherTypes.length > 0 || person2.value.customType
})

// 其他类型选项
const otherTypes = Object.entries(typeTranslations).map(([id, name]) => ({
  id,
  name
}))

// 方法
const toggleOtherType = (personNum: number, typeId: string) => {
  const person = personNum === 1 ? person1 : person2
  const customType = personNum === 1 ? customType1 : customType2
  const typeName = typeTranslations[typeId]
  
  // 如果已经包含这个类型ID，则移除
  const index = person.value.otherTypes.indexOf(typeId)
  if (index === -1) {
    // 添加类型ID到数组
    person.value.otherTypes.push(typeId)
    // 追加类型名称到输入框，使用顿号分隔
    const currentValue = customType.value.trim()
    customType.value = currentValue 
      ? `${currentValue}、${typeName}`
      : typeName
  } else {
    // 从数组中移除类型ID
    person.value.otherTypes.splice(index, 1)
    // 从输入框中移除对应的类型名称
    const types = customType.value.split('、')
    const typeIndex = types.indexOf(typeName)
    if (typeIndex !== -1) {
      types.splice(typeIndex, 1)
      customType.value = types.join('、')
    }
  }
}

const applyCustomType = (personNum: number) => {
  const customType = personNum === 1 ? customType1 : customType2
  const person = personNum === 1 ? person1 : person2
  if (customType.value.trim()) {
    person.value.customType = customType.value.trim()
  }
}

const clearCustomType = (personNum: number) => {
  const person = personNum === 1 ? person1 : person2
  const customType = personNum === 1 ? customType1 : customType2
  person.value.customType = ''
  customType.value = ''
  person.value.otherTypes = []
}

const resetSelection = async () => {
  try {
    // 从localStorage获取用户ID
    const userId = localStorage.getItem('userId')
    if (!userId) {
      ElMessage.error('未找到用户信息，请重新登录')
      return
    }

    // 调用API保存空的性格匹配数据
    await personalityApi.createInitialMatch({
      userId: Number(userId),
      personalityText1: '',
      personalityText2: ''
    })

    // 重置本地数据
    person1.value.customType = ''
    person2.value.customType = ''
    customType1.value = ''
    customType2.value = ''
    person1.value.otherTypes = []
    person2.value.otherTypes = []

    // 清除localStorage中的数据
    localStorage.removeItem('personalityText1')
    localStorage.removeItem('personalityText2')

    ElMessage.success('性格档案已重置')
  } catch (error) {
    console.error('重置失败:', error)
    ElMessage.error('重置失败，请重试')
  }
}

// 添加加载数据的方法
const loadProfileData = async () => {
  try {
    // 从localStorage获取用户ID
    const userId = localStorage.getItem('userId')
    if (!userId) {
      ElMessage.error('未找到用户信息，请重新登录')
      return
    }

    // 获取性格匹配数据
    const response = await personalityApi.getMatchResult(Number(userId))
    
    // 优先使用API返回的数据
    customType1.value = response.personalityText1 || localStorage.getItem('personalityText1') || ''
    customType2.value = response.personalityText2 || localStorage.getItem('personalityText2') || ''
    
    // 设置person对象的值
    person1.value.customType = customType1.value
    person2.value.customType = customType2.value

  } catch (error) {
    console.error('获取性格匹配数据失败:', error)
    ElMessage.error('获取性格匹配数据失败')
    
    // API请求失败时，从localStorage读取数据
    customType1.value = localStorage.getItem('personalityText1') || ''
    customType2.value = localStorage.getItem('personalityText2') || ''
    person1.value.customType = customType1.value
    person2.value.customType = customType2.value
  }
}

// 监听对话框显示状态
watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    await loadProfileData()
  }
}, { immediate: false })

// 修改保存方法，同时保存到API和本地存储
const saveProfile = async () => {
  try {
    // 从localStorage获取用户ID
    const userId = localStorage.getItem('userId')
    if (!userId) {
      ElMessage.error('未找到用户信息，请重新登录')
      return
    }

    // 调用API保存性格匹配数据
    await personalityApi.createInitialMatch({
      userId: Number(userId),
      personalityText1: customType1.value,
      personalityText2: customType2.value
    })

    // 将性格文本保存到 localStorage
    localStorage.setItem('personalityText1', customType1.value)
    localStorage.setItem('personalityText2', customType2.value)

    ElMessage.success('性格档案保存成功')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}
</script>

<style scoped>
.personality-profile-container {
  min-height: 60vh;
  position: relative;
}
</style> 