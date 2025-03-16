export const API_CONFIG = {
  // 网关基础地址
  BASE_URL: 'http://localhost:9000',
  
  // 服务别名
  SERVICES: {
    UAA: '/uaa',
    BUSINESS: '/business'
  }
} as const

// API路径配置
export const API_PATHS = {
  // UAA服务接口
  UAA: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    UPDATE_PASSWORD: '/api/users/password'
  },
  
  // 业务服务接口
  BUSINESS: {
    // 在这里添加业务服务的接口路径
  }
} as const 