<template>
  <div id="app">
    <a href="https://data.avuejs.com/build/1" target="_blank" class="redlink">
      实例地址:https://data.avuejs.com/build/1
    </a>
    <div>按住Ctril+鼠标滚轮可以缩放页面-vue2加载</div>
    <UserRuler />
  </div>
</template>
<script>
import UserRuler from './components/user-rulerts.vue'
import { defineComponent } from 'vue-demi'

export default defineComponent({
  name: 'App',
  components: {
    UserRuler
  }
})
</script>

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
