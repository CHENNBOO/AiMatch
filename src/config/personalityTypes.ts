export const typeTranslations: Record<string, string> = {
  'BUDDHA_LIKE': '佛系人格',
  'WORKING_HARD': '卷王',
  'LAID_BACK': '躺平型',
  'SOCIAL_BUTTERFLY': '社交牛逼症',
  'INTROVERT_EXPERT': '社恐达人',
  'DRAMA_QUEEN': '戏精本精',
  'CONTRARIAN': '反骨仔',
  'KNOWLEDGE_KING': '知识带师',
  'POSITIVE_ENERGY': '正能量满满',
  'DETAIL_ORIENTED': '细节控',
  'PROCRASTINATOR': '拖延症患者',
  'SUPER_HOMO': '超雄人格'
}

// 转换函数
export const translatePersonalityType = (type: string): string => {
  return typeTranslations[type] || type
} 