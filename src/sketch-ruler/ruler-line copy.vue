<template>
  <!-- 线的显示 -->
  <div
    v-show="showLine"
    class="line"
    :style="{ ...offsetStyle, ...borderCursor }"
    @mouseenter="showLabel = true"
    @mouseleave="showLabel = false"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
  >
    <div class="action" :style="actionStyle">
      <span class="del" @click="handleRemove">&times;</span>
      <span class="value">{{ startValue }}</span>
    </div>
    <!-- 鼠标悬停时显示的标签 -->
    <div v-if="showLabel" class="hover-label" :style="labelStyle"> {{ labelContent }} </div>
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

const actionStyle = computed(() => {
  const offsetPx = (startValue.value - props.start) * props.scale
  return props.vertical ? { top: `${offsetPx}px` } : { left: `${offsetPx}px` }
  // [props.vertical ? 'left' : 'top']: `${props.thick}px`
})

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
      document.removeEventListener('mousemove', moveHandler)
      emit('onRelease', startValue.value, props.index)
    },
    { once: true }
  )
}

function handleRemove() {
  emit('onRemove', props.index)
}

// 定义响应式引用
const showLabel = ref(false)
const labelStyle = ref({ left: 0, top: 0 })

// 鼠标进入时显示标签
const handleMouseEnter = () => {
  showLabel.value = true
}

// 鼠标离开时隐藏标签
const handleMouseLeave = () => {
  showLabel.value = false
}

// 更新鼠标位置
const handleMouseMove = (event) => {
  console.log(event, 'event')

  labelStyle.value = {
    left: event.clientX + 'px',
    top: event.clientY + 'px'
  }
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
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    pointer-events: none;
    transform: scale(0.83);
  }
  .del {
    padding: 3px 5px;
    cursor: pointer;
    visibility: hidden;
  }
  &:hover .del {
    visibility: visible;
  }
}

.hover-label {
  position: absolute;
  color: white;
  background-color: black;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
