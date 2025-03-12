const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 验证环境变量
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('错误: 未设置 DEEPSEEK_API_KEY 环境变量');
  console.error('请复制 .env.example 到 .env 并设置你的 API 密钥');
  process.exit(1);
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 创建 axios 实例
const deepseekApi = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Accept': 'application/json'
  }
});

// 添加响应拦截器
deepseekApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
      
      if (error.response.status === 401) {
        console.error('API 密钥无效或已过期，请检查 .env 文件中的 DEEPSEEK_API_KEY 设置');
        throw new Error('API 密钥无效或已过期，请联系管理员');
      }
    } else if (error.code === 'ECONNRESET') {
      console.error('连接被重置，可能是网络问题');
      throw new Error('网络连接不稳定，请重试');
    } else {
      console.error('API 请求错误:', error.message);
    }
    throw error;
  }
);

// MBTI类型特征数据
const mbtiTraits = {
  ISTJ: { focus: '细节和规律', stress: '突发变化和不确定性', strength: '组织能力和责任心' },
  ISFJ: { focus: '他人需求和传统', stress: '冲突和过度期望', strength: '同理心和可靠性' },
  INFJ: { focus: '意义和理想', stress: '人际冲突和价值观挑战', strength: '洞察力和创造力' },
  INTJ: { focus: '系统和改进', stress: '无能和混乱', strength: '战略思维和独立性' },
  ISTP: { focus: '实践和效率', stress: '情感压力和约束', strength: '适应力和问题解决能力' },
  ISFP: { focus: '和谐和自由', stress: '批评和时间压力', strength: '审美能力和灵活性' },
  INFP: { focus: '个人价值和创造', stress: '批评和冲突', strength: '创造力和同理心' },
  INTP: { focus: '概念和分析', stress: '情感压力和期限', strength: '逻辑思维和创新能力' },
  ESTP: { focus: '行动和冒险', stress: '规则限制和单调', strength: '果断力和适应能力' },
  ESFP: { focus: '体验和享受', stress: '长期规划和限制', strength: '社交能力和乐观性' },
  ENFP: { focus: '可能性和创新', stress: '细节和常规', strength: '热情和创造力' },
  ENTP: { focus: '创新和辩论', stress: '规则和重复', strength: '创新能力和适应性' },
  ESTJ: { focus: '秩序和效率', stress: '不确定性和失控', strength: '组织能力和决断力' },
  ESFJ: { focus: '和谐和服务', stress: '冲突和否定', strength: '人际关系和责任心' },
  ENFJ: { focus: '发展和激励', stress: '批评和冲突', strength: '领导力和同理心' },
  ENTJ: { focus: '目标和效率', stress: '无能和失控', strength: '领导力和战略思维' }
}

// 压力等级描述
const stressLevels = {
  0: '当前压力水平较低，心理状态良好',
  25: '存在轻度压力，但在可控范围内',
  50: '中等程度的压力，需要适当关注',
  75: '压力水平较高，建议采取缓解措施',
  100: '压力水平严重，强烈建议寻求专业帮助'
}

// 心情评分描述
const moodDescriptions = {
  1: '心情低落，可能需要更多关注和支持',
  2: '心情一般，有改善空间',
  3: '心情尚可，保持平和状态',
  4: '心情不错，保持积极心态',
  5: '心情很好，继续保持乐观态度'
}

// 心理健康分析路由
app.post('/api/mental-health-analysis', async (req, res) => {
  try {
    const { mbtiType, moodRating, stressLevel, symptoms } = req.body

    // 获取MBTI特征
    const traits = mbtiTraits[mbtiType]
    const stressDesc = stressLevels[stressLevel]
    const moodDesc = moodDescriptions[moodRating]

    // 构建提示信息
    const prompt = `作为一个专业的心理健康顾问，请基于以下信息为用户提供全面的心理健康分析和建议：

1. MBTI类型：${mbtiType}
- 关注重点：${traits.focus}
- 压力源：${traits.stress}
- 优势：${traits.strength}

2. 当前状态：
- 心情评分：${moodRating}/5 (${moodDesc})
- 压力水平：${stressLevel}/100 (${stressDesc})
- 症状：${symptoms.join('、')}

请提供以下格式的分析：

1. 总体评估：[简要总结当前心理状态]
2. 个性化见解：[基于MBTI类型的分析]
3. 建议：
   - 日常建议：[具体可行的日常调节方法]
   - 压力管理：[针对性的压力管理技巧]
   - 专业帮助：[必要时的专业帮助建议]

请用中文回答，语气温和专业，建议具体可行。`

    console.log('开始调用 Deepseek API...');
    
    const response = await deepseekApi.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    console.log('API 调用成功');
   

    // 解析AI响应
    const content = response.data.choices[0].message.content;
    console.log('API返回内容:', content);

    // 直接返回原始内容
    res.json({
      status: 'success',
      data: content
    });
  } catch (error) {
    console.error('Error generating mental health analysis:', error)
    res.status(500).json({ 
      error: error.message || '生成分析报告时出现错误，请稍后重试',
      details: error.response?.data || error.message 
    })
  }
})

