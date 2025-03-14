// 工具函数：去除字符串中的```json和```标记
export const removeJsonMarkers = (str: string) => {
    return str
      .replace(/^```json\s*/, '') // 移除开头的```json
      .replace(/```\s*$/, '') // 移除结尾的```
      .trim(); // 移除首尾空白字符
  }