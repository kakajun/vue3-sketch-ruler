<template>
  <div class="demo">
    <div class="top font16">
      <div class="scale mr10"> 缩放比:{{ cpuScale }} </div>
      <button class="mr10 font16" @click="post.showRuler = !post.showRuler">{{
        (post.showRuler ? '隐藏' : '显示') + '规尺'
      }}</button>
      <button class="mr10 font16" @click="post.isShowReferLine = !post.isShowReferLine">{{
        (post.isShowReferLine ? '隐藏' : '显示') + '参考线'
      }}</button>
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
        @input="scaleChange"
        type="range"
        min="0.3"
        max="3"
        step="0.1"
        defaultValue="1"
      />
      <div class="mr10"> 吸附横线: </div>
      <input class="mr10" style="width: 90px" :value="post.snapsObj.h" @blur="snapsChange" />
      <div class="mr10"> 吸附纵线: </div>
      <input class="mr10" style="width: 90px" :value="post.snapsObj.v" @blur="snapsChangeV" />

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
      <!--  :gridRatio="0.5" -->
      <SketchRule
        ref="sketchruleRef"
        :key="rendIndex"
        v-model:scale="state.scale"
        v-model:lockLine="lockLine"
        v-bind="post"
        :selfHandle="true"
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
// import { SketchRule } from 'vue3-sketch-ruler'
// import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../lib/index.mjs'
// import '../../lib/style.css'
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted } from 'vue'
import SketchRule from '../../src/index' // 这里可以换成打包后的
import type { PanzoomEventDetail, PanzoomEvent } from 'simple-panzoom'

const rendIndex = ref(0)
const sketchruleRef = ref()

// 更多配置,参见 https://github.com/timmywil/panzoom
const panzoomOption = reactive({
  maxScale: 3,
  minScale: 0.3,
  // startX: 0,   // 画布距离左边框距离, 如果想自动,那么不要传
  // startY: 0,   // 画布距离顶边框距离, 如果想自动,那么不要传
  disablePan: false,
  disableZoom: false,
  contain: 'none', // 'inside' | 'outside' | 'none'
  handleStartEvent: (event: PanzoomEvent['panzoomstart']) => {
    event.preventDefault()
    console.log('handleStartEvent', event)
  }
})
const lockLine = ref(false)

// 另外一个方法调用内部方法
const zoomOutMethod = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.zoomOut()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  const panzoomInstance = sketchruleRef.value.panzoomInstance
  const cursorClass = sketchruleRef.value.panzoomInstance
  const parentDom = document.getElementsByClassName('canvasedit-parent')
  if (parentDom[0]) {
    const parent = parentDom[0]
    parent &&
      parent.addEventListener('wheel', function (e: WheelEvent) {
        if (e.ctrlKey || e.metaKey) {
          panzoomInstance.zoomWithWheel(e)
        }
      })

    // 让按下空格键才能移动画布
    document.addEventListener('mousedown', function (e) {
      if (e.button === 1) {
        console.log('按下了鼠标中键')

        cursorClass.value = 'grabCursor'
        panzoomInstance.bind()
        e.preventDefault()
        panzoomInstance.handleDown(e)
      }
    })

    document.addEventListener('mouseup', function (e) {
      if (e.button === 1) {
        panzoomInstance.destroy()
        cursorClass.value = 'defaultCursor'
      }
    })
  }
})

const handleResize = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.initPanzoom()
  }
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
  isBlack: false
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

const post = reactive({
  thick: 20,
  width: 1470,
  height: 800,
  // canvasWidth: 1920,
  // canvasHeight: 1080,
  canvasWidth: 1000,
  canvasHeight: 500,
  showRuler: true,
  palette: cpuPalette.value,
  snapsObj: { h: [0, 100, 200], v: [130] },
  shadow: {
    x: 0,
    y: 0,
    width: 300,
    height: 300
  },
  panzoomOption: panzoomOption,
  isShowReferLine: true,
  lines: {
    h: [0, 250],
    v: [0, 500]
  }
})

const rectStyle = computed(() => {
  return {
    width: `${post.width}px`,
    height: `${post.height}px`
  }
})

const cpuScale = computed(() => {
  const num = Number(state.scale)
  return num.toFixed(1)
})

const canvasStyle = computed(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`
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

const snapsChange = (e: { target: { value: string } }) => {
  const arr = e.target.value.split(',')
  post.snapsObj.h = arr.map((item) => Number(item))
}
const snapsChangeV = (e: { target: { value: string } }) => {
  const arr = e.target.value.split(',')
  post.snapsObj.v = arr.map((item) => Number(item))
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
  post.shadow.x = Math.random() * post.canvasWidth
  post.shadow.y = Math.random() * post.canvasHeight
}
</script>

<style lang="scss">
.demo {
  width: 100%;
  // padding-top: 10px;
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
  background-image: linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
.balckwrapper {
  background-color: #18181c;
  background-image: linear-gradient(#18181c 20px, transparent 0),
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
