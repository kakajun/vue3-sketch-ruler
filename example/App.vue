<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import UserRuler from './components/user-rulerts.vue'
</script>

<template>
  <div>
    <a href="https://data.avuejs.com/build/1" target="_blank" class="redlink">
      实例地址:https://data.avuejs.com/build/1
    </a>
    <div>按住Ctril+鼠标滚轮可以缩放页面-vue3加载</div>
  </div>
  <UserRuler />
</template>

<style>
#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
