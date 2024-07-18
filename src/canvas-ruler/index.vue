<template>
  <canvas
    ref="canvas"
    class="ruler"
    :style="rulerStyle"
    @click="handle($event, 'click')"
    @mouseenter="handle($event, 'enter')"
    @mousemove="handle($event, 'move')"
    @mouseleave="$emit('update:showIndicator', false)"
  ></canvas>
</template>
<script setup lang="ts">
import { drawCavaseRuler } from './utils'
import { reactive, ref, onMounted, watch, onUnmounted, computed } from 'vue'

interface Props {
  showIndicator: boolean
  valueNum: number
  scale: number
  palette: Object
  vertical: Boolean
  start: number
  width: number
  height: number
  selectStart: number
  selectLength: number
  endNumX: number
  endNumY: number
}
const props = defineProps<Props>()
const emit = defineEmits(['onAddLine', 'update:showIndicator', 'update:valueNum'])

const state = reactive({
  isDragging: false,
  canvasContext: null as CanvasRenderingContext2D | null
})
let ratioValue = 1
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  ratioValue = window.devicePixelRatio || 1
  window.addEventListener('resize', handleResize)
  initCanvasRef()
  updateCanvasContext(ratioValue)
})

const handleResize = () => {
  ratioValue = window.devicePixelRatio || 1
  updateCanvasContext(ratioValue)
  drawRuler(ratioValue)
}
const initCanvasRef = () => {
  state.canvasContext = canvas.value && canvas.value.getContext('2d')
}

const rulerStyle = computed(() => {
  return {
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
    canvas.value.width = props.width!
    canvas.value.height = props.height!
    const ctx = state.canvasContext
    if (ctx) {
      ctx.font = `${12 * ratio!}px -apple-system,
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
    endNumX: props.endNumX,
    endNumY: props.endNumY,
    ratio: ratio
  }

  if (state.canvasContext) {
    drawCavaseRuler(
      state.canvasContext,
      props.start!,
      props.selectStart!,
      props.selectLength!,
      options,
      !props.vertical
    )
  }
}
watch(
  () => props.start,
  () => {
    console.log('start', props.start)

    drawRuler(ratioValue)
  }
)
watch([() => props.width, () => props.height], () => {
  updateCanvasContext(ratioValue)
  drawRuler(ratioValue)
})
const handle = (e: MouseEvent, key: string) => {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = Math.round(props.start + offset / props.scale!)
  switch (key) {
    case 'click':
      emit('onAddLine', value)
      break
    case 'enter':
      emit('update:valueNum', value)
      emit('update:showIndicator', true)
      break
    default:
      emit('update:valueNum', value)
      break
  }
}

const handleDragStart = (event: any) => {
  console.log(1111111111111)
  emit('update:showIndicator', true)
}
const handleDragEnd = (event: any) => {
  // showIndicator.value = false
}
</script>
