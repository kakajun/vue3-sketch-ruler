<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">设置autoCenter=false, 自己给初始值---</div>
      <div class="mr10">X方向:</div>
      <el-input class="mr10" style="width: 90px" v-model="offsetX" @change="rendIndex++" />
      <div class="mr10">Y方向:</div>
      <el-input class="mr10" style="width: 90px" v-model="offsetY" @change="rendIndex++" />
    </div>
    <div class="top font16">
      <div class="scale mr10">缩放比:{{ cpuScale }}</div>
      <button v-if="showRuler" class="mr10 font16" @click="showRuler = false">隐藏标尺</button>
      <button v-else class="mr10 font16" @click="handleShow">显示标尺</button>
      <button class="mr10 font16" @click="showLineClick">辅助线开关</button>
      <button class="mr10 font16" @click="lockLine = true">锁定参考线</button>
      <button class="mr10 font16" @click="changeShadow">模拟阴影切换</button>
      <button class="mr10 font16" @click="changeTheme">主题切换</button>
      <button class="mr10 font16" @click.stop="resetMethod">还原</button>
      <button class="mr10 font16" @click.stop="zoomOutMethod">缩小</button>
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
      <div class="mr10">吸附横线:</div>
      <input class="mr10" style="width: 90px" :value="snapsObj.h" @blur="snapsChange" />
      <div class="mr10">吸附纵线:</div>
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
      <SketchRuler
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
        :auto-center="false"
        :shadow="state.shadow"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :is-show-refer-line="state.isShowReferLine"
        :lines="state.lines"
        :initial-offset="{ x: Number(offsetX), y: Number(offsetY) }"
        @on-corner-click="handleCornerClick"
        @zoomchange="zoomchange"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" alt="" />
          </div>
        </template>
        <template #toolbar="{ tools, state }">
          <div class="btns">
            <button @click.stop="tools.reset">还原</button>
            <button @click.stop="tools.zoomIn">放大</button>
            <button @click.stop="tools.zoomOut">缩小</button>
          </div>
        </template>
      </SketchRuler>
    </div>
  </div>
</template>
<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const rectWidth = ref(1470)
const rectHeight = ref(800)
const canvasWidth = ref(1000)
const canvasHeight = ref(500)
const rendIndex = ref(0)
const sketchruleRef = ref()
const showRuler = ref(true)
const offsetX = ref('0')
const offsetY = ref('0')

const lockLine = ref(false)
const snapsObj = ref({ h: [0, 100, 200], v: [130] })

const zoomOutMethod = (): void => {
  if (sketchruleRef.value) {
    sketchruleRef.value.zoomOut()
  }
}

const handleShow = (): void => {
  showRuler.value = !showRuler.value
}

const resetMethod = (): void => {
  if (sketchruleRef.value) {
    sketchruleRef.value.reset()
  }
}

const changeTheme = (): void => {
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
  isShowRuler: true,
  isShowReferLine: true
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
        tickColor: '#BABBBC',
        labelColor: '#DEDEDE',
        shadowColor: '#525252',
        guideLineColor: '#51d6a9',
        borderColor: '#B5B5B5'
      }
    : {
        bgColor: 'transparent',
        guideLineColor: '#51d6a9',
        guideLineStyle: 'dashed'
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

const scaleChange = (e: { target: { value: number } }): void => {
  state.scale = e.target.value * 1
  sketchruleRef.value?.setTransform?.({ scale: state.scale })
}

const handleCornerClick = (e: MouseEvent): void => {
  console.log('handleCornerClick', e)
}

const zoomchange = (detail: { scale: number; x: number; y: number }): void => {
  console.log('zoomchange', detail)
}

const showLineClick = (): void => {
  state.isShowReferLine = !state.isShowReferLine
  console.log(state.isShowReferLine, 'state.isShowReferLine')
}
const snapsChange = (e: { target: { value: string } }): void => {
  const arr = e.target.value.split(',')
  snapsObj.value.h = arr.map((item) => Number(item))
}
const snapsChangeV = (e: { target: { value: string } }): void => {
  const arr = e.target.value.split(',')
  snapsObj.value.v = arr.map((item) => Number(item))
}

const changeShadow = (): void => {
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
input[type='checkbox'].switch:checked::after {
  content: '';
  position: absolute;
  left: 55%;
  top: 2px;
}
</style>
