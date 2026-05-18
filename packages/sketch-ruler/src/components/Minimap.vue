<template>
  <div class="minimap-container" :style="containerStyle">
    <canvas
      ref="canvasRef"
      class="minimap-canvas"
      :width="props.width"
      :height="props.height"
      @pointerdown="handleCanvasPointerDown"
    />
    <div
      ref="viewportRef"
      class="minimap-viewport"
      :style="viewportStyle"
      @pointerdown="handleViewportPointerDown"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'

interface Props {
  contentWidth: number
  contentHeight: number
  viewportX: number
  viewportY: number
  viewportWidth: number
  viewportHeight: number
  scale: number
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 150
})

const emit = defineEmits<{
  (e: 'navigate', x: number, y: number): void
  (e: 'dragstart'): void
  (e: 'dragend'): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragRect = ref({ left: 0, top: 0, width: 0, height: 0 })

const containerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))

const miniScale = computed(() => {
  const scaleX = props.width / props.contentWidth
  const scaleY = props.height / props.contentHeight
  return Math.min(scaleX, scaleY)
})

const contentOffset = computed(() => {
  const s = miniScale.value
  const cw = props.contentWidth * s
  const ch = props.contentHeight * s
  return {
    x: (props.width - cw) / 2,
    y: (props.height - ch) / 2
  }
})

const viewportRect = computed(() => {
  const s = miniScale.value
  const ox = contentOffset.value.x
  const oy = contentOffset.value.y
  const left = ox + (-props.viewportX / props.scale) * s
  const top = oy + (-props.viewportY / props.scale) * s
  const width = (props.viewportWidth / props.scale) * s
  const height = (props.viewportHeight / props.scale) * s
  return { left, top, width, height }
})

const viewportStyle = computed(() => {
  const rect = dragging.value ? dragRect.value : viewportRect.value
  return {
    left: rect.left + 'px',
    top: rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
  }
})

function clampTransform(x: number, y: number): { x: number; y: number } {
  const contentW = props.contentWidth * props.scale
  const contentH = props.contentHeight * props.scale

  let cx = x
  let cy = y

  if (contentW <= props.viewportWidth) {
    cx = (props.viewportWidth - contentW) / 2
  } else {
    cx = Math.min(0, Math.max(props.viewportWidth - contentW, x))
  }

  if (contentH <= props.viewportHeight) {
    cy = (props.viewportHeight - contentH) / 2
  } else {
    cy = Math.min(0, Math.max(props.viewportHeight - contentH, y))
  }

  return { x: cx, y: cy }
}

function canPan(): boolean {
  return (
    props.contentWidth * props.scale > props.viewportWidth ||
    props.contentHeight * props.scale > props.viewportHeight
  )
}

function drawMinimap(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = props.width
  const h = props.height
  ctx.clearRect(0, 0, w, h)

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, w, h)

  const s = miniScale.value
  const cw = props.contentWidth * s
  const ch = props.contentHeight * s
  const ox = (w - cw) / 2
  const oy = (h - ch) / 2

  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  ctx.strokeRect(ox, oy, cw, ch)
}

watch(
  () => [
    props.contentWidth,
    props.contentHeight,
    props.viewportX,
    props.viewportY,
    props.scale,
    props.width,
    props.height
  ],
  () => {
    drawMinimap()
  },
  { deep: true, flush: 'post' }
)

onMounted(() => {
  drawMinimap()
})

function handleClickAt(clientX: number, clientY: number): void {
  const rect = canvasRef.value!.getBoundingClientRect()
  const ox = contentOffset.value.x
  const oy = contentOffset.value.y
  const worldX = (clientX - rect.left - ox) / miniScale.value
  const worldY = (clientY - rect.top - oy) / miniScale.value
  const transformX = props.viewportWidth / 2 - worldX * props.scale
  const transformY = props.viewportHeight / 2 - worldY * props.scale
  const clamped = clampTransform(transformX, transformY)
  emit('navigate', clamped.x, clamped.y)
}

function handleCanvasPointerDown(e: PointerEvent): void {
  if (!canPan()) {
    // 不能平移时，pointerup 再判断是否为 click
    startDrag(e, 'canvas', false)
    return
  }
  startDrag(e, 'canvas', true)
}

function handleViewportPointerDown(e: PointerEvent): void {
  e.stopPropagation()
  if (!canPan()) return
  startDrag(e, 'viewport', true)
}

function startDrag(e: PointerEvent, source: 'canvas' | 'viewport', canMove: boolean): void {
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)

  const startViewportX = props.viewportX
  const startViewportY = props.viewportY
  const startMinimapLeft = viewportRect.value.left
  const startMinimapTop = viewportRect.value.top
  const ratio = props.scale / miniScale.value

  let accDx = 0
  let accDy = 0
  let hasMoved = false
  let skipClick = false

  let pendingTargetX = startViewportX
  let pendingTargetY = startViewportY
  let emitRafId: number | null = null

  function scheduleEmit(): void {
    if (emitRafId !== null) return
    emitRafId = requestAnimationFrame(() => {
      emitRafId = null
      emit('navigate', pendingTargetX, pendingTargetY)
    })
  }

  if (canMove) {
    dragRect.value = { ...viewportRect.value }
    dragging.value = true
    emit('dragstart')
  }

  const onMove = (ev: PointerEvent): void => {
    accDx += ev.movementX
    accDy += ev.movementY

    if (Math.abs(accDx) > 3 || Math.abs(accDy) > 3) {
      skipClick = true
      if (!hasMoved && canMove) {
        hasMoved = true
      }
    }

    if (canMove) {
      const rawX = startViewportX - accDx * ratio
      const rawY = startViewportY - accDy * ratio
      const clamped = clampTransform(rawX, rawY)

      // 反推 minimap 上实际允许的位移，确保 mask 和主画布同步且不出界
      const actualDx = (startViewportX - clamped.x) / ratio
      const actualDy = (startViewportY - clamped.y) / ratio
      dragRect.value.left = startMinimapLeft + actualDx
      dragRect.value.top = startMinimapTop + actualDy

      pendingTargetX = clamped.x
      pendingTargetY = clamped.y
      scheduleEmit()
    }
  }

  const onUp = (ev: PointerEvent): void => {
    target.releasePointerCapture(ev.pointerId)
    target.removeEventListener('pointermove', onMove)
    target.removeEventListener('pointerup', onUp)
    target.removeEventListener('pointercancel', onUp)

    if (emitRafId !== null) {
      cancelAnimationFrame(emitRafId)
      emitRafId = null
    }

    if (canMove) {
      // 确保最终状态 emit 出去
      emit('navigate', pendingTargetX, pendingTargetY)
      setTimeout(() => {
        dragging.value = false
        emit('dragend')
      }, 50)
    } else if (!skipClick && source === 'canvas') {
      handleClickAt(ev.clientX, ev.clientY)
    }
  }

  target.addEventListener('pointermove', onMove)
  target.addEventListener('pointerup', onUp)
  target.addEventListener('pointercancel', onUp)
}
</script>

<style lang="scss" scoped>
.minimap-container {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.minimap-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.minimap-viewport {
  position: absolute;
  border: 1px solid #1890ff;
  background: rgba(24, 144, 255, 0.15);
  cursor: move;
  pointer-events: auto;
  box-sizing: border-box;
  will-change: left, top, width, height;
}
</style>
