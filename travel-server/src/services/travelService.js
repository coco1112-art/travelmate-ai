import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage,SystemMessage } from "@langchain/core/messages"
import 'dotenv/config'

class TravelService{
    constructor(){
        this.llm = null
        this.initLLM()
    }
    initLLM(){
        let apiKey,baseUrl,model
        const provider = process.env.PROVIDER
        if(provider === 'DEEPSEEK'){
          apiKey = process.env.DEEPSEEK_API_KEY
          baseUrl = process.env.DEEPSEEK_BASE_URL
          model = process.env.DEEPSEEK_MODEL
        }
        this.llm = new ChatOpenAI({
            configuration:{
                baseURL: baseUrl,
            },
            apiKey,
            model,
            temperature:0.7,
            streaming:true,
            timeout:15000
        })
    }
    async recommend(city,budget,days){
        if(budget < 100 || days < 1 || days >30){
            throw new Error("预算不能低于100，天数要在1-30天之间")
        }
        //提示词数据
        const message = this.getTravelPrompt(city,budget,days)
        try {
          //调用llm
          const respond = await this.llm.invoke(message)
          try {
            const fullResponse = respond.content || ''
            const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/) ||
              fullResponse.match(/```\n([\s\S]*?)\n```/) ||
              fullResponse.match(/\{[\s\S]*\}/);
            console.log(jsonMatch)
            const resData = JSON.parse(jsonMatch[0])
            return resData
          } catch (error) {
            return {
              success:false,
              error:"json格式解析失败",
              rawMessage:error.message
            }
          }
          
        } catch (error) {
          return {
            success:false,
            error:`AI 服务暂时不可用，请稍后重试。(${error.message})`
          }
        }
        
    }
    getTravelPrompt(city,budget,days){
        return[
           new HumanMessage(`你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。

请根据以下信息为用户生成一份详细的旅游规划：
- 目的地城市：${city}
- 预算：${budget}元
- 旅行天数：${days}天

要求：
1. 每天的行程安排（上午、下午、晚上）
2. 每个景点的详细介绍
3. 交通建议
4. 预算分配明细
5. 注意事项

请以JSON格式输出，结构如下：
{
  "success": true,
  "city": "城市名",
  "days": 天数,
  "totalBudget": 总预算,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "afternoon": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "evening": {
        "spot": "活动名称",
        "duration": "活动时长",
        "ticket": "费用",
        "transportation": "交通方式",
        "description": "活动介绍"
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 住宿费用,
    "food": 餐饮费用,
    "transportation": 交通费用,
    "tickets": 门票费用,
    "other": 其他费用
  },
  "tips": ["提示1", "提示2", "提示3"],
  "warnings": ["注意事项1", "注意事项2"]
}

请确保JSON格式正确，可以被解析。`)
        ]
    }
    async chat(message,streamCallBack){
      //处理参数
      const messages = [
        new SystemMessage("你是一个有好的旅游助手，请用中文回答用户有关旅游的问题"),
        new HumanMessage(message)
      ]
      //调用llm大模型
      try {
        const stream = await this.llm.stream(messages)
        let fullResponse
        for await (const chunk of stream){
          const content = chunk.content || ''
          //空内容就跳过
          if(content.trim() === ''){
            continue
          }
          //加到总内容中
          fullResponse += content
          if(streamCallBack){
            streamCallBack(content)
          }
        }
        return {
          success: true,
          replay: fullResponse
        }
      } catch (error) {
        return {
          success: false,
          error: "调用大模型输出数据失败" + error.message
        }
      }
      
    }
}

export default new TravelService()