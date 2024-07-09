<template>
  <canvas
    ref="canvas"
    class="ruler"
    @click="handle($event, 'click')"
    @mouseenter="handle($event, 'enter')"
    @mousemove="handle($event, 'move')"
    @mouseleave="$emit('update:showIndicator', false)"
  ></canvas>
</template>
<script setup lang="ts">
import { drawCavaseRuler } from './utils'
import { reactive, ref, onMounted, watch } from 'vue'

interface Props {
  showIndicator: boolean
  valueNum: number
  scale: number
  ratio: number
  palette: Object
  vertical: Boolean
  start: number
  width: number
  height: number
  selectStart: number
  selectLength: number
  startNumX: number
  endNumX: number
  startNumY: number
  endNumY: number
}
const props = defineProps<Props>()
const emit = defineEmits(['onAddLine', 'update:showIndicator', 'update:valueNum'])

const state = reactive({
  canvasContext: null as CanvasRenderingContext2D | null
})
let ratioValue = 1
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  ratioValue = props.ratio || window.devicePixelRatio || 1
  initCanvasRef()
  updateCanvasContext(ratioValue)
})
const initCanvasRef = () => {
  state.canvasContext = canvas.value && canvas.value.getContext('2d')
}
const updateCanvasContext = (ratio: number) => {
  if (canvas.value) {
    // 比例宽高
    canvas.value.width = props.width! * ratio!
    canvas.value.height = props.height! * ratio!
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
  console.log('drawRuler', props.scale)
  const options = {
    scale: props.scale!,
    width: props.width!,
    height: props.height!,
    palette: props.palette!,
    startNumX: props.startNumX!,
    endNumX: props.endNumX!,
    startNumY: props.startNumY!,
    endNumY: props.endNumY!,
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
  const getValueByOffset = (offset: number, start: number, scale: number) =>
    Math.round(start + offset / scale)
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, props.scale!)
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
</script>
