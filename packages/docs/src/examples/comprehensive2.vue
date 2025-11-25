<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">设置autoCenter=false, 自己给初始值--- </div>
      <div class="mr10"> X方向: </div>
      <el-input
        class="mr10"
        style="width: 90px"
        v-model="panzoomOption.startX"
        @change="rendIndex++"
      />
      <div class="mr10"> Y方向: </div>
      <el-input
        class="mr10"
        style="width: 90px"
        v-model="panzoomOption.startY"
        @change="rendIndex++"
      />
    </div>
    <div class="top font16">
      <div class="scale mr10"> 缩放比:{{ cpuScale }} </div>
      <button v-if="showRuler" class="mr10 font16" @click="showRuler = false">隐藏规尺</button>
      <button v-else class="mr10 font16" @click="handleShow">显示规尺</button>
      <button class="mr10 font16" @click="showLineClick">辅助线开关</button>
      <button class="mr10 font16" @click="lockLine = true">锁定参考线</button>
      <button class="mr10 font16" @click="changeShadow">模拟阴影切换</button>
      <button class="mr10 font16" @click="changeTheme">主题切换</button>
      <button class="mr10 font16" @click.stop="resetMethod">还原</button>
      <button class="mr10 font16" @click.stop="zoomOutMethod">缩小</button>
      <span>禁止缩放</span>
      <input type="checkbox" class="switch" @change="changeScale" />
      <span>禁止移动</span>
      <input type="checkbox" class="switch mr10" @change="changeMove" />
      <span>框内移动</span>
      <input type="checkbox" class="switch mr10" @change="changeInsideMove" />
      <input
        class="mr10 font16"
        :value="state.scale"
        type="range"
        min="0.3"
        max="3"
        step="0.1"
        defaultValue="1"
        @input="scaleChange"
      />
      <div class="mr10"> 吸附横线: </div>
      <input class="mr10" style="width: 90px" :value="snapsObj.h" @blur="snapsChange" />
      <div class="mr10"> 吸附纵线: </div>
      <input class="mr10" style="width: 90px" :value="snapsObj.v" @blur="snapsChangeV" />

      <a
        href="https://github.com/kakajun/vue3-sketch-ruler"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fas fa-external-link-alt"></i> git源码
      </a>
    </div>

    <div
      class="wrapper"
      :class="[state.isBlack ? 'balckwrapper' : 'whitewrapper']"
      :style="rectStyle"
    >
      <!--  这个可以传入图标  :gridRatio="0.5" -->
      <SketchRule
        :key="rendIndex"
        ref="sketchruleRef"
        v-model:scale="state.scale"
        v-model:lock-line="lockLine"
        :thick="state.thick"
        :width="rectWidth"
        :show-ruler="showRuler"
        :height="rectHeight"
        :palette="cpuPalette"
        :snaps-obj="snapsObj"
        :autoCenter="false"
        :shadow="state.shadow"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :panzoom-option="panzoomOption"
        :is-show-refer-line="state.isShowReferLine"
        :lines="state.lines"
        @on-corner-click="handleCornerClick"
        @zoomchange="zoomchange"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" alt="" />
          </div>
        </template>
        <template #btn="{ reset, zoomIn, zoomOut }">
          <div class="btns">
            <button @click.stop="reset">还原</button>
            <button @click.stop="zoomIn">放大</button>
            <button @click.stop="zoomOut">缩小</button>
          </div>
        </template>
      </SketchRule>
    </div>
  </div>
</template>
<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import type { PanzoomEventDetail, PanzoomEvent } from 'simple-panzoom'
const rectWidth = ref(1470)
const rectHeight = ref(800)
// const canvasWidth = ref(2800)
// const canvasHeight = ref(1800)
// const canvasWidth = ref(1920)
// const canvasHeight = ref(1080)
const canvasWidth = ref(1000)
const canvasHeight = ref(500)
// const rectWidth =ref( 800)
// const rectHeight =ref( 400)
// const canvasWidth =ref( 530)
// const canvasHeight =ref( 250)
const rendIndex = ref(0)
const windowScale = ref(1)
const sketchruleRef = ref()
const showRuler = ref(true)
// 更多配置,参见 https://github.com/timmywil/panzoom
const panzoomOption = reactive({
  maxScale: 3,
  minScale: 0.3,
  startX: 0, // 画布距离左边框距离, 如果想自动,那么不要传
  startY: 0, // 画布距离顶边框距离, 如果想自动,那么不要传
  disablePan: false,
  disableZoom: false,
  contain: 'none', // 'inside' | 'outside' | 'none'
  handleStartEvent: (event: PanzoomEvent['panzoomstart']) => {
    event.preventDefault()
    console.log('handleStartEvent', event)
  }
})

