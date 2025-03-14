// 违禁词配置
export const forbiddenWords = {
  // 色情相关
  pornWords: [
    '色情', '性', '做爱', '性交', '性行为', '性关系', '性骚扰',
    'porn', 'sex', 'xxx', 'adult', 'nude', 'naked', 'erotic',
    '裸', '脱', '上床', '开房', '约炮', '一夜情',
    // 新增20个色情相关违禁词
    '情色', '性爱', '性欲', '性器官', '性病', '性传播', '性虐待',
    '性骚扰', '性侵犯', '性暴力', '性交易', '性服务', '性工作者',
    '性玩具', '性用品', '性教育', '性健康', '性心理', '性取向',
    '性功能障碍', '性冷淡'
  ],

  // 政治相关
  politicalWords: [
    '政治', '政党', '政府', '国家', '领导人', '主席', '总理',
    'politics', 'government', 'party', 'leader', 'president',
    '党', '国', '政', '军', '警', '法', '宪','共产党','习近平',
    // 新增20个政治相关违禁词
    '中央', '国务院', '人大', '政协', '纪委', '政法委', '统战部',
    '宣传部', '组织部', '外交部', '国防部', '公安部', '司法部',
    '财政部', '发改委', '教育部', '科技部', '工信部', '民政部',
    '人社部', '自然资源部'
  ],

  // 代码相关
  codeWords: [
    '代码', '编程', '写代码', 'debug', 'bug', 'programming',
    '开发', '程序员', '工程师', '技术', '算法', '框架',
    'code', 'program', 'developer', 'engineer', 'algorithm',
    // 新增20个代码相关违禁词
    '前端', '后端', '全栈', '数据库', '服务器', 'API', '接口',
    '函数', '变量', '类', '对象', '方法', '属性', '继承',
    '封装', '多态', '模块', '组件', '库', '框架', '工具',
    'IDE', '编辑器', '编译器', '解释器', '测试', '部署'
  ],

  // 其他敏感词
  sensitiveWords: [
    '自杀', '自残', '暴力', '恐怖', '犯罪', '毒品', '赌博',
    'suicide', 'violence', 'terror', 'crime', 'drug', 'gambling',
    '死', '杀', '打', '抢', '偷', '骗', '赌'
  ]
}

// 检查文本是否包含违禁词
export const checkForbiddenWords = (text: string): boolean => {
  const allForbiddenWords = [
    ...forbiddenWords.pornWords,
    ...forbiddenWords.politicalWords,
    ...forbiddenWords.codeWords,
    ...forbiddenWords.sensitiveWords
  ]

  return allForbiddenWords.some(word => text.toLowerCase().includes(word.toLowerCase()))
}

// 获取违禁词类型
export const getForbiddenWordType = (text: string): string[] => {
  const types: string[] = []
  
  if (forbiddenWords.pornWords.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
    types.push('色情')
  }
  if (forbiddenWords.politicalWords.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
    types.push('政治')
  }
  if (forbiddenWords.codeWords.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
    types.push('代码')
  }
  if (forbiddenWords.sensitiveWords.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
    types.push('敏感')
  }

  return types
} 