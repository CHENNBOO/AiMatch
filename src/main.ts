import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'animate.css'
import './style.css'
import router from './router'
import App from './App.vue'
import axios from 'axios';
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置axios默认URL
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

app.use(ElementPlus)
app.use(router)
app.mount('#app') 