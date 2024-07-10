<script setup>
import UserRuler from './components/user-rulerts.vue'
</script>

<template>
  <div id="app">
    <!-- <div>
      <a href="https://data.avuejs.com/build/1" target="_blank" class="redlink">
        实例地址:https://data.avuejs.com/build/1
      </a>
    </div> -->

    <div class="tittle">按住Ctril+鼠标滚轮可以缩放页面, 按住空格键+鼠标拖动可以移动画布</div>
  </div>
  <UserRuler />
</template>

<style>
#app {
  margin-top: 20px;
  text-align: center;
}
.redlink {
  margin-bottom: 10px;
}
.tittle {
  font-size: 20px;
  padding-top: 10px;
  margin-bottom: 10px;
}
</style>
