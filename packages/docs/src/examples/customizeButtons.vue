<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">鼠标中键移动画布</div>
      <div class="scale mr10">{{ cpuScale }}</div>
      <button class="mr10 font16" @click="post.showRuler = !post.showRuler">
        {{ (post.showRuler ? '隐藏' : '显示') + '标尺' }}
      </button>
      <button class="mr10 font16" @click="post.isShowReferLine = !post.isShowReferLine">
        {{ (post.isShowReferLine ? '隐藏' : '显示') + '参考线' }}
      </button>
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
      <input class="mr10" style="width: 90px" :value="post.snapsObj.h" @blur="snapsChange" />
      <div class="mr10">吸附纵线:</div>
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
      <SketchRuler
        ref="sketchruleRef"
        :key="rendIndex"
        v-model:scale="state.scale"
        v-model:lock-line="lockLine"
        v-bind="post"
        :self-handle="true"
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
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const rendIndex = ref(0)
const sketchruleRef = ref()
const lockLine = ref(false)

const zoomOutMethod = (): void => {
  sketchruleRef.value?.zoomOut?.()
}

const resetMethod = (): void => {
  sketchruleRef.value?.reset?.()
}

const changeTheme = (): void => {
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

const post = reactive({
  thick: 20,
  width: 1470,
  height: 800,
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

const scaleChange = (e: { target: { value: number } }): void => {
  state.scale = e.target.value * 1
  sketchruleRef.value?.setTransform?.({ scale: state.scale })
}

const handleCornerClick = (e: MouseEvent): void => {
  console.log('handleCornerClick', e)
}

const zoomchange = (detail: { scale: number; x: number; y: number }): void => {
  // console.log('zoomchange', detail)
}

const snapsChange = (e: { target: { value: string } }): void => {
  const arr = e.target.value.split(',')
  post.snapsObj.h = arr.map((item) => Number(item))
}
const snapsChangeV = (e: { target: { value: string } }): void => {
  const arr = e.target.value.split(',')
  post.snapsObj.v = arr.map((item) => Number(item))
}

const changeShadow = (): void => {
  post.shadow.x = Math.random() * post.canvasWidth
  post.shadow.y = Math.random() * post.canvasHeight
}

/* ========== 自定义输入事件（selfHandle=true 时需自行绑定） ========== */

let isMiddleDragging = false
let lastMouseX = 0
let lastMouseY = 0

const handleWheel = (e: WheelEvent): void => {
  if (!(e.ctrlKey || e.metaKey)) return
  e.preventDefault()
  const engine = sketchruleRef.value?.engine
  if (!engine) return
  const parent = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const originX = e.clientX - parent.left
  const originY = e.clientY - parent.top
  const delta = e.deltaY < 0 ? 1 : -1
  const currentScale = engine.getState().scale
  const toScale = currentScale * Math.exp((delta * 0.25) / 3)
  engine.zoomTo(toScale, originX, originY)
}

const handlePointerDown = (e: PointerEvent): void => {
  if (e.button !== 1) return
  isMiddleDragging = true
  lastMouseX = e.clientX
  lastMouseY = e.clientY
  sketchruleRef.value.cursorClass = 'grab'
  e.preventDefault()
}

const handlePointerMove = (e: PointerEvent): void => {
  if (!isMiddleDragging) return
  const engine = sketchruleRef.value?.engine
  if (!engine) return
  const dx = e.clientX - lastMouseX
  const dy = e.clientY - lastMouseY
  engine.panBy(dx, dy)
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

const handlePointerUp = (e: PointerEvent): void => {
  if (e.button !== 1 || !isMiddleDragging) return
  isMiddleDragging = false
  sketchruleRef.value.cursorClass = 'default'
}

onMounted(() => {
  const parent = document.querySelector('.canvasedit-parent')
  if (parent) {
    parent.addEventListener('wheel', handleWheel as EventListener, { passive: false })
  }
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
})

onUnmounted(() => {
  const parent = document.querySelector('.canvasedit-parent')
  if (parent) {
    parent.removeEventListener('wheel', handleWheel as EventListener)
  }
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
})
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
