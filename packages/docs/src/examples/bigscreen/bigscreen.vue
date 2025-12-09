<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description"
      >说明: 该案例展示了如何在大屏(3600*1080)上使用simple-panzoom插件, 实现大屏的缩放(Ctrl +
      鼠标滚轮)功能, 拖动(空白键+鼠标拖动)功能.方便前端分组件开发</div
    >
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
import Panzoom, { PanzoomObject, PanzoomEventDetail } from 'simple-panzoom'
import { ref, onMounted, computed, onUnmounted } from 'vue'

const panzoomInstance = ref<PanzoomObject | null>(null)
const lastElem = ref<HTMLElement | null>(null)
const ownScale = ref<number>(1)
const elem = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref<number>(0) // 动态给
const rectHeight = ref<number>(0)
const canvasWidth = ref<number>(3600)
const canvasHeight = ref<number>(1080)
const paddingRatio = ref<number>(0.1)
const cursorClass = ref('')
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
  const { scale, dimsOut } = e.detail as PanzoomEventDetail
  if (dimsOut) {
    ownScale.value = scale
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
 * @desc: 居中算法
 */
const calculateTransform = () => {
  const rw = rectWidth.value
  const rh = rectHeight.value
  const cw = canvasWidth.value
  const ch = canvasHeight.value

  // 保持比例缩放以适应视口，并考虑 padding
  const scaleX = (rw * (1 - paddingRatio.value)) / cw
  const scaleY = (rh * (1 - paddingRatio.value)) / ch
  const scale = Math.min(scaleX, scaleY)

  // 计算居中偏移量
  // simple-panzoom 默认 origin 为 '50% 50%'，即基于元素中心缩放
  // 我们只需要让内容中心对齐视口中心
  // 偏移量 = (视口宽 - 内容宽) / 2
  // 由于 CSS transform 顺序为 scale() translate()，位移量会被缩放
  // 所以需要除以 scale
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
    console.log(scale, 'scale')

    panzoomInstance.value = Panzoom(elem.value, {
      // noBind: true,
      startScale: scale,
      smoothScroll: true,
      canvas: true,
      disablePan: true, // 默认禁止拖拽
      cursor: 'default', // 默认光标
      startX: zoomStartX,
      startY: zoomStartY
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
