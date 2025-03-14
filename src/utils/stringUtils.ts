// 工具函数：去除字符串中的```json和```标记
export const removeJsonMarkers = (str: string) => {
    return str
      .replace(/^```json\s*/, '') // 移除开头的```json
      .replace(/```\s*$/, '') // 移除结尾的```
      .trim(); // 移除首尾空白字符
  }

// 工具函数：去除字符串中的特殊符号（换行符、横杠、星号等）
export const removeSpecialCharacters = (str: string) => {
  return str
    .replace(/[\n\r]+/g, ' ') // 将换行符替换为空格
    .replace(/[-*]+/g, '') // 移除横杠和星号
    .replace(/\s+/g, ' ') // 将多个空格合并为一个
    .trim(); // 移除首尾空白字符
}

// 工具函数：去除所有特殊字符（包括标点符号）
export const removeAllSpecialCharacters = (str: string) => {
  return str
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 只保留字母、数字、下划线、空格和中文字符
    .replace(/\s+/g, ' ') // 将多个空格合并为一个
    .trim(); // 移除首尾空白字符
}

// 工具函数：去除Markdown格式
export const removeMarkdown = (str: string) => {
  return str
    .replace(/#{1,6}\s?/g, '') // 移除标题
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
    .replace(/(\*|_)(.*?)\1/g, '$2') // 移除斜体
    .replace(/~~(.*?)~~/g, '$1') // 移除删除线
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // 移除代码块
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留链接文字
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // 移除图片，保留alt文字
    .replace(/^\s*[-+*]\s+/gm, '') // 移除无序列表标记
    .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
    .replace(/\n{2,}/g, '\n') // 将多个换行符合并为一个
    .trim(); // 移除首尾空白字符
}