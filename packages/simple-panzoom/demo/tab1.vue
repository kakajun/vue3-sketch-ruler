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
// import Panzoom from '../dist/panzoom'
let panzoomInstance = null
const zoomStartX = ref(0)
const zoomStartY = ref(0)
const props = reactive({
  canvasWidth: 1920, // 画布宽度
  canvasHeight: 1080, // 画布高度
  paddingRatio: 0.2 // 内边距比例
})
const scaleRef = ref(1)
const canvasWidth = computed(() => props.canvasWidth + 'px')
const canvasHeight = computed(() => props.canvasHeight + 'px')
const rectWidth = ref(700)
const rectHeight = ref(400)
onMounted(() => {
  const area = document.querySelector('.zoomable')
  scaleRef.value = calculateTransform()
  panzoomInstance = Panzoom(area, {
    startX: zoomStartX.value,
    startY: zoomStartY.value,
    animate: false,
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
  const rectParent = parent.getBoundingClientRect()
  // const scale= scaleRef.value
  // const clientX = -props.canvasWidth / scaleRef.value / 2
  // const clientY = -props.canvasHeight / scaleRef.value / 2

  // // Convert the mouse point from it's position over the
  // // effective area before the scale to the position
  // // over the effective area after the scale.
  // const focal = {
  //   x: (clientX / rectWidth.value) * (rectWidth.value * scale),
  //   y: (clientY / rectHeight.value) * (rectHeight.value * scale)
  // }
  // panzoomInstance.zoom(0.5, { animate: false, focal })
  parent.addEventListener('wheel', panzoomInstance.zoomWithWheel)
  // setTimeout(() => {
  //   const dims = panzoomInstance.setStyle('zoomable', 'style', 'none')
  //   console.log(dims, 'dims')
  // }, 3000)
  area.addEventListener('panzoomchange', event => {
    console.log(event.detail.dimsOut.elem, 'event')
    console.log(event.detail, 'detail')
    // const { scale, dimsOut } = event.detail
    //     if (dimsOut) {
    //       // emit('update:scale', scale)
    //       // ownScale.value = scale
    //       const left = (dimsOut.parent.left - dimsOut.elem.left) / scale
    //       const top = (dimsOut.parent.top - dimsOut.elem.top) / scale
    //       startX.value = left

    //       startY.value = top
    //     }
  })

  //  startX.value = ((1 - scale) * width) / 2 + x
  //   startX.value = ((1 - scale) * height) / 2 + y
  // console.log(newx, newy, '44')
})

/**
 * @desc: 居中算法
 */
const calculateTransform = () => {
  const scaleX =
    (rectWidth.value * (1 - props.paddingRatio)) / props.canvasWidth
  const scaleY =
    (rectHeight.value * (1 - props.paddingRatio)) / props.canvasHeight
  console.log(scaleX, scaleY, 'sssssssss')

  const scale = Math.min(scaleX, scaleY)
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

  const diffHorizontal = (props.canvasWidth * scale - props.canvasWidth) / 2
  const diffVertical = (props.canvasHeight * scale - props.canvasHeight) / 2
  const minX = diffHorizontal / scale
  const minY = diffVertical / scale
  zoomStartY.value = minY
  if (scale == scaleX) {
    // zoomStartX.value = rectWidth.value / 2 - props.canvasWidth / 2
    zoomStartX.value = minX + (props.paddingRatio * rectWidth.value) / scale / 2
    zoomStartY.value =
      minY + rectHeight.value / 2 / scale - props.canvasHeight / 2
  } else {
    zoomStartX.value =
      minX + rectWidth.value / 2 / scale - props.canvasWidth / 2
    zoomStartY.value =
      minY + (props.paddingRatio * rectHeight.value) / scale / 2
  }
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

#edit {
  width: v-bind(props.canvasWidth + 'px');
  height: v-bind(props.canvasHeight + 'px');
}
.img-content {
  width: 100%;
  height: 100%;
}
</style>
