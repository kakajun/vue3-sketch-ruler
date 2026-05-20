<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明: 该案例展示了大分辨率8K大屏(8800*5097)上使用 @sketch-ruler/core 的 TransformEngine,
      依然能做到上下左右居中正确
    </div>
    <div class="control-panel">
      <label style="cursor: pointer">
        <input type="checkbox" v-model="isRemember" @change="handleRememberChange" />
        记住位置 (刷新页面后保持位置)
      </label>
    </div>
    <div class="canvasedit-parent" :style="rectStyle" :class="cursorClass">
      <div class="canvasedit big-screen-demo" :style="canvasStyle" ref="elem">
        <!-- 下面可以分组件开发 -->
        <img style="width: 100%; height: 100%" :src="leftImg" alt="Left Screen" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TransformEngine } from '@sketch-ruler/core'
import { InputManager } from '@sketch-ruler/canvas'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import leftImg from '../../assets/8k.jpg'

const elem = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const canvasWidth = ref(8800)
const canvasHeight = ref(5097)
const paddingRatio = ref(0.2)
const cursorClass = ref('')
const isRemember = ref(false)
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
 * @desc: Centering Algorithm (居中算法)
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

const handleRememberChange = () => {
  localStorage.setItem('sketch-ruler-8k-remember', String(isRemember.value))
  if (!isRemember.value) {
    localStorage.removeItem('sketch-ruler-8k-state')
  }
}

const init = () => {
  updateDimensions()
  let { scale, x, y } = calculateTransform()

  const savedRemember = localStorage.getItem('sketch-ruler-8k-remember')
  if (savedRemember === 'true') {
    isRemember.value = true
    const savedState = localStorage.getItem('sketch-ruler-8k-state')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        scale = Number(state.scale)
        x = Number(state.x)
        y = Number(state.y)
      } catch (e) {
        console.error('Failed to parse saved state', e)
      }
    }
  }

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
  if (!isRemember.value) {
    const { scale, x, y } = calculateTransform()
    engine.setTransform({ scale, x, y })
  }
}

onMounted(() => {
  unsubscribe = engine.onUpdate((state) => {
    ownScale.value = state.scale
    if (elem.value) {
      elem.value.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.x}, ${state.y})`
    }
    if (isRemember.value) {
      localStorage.setItem('sketch-ruler-8k-state', JSON.stringify(state))
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
  position: absolute;
  top: 0;
  left: 0;
  font-size: 16px;
  padding: 5px;
  width: 100%;
  text-align: center;
  color: #000;
  z-index: 1000;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  color: #000;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.canvasedit-parent {
  position: absolute;
  top: 0;
  left: 0;
}
// TransformEngine 的所有矩阵计算都假设变换原点是左上角 (0, 0)，但 CSS 默认的 transform-origin 是元素中心 50% 50%
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
