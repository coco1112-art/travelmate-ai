export const createRespondStream = (res) => {
    //设置相应头
    res.setHeader('Content-Type','text/even-stream')
    res.setHeader('Cache-Control','no-cache')
    //确保http为长连接
    res.setHeader('Connection','keep-alive')
    return {
        send:(data)=>{
            try {
                res.write(`data: ${JSON.stringify(data)}\n\n`)
            } catch (error) {
                console.log("返回流式数据失败" + error)
            }
        },
        end:() => {
            try {
                res.write('even: end\ndata: {"done": true}\n\n')
                res.end()
            } catch (error) {
                console.log("流式结束失败" + error)
            }
        },
        error:(message) => {
            try {
                res.write(`data: ${JSON.stringify(message)}`)
                res.end()
            } catch (error) {
                console.log("流式数据错误" + error)
            }
        }
    }
}