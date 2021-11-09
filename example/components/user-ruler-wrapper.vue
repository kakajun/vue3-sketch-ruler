<template>
  <div class="home">
    <SketchRuleWrapper
      :zoomSize="state.zoomSize"
      :prevSize="state.prevSize"
      class="wrapper"
      :draggleRate="state.draggleRate"
      :preview-img="previewImg"
      :zoom-img="zoomImg"
      @on-preview-click="handleClick"
    >
      <!-- 预览页面 -->
      <img class="imhhhh" :src="previewImg" />
    </SketchRuleWrapper>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent } from 'vue'
import previewImg from '../assets/product/onepuls8-pro.jpg'

import zoomImg from '../assets/bg.jpeg'
import { computed, reactive, onMounted } from 'vue'
import { SketchRuleWrapper } from '../../src/index' // 这里可以换成打包后的
export default defineComponent({
  name: 'user-ruler-wrapper',
  components: { SketchRuleWrapper },
  setup() {
    const state = reactive({
      /*预览大小*/
      zoomSize: {
        w: window.innerWidth - 400, // 定义外面容器大小,
        h: window.innerHeight - 300
      },
      draggleRate: 0.3,
      /* 整个视图大小 */
      prevSize: {
        w: window.innerWidth - 400, // 定义外面容器大小,
        h: window.innerHeight - 300
      },
      scale: 1,
      lines: {
        h: [433, 588],
        v: [33, 143]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    })
    const wrapperwithpx = computed(() => state.prevSize.w + 22 + 'px')
    const wrapperheightpx = computed(() => state.prevSize.h + 22 + 'px')
    const handleClick = e => {
      console.log(e)
    }
    return {
      wrapperwithpx,
      wrapperheightpx,
      state,
      previewImg,
      zoomImg,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>
