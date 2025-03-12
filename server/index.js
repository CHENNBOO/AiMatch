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

// // MBTI 性格类型匹配规则
// const getMbtiCompatibility = (type1, type2) => {
//   // 计算共同特质数量
//   let commonTraits = 0;
//   for (let i = 0; i < 4; i++) {
//     if (type1[i] === type2[i]) {
//       commonTraits++;
//     }
//   }

//   // 基础匹配度计算
//   let basePercentage = commonTraits * 15 + 40; // 40% 基础分 + 每个相同特质 15%

//   // 特殊匹配规则
//   const isOppositeEI = type1[0] !== type2[0]; // E/I 相反
//   const hasSameNS = type1[1] === type2[1]; // N/S 相同
//   const hasSameTF = type1[2] === type2[2]; // T/F 相同
//   const hasSameJP = type1[3] === type2[3]; // J/P 相同

//   // 调整匹配度
//   if (isOppositeEI) basePercentage += 10; // E/I 互补加分
//   if (hasSameNS) basePercentage += 5; // N/S 相同小幅加分
//   if (hasSameTF) basePercentage += 5; // T/F 相同小幅加分
  
//   // 确保匹配度在合理范围内
//   return Math.min(Math.max(basePercentage, 30), 98);
// };

// // 生成匹配描述
// const generateDescription = (type1, type2, matchPercentage) => {
//   const isHighMatch = matchPercentage >= 80;
//   const isMediumMatch = matchPercentage >= 60 && matchPercentage < 80;
//   const isLowMatch = matchPercentage < 60;

//   let description = `${type1}和${type2}的性格匹配分析：\n\n`;
//   description += `总体匹配度：${matchPercentage}%\n\n`;

//   // 沟通方式分析
//   if (type1[0] !== type2[0]) {
//     description += "沟通方式：一个内向一个外向，能够在社交活动中互相平衡。外向的一方可以帮助内向的一方更好地社交，而内向的一方则能给外向的一方带来深度的交流。\n\n";
//   } else {
//     description += "沟通方式：具有相似的社交倾向，容易产生共鸣，但可能会强化彼此的特点。\n\n";
//   }

//   // 共同价值观分析
//   if (type1[1] === type2[1] && type1[2] === type2[2]) {
//     description += "共同价值观：在认知方式和决策方式上都比较一致，这有助于减少分歧和冲突。\n\n";
//   } else {
//     description += "共同价值观：在某些方面可能存在认知差异，需要更多的相互理解和包容。\n\n";
//   }

//   // 可能存在的挑战
//   description += "可能存在的挑战：\n";
//   if (type1[3] !== type2[3]) {
//     description += "- 在生活方式的规划性和灵活性上可能存在分歧\n";
//   }
//   if (type1[2] !== type2[2]) {
//     description += "- 在做决定时可能会采用不同的标准和考虑因素\n";
//   }
//   description += "\n";

//   // 改善建议
//   description += "改善建议：\n";
//   description += "1. 保持开放和理解的态度，欣赏彼此的不同\n";
//   description += "2. 在做重要决定时，多听取对方的想法和感受\n";
//   description += "3. 建立有效的沟通机制，及时表达自己的需求和顾虑\n";

//   return description;
// };

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 