import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from '../config/api.config'
import { useRouter } from 'vue-router'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  withCredentials: true, // 允许跨域携带cookie
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    
    // 打印完整的请求信息
    console.log('Request:', {
      url: config.url ? (config.baseURL || '') + config.url : '',
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params
    })
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 打印完整的响应信息
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    })
    
    return response.data
  },
  (error) => {
    // 打印详细的错误信息
    console.error('Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response
      handleError(status, data.message)
    }
    return Promise.reject(error)
  }
)

// 错误处理函数
const handleError = (code: number, message: string) => {
  // 如果是401未授权，跳转到登录页
  if (code === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    const router = useRouter()
    router.push('/login')
  }
  
  // 显示错误消息
  console.error(message)
}

// 封装GET请求
export const get = <T>(servicePath: string, url: string, params?: any): Promise<T> => {
  return service.get<any, T>(servicePath + url, { params })
}

// 封装POST请求
export const post = <T>(servicePath: string, url: string, data?: any): Promise<T> => {
  return service.post<any, T>(servicePath + url, data)
}

// 封装PUT请求
export const put = <T>(servicePath: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return service.put<any, T>(servicePath + url, data, config)
}

// 封装DELETE请求
export const del = <T>(servicePath: string, url: string): Promise<T> => {
  return service.delete<any, T>(servicePath + url)
}

export default service 