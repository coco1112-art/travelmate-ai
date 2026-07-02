<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const active = ref(0)
const route = useRoute()

</script>

<template>
  <div class="app-container">
    <router-view></router-view>
    <van-tabbar v-if="['Home','Chat','Profile'].includes(route.name)" route v-model="active">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/chat" icon="chat-o">聊天</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
