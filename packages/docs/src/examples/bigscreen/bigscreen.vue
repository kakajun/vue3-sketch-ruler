<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明: 该案例展示了如何在大屏(3600*1080)上使用 @sketch-ruler/core 的 TransformEngine,
      实现大屏的缩放(Ctrl + 鼠标滚轮)功能, 拖动(空白键+鼠标拖动)功能.方便前端分组件开发
    </div>
    <div class="canvasedit-parent" :style="rectStyle" :class="cursorClass">
      <div class="canvasedit big-screen-demo" :style="canvasStyle" ref="elem">
        <!-- 下面可以分组件开发 -->
        <div class="screen-item left">
          <img :src="leftImg" alt="Left Screen" />
        </div>
        <div class="screen-item center">
          <img :src="middleImg" alt="Center Screen" />
        </div>
        <div class="screen-item right">
          <img :src="rightImg" alt="Right Screen" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import leftImg from './left.png'
import middleImg from './middle.png'
import rightImg from './right.png'
import { TransformEngine } from '@sketch-ruler/core'
import { InputManager } from '@sketch-ruler/canvas'
import { ref, onMounted, computed, onUnmounted } from 'vue'

const elem = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const canvasWidth = ref(3600)
const canvasHeight = ref(1080)
const paddingRatio = ref(0.1)
const cursorClass = ref('')
const ownScale = ref(1)

const engine = new TransformEngine(
  { x: 0, y: 0, scale: 1 },
  { minZoom: 0.01, maxZoom: 3, enableAnimation: false }
)

let inputManager: InputManager | null = null
let unsubscribe: (() => void) | null = null

const rectStyle = computed(() => ({
  background: '#f6f7f9',
  width: rectWidth.value + 'px',
  height: rectHeight.value + 'px',
  overflow: 'hidden'
}))

const canvasStyle = computed(() => ({
  width: canvasWidth.value + 'px',
  height: canvasHeight.value + 'px'
}))

const updateDimensions = () => {
  if (wrapperRef.value) {
    rectWidth.value = wrapperRef.value.clientWidth
    rectHeight.value = wrapperRef.value.clientHeight
  } else {
    rectWidth.value = window.innerWidth
    rectHeight.value = window.innerHeight
  }
}

/**
 * @desc: 居中算法
 * TransformEngine 以左上角为变换原点，平移量直接为像素偏移
 */
const calculateTransform = () => {
  const rw = rectWidth.value
  const rh = rectHeight.value
  const cw = canvasWidth.value
  const ch = canvasHeight.value

  const scaleX = (rw * (1 - paddingRatio.value)) / cw
  const scaleY = (rh * (1 - paddingRatio.value)) / ch
  const scale = Math.min(scaleX, scaleY)

  const x = (rw - cw * scale) / 2
  const y = (rh - ch * scale) / 2

  return { scale, x, y }
}

const init = () => {
  updateDimensions()
  const { scale, x, y } = calculateTransform()

  engine.setTransform({ scale, x, y })

  if (elem.value) {
    inputManager = new InputManager(engine, {
      zoomStep: 0.25,
      zoomMode: 'pointer',
      viewportSize: { width: rectWidth.value, height: rectHeight.value },
      contentSize: { width: canvasWidth.value, height: canvasHeight.value },
      onCursorChange: (cls) => {
        cursorClass.value = cls
      }
    })
    inputManager.bind(elem.value)
  }
}

const onResize = () => {
  updateDimensions()
  const { scale, x, y } = calculateTransform()
  engine.setTransform({ scale, x, y })
}

onMounted(() => {
  unsubscribe = engine.onUpdate((state) => {
    ownScale.value = state.scale
    if (elem.value) {
      elem.value.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.x}, ${state.y})`
    }
  })

  init()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  unsubscribe?.()
  inputManager?.destroy()
  engine.destroy()
})
</script>

<style lang="scss" scoped>
.description {
  font-size: 16px;
  padding: 5px;
  width: 100%;
  text-align: center;
  color: #666;
  margin-bottom: 10px;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.canvasedit-parent {
  position: absolute;
  top: 30px;
  left: 0;
}
.canvasedit {
  transform-origin: 0 0;
}
.big-screen-demo {
  display: flex;
  background-color: #030409;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;

  .screen-item {
    height: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: fill;
      display: block;
      pointer-events: none;
    }

    &.left,
    &.right {
      width: 25%;
    }

    &.center {
      flex: 1;
    }
  }
}
</style>
