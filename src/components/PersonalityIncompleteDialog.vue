<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    center
    class="personality-incomplete-dialog"
  >
    <template #header>
      <div class="flex items-center justify-center w-full pb-2">
        <h3 class="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          提示
        </h3>
      </div>
    </template>
    
    <div class="py-6 px-4">
      <el-carousel height="400px" class="mb-6 w-full">
        <el-carousel-item>
          <img src="../../img/3.png" alt="性格类型图片1" class="w-full h-full object-contain">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../img/5.png" alt="性格类型图片2" class="w-full h-full object-contain">
        </el-carousel-item>
      </el-carousel>

      <div class="flex items-center justify-center space-x-4 mb-6">
        <el-icon class="text-4xl text-blue-500"><Warning /></el-icon>
        <span class="text-lg text-black dark:text-white">请先完成双方的性格类型设置</span>
      </div>
      
      <div class="text-sm text-black/60 dark:text-white/60 text-center">
        完成性格类型设置后，即可开启互动场景
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

<style>
.personality-incomplete-dialog {
  @apply backdrop-blur-xl;
}

.personality-incomplete-dialog .el-dialog {
  @apply !bg-white/90 dark:!bg-gray-800/90 !rounded-2xl !shadow-xl !max-w-lg !w-full;
}

.personality-incomplete-dialog .el-dialog__header {
  @apply !mb-0 !pb-0 !border-b !border-gray-200 dark:!border-gray-700;
}

.personality-incomplete-dialog .el-dialog__footer {
  @apply !border-t !border-gray-200 dark:!border-gray-700;
}

.personality-incomplete-dialog .el-button {
  @apply !rounded-xl !h-11 !text-base !font-medium !transition-all !duration-300;
}
</style> 