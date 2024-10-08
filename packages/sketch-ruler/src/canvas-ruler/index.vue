<template>
  <canvas ref="canvas" class="ruler" :style="rulerStyle" @mousedown.stop="handleDragStart"></canvas>
</template>
<script setup lang="ts">
import { drawCanvasRuler } from './utils'
import { reactive, ref, onMounted, watch, onUnmounted, computed } from 'vue'
import type { FinalPaletteType } from '../index-types'
interface Props {
  scale: number
  palette: FinalPaletteType
  vertical: boolean
  showShadowText: boolean
  start: number
  width: number
  height: number
  selectStart: number
  selectLength: number
  canvasWidth: number
  canvasHeight: number
  rate: number
  gridRatio: number
}
const props = defineProps<Props>()
const emit = defineEmits(['handleDragStart'])

const state = reactive({
  isDragging: false,
  canvasContext: null as CanvasRenderingContext2D | null
})
let ratioValue = window.devicePixelRatio
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  window.addEventListener('resize', handleResize)
  initCanvasRef()
  updateCanvasContext(ratioValue)
  drawRuler(ratioValue)
})

const handleResize = () => {
  ratioValue = window.devicePixelRatio
  updateCanvasContext(ratioValue)
  drawRuler(ratioValue)
}
const initCanvasRef = () => {
  state.canvasContext = canvas.value?.getContext('2d') || null
}

const rulerStyle = computed(() => {
  return {
    width: props.width + 'px',
    height: props.height + 'px',
    cursor: props.vertical ? 'ew-resize' : 'ns-resize',
    [props.vertical ? 'borderRight' : 'borderBottom']:
      `1px solid ${props.palette.borderColor || '#eeeeef'} `
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
const updateCanvasContext = (ratio: number) => {
  if (canvas.value) {
    // 比例宽高
    canvas.value.width = Math.round(props.width! * ratio)
    canvas.value.height = Math.round(props.height! * ratio)
    const ctx = state.canvasContext

    if (ctx) {
      ctx.font = `11px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
      ctx.lineWidth = 1
      ctx.textBaseline = 'middle'
    }
  }
}
const drawRuler = (ratio: number) => {
  const options = {
    scale: props.scale!,
    width: props.width!,
    height: props.height!,
    palette: props.palette!,
    canvasWidth: props.canvasWidth,
    canvasHeight: props.canvasHeight,
    ratio: ratio,
    rate: props.rate,
    gridRatio: props.gridRatio,
    showShadowText: props.showShadowText
  }
  options.scale = props.scale / props.rate
  options.canvasWidth = props.canvasWidth * props.rate
  options.canvasHeight = props.canvasHeight * props.rate
  if (state.canvasContext) {
    drawCanvasRuler(
      state.canvasContext,
      props.start * props.rate!,
      props.selectStart!,
      props.selectLength!,
      options,
      !props.vertical
    )
  }
}
watch(
  [
    () => props.width,
    () => props.height,
    () => props.start,
    () => props.palette,
    () => props.selectStart,
    () => props.selectLength
  ],
  () => {
    drawRuler(ratioValue)
  }
)
watch([() => props.width, () => props.height], () => {
  updateCanvasContext(ratioValue)
})

const handleDragStart = (e: MouseEvent) => {
  emit('handleDragStart', e)
}
</script>
