<template>
  <div class="sketch-ruler">
    <slot name="btn" :reset="reset" :zoom-in="zoomIn" :zoom-out="zoomOut"></slot>
    <div class="canvasedit-parent" :style="rectStyle" :class="cursorClass">
      <div class="canvasedit" :class="cursorClass">
        <slot></slot>
      </div>
    </div>
    <!-- 水平方向 -->
    <RulerWrapper
      v-show="showRuler"
      :style="{ marginLeft: thick + 'px', width: rectWidth + 'px' }"
      :vertical="false"
      :width="width"
      :height="thick"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :start="startX"
      :start-other="startY"
      :lines="lines"
      :select-start="shadow.x"
      :snap-threshold="snapThreshold"
      :snaps-obj="snapsObj"
      :select-length="shadow.width"
      :scale="ownScale"
      :palette="paletteCpu"
      :canvas-width="canvasWidth"
      :show-shadow-text="showShadowText"
      :canvas-height="canvasHeight"
      :rate="rate"
      :grid-ratio="gridRatio"
      :lock-line="lockLine"
      @change-line-state="changeLineState"
    />
    <!-- 竖直方向 -->
    <RulerWrapper
      v-show="showRuler"
      :style="{ marginTop: thick + 'px', top: 0, height: rectHeight + 'px' }"
      :vertical="true"
      :width="thick"
      :height="height"
      :is-show-refer-line="showReferLine"
      :thick="thick"
      :start="startY"
      :start-other="startX"
      :lines="lines"
      :select-start="shadow.y"
      :select-length="shadow.height"
      :snap-threshold="snapThreshold"
      :snaps-obj="snapsObj"
      :scale="ownScale"
      :palette="paletteCpu"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :show-shadow-text="showShadowText"
      :rate="rate"
      :grid-ratio="gridRatio"
      :lock-line="lockLine"
      @change-line-state="changeLineState"
    />
    <a v-show="showRuler" class="corner" :style="cornerStyle" @click="onCornerClick"></a>
  </div>
</template>

<script setup lang="ts">
import RulerWrapper from './ruler-wrapper.vue'
import { eye64, closeEye64 } from './cornerImg64'
import { computed, ref, watch, onMounted } from 'vue'
import { SketchRulerProps } from '../index-types'
import Panzoom, { PanzoomObject, PanzoomEventDetail } from 'simple-panzoom'

const props = withDefaults(defineProps<SketchRulerProps>(), {
  showRuler: true,
  scale: 1,
  rate: 1,
  thick: 16,
  width: 1400,
  height: 800,
  paddingRatio: 0.2,
  autoCenter: true,
  shadow: () => {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  },
  lines: () => {
    return {
      h: [],
      v: []
    }
  },
  isShowReferLine: true,
  showShadowText: true,
  canvasWidth: 700,
  canvasHeight: 700,
  snapsObj: () => {
    return {
      h: [],
      v: []
    }
  },
  snapThreshold: 5,
  gridRatio: 1,
  lockLine: false,
  selfHandle: false
})

const emit = defineEmits(['onCornerClick', 'update:scale', 'zoomchange', 'update:lockLine'])
const elem = ref<HTMLElement | null>(null)
const startX = ref(0)
const startY = ref(0)
let zoomStartX = 0
let zoomStartY = 0
const ownScale = ref(1)
const showReferLine = ref(props.isShowReferLine)
const panzoomInstance = ref<PanzoomObject | null>(null)
const cursorClass = ref('defaultCursor')
// 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
const paletteCpu = computed(() => {
  return {
    bgColor: '#f6f7f9', // ruler bg color
    longfgColor: '#BABBBC', // ruler longer mark color
    fontColor: '#7D8694', // ruler font color
    fontShadowColor: '#106ebe',
    shadowColor: '#e9f7fe', // ruler shadow color
    lineColor: '#51d6a9',
    lineType: 'solid',
    lockLineColor: '#d4d7dc',
    hoverBg: '#000',
    hoverColor: '#fff',
    borderColor: '#eeeeef',
    ...props.palette
  }
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

const rectWidth = computed(() => {
  return props.width - props.thick
})

const rectHeight = computed(() => {
  return props.height - props.thick
})

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    panzoomInstance.value?.zoomWithWheel(e)
  }
}
const handleSpaceKeyDown = (e: KeyboardEvent) => {
  if (e.key === ' ') {
    cursorClass.value = 'grabCursor'
    panzoomInstance.value?.bind()
    e.preventDefault()
  }
}

