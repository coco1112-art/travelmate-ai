<template>
    <div class="page-container">
        <div class="page-header">
            <van-nav-bar title="智能旅游助手"/>
        </div>
        <div class="page-content">
            <van-notice-bar
                left-icon="info-o"
                text="基于ai的智能景点介绍以及行程规划系统"
                style="margin-bottom:16px;"
            />
            <div class="card search-card">
                <div class="section-title">
                    规划你的旅程
                </div>
                <van-field
                 v-model="formData.city"
                 label="目的地" 
                 placeholder="请选择城市" 
                 readonly
                 is-link
                 @click="showCitys = true"
                 style="background-color: #f7f8fa;margin-bottom: 12px;border-radius: 8px;"
                 />
                 <van-field
                  v-model="formData.budget"
                  label="预算(元)"
                  placeholder="请输入预算金额"
                  type="number"
                  style="background-color: #f7f8fa;margin-bottom: 12px;border-radius: 8px;"
                 />
                <van-field
                  v-model="formData.days"
                  label="天数"
                  placeholder="请输入旅游天数"
                  type="digit"
                  style="background-color: #f7f8fa;margin-bottom: 12px;border-radius: 8px;"
                 />
                <van-button
                 type="primary"
                 size="large"
                 round
                 :loading="isLodaing"
                 @click="handleSumbit"
                >
                    开始规划
                </van-button>
            </div>
            <div class="card quick-actions">
                <div class="section-title">
                    快捷入口
                </div>
                <van-grid column-num="2" gutter="12">
                    <van-grid-item @click="goPage('/chat')" icon="chat-o" text="聊天" />
                    <van-grid-item @click="goPage('/profile')" icon="user-o" text="我的" />
                </van-grid>

            </div>
            <div class="card popular-destinations">
                <div class="section-title">
                    热门目的地
                </div>
                <van-grid column-num="4" gutter="8">
                    <van-grid-item @click="selectedCity(city)" v-for="(city,index) in popularCities" :key="index">
                        <div class="city-tag" :class="{ active:city===formData.city}">
                            {{ city }}
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <van-popup
            v-model:show="showCitys"
            round
            position="bottom"
        >
            <van-picker
                title="选择城市"
                :columns="cityColumns"
                @confirm="cityConfirm"
                @cancel="cityCancel"
            />
        </van-popup>
    </div>
</template>

<script setup>
import { showToast, SubmitBar } from 'vant';
import { ref,reactive } from 'vue';
import { useRouter } from 'vue-router';

//定义旅程规划的数据
const formData = reactive({
    city:"",
    budget:null,
    days:""
})
const router = useRouter()
//控制选择城市的条件
const showCitys = ref(false)

//所有城市
const allCitys = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
  '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
  '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
  '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
  '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
]
//热门城市
const popularCities = [
    '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆'
]

//对景点城市进行处理，以适配picker组件
const cityColumns = allCitys.map((city) => {
    return {text:city,value:city}
})

//确认城市事件回调
const cityConfirm = ({selectedOptions}) => {
    formData.city = selectedOptions[0].value
    showCitys.value = false
}
//取消确认城市事件回调
const cityCancel = () => {
    showCitys.value = false
}
//点击按钮加载状态
const isLodaing = ref(false)
//提交城市规划表单
const handleSumbit = () => {
    isLodaing.value = true
    if(!formData.city){
        showToast('请选择城市')
        isLodaing.value = false
        return
    }
    if(!formData.budget || formData.budget < 100){
        showToast('预算要大于100')
        isLodaing.value = false
        return
    }
    if(!formData.days || formData.days < 1 || formData.days > 30){
        showToast('旅游天数要在1-30天之间')
        isLodaing.value = false
        return
    }
    router.push({
        path:'/detail',
        query:{
            city:formData.city,
            budget:formData.budget,
            days:formData.days
        }
    })
}

//快捷入口跳转页面
const goPage = (path) => {
    router.push(path)
}
//选中的城市
const selectedCity = (city) => {
    formData.city = city
}

</script>

<style scoped>
    .search-card{
        margin-bottom: 16px;
    }
    .city-tag{
        padding: 8px 12px;
        border-radius: 16px;
        font-size: 14px;
        color: #666;
        background-color: #f7f8fa;
        transition: all 0.3s;
    }
    .active{
        color: #fff;
        background-color: #1989fa;
    }
</style>