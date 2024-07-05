<template>
  <div>
    <div class="top">缩放比例:{{ state.scale }}</div>
    <button class="right" @click="showLineClick">辅助线开关</button>
    <div class="wrapper" :style="rectStyle">
      <!--  这个可以传入图标 -->
      <SketchRule
        :thick="state.thick"
        v-model:scale="state.scale"
        :width="rectWidth"
        :height="rectHeight"
        :startNumX="0"
        :endNumX="canvasWidth"
        :startNumY="0"
        :endNumY="canvasHeight"
        ref="sketchrule"
        :isShowReferLine="state.isShowReferLine"
        @onCornerClick="handleCornerClick"
        :lines="state.lines"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" alt="" />>
          </div>
        </template>
        <template #btn="{ resetMethod, zoomInMethod, zoomOutMethod }">
          <div class="btns">
            <button class="btn reset-btn" @click="resetMethod">还原</button>
            <button class="btn zoomin-btn" @click="zoomInMethod">放大</button>
            <button class="btn zoomout-btn" @click="zoomOutMethod">缩小</button>
          </div>
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
const canvasWidth = 800
const canvasHeight = 400

const sketchrule = ref()
// 另外一个方法调用内部方法
const zoomOutMethod2 = () => {
  if (sketchrule.value && typeof sketchrule.value.zoomOutMethod === 'function') {
    console.log(sketchrule.value)
    sketchrule.value.zoomOutMethod()
  }
}
const state = reactive({
  scale: 0.5,
  lines: {
    h: [0, 588],
    v: [0, 143]
  },
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: false // 显示参考线
})

const shadow = computed(() => {
  return {
    x: 0,
    y: 0,
    width: rectWidth,
    height: rectHeight
  }
})

const rectStyle = computed(() => {
  return {
    width: `${rectWidth}px`,
    height: `${rectHeight}px`
  }
})

const canvasStyle = computed(() => {
  return {
    // margin: '0 auto', // 画布水平居中就靠它
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`
  }
})

const handleCornerClick = (e) => {
  console.log('handleCornerClick', e)
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
  z-index: 999;
}
</style>
