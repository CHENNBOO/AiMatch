<template>
  <div class="app-container">
    <!-- 左侧菜单 -->
    <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="logo">
        <h2>{{ isCollapsed ? 'Ai' : 'AiMatch' }}</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapsed"
        @select="handleSelect"
        :router="true">
        <el-menu-item index="/">
          <el-icon><UserFilled /></el-icon>
          <template #title>MBTI匹配</template>
        </el-menu-item>
        <el-menu-item index="/event-planner">
          <el-icon><Calendar /></el-icon>
          <template #title>事件策划Agent</template>
        </el-menu-item>
        <el-menu-item index="/mental-health">
          <el-icon><Monitor /></el-icon>
          <span>心理健康</span>
        </el-menu-item>
        <el-menu-item index="/communication-guide">
          <el-icon><ChatDotRound /></el-icon>
          <span>沟通指导</span>
        </el-menu-item>
        <el-menu-item index="/virtual-interaction">
          <el-icon><Avatar /></el-icon>
          <span>虚拟互动</span>
        </el-menu-item>
        
        <el-sub-menu index="agent">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>Agent</span>
          </template>
          <el-menu-item index="/event-planner">
            <el-icon><Calendar /></el-icon>
            <span>活动策划</span>
          </el-menu-item>
          <el-menu-item index="/mental-health">
            <el-icon><Monitor /></el-icon>
            <span>心理健康</span>
          </el-menu-item>
          <el-menu-item index="/communication-guide">
            <el-icon><ChatDotRound /></el-icon>
            <span>沟通指导</span>
          </el-menu-item>
          <el-menu-item index="/virtual-interaction">
            <el-icon><Avatar /></el-icon>
            <span>虚拟互动</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/coming-soon" disabled>
          <el-icon><More /></el-icon>
          <template #title>更多内容敬请期待...</template>
        </el-menu-item>
      </el-menu>
      <!-- 折叠按钮 -->
      <div class="collapse-button" @click="toggleCollapse">
        <el-icon>
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserFilled, Calendar, Monitor, More, Expand, Fold, ChatDotRound, Avatar } from '@element-plus/icons-vue'
import { UserFilled, Calendar, Monitor, More, Expand, Fold, ChatDotRound, Avatar } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const activeMenu = ref('/mbti')

const handleSelect = (path: string) => {
  router.push(path)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 监听路由变化，更新菜单选中状态
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  transition: width 0.3s;
  position: relative;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e6e6e6;
}

.logo h2 {
  margin: 0;
  color: #409EFF;
  font-size: 24px;
  transition: font-size 0.3s;
}

.sidebar.collapsed .logo h2 {
  font-size: 20px;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
}

:deep(.el-menu-item) {
  margin: 8px 14px;
  border-radius: 8px;
  height: 50px !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409EFF !important;
  box-shadow: 0 2px 8px rgba(64,158,255,0.2);
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-menu-item.is-active:hover) {
  background-color: #ecf5ff !important;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 12px;
}

.collapse-button {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
  border-top: 1px solid #e6e6e6;
  transition: all 0.3s;
}

.collapse-button:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
  padding: 20px;
  margin-left: 50px;
  transition: margin-left 0.3s;
}

.sidebar.collapsed + .main-content {
  margin-left: 50px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 