import { createRouter,createWebHistory } from "vue-router";

const routes = [
    {
        path:'/',
        name:'Home',
        component:() =>import('../views/home.vue')
    },
    {
        path:'/chat',
        name:'Chat',
        component:() =>import('../views/chat.vue')
    },
    {
        path:'/profile',
        name:'Profile',
        component:() =>import('../views/profile.vue')
    },
    {
        path:'/detail',
        name:'Detail',
        component:() =>import('../views/detail.vue')
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router