<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明: 该案例展示了大分辨率8K大屏(8800*5097)上使用simple-panzoom插件,
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
import leftImg from '../../assets/8k.jpg'
import middleImg from './middle.png'
import rightImg from './right.png'
import Panzoom, { PanzoomObject, PanzoomEventDetail } from 'simple-panzoom'
import { ref, onMounted, computed, onUnmounted } from 'vue'

const panzoomInstance = ref<PanzoomObject | null>(null)
const lastElem = ref<HTMLElement | null>(null)
const ownScale = ref<number>(1)
const elem = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref<number>(0) // 动态给
const rectHeight = ref<number>(0)
const canvasWidth = ref<number>(8800)
const canvasHeight = ref<number>(5097)
const paddingRatio = ref<number>(0.2) // padding
const cursorClass = ref('')
const isRemember = ref(false)
let zoomStartX = 0
let zoomStartY = 0

const rectStyle = computed(() => {
  return {
    background: '#f6f7f9',
    width: rectWidth.value + 'px',
    height: rectHeight.value + 'px',
    overflow: 'hidden'
  }
})

const canvasStyle = computed(() => {
  return {
    width: canvasWidth.value + 'px',
    height: canvasHeight.value + 'px'
  }
})

const handlePanzoomChange = (e: any) => {
  const { scale, dimsOut, x, y } = e.detail as PanzoomEventDetail
  console.log('e.detail', e.detail)
  if (dimsOut) {
    ownScale.value = scale
  }
  if (isRemember.value) {
    localStorage.setItem(
      'simple-panzoom-8k-state',
      JSON.stringify({
        scale,
        x,
        y
      })
    )
  }
}

const handleRememberChange = () => {
  localStorage.setItem('simple-panzoom-8k-remember', String(isRemember.value))
  if (!isRemember.value) {
    localStorage.removeItem('simple-panzoom-8k-state')
  } else {

  }
}

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey && panzoomInstance.value) {
    // 阻止浏览器默认的缩放行为
    e.preventDefault()
    panzoomInstance.value.zoomWithWheel(e)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  if (e.code === 'Space' && !e.repeat && panzoomInstance.value) {
    // 阻止空格键默认的滚动行为
    e.preventDefault()
    cursorClass.value = 'grab'
    panzoomInstance.value.setOptions({ disablePan: false, cursor: 'grab' })
  }
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.code === 'Space' && panzoomInstance.value) {
    cursorClass.value = ''
    panzoomInstance.value.setOptions({ disablePan: true, cursor: 'default' })
  }
}

/**
 * @desc: Centering Algorithm (居中算法)
 */
const calculateTransform = () => {
  const rw = rectWidth.value
  const rh = rectHeight.value
  const cw = canvasWidth.value
  const ch = canvasHeight.value

  // Scale proportionally to fit the viewport, considering padding (保持比例缩放以适应视口，并考虑 padding)
  const scaleX = (rw * (1 - paddingRatio.value)) / cw
  const scaleY = (rh * (1 - paddingRatio.value)) / ch
  const scale = Math.min(scaleX, scaleY)

  // Calculate centering offset (计算居中偏移量)
  // simple-panzoom defaults origin to '50% 50%', scaling based on element center (simple-panzoom 默认 origin 为 '50% 50%'，即基于元素中心缩放)
  // We only need to align the content center with the viewport center (我们只需要让内容中心对齐视口中心)
  // Offset = (Viewport Width - Content Width) / 2 (偏移量 = (视口宽 - 内容宽) / 2)
  // Since CSS transform order is scale() translate(), translation is scaled (由于 CSS transform 顺序为 scale() translate()，位移量会被缩放)
  // So we need to divide by scale (所以需要除以 scale)
  zoomStartX = (rw - cw) / 2 / scale
  zoomStartY = (rh - ch) / 2 / scale

  return scale
}

const updateDimensions = () => {
  if (wrapperRef.value) {
    rectWidth.value = wrapperRef.value.clientWidth
    rectHeight.value = wrapperRef.value.clientHeight
  } else {
    rectWidth.value = window.innerWidth
    rectHeight.value = window.innerHeight
  }
}

const initPanzoom = () => {
  // 清理旧实例与监听
  if (lastElem.value) {
    lastElem.value.removeEventListener('panzoomchange', handlePanzoomChange as EventListener)
    // 移除 wheel 监听（如果之前绑定在 lastElem 的 parent 上）
    if (lastElem.value.parentElement) {
      lastElem.value.parentElement.removeEventListener('wheel', handleWheel as any)
    }
  }
  panzoomInstance.value?.destroy()

  elem.value = document.querySelector('.canvasedit')
  if (elem.value) {
    updateDimensions()
    let scale = calculateTransform()
    let startX = zoomStartX
    let startY = zoomStartY

    const savedRemember = localStorage.getItem('simple-panzoom-8k-remember')
    if (savedRemember === 'true') {
      isRemember.value = true
      const savedState = localStorage.getItem('simple-panzoom-8k-state')
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          scale = Number(state.scale)
          startX = Number(state.x)
          startY = Number(state.y)
        } catch (e) {
          console.error('Failed to parse saved state', e)
        }
      }
    }

    console.log(scale, 'scale')

    panzoomInstance.value = Panzoom(elem.value, {
      // noBind: true,
      startScale: scale,
      smoothScroll: true,
      canvas: true,
      maxScale: 3,
      minScale: 0.01,
      disablePan: true, // 默认禁止拖拽
      cursor: 'default', // 默认光标
      startX: startX,
      startY: startY
    })
    elem.value.addEventListener('panzoomchange', handlePanzoomChange as EventListener)
    // 绑定 wheel 事件到 parent (因为 canvas: true 时事件绑定在 parent 上)
    if (elem.value.parentElement) {
      elem.value.parentElement.addEventListener('wheel', handleWheel, { passive: false })
    }
    lastElem.value = elem.value
  }
}

const onResize = () => {
  updateDimensions()
  if (panzoomInstance.value) {
    if (!isRemember.value) {
      const scale = calculateTransform()
      // 重新居中
      panzoomInstance.value.reset({
        startScale: scale,
        startX: zoomStartX,
        startY: zoomStartY,
        animate: false
      })
    }
  }
}

onMounted(() => {
  initPanzoom()
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
  if (elem.value && elem.value.parentElement) {
    elem.value.parentElement.removeEventListener('wheel', handleWheel as any)
  }
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
