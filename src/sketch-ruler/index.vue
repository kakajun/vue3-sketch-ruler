<template>
  <div class="sketch-ruler">
    <slot name="btn" :reset="reset" :zoomIn="zoomIn" :zoomOut="zoomOut"></slot>
    <div class="canvasedit-parent" :style="rectStyle" @wheel.prevent="">
      <!-- :style="canvasStyle" -->
      <div class="canvasedit">
        <slot></slot>
      </div>
    </div>
    <!-- 水平方向 -->
    <RulerWrapper
      :style="{ marginLeft: thick + 'px', width: rectWidth + 'px' }"
      v-show="showRuler"
      :vertical="false"
      :width="width"
      :height="thick"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :start="startX"
      :startOther="startY"
      :lines="lines"
      :select-start="shadow.x"
      :snapThreshold="snapThreshold"
      :snapsObj="snapsObj"
      :select-length="shadow.width"
      :scale="ownScale"
      :parentRect="parentRect"
      :palette="paletteCpu"
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
      :rate="rate"
      :gridRatio="gridRatio"
      :lockLine="lockLine"
      @change-line-state="changeLineState"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      :style="{ marginTop: thick + 'px', top: 0, height: rectHeight + 'px' }"
      v-show="showRuler"
      :vertical="true"
      :width="thick"
      :height="height"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :start="startY"
      :startOther="startX"
      :lines="lines"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :snapThreshold="snapThreshold"
      :snapsObj="snapsObj"
      :scale="ownScale"
      :parentRect="parentRect"
      :palette="paletteCpu"
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
      :rate="rate"
      :gridRatio="gridRatio"
      :lockLine="lockLine"
      @change-line-state="changeLineState"
    />
    <a v-show="showRuler" class="corner" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script setup lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { eye64, closeEye64 } from './cornerImg64'
import { computed, ref, watch, onMounted } from 'vue'
import { sketchRulerProps } from '../index-types'
import Panzoom, { PanzoomObject } from 'simple-panzoom'
import { merge } from '../canvas-ruler/utils'
const props = defineProps(sketchRulerProps)

const emit = defineEmits(['onCornerClick', 'update:scale', 'zoomchange', 'update:lockLine'])
const parentRect = ref<DOMRect | null>(null)
const elem = ref<HTMLElement | null>(null)
const startX = ref(0)
const startY = ref(0)
const zoomStartX = ref(0)
const zoomStartY = ref(0)
const ownScale = ref(1)
const showReferLine = ref(props.isShowReferLine)
const panzoomInstance = ref<PanzoomObject | null>(null)

// 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
const paletteCpu = computed(() => {
  const finalObj = merge(
    {
      bgColor: '#f6f7f9', // ruler bg color
      longfgColor: '#BABBBC', // ruler longer mark color
      fontColor: '#7D8694', // ruler font color
      shadowColor: '#E8E8E8', // ruler shadow color
      lineColor: '#EB5648',
      lineType: 'solid',
      lockLineColor: '#d4d7dc',
      hoverBg: '#000',
      hoverColor: '#fff',
      borderColor: '#eeeeef',
      cornerActiveColor: 'rgb(235, 86, 72, 0.6)'
    },
    props.palette || {}
  )
  return finalObj
})

const cornerStyle = computed(() => {
  return {
    backgroundImage: showReferLine.value
      ? `url(${props.eyeIcon || eye64})`
      : `url(${props.closeEyeIcon || closeEye64})`,
    width: props.thick + 'px',
    height: props.thick + 'px',
    borderRight: `1px solid ${paletteCpu.value.borderColor}`,
    borderBottom: `1px solid ${paletteCpu.value.borderColor}`
  }
})
const rectStyle = computed(() => {
  return {
    background: paletteCpu.value.bgColor,
    width: rectWidth.value + 'px',
    height: rectHeight.value + 'px'
  }
})
// const canvasStyle = computed(() => {
//   return {
//     width: props.canvasWidth + 'px',
//     height: props.canvasHeight + 'px'
//   }
// })

const rectWidth = computed(() => {
  return props.width - props.thick
})

const rectHeight = computed(() => {
  return props.height - props.thick
})

onMounted(() => {
  initPanzoom()
  if (!props.selfHandle) {
    document.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.metaKey) {
        panzoomInstance.value?.zoomWithWheel(e)
      }
    })

    // 让按下空格键才能移动画布
    document.addEventListener('keydown', function (e) {
      if (e.key === ' ') {
        panzoomInstance.value?.bind()
        e.preventDefault()
      }
    })

    document.addEventListener('keyup', function (e) {
      if (e.key === ' ') {
        panzoomInstance.value?.destroy()
      }
    })
  }
})

