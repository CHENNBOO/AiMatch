<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    center
    class="personality-settings-dialog"
  >
    <template #header>
      <div class="flex items-center justify-center w-full pb-2">
        <h3 class="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          温馨提示
        </h3>
      </div>
    </template>
    
    <div class="py-6 px-4">
      <div class="flex items-center justify-center space-x-4 mb-6">
        <el-icon class="text-4xl text-blue-500"><InfoFilled /></el-icon>
        <span class="text-lg text-black dark:text-white">您还未设置性格类型，建议先进行性格设置</span>
      </div>
      
      <div class="text-sm text-black/60 dark:text-white/60 text-center">
        设置性格类型后，您可以探索更多个性化的互动场景
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center space-x-4 pt-2">
        <el-button
          class="w-32 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 !text-black dark:!text-white border-none"
          @click="$emit('update:modelValue', false)"
        >
          稍后设置
        </el-button>
        <el-button
          type="primary"
          class="w-32 !bg-gradient-to-r from-blue-500 to-purple-500 hover:!opacity-90 border-none"
          @click="goToPersonalitySettings"
        >
          立即设置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()

const goToPersonalitySettings = () => {
  router.push('/personality')
}
</script>

<style>
.personality-settings-dialog {
  @apply backdrop-blur-xl;
}

.personality-settings-dialog .el-dialog {
  @apply !bg-white/90 dark:!bg-gray-800/90 !rounded-2xl !shadow-xl !max-w-lg !w-full;
}

.personality-settings-dialog .el-dialog__header {
  @apply !mb-0 !pb-0 !border-b !border-gray-200 dark:!border-gray-700;
}

.personality-settings-dialog .el-dialog__footer {
  @apply !border-t !border-gray-200 dark:!border-gray-700;
}

.personality-settings-dialog .el-button {
  @apply !rounded-xl !h-11 !text-base !font-medium !transition-all !duration-300;
}
</style> 