<template>
  <div class="demo-wrapper">
    <div class="title">2021/10/28</div>
    <SketchRule
      class="wrapper"
      :thick="state.thick"
      :scale="state.scale"
      :corner-active="true"
      v-model="state.lines"
    >
      <div class="constent" />
    </SketchRule>
  </div>
</template>
<script lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
import { computed, defineComponent, ref, reactive, onMounted } from 'vue'
// import '../../lib/style.css'
// import { SketchRule } from '../../lib/index.es' // 这里可以换成打包后的
import { SketchRule } from '../../src/index' // 这里可以换成打包后的
export default defineComponent({
  components: { SketchRule },
  setup() {
    const state = reactive({
      scale: 1,
      wrapperwith: 1000, // 定义外面容器大小
      wrapperheight: 500,
      lines: {
        h: [0, 200],
        v: [0, 200]
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
      // 滚动居中
      // screensRef.value.scrollLeft =
      //   containerRef.value.getBoundingClientRect().width / 2 - 300
    })

    return {
      wrapperwithpx,
      wrapperheightpx,
      state,
    }
  }
})
</script>
<style lang="scss" scoped>
.title {
  position: absolute;
  font-size: 30px;
  top: 50px;
  left: 400px;
}
.demo-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
}
.wrapper {
  position: absolute;
  top: 100px;
  left: 100px;
  // vue3 新写法,可以共享js中的变量,必须要写
  width: v-bind(wrapperwithpx);
  height: v-bind(wrapperheightpx);
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}
#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}
.scale-value {
  position: absolute;
  bottom: 100%;
  left: 100px;
}
.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}
.constent {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 200px;
  height: 200px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>
