<template>
  <div class="demo">
    <div class="top">
      <!-- <div class="scale"> 浏览器缩放:{{ windowScale }} </div> -->
      <div class="scale"> 缩放比例:{{ cpuScale }} </div>
      <button class="mr10 font18" v-if="showRuler" @click="showRuler = false">隐藏规尺</button>
      <button class="mr10 font18" v-else @click="handleShow">显示规尺</button>
      <button class="mr10 font18" @click="showLineClick">辅助线开关</button>
      <button class="mr10 font18" @click="lockLine = true">锁定参考线</button>
      <button class="mr10 font18" @click="changeTheme">主题切换</button>
      <button class="mr10 font18" @click="resetMethod">还原</button>
      <button class="mr10 font18" @click="zoomOutMethod">缩小</button>
      <input
        class="mr10 font18"
        :value="state.scale"
        @input="scaleChange"
        className="range-input"
        type="range"
        min="0.3"
        max="3"
        step="0.1"
        defaultValue="1"
      />
      <div class="mr10"> 吸附横线: </div>
      <input class="mr10" :value="snapsObj.h" @blur="snapsChange" />
      <div class="mr10"> 吸附纵线: </div>
      <input class="mr10" :value="snapsObj.v" @blur="snapsChangeV" />
    </div>

    <div class="wrapper" :style="rectStyle">
      <!--  这个可以传入图标 -->
      <SketchRule
        :key="rendIndex"
        v-model:scale="state.scale"
        v-model:lockLine="lockLine"
        :thick="state.thick"
        :width="rectWidth"
        :gridRatio="0.5"
        :showRuler="showRuler"
        :height="rectHeight"
        :palette="cpuPalette"
        :snapsObj="snapsObj"
        :canvasWidth="canvasWidth"
        :canvasHeight="canvasHeight"
        :panzoomOption="panzoomOption"
        ref="sketchruleRef"
        :isShowReferLine="state.isShowReferLine"
        @on-corner-click="handleCornerClick"
        :lines="state.lines"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" alt="" />
          </div>
        </template>
        <template #btn="{ reset, zoomIn, zoomOut }">
          <div class="btns">
            <button class="btn reset-btn" @click="reset">还原</button>
            <button class="btn zoomin-btn" @click="zoomIn">放大</button>
            <button class="btn zoomout-btn" @click="zoomOut">缩小</button>
          </div>
        </template>
      </SketchRule>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.mjs'
// import '../../lib/style.css'
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted } from 'vue'
import SketchRule from '../../src/index' // 这里可以换成打包后的
const rectWidth = 1600
const rectHeight = 800
// const canvasWidth = 2800
// const canvasHeight = 1800
const canvasWidth = 1000
const canvasHeight = 500
// const rectWidth = 800
// const rectHeight = 400
// const canvasWidth = 530
// const canvasHeight = 250
const rendIndex = ref(0)
const windowScale = ref(1)
const sketchruleRef = ref()
const showRuler = ref(true)
// 更多配置,参见 https://github.com/timmywil/panzoom
const panzoomOption = ref({
  maxScale: 2,
  minScale: 0.5
})
const lockLine = ref(false)
const snapsObj = ref({ h: [0, 100, 200], v: [130] })
// 另外一个方法调用内部方法
const zoomOutMethod = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.zoomOut()
  }
}

onMounted(() => {
  changeWindowScale()
  window.addEventListener('resize', handleResize)
})

const handleShow = () => {
  showRuler.value = !showRuler.value
}

const handleResize = () => {
  if (sketchruleRef.value) {
    changeWindowScale()
    sketchruleRef.value.initPanzoom()
  }
}
const changeWindowScale = () => {
  const num = Number(window.devicePixelRatio || 1)
  windowScale.value = num.toFixed(2) * 1
}
const resetMethod = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.reset()
  }
}

const changeTheme = () => {
  state.isBlack = !state.isBlack
  rendIndex.value++
}

const state = reactive({
  scale: 1,
  isBlack: false,
  lines: {
    h: [0, 200],
    v: [0, 250]
  },
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: true // 显示参考线
})

const rectStyle = computed(() => {
  return {
    width: `${rectWidth}px`,
    height: `${rectHeight}px`
  }
})
const cpuPalette = computed(() => {
  return state.isBlack
    ? {
        bgColor: '#000',
        backgroundSize: '15px 15px, 15px 15px',
        hoverBg: '#fff',
        hoverColor: '#000',
        longfgColor: '#BABBBC', // ruler longer mark color
        fontColor: '#DEDEDE', // ruler font color
        shadowColor: '#525252', // ruler shadow color
        lineColor: '#EB5648',
        borderColor: '#B5B5B5',
        cornerActiveColor: '#fff'
      }
    : {}
})

const cpuScale = computed(() => {
  const num = Number(state.scale)
  return num.toFixed(2)
})

const canvasStyle = computed(() => {
  return {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`
  }
})

const scaleChange = (e: { target: { value: number } }) => {
  state.scale = e.target.value
  if (sketchruleRef.value) {
    const panzoomInstance = sketchruleRef.value.panzoomInstance
    panzoomInstance.zoom(state.scale)
  }
}

const handleCornerClick = (e: MouseEvent) => {
  console.log('handleCornerClick', e)
}

const showLineClick = () => {
  state.isShowReferLine = !state.isShowReferLine
  console.log(state.isShowReferLine, 'state.isShowReferLine')
}
const snapsChange = (e: { target: { value: string } }) => {
  const arr = e.target.value.split(',')
  snapsObj.value.h = arr.map((item) => Number(item))
}
const snapsChangeV = (e: { target: { value: string } }) => {
  const arr = e.target.value.split(',')
  snapsObj.value.v = arr.map((item) => Number(item))
}
</script>

<style lang="scss">
.demo {
  width: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
}
.top {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  width: 100%;
  font-size: 20px;
  .scale {
    margin-right: 10px;
  }
}

.right {
  font-size: 20px;
}
.font18 {
  font-size: 18px;
}
.mr10 {
  margin-right: 10px;
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
  margin: 0 auto;
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}

.button {
  bottom: 100%;
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
