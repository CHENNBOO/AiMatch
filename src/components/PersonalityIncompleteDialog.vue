<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    center
    class="personality-incomplete-dialog"
    width="400px"
  >
    <template #header>
      <div class="flex items-center justify-center w-full pb-2">
        <h3 class="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          提示
        </h3>
      </div>
    </template>
    
    <div class="py-6 px-4">
      <div class="flex flex-col items-center justify-center space-y-4 mb-6">
        <el-icon class="text-5xl text-blue-500"><Warning /></el-icon>
        <span class="text-lg text-black dark:text-white text-center">请先完善性格档案</span>
        <div class="text-sm text-black/60 dark:text-white/60 text-center">
          完善性格档案后，即可开启互动场景
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center space-x-4 pt-2">
        <el-button
          type="primary"
          class="w-32 !bg-gradient-to-r from-blue-500 to-purple-500 hover:!opacity-90 border-none"
          @click="$emit('update:modelValue', false)"
        >
          我知道了
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped>
.personality-incomplete-dialog {
  border-radius: 1rem;
  overflow: hidden;
}
</style> 