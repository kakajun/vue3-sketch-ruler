<template>
  <div class="wrapper">
    <div class="top">缩放比例:{{ state.scale }}</div>
    <SketchRuleWrapper>
      <div class="canvas" />
    </SketchRuleWrapper>
  </div>
</template>

<script>
import { SketchRuleWrapper } from '../../src/index' // 这里可以换成打包后的
import { computed, reactive, onMounted } from 'vue'
export default {
  name: '',
  components: { SketchRuleWrapper },
  setup() {
    const state = reactive({
      scale: 1,
      wrapperwith: window.innerWidth - 400, // 定义外面容器大小
      wrapperheight: window.innerHeight - 300,
      lines: {
        h: [433, 588],
        v: [33, 143]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    })
    const wrapperwithpx = computed(() => state.wrapperwith + 22 + 'px')
    const wrapperheightpx = computed(() => state.wrapperheight + 22 + 'px')

    onMounted(() => {
      // 这里监听窗口变化, 可要可不要
      window.addEventListener('resize', () => {
        state.wrapperwith = window.innerWidth - 400
        state.wrapperheight = window.innerHeight - 400
      })
    })

    return {
      wrapperwithpx,
      wrapperheightpx,
      state
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  position: absolute;
  right: 100px;
  font-size: 20px;
}
.wrapper {
  position: relative;
  top: 100px;
  left: 240px;
  // vue3 新写法,可以共享js中的变量,必须要写
  width: v-bind(wrapperwithpx);
  height: v-bind(wrapperheightpx);
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}
.canvas {
  left: 0;
  top: 0;
  width: 600px;
  height: 320px;
  background: url('../assets/bg.jfif') no-repeat;
  background-size: 100% 100%;
}
</style>
