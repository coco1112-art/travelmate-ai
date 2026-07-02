import express from 'express'
import travelService from '../services/travelService.js'
import { createRespondStream } from '../utils/streamUtils.js'

const router = express.Router()

router.post("/chat",async (req,res) => {
    const { message } = req.body
    if(!message) {
        return res.status(400).json({
            "success":false,
            "message":"message不能为空"
        })
    }
    //处理sse流式返回数据
    const respondStream = createRespondStream(res)
    const result = await travelService.chat(message,(content) => {
        respondStream.send({type:'chunk',content:content})
    })
    respondStream.send({type:'complete',data:result})
    respondStream.end()
})

router.post("/recommend",async (req,res) => {
    console.log(req.body)
    const {city,budget,days} = req.body
    if(!city || !budget || !days){
        return res.status(400).json({
            "success":false,
            "message":"city,budget,days输入参数有误"
        })
    }
    const result = await travelService.recommend(city,budget,days)
    return res.json(result)
})

export default router