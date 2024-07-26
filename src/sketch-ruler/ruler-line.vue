<template>
  <div
    v-show="showLine"
    class="line"
    :style="{ ...offsetStyle, ...borderCursor }"
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
interface Props {
  scale: number
  thick: number
  palette: { lineColor?: string }
  index: number
  start: number
  vertical: boolean
  value: number
  canvasWidth: number
  canvasHeight: number
  lines: object
  isShowReferLine: boolean
  rate: number
  snapThreshold: number
  snapsObj: object
  lockLine: boolean
}
const showLabel = ref(false)
const props = defineProps<Props>()
const isInscale = ref(false)

const { actionStyle, handleMouseMove, handleMouseDown, labelContent, startValue } = useLine(
  props,
  props.vertical
)
const showLine = computed(() => startValue.value >= props.start)

const offsetStyle = computed(() => {
  const offsetPx = (startValue.value - props.start) * props.scale
  return props.vertical ? { top: `${offsetPx}px` } : { left: `${offsetPx}px` }
})

const borderCursor = computed(() => {
  const borderColor = props.lockLine
    ? props.palette?.lockLineColor
    : (props.palette?.lineColor ?? 'black')
  return {
    pointerEvents: props.lockLine || isInscale.value ? 'none' : 'auto',
    cursor:
      props.isShowReferLine && !props.lockLine
        ? props.vertical
          ? 'ns-resize'
          : 'ew-resize'
        : 'default',
    ...(props.vertical
      ? { borderTop: `1px solid ${borderColor}` }
      : { borderLeft: `1px solid ${borderColor}` })
  }
})

onMounted(() => {
  startValue.value = props.value ?? 0
})

// 使用防抖函数
const deactivateAfterDelay = debounce(() => {
  isInscale.value = false
}, 2000)
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
