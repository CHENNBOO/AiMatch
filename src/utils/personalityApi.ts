import { API_CONFIG, API_PATHS } from '../config/api.config'
import { get, post } from './request'

// 接口返回类型定义
export interface PersonalityMatch {
  id: number
  userId: number
  personalityText1: string
  personalityText2: string
  matchScore: number | null
  matchDescription: string | null
  createdAt: string
  updatedAt: string
}

export interface VirtualInteractionResponse {
  reply: string
}

export interface PersonalityAnalysisResponse {
  matchPercentage: number
  analysis: string
}

export interface PersonalityTypesResponse {
  [key: string]: string
}

// 请求参数类型定义
export interface InitialMatchRequest {
  userId: number
  personalityText1: string
  personalityText2: string
}

export interface VirtualInteractionRequest {
  message: string
  personality: string
}

export interface PersonalityAnalysisRequest {
  personality1: string
  personality2: string
}

// API请求函数
export const personalityApi = {
  // 创建初始性格匹配
  createInitialMatch: (data: InitialMatchRequest): Promise<PersonalityMatch> => {
    return post<PersonalityMatch>(
      API_CONFIG.SERVICES.BUSINESS,
      API_PATHS.BUSINESS.PERSONALITY_MATCH.INITIAL,
      data
    )
  },

  // 获取性格匹配分析结果
  getMatchResult: (userId: number): Promise<PersonalityMatch> => {
    return get<PersonalityMatch>(
      API_CONFIG.SERVICES.BUSINESS,
      API_PATHS.BUSINESS.PERSONALITY_MATCH.RESULT,
      { userId }
    )
  },

  // 虚拟互动
  virtualInteraction: (data: VirtualInteractionRequest): Promise<VirtualInteractionResponse> => {
    return post<VirtualInteractionResponse>(
      API_CONFIG.SERVICES.BUSINESS,
      API_PATHS.BUSINESS.VIRTUAL_INTERACTION,
      data
    )
  },

  // 分析性格匹配
  analyzePersonality: (data: PersonalityAnalysisRequest): Promise<PersonalityAnalysisResponse> => {
    return post<PersonalityAnalysisResponse>(
      API_CONFIG.SERVICES.BUSINESS,
      API_PATHS.BUSINESS.PERSONALITY_MATCH.ANALYSIS,
      data
    )
  },

  // 获取用户的性格类型
  getPersonalityTypes: (userId: number): Promise<PersonalityTypesResponse> => {
    return get<PersonalityTypesResponse>(
      API_CONFIG.SERVICES.BUSINESS,
      API_PATHS.BUSINESS.PERSONALITY_MATCH.PERSONALITY_TYPES,
      { userId }
    )
  }
} 