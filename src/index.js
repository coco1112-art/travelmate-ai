import express from 'express'
import travelRouter from './routes/index.js'
import 'dotenv/config'
import cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

app.get('/heart',(req,res) => {
    res.json({
        status:200,
        message:"bong"
    })
})
//路由挂载
app.use("/api/travel",travelRouter)

app.listen(port,() => {
    console.log("server监听" + port + "端口中");
    
})