app.post('/api/mbti-match', async (req, res) => {
  try {
    const { type1, type2 } = req.body;
    
    // 构建提示词，按照规范格式
    const prompt = `请分析MBTI性格类型${type1}和${type2}的匹配情况，并按照以下格式输出分析结果：

总体匹配度
[在这里描述两种性格类型的总体匹配度，包括百分比和主要特点]

沟通方式的兼容性
[在这里描述两种性格类型的沟通方式的兼容性]

共同价值观
[在这里描述两种性格类型的共同价值观]

可能存在的挑战
[在这里描述两种性格类型可能存在的挑战]

改善建议
[在这里描述两种性格类型可以改善的地方]

总结：
[总结性描述，包括匹配度百分比和关键点]

请确保回答严格按照这个格式，使用"、"而不是"."作为序号，并避免使用任何特殊字符（如#、*等）。每个部分都要详细具体，针对这两种具体的性格类型进行分析。`;

    console.log('开始调用 Deepseek API...');
    
    const response = await deepseekApi.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log('API 调用成功');
    // 解析响应
    const analysis = response.data.choices[0].message.content;
    
    // 从分析中提取匹配度百分比
    const percentageMatch = analysis.match(/(\d+)%/);
    const matchPercentageValue = percentageMatch ? parseInt(percentageMatch[1]) : 75;

    res.json({
      matchPercentageValue,
      description: analysis
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || '分析过程出现错误，请稍后重试',
      details: error.response?.data || error.message 
    });
  }
});

app.post('/api/event-plan', async (req, res) => {
  try {
    const { person1Type, person2Type, eventType, preferences } = req.body;
    
    // 构建提示词
    const prompt = `作为一个MBTI性格专家和活动策划师，请为一对性格类型分别为${person1Type}和${person2Type}的伴侣策划一次${
      eventType === 'date' ? '约会' : 
      eventType === 'travel' ? '旅行' : '日常活动'
    }。

考虑到以下偏好：
- 预算范围：${preferences.budget === 'low' ? '经济实惠 (¥0-300)' : 
            preferences.budget === 'medium' ? '中等消费 (¥300-800)' : '高端体验 (¥800+)'}
- 活动时长：${preferences.duration === 'short' ? '2-3小时' : 
            preferences.duration === 'half_day' ? '半天' : 
            preferences.duration === 'full_day' ? '一整天' : '多天'}
- 活动场景：${preferences.scene.join('、')}

请按照以下格式输出活动方案：

方案概述：
[简要描述这个活动方案的整体设计思路，以及如何契合双方的性格特点]

具体安排：
[详细的时间安排，每个环节的具体活动内容]

贴心建议：
[根据双方的性格特点，给出一些具体的建议，帮助活动顺利进行]

请确保建议具体实用，充分考虑两种性格类型的特点和偏好。`;

    console.log('开始调用 API...');
    
    const response = await deepseekApi.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    console.log('API 调用成功');
    
    // 解析响应内容
    const content = response.data.choices[0].message.content;
    
    // 提取各个部分
    const overviewMatch = content.match(/方案概述：\n([\s\S]*?)(?=\n\n具体安排：)/);
    const activitiesMatch = content.match(/具体安排：\n([\s\S]*?)(?=\n\n贴心建议：)/);
    const tipsMatch = content.match(/贴心建议：\n([\s\S]*?)$/);

    // 处理活动安排
    const activitiesText = activitiesMatch ? activitiesMatch[1] : '';
    const activities = activitiesText.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [time, ...rest] = line.split('：');
        const [title, description] = rest.join('：').split('，');
        return {
          time: time.trim(),
          title: title ? title.trim() : '',
          description: description ? description.trim() : ''
        };
      });

    // 处理建议
    const tips = tipsMatch ? tipsMatch[1]
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[•-]\s*/, '').trim()) : [];

    res.json({
      overview: overviewMatch ? overviewMatch[1].trim() : '',
      activities,
      tips
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || '生成活动方案时出现错误，请稍后重试',
      details: error.response?.data || error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 