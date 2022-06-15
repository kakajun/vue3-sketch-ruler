<template>
  <div class="wrapper">
    <!-- <div class="top">缩放比例:{{ state.scale }}</div> -->
    <SketchRuleWrapper
      height="700px"
      :zoomSize="state.zoomSize"
      :prevSize="state.prevSize"
      :draggleRate="state.draggleRate"
      :preview-img="previewImg"
      :zoom-img="zoomImg"
    >
      <img class="imhhhh" :src="zoomImg" />
    </SketchRuleWrapper>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick
} from 'vue'
import SketchRuleWrapper from '../../src/index' // 这里可以换成打包后的
import previewImg from '../assets/product/onepuls8-pro-zoom.jpg'
import zoomImg from '../assets/bg.jpeg'
const rectWidth = 600
const rectHeight = 320
const screensRef = ref(null)
const containerRef = ref(null)
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
  scale: 2, //658813476562495, //1,
  startX: 0,
  startY: 0,
  lines: {
    h: [433, 588],
    v: [33, 143]
  },
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: true // 显示参考线
})
const shadow = computed(() => {
  return {
    x: 0,
    y: 0,
    width: rectWidth,
    height: rectHeight
  }
})
const canvasStyle = computed(() => {
  return {
    width: rectWidth,
    height: rectHeight,
    transform: `scale(${state.scale})`
  }
})
</script>
<style lang="scss">
.top {
  position: absolute;
  right: 100px;
  font-size: 20px;
}
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  position: absolute;
  top: 100px;
  left: 240px;
  right: 20px;
}

#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 600px;
  height: 320px;
  background: url('../assets/bg.png') no-repeat;
  background-size: 100% 100%;
  transform-origin: 50% 0;
}
</style>
