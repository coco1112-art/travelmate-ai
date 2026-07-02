<template>
    <div class="page-container chat-page">
        <div class="page-header">
            <van-nav-bar
                title="AI旅游助手"
                left-text="返回"
                left-arrow
                @click-left="onBack"
                fixed
            />
        </div>
        <div class="chat-container" ref="chatContainer">
            <div class="chat-empty" v-if="messages.length === 0">
                <van-empty description="开始和AI助手对话吧"/>
                <div class="quick-questions">
                    <div class="quick-title">
                        常见问题
                    </div>
                    <van-tag @click="handleClick(q)" v-for="q in quickQuestions" :key="q" class="quick-tag" mark size="large">
                        {{ q }}
                    </van-tag>
                </div>
            </div>
            <div v-else class="message-list">
                <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
                <div v-if="isStreaming" class="streaming-indicator">
                    <van-loading type="spinner" size="20px">
                        <span>等待ai回复中...</span>
                    </van-loading>
                </div> 
            </div>
        </div>
        <div class="chat-input-area">
            <van-field
                v-model="inputMessage" 
                placeholder="请输入你的问题"
                :disabled="isStreaming"
                @keyup.enter="sendMessage"
            >
                <template #button>
                    <van-button @click="sendMessage" type="primary" size="small" :disabled="!inputMessage.trim()">发送</van-button>
                </template>
            </van-field>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { fetchStream } from '../utils/request';
import { showToast } from 'vant';
import ChatBubble from '../components/ChatBubble.vue';
const router = useRouter()

//对话信息
const messages = ref([])
const onBack = () => {
    router.back()
}

const quickQuestions = [
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
]
//点击常见问题标签
const handleClick = (q) => {
    inputMessage.value = q
    sendMessage()
}
//输入信息
const inputMessage = ref('')
//AI回复状态
const isStreaming = ref(false)
//发送信息
const sendMessage = () => {
    const msg = inputMessage.value.trim()
    if(!msg || isStreaming.value){
        return
    }
    addUsermessage(msg)
    inputMessage.value = ''
    //调用ai流式回复
    fetchAIRespond(msg)
}
//添加用户消息
const addUsermessage = (content) => {
    if(!content){
        showToast('输入问题有错误')
    }
    messages.value.push({
        id:Date.now(),
        role:'user',
        content:content,
        timestamp:new Date().toISOString()
    })
}
//ai流式回复
const fetchAIRespond = (userMsg) => {
    isStreaming.value = true
    messages.value.push({
        id:Date.now() + 1,
        role:'ai',
        content:'',
        timestamp:new Date().toISOString()
    })
    let fullRespond = ''
    fetchStream('chat',{message:userMsg},(chunk) => {
        fullRespond += chunk
        const lastMsg = messages.value[messages.value.length-1]
        if(lastMsg && lastMsg.role === 'ai'){
            lastMsg.content = fullRespond
        }
        scorlltoButton()
    },() => {
        isStreaming.value = false
        scorlltoButton()
    },(error) => {
        if(lastMsg && lastMsg.role === 'ai'){
            lastMsg.content = '回复失败' + error
        }
        showToast('ai回复失败')
        scorlltoButton()
    })
}
const chatContainer = ref(null)
//保持·滚动条在最下面
const scorlltoButton = () => {
    if(chatContainer.value){
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}
const route = useRoute()
onMounted(() => {
    if(route.query.scene === 'detail' && route.query.city){
        inputMessage.value = `${route.query.city}旅游景点推荐`
    }
})

</script>
<style scoped>
.page-header{
    height: 46px;
}
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 0px !important;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  background: #fff;
  padding: 8px 16px;
  padding-bottom: 58px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
}
</style>