const getPanOptions = (scale: number) => {
  return {
    noBind: true,
    // startScale: scale,
    cursor: 'default',
    startX: zoomStartX.value,
    startY: zoomStartY.value,
    smoothScroll: true,
    ...props.panzoomOption
  }
}

const initPanzoom = () => {
  elem.value = document.querySelector('.canvasedit')
  if (elem.value) {
    let scale = props.scale
    if (props.autoCenter) {
      scale = calculateTransform()
    } else {
      zoomStartX.value = props.zoomStartX
      zoomStartY.value = props.zoomStartY
    }

    panzoomInstance.value = Panzoom(elem.value, getPanOptions(scale))
    if (elem.value) {
      elem.value.addEventListener('panzoomchange', (e: any) => {
        const { scale, dimsOut } = e.detail
        if (dimsOut) {
          emit('update:scale', scale)
          ownScale.value = scale
          const left = (dimsOut.parent.left - dimsOut.elem.left) / scale
          const top = (dimsOut.parent.top - dimsOut.elem.top) / scale
          startX.value = left
          emit('zoomchange', e.detail)
          startY.value = top
        }
      })
    }
  }
}

/**
 * @desc: 居中算法
 */
const calculateTransform = () => {
  const rateX = rectWidth.value / props.canvasWidth
  const rateY = rectHeight.value / props.canvasHeight
  const len = Math.min(rateX, rateY) == rateX ? rectWidth.value : rectHeight.value
  const paading = len * props.paddingRatio
  const scaleX = (rectWidth.value - paading) / props.canvasWidth
  const scaleY = (rectHeight.value - paading) / props.canvasHeight
  const scale = Math.min(scaleX, scaleY)
  if (scale == scaleX) {
    zoomStartX.value = (props.canvasWidth / 2) * (scale - 1) + paading / 2
    // 多向右偏移一半
    zoomStartY.value =
      (props.canvasHeight / 2) * (scale - 1) + (props.height - props.canvasHeight * scale) / 2
  } else {
    zoomStartX.value =
      (props.canvasWidth / 2) * (scale - 1) + (props.width - props.canvasWidth * scale) / 2
    zoomStartY.value = (props.canvasHeight / 2) * (scale - 1) + paading / 2
  }
  return scale
  // zoomStartX.value = rectWidth.value / 2 - props.canvasWidth / 2
  // zoomStartY.value = rectHeight.value / 2 - props.canvasHeight / 2
  // }
  return scale
}

const reset = () => {
  panzoomInstance.value?.reset()
}

const zoomIn = () => {
  panzoomInstance.value?.zoomIn()
}

const zoomOut = () => {
  panzoomInstance.value?.zoomOut()
}

/**
 * @desc: 更新panzoom的配置
 * @param {*}
 */
const setOtions = (obj?: any) => {
  panzoomInstance.value?.setOptions(obj || getPanOptions(props.scale))
}

const onCornerClick = () => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}
const changeLineState = (val: boolean) => {
  emit('update:lockLine', val)
}
const thickness = computed(() => {
  return props.thick + 'px'
})
watch([() => props.isShowReferLine], () => {
  showReferLine.value = props.isShowReferLine
})

watch(
  [() => props.canvasWidth, () => props.canvasHeight, () => props.width, () => props.height],
  () => {
    // 画框大小改变时，重新初始化panzoom以及scale
    initPanzoom()
  }
)

watch([() => props.scale], () => {
  panzoomInstance.value?.zoom(props.scale)
})

watch(
  () => props.panzoomOption,
  (newVal) => {
    setOtions()
  },
  { deep: true }
)

defineExpose({
  initPanzoom,
  panzoomInstance,
  reset,
  zoomIn,
  zoomOut
})
</script>

<style lang="scss">
.sketch-ruler {
  position: relative;
  z-index: 3;
  /* 需要比resizer高 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  span {
    line-height: 1;
  }
  .canvasedit-parent {
    position: absolute;
    left: v-bind(thickness);
    top: v-bind(thickness);
  }
  .corner {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: auto;
    cursor: pointer;
    box-sizing: content-box;
    transition: all 0.2s ease-in-out;
  }
}
</style>