const handleSpaceKeyUp = (e: KeyboardEvent) => {
  if (e.key === ' ') {
    panzoomInstance.value?.destroy()
    cursorClass.value = 'defaultCursor'
  }
}

onMounted(() => {
  initPanzoom()
  if (!props.selfHandle && elem.value) {
    const parent = elem.value.parentElement
    if (!parent) return
    parent.addEventListener('wheel', handleWheel)
    document.addEventListener('keydown', handleSpaceKeyDown)
    document.addEventListener('keyup', handleSpaceKeyUp)
  }
})

const getPanOptions = (scale: number) => {
  return {
    noBind: true,
    startScale: scale,
    // cursor: 'default',
    startX: zoomStartX,
    startY: zoomStartY,
    smoothScroll: true,
    canvas: true,
    ...props.panzoomOption
  }
}

const handlePanzoomChange = (e: any) => {
  const { scale, dimsOut } = e.detail as PanzoomEventDetail
  if (dimsOut) {
    emit('update:scale', scale)
    ownScale.value = scale
    const left = (dimsOut.parent.left - dimsOut.elem.left) / scale
    const top = (dimsOut.parent.top - dimsOut.elem.top) / scale
    startX.value = left
    emit('zoomchange', e.detail)
    startY.value = top
  }
}
const initPanzoom = () => {
  elem.value = document.querySelector('.canvasedit')
  if (elem.value) {
    let scale = props.scale
    if (props.autoCenter) {
      scale = calculateTransform()
    }
    panzoomInstance.value = Panzoom(elem.value, getPanOptions(scale))
    if (elem.value) {
      elem.value.addEventListener('panzoomchange', handlePanzoomChange)
    }
  }
}

/**
 * @desc: 居中算法
 */
const calculateTransform = () => {
  const scaleX = (rectWidth.value * (1 - props.paddingRatio)) / props.canvasWidth
  const scaleY = (rectHeight.value * (1 - props.paddingRatio)) / props.canvasHeight
  const scale = Math.min(scaleX, scaleY)
  zoomStartX = rectWidth.value / 2 - props.canvasWidth / 2
  if (scale < 1) {
    zoomStartY =
      ((props.canvasHeight * scale) / 2 - props.canvasHeight / 2) / scale -
      (props.canvasHeight * scale - rectHeight.value) / scale / 2
  } else if (scale > 1) {
    zoomStartY =
      (props.canvasHeight * scale - props.canvasHeight) / 2 / scale +
      (rectHeight.value - props.canvasHeight * scale) / scale / 2
  } else {
    zoomStartY = 0
  }

  return scale
}
const reset = () => panzoomInstance.value?.reset()
const zoomIn = () => panzoomInstance.value?.zoomIn()
const zoomOut = () => panzoomInstance.value?.zoomOut()

/**
 * @desc: 更新panzoom的配置
 * @param {*}
 */
const setOtions = () => {
  panzoomInstance.value?.setOptions(getPanOptions(props.scale))
}

const onCornerClick = () => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}
const changeLineState = (val: boolean) => {
  emit('update:lockLine', val)
}
const thickness = computed(() => props.thick + 'px')

watch([() => props.isShowReferLine], () => {
  showReferLine.value = props.isShowReferLine
})

watch(
  [() => props.canvasWidth, () => props.canvasHeight, () => props.width, () => props.height],
  () => {
    initPanzoom()
  }
)
watch(
  () => props.panzoomOption,
  () => {
    setOtions()
  },
  { deep: true }
)

defineExpose({
  initPanzoom,
  panzoomInstance,
  reset,
  zoomIn,
  zoomOut,
  cursorClass
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
  // TODO  这个加了影响居中
  // .canvasedit {
  //   width: v-bind("props.canvasWidth + 'px'");
  //   height: v-bind("props.canvasHeight + 'px'");
  // }
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

  .defaultCursor {
    cursor: default !important;
  }

  .grabCursor {
    cursor: grab !important;
  }
}
</style>
