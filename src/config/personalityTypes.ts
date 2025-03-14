export const typeTranslations: Record<string, string> = {
  'HSP': '高敏感人群',
  'GIFTED': '天赋异禀者',
  'EMPATH': '共情能力者',
  'HIGHLY_SENSITIVE': '高度敏感',
  'CREATIVE': '创造型人格',
  'ANALYTICAL': '分析型人格',
  'INTUITIVE': '直觉型人格',
}

// 转换函数
export const translatePersonalityType = (type: string): string => {
  return typeTranslations[type] || type
} 