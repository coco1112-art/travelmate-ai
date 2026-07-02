import axios from "axios";

const request = axios.create({
    baseURL:'http://127.0.0.1:3300/api/travel/',
    timeout:600000,
    headers:{
        "Content-Type":"application/json"
    }
})

request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

export function post(url,data){
    return request.post(url,data)
}
export function get(url,params){
    return request.post(url,{params})
}
export async function fetchStream(url,data,onChunk,onComplect,onError){
    const controller = new AbortController()
    
    try {
        const response = await fetch(`http://127.0.0.1:3300/api/travel/${url}`,{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(data),
            signal:controller.signal
        })
        const reader = response.body.getReader()
        //二进制解读器
        const decoder = new TextDecoder()

        while(true){
            const { done,value } = await reader.read()
            if(done) break;
            const chunk = decoder.decode(value,{stream:true})
            const lines = chunk.split('\n').filter(line => line.trim())
            for(const line of lines){
                //data:{"type":"chunk","content":"历史"}
                try {
                    if(line.startsWith('data: ')){
                    const jsonStr = line.substring(6)
                    const jsonData = JSON.parse(jsonStr)
                    if(jsonData.type === 'chunk'){
                        onChunk(jsonData.content)
                    }
                    else if(jsonData.done){
                        onComplect(jsonData.data)
                    }
                    else if(jsonData.error){
                        onError(jsonData.error)
                    }
                }
                } catch (error) {
                    onError('流式数据解析异常')
                }
            }
            
        }
        return controller.abort()
    } catch (error) {
        onError(error)
    }
}