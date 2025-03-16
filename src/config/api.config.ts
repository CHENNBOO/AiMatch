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
    // 性格匹配相关接口
    PERSONALITY_MATCH: {
      INITIAL: '/api/personality-match/initial',
      RESULT: '/api/personality-match/result',
      ANALYSIS: '/api/personality/match',
      PERSONALITY_TYPES: '/api/personality-match/personality-types'
    },
    // 虚拟互动接口
    VIRTUAL_INTERACTION: '/api/virtual/interaction'
  }
} as const 