<template>
  <div
    class="ruler-line"
    :class="{ locked: line.locked, vertical: isVertical }"
    :style="lineStyle"
    @mousedown="handleMouseDown"
  >
    <span v-if="!line.locked" class="ruler-line-label">{{ Math.round(line.position) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GuideLine, RulerPalette } from '../state/ruler-context'

interface Props {
  line: GuideLine
  scale: number
  offset: number
  thick: number
  palette: RulerPalette
  containerWidth: number
  containerHeight: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [id: string, position: number]
  delete: [id: string]
}>()

const isVertical = computed(() => props.line.orientation === 'v')

const lineStyle = computed(() => {
  const pos = props.line.position * props.scale + props.offset
  const color = props.line.locked ? props.palette.guideLineLockedColor : props.palette.guideLineColor

  if (isVertical.value) {
    return {
      left: `${pos}px`,
      top: 0,
      height: `${props.containerHeight}px`,
      borderLeft: `1px dashed ${color}`,
      cursor: props.line.locked ? 'not-allowed' : 'ew-resize'
    }
  }
  return {
    top: `${pos}px`,
    left: 0,
    width: `${props.containerWidth}px`,
    borderBottom: `1px dashed ${color}`,
    cursor: props.line.locked ? 'not-allowed' : 'ns-resize'
  }
})

function handleMouseDown(e: MouseEvent): void {
  if (props.line.locked) return

  const startPos = props.line.position
  const startClient = isVertical.value ? e.clientX : e.clientY

  const onMouseMove = (moveEvent: MouseEvent): void => {
    const currentClient = isVertical.value ? moveEvent.clientX : moveEvent.clientY
    const delta = (currentClient - startClient) / props.scale
    const newPosition = startPos + delta

    // 越界检测：拖出画布外则删除
    const screenPos = newPosition * props.scale + props.offset
    const limit = isVertical.value ? props.containerWidth : props.containerHeight
    if (screenPos < -10 || screenPos > limit + 10) {
      emit('delete', props.line.id)
      cleanup()
      return
    }

    emit('update', props.line.id, Math.round(newPosition))
  }

  const onMouseUp = (): void => {
    cleanup()
  }

  const cleanup = (): void => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}
</script>

<style lang="scss" scoped>
.ruler-line {
  position: absolute;
  pointer-events: auto;
  user-select: none;

  &.locked {
    pointer-events: none;
  }
}

.ruler-line-label {
  position: absolute;
  background: v-bind('palette.hoverBg');
  color: v-bind('palette.hoverColor');
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;

  .ruler-line:hover & {
    opacity: 1;
  }
}
</style>