const lockLine = ref(false)
const snapsObj = ref({ h: [0, 100, 200], v: [130] })
// 另外一个方法调用内部方法
const zoomOutMethod = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.zoomOut()
  }
}

const handleShow = () => {
  showRuler.value = !showRuler.value
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
    h: [0, 250],
    v: [0, 500]
  },
  thick: 20,
  shadow: {
    x: 0,
    y: 0,
    width: 300,
    height: 300
  },
  isShowRuler: true, // 显示标尺
  isShowReferLine: true // 显示参考线
})

const rectStyle = computed(() => {
  return {
    width: `${rectWidth.value}px`,
    height: `${rectHeight.value}px`
  }
})
const cpuPalette = computed(() => {
  return state.isBlack
    ? {
        bgColor: 'transparent',
        hoverBg: '#fff',
        hoverColor: '#000',
        longfgColor: '#BABBBC', // ruler longer mark color
        fontColor: '#DEDEDE', // ruler font color
        shadowColor: '#525252', // ruler shadow color
        lineColor: '#51d6a9',
        borderColor: '#B5B5B5'
      }
    : {
        bgColor: 'transparent',
        lineColor: '#51d6a9',
        lineType: 'dashed'
      }
})

const cpuScale = computed(() => {
  const num = Number(state.scale)
  return num.toFixed(1)
})

const canvasStyle = computed(() => {
  return {
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
  }
})

const scaleChange = (e: { target: { value: number } }) => {
  state.scale = e.target.value * 1
  if (sketchruleRef.value) {
    const panzoomInstance = sketchruleRef.value.panzoomInstance
    panzoomInstance.zoom(state.scale)
  }
}

const handleCornerClick = (e: MouseEvent) => {
  console.log('handleCornerClick', e)
}

const zoomchange = (detail: PanzoomEventDetail) => {
  console.log('zoomchange', detail)
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

const changeScale = (e: { target: { checked: boolean } }) => {
  panzoomOption.disableZoom = e.target.checked
}
const changeMove = (e: { target: { checked: boolean } }) => {
  panzoomOption.disablePan = e.target.checked
}

const changeInsideMove = (e: { target: { checked: boolean } }) => {
  panzoomOption.contain = e.target.checked ? 'inside' : 'none'
}

const changeShadow = () => {
  // 模拟 x canvasWidth.value   y canvasHeight.value  范围内随机数据
  state.shadow.x = Math.random() * canvasWidth.value
  state.shadow.y = Math.random() * canvasHeight.value
}
</script>

<style lang="scss">
.demo {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
}
.top {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  width: 100%;
}

.font16 {
  font-size: 16px;
}
.mr10 {
  margin-right: 10px;
}

.wrapper {
  margin: 0 auto;
  background-size:
    21px 21px,
    21px 21px;
  border: 1px solid #dadadc;
}
.whitewrapper {
  background-color: #fafafc;
  background-image:
    linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
.balckwrapper {
  background-color: #18181c;
  background-image:
    linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
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

/* Switch开关样式 */
/* 必须是input为 checkbox class 添加 switch 才能实现以下效果 */
input[type='checkbox'].switch {
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  transition:
    border-color 0.3s,
    background-color 0.3s;
}

input[type='checkbox'].switch::after {
  content: '';
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0, 0, 2px, #999;
  transition: 0.4s;
  top: 2px;
  position: absolute;
  left: 2px;
}

input[type='checkbox'].switch:checked {
  background: rgb(19, 206, 102);
}
/* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
input[type='checkbox'].switch:checked::after {
  content: '';
  position: absolute;
  left: 55%;
  top: 2px;
}
</style>
