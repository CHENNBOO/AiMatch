const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// 加载环境变量
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 性格匹配分析接口
app.post('/api/personality-match', async (req, res) => {
  try {
    const { personality1, personality2 } = req.body;
    console.log('进入性格匹配分析接口');
    console.log('personality1：', personality1);
    console.log('personality2：', personality2);
    if (!personality1 || !personality2) {
      return res.status(400).json({ error: '请提供两个性格描述' });
    }

    // 构建提示词
    const prompt = `作为一个专业的性格分析专家，请分析以下两种性格类型的匹配程度：
    
第一个人的性格特征：${personality1}
第二个人的性格特征：${personality2}

请提供：
1. 匹配度百分比（0-100之间的数字）
2. 一段详细的中文分析，包括：
   - 性格互补或冲突的方面
   - 可能存在的沟通挑战
   - 建议的相处之道

请以JSON格式返回，包含以下字段：
{
  "matchPercentage": 数字,
  "analysis": "分析文本"
}`;
    // 调用 Deepseek API
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('性格匹配分析接口，返回结果',response.data.choices[0].message.content);

    // 解析 AI 返回的结果
    let result=response.data.choices[0].message.content;
    // try {
    //   result = JSON.parse(response.data.choices[0].message.content);
    // } catch (error) {
    //   // 如果解析失败，返回原始响应
    // //   return res.json({
    // //     matchPercentage: 70, // 默认匹配度
    // //     analysis: response.data.choices[0].message.content
    // //   });
    // }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: '分析过程中出现错误',
      details: error.message 
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 