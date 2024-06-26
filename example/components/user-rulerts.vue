<template>
  <div>
    <div class="top">缩放比例:{{ state.scale }}</div>
    <button class="right" @click="showLineClick">辅助线开关</button>
    <div class="wrapper" :style="canvasStyle">
      <!--  这个可以传入图标 -->
      <SketchRule
        :thick="state.thick"
        v-model:scale="state.scale"
        :width="rectWidth"
        :height="rectHeight"
        :start-x="state.startX"
        :start-y="state.startY"
        :shadow="shadow"
        :startNumX="0"
        :endNumX="1200"
        :startNumY="0"
        :endNumY="320"
        ref="sketchrule"
        v-slot="{ resetMethod, zoomInMethod, zoomOutMethod }"
        :isShowReferLine="state.isShowReferLine"
        @onCornerClick="handleCornerClick"
        :lines="state.lines"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" alt="" />>
          </div>
        </template>
        <template #btn class="btns">
          <button class="btn reset-btn" @click="resetMethod">还原</button>
          <button class="btn zoomin-btn" @click="zoomInMethod">放大</button>
          <button class="btn zoomout-btn" @click="zoomOutMethod">缩小</button>
        </template>
      </SketchRule>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.es'
// import '../../lib/style.css'
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted, nextTick } from 'vue'
import SketchRule from '../../src/index' // 这里可以换成打包后的
const rectWidth = 1200
const rectHeight = 600
const sketchrule = ref()
// 另外一个方法调用内部方法
const zoomOutMethod2 = () => {
  if (sketchrule.value && typeof sketchrule.value.zoomOutMethod === 'function') {
    console.log(sketchrule.value)
    sketchrule.value.zoomOutMethod()
  }
}
const state = reactive({
  scale: 0.75,
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
    width: `${rectWidth}px`,
    height: `${rectHeight}px`
  }
})

const handleScroll = () => {
  const screensRect = document.querySelector('#screens').getBoundingClientRect()
  const canvasRect = document.querySelector('#canvas').getBoundingClientRect()

  // 标尺开始的刻度
  const startX = (screensRect.left + state.thick - canvasRect.left) / state.scale
  const startY = (screensRect.top + state.thick - canvasRect.top) / state.scale
  state.startX = startX
  state.startY = startY
}
const handleCornerClick = (e) => {
  console.log('handleCornerClick', e)
}
// 控制缩放值
const handleWheel = (e: {
  ctrlKey: any
  metaKey: any
  preventDefault: () => void
  deltaY: number
}) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const nextScale = parseFloat(Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2))
    state.scale = nextScale
  }
  nextTick(() => {
    handleScroll()
  })
}
const showLineClick = () => {
  state.isShowReferLine = !state.isShowReferLine
  console.log(state.isShowReferLine, 'state.isShowReferLine')
}
</script>
<style lang="scss">
.top {
  position: absolute;
  left: 0px;
  font-size: 20px;
}

.right {
  top: 200px;
  position: absolute;
  left: 0px;
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
  left: 140px;
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
  left: 0;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 800px;
  height: 320px;
  background: url('../assets/bg.jfif') no-repeat;
  background-size: 100% 100%;
  transform-origin: 50% 0;
}

.img-style {
  width: 100%;
  height: 100%;
}
.btns {
  position: absolute;
  display: flex;
  bottom: 20px;
  right: 40px;
}
</style>
