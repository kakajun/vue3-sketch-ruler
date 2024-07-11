<template>
  <!-- 线的显示 -->
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
const offsetLine = ref(0)
const props = defineProps<Props>()
const emit = defineEmits(['onMouseDown', 'onRelease', 'onRemove'])

const startValue = ref(props.value)
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

const actionStyle = computed(() => ({
  backgroundColor: props.palette.hoverBg,
  // padding: '5px',
  color: props.palette.hoverColor,
  [props.vertical ? 'top' : 'left']: `-8px`,
  [props.vertical ? 'left' : 'top']: `${offsetLine.value + 10}px`
}))

onMounted(() => {
  startValue.value = props.value ?? 0
})

function handleMouseDown(e: MouseEvent) {
  const startPosition = props.vertical ? e.clientY : e.clientX
  const initialValue = startValue.value

  const moveHandler = (e: MouseEvent) => {
    const currentPosition = props.vertical ? e.clientY : e.clientX
    const delta = (currentPosition - startPosition) / props.scale
    startValue.value = Math.round(initialValue + delta)
    emit('onMouseDown')
  }

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener(
    'mouseup',
    () => {
      if (!showLine.value) {
        handleRemove()
      }

      document.removeEventListener('mousemove', moveHandler)
      emit('onRelease', startValue.value, props.index)
    },
    { once: true }
  )
}

function handleRemove() {
  console.log('删除', props.index)
  emit('onRemove', props.index)
}

const showLabel = ref(false)
const handleMouseMove = (event) => {
  offsetLine.value = props.vertical ? event.offsetX : event.offsetY
}

const labelContent = computed(() => {
  return `${props.vertical ? 'Y' : 'X'}：${startValue.value}`
})
</script>

<style lang="scss" scoped>
.line {
  pointer-events: auto;
  position: absolute;
  .action {
    position: absolute;
  }
}

.value {
  transform: scale(0.83);
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
