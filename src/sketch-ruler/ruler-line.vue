<template>
  <div
    v-show="showLine"
    class="line"
    :style="{ ...offsetStyle, ...borderCursor }"
    @mouseenter="showLabel = true"
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
import { ref, computed, onMounted } from 'vue'
import useLine from './useLine'

interface Props {
  scale: number
  thick: number
  palette: { lineColor?: string }
  index: number
  start: number
  vertical: boolean
  value: number
  isShowReferLine: boolean
}
const showLabel = ref(false)
const props = defineProps<Props>()

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
  const borderColor = props.palette?.lineColor ?? 'black'
  return {
    cursor: props.isShowReferLine ? (props.vertical ? 'ns-resize' : 'ew-resize') : 'default',
    ...(props.vertical
      ? { borderTop: `1px solid ${borderColor}` }
      : { borderLeft: `1px solid ${borderColor}` })
  }
})

onMounted(() => {
  startValue.value = props.value ?? 0
})
</script>
