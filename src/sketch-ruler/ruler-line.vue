<template>
  <div
    v-show="showLine"
    class="line"
    :style="combinedStyle"
    @mouseenter="handleMouseenter"
    @mousemove="handleMouseMove"
    @mouseleave="showLabel = false"
    @mousedown="handleMouseDown"
  >
    <div class="action" :style="actionStyle">
      <span v-if="showLabel" class="value">{{ labelContent }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import useLine from './useLine'
import { debounce } from '../canvas-ruler/utils'
import type { FinalPaletteType, LineType } from '../index-types'
interface Props {
  scale: number
  palette: FinalPaletteType
  index: number
  start: number
  vertical: boolean
  value: number
  canvasWidth: number
  canvasHeight: number
  lines: LineType
  isShowReferLine: boolean
  rate: number
  snapThreshold: number
  snapsObj: LineType
  lockLine: boolean
}
type PointerEvents = 'auto' | 'none'

const props = defineProps<Props>()
const showLabel = ref(false)
const isInscale = ref(false)

const { actionStyle, handleMouseMove, handleMouseDown, labelContent, startValue } = useLine(
  props,
  props.vertical
)
const showLine = computed(() => startValue.value >= props.start)

const combinedStyle = computed(() => {
  const { lineType, lockLineColor, lineColor } = props.palette
  const borderColor = props.lockLine ? lockLineColor : (lineColor ?? 'black')
  const pointerEvents: PointerEvents = props.lockLine || isInscale.value ? 'none' : 'auto'
  const cursor =
    props.isShowReferLine && !props.lockLine
      ? props.vertical
        ? 'ns-resize'
        : 'ew-resize'
      : 'default'
  const borderProperty = props.vertical ? 'borderTop' : 'borderLeft'
  const offsetPx = (startValue.value - props.start) * props.scale
  return {
    [borderProperty]: `1px ${lineType} ${borderColor}`,
    'pointer-events': pointerEvents,
    cursor,
    [props.vertical ? 'top' : 'left']: `${offsetPx}px`
  }
})

onMounted(() => {
  startValue.value = props.value ?? 0
})

// 使用防抖函数
const deactivateAfterDelay = debounce(() => {
  isInscale.value = false
}, 1000)
watch([() => props.scale], () => {
  isInscale.value = true
  deactivateAfterDelay()
})
const handleMouseenter = () => {
  if (!props.lockLine) {
    showLabel.value = true
  }
}
</script>
