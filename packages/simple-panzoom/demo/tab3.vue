<template>
  <button @click="clickReset">还原</button>
  <button class="btn zoomout-btn" @click.stop="zoomOut">缩小</button>
  <span>缩放:</span>
  {{ scaleRef }}
  <div class="wrapper">
    <div id="edit" class="zoomable">
      <div :style="{ width: canvasWidth, height: canvasHeight }">
        <img src="./bg.png" id="image" class="img-content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import Panzoom from '../src/panzoom'
// import Panzoom from './old'
// import Panzoom from '../dist/panzoom'
let panzoomInstance = null
const zoomStartX = ref(100)
const zoomStartY = ref(330)
const scaleRef = ref(1)
const props = reactive({
  canvasWidth: 920, // 画布宽度
  canvasHeight: 980, // 画布高度
  paddingRatio: 0.2 // 内边距比例
})

const canvasWidth = computed(() => props.canvasWidth + 'px')
const canvasHeight = computed(() => props.canvasHeight + 'px')
const rectWidth = ref(700)
const rectHeight = ref(400)
onMounted(() => {
  const area = document.querySelector('.zoomable')
  scaleRef.value = calculateTransform()
  panzoomInstance = Panzoom(area, {
    // startX: zoomStartX.value,
    // startY: zoomStartY.value,
    animate: false,
    relative: true,
    // origin: '0 0',
    startScale: scaleRef.value,
    // contain: 'inside',
    zoomDoubleClickSpeed: 1,
    zoomSpeed: 1
    // panOnlyWhenZoomed: false,
    // disablePan: false,
    // disableZoom: false,
    // disableXAxis: false,
    // disableYAxis: false
  })

  const parent = area.parentElement
  // const rectParent = parent.getBoundingClientRect()
  // console.log(rectParent, 'rectParent')
  // const point = {
  //   clientX: rectParent.left,
  //   clientY: rectParent.top
  // }
  // panzoomInstance.zoomToPoint(scaleRef.value, point)
  parent.addEventListener('wheel', panzoomInstance.zoomWithWheel)
  area.addEventListener('panzoomchange', event => {
    const { scale, dimsOut } = event.detail
    if (dimsOut) {
      // const left = (dimsOut.parent.left - dimsOut.elem.left) / scale
      // const top = (dimsOut.parent.top - dimsOut.elem.top) / scale
      // zoomStartX.value = left
      // zoomStartY.value = top
      scaleRef.value = scale
      console.log(scale, 'scale')
    }
  })
})

/**
 * @desc: 居中算法
 */
const calculateTransform = () => {
  const scaleX =
    (rectWidth.value * (1 - props.paddingRatio)) / props.canvasWidth
  const scaleY =
    (rectHeight.value * (1 - props.paddingRatio)) / props.canvasHeight
  const scale = Math.min(scaleX, scaleY)
  // zoomStartX.value = rectWidth.value / 2 - props.canvasWidth / 2
  // if (scale < 1) {
  //   zoomStartY.value =
  //     ((props.canvasHeight * scale) / 2 - props.canvasHeight / 2) / scale -
  //     (props.canvasHeight * scale - rectHeight.value) / scale / 2
  // } else if (scale > 1) {
  //   zoomStartY.value =
  //     (props.canvasHeight * scale - props.canvasHeight) / 2 / scale +
  //     (rectHeight.value - props.canvasHeight * scale) / scale / 2
  // } else {
  //   zoomStartY.value = 0
  // }
  return scale
}
const clickReset = () => {
  panzoomInstance.reset()
}

const zoomOut = () => {
  panzoomInstance.zoomOut()
}
</script>

<style>
.wrapper {
  position: absolute;
  top: 100px;
  left: 100px;
  width: v-bind(rectWidth + 'px');
  height: v-bind(rectHeight + 'px');
  box-sizing: border-box;
  box-shadow: inset 0 0 5px rgba(223, 212, 212, 0.5);
  border: 1px solid black;
  border-radius: 5px;
  cursor: move;
  overflow: hidden;
  /* 确保内容不会溢出 */
}

/* #edit {
  width: v-bind(props.canvasWidth + 'px');
  height: v-bind(props.canvasHeight + 'px');
} */
.img-content {
  width: 100%;
  height: 100%;
}
</style>
