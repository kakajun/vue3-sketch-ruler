<template>
  <div class="minimap-container" :style="containerStyle">
    <canvas
      ref="canvasRef"
      class="minimap-canvas"
      :width="resolution"
      :height="resolution"
      @click="handleClick"
      @mousedown="handleMouseDown"
    />
    <div
      class="minimap-viewport"
      :style="viewportStyle"
      @mousedown="handleViewportMouseDown"
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
  resolution?: number
}

const props = withDefaults(defineProps<Props>(), {
  resolution: 256
})

const emit = defineEmits<{
  (e: 'navigate', x: number, y: number): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const dragging = ref(false)

const containerStyle = computed(() => ({
  width: props.resolution + 'px',
  height: props.resolution + 'px'
}))

// 计算缩略图缩放比例，使内容适配 minimap
const miniScale = computed(() => {
  const scaleX = props.resolution / props.contentWidth
  const scaleY = props.resolution / props.contentHeight
  return Math.min(scaleX, scaleY)
})

const viewportStyle = computed(() => {
  const s = miniScale.value
  const left = -props.viewportX * s / props.scale
  const top = -props.viewportY * s / props.scale
  const width = props.viewportWidth * s / props.scale
  const height = props.viewportHeight * s / props.scale
  return {
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px'
  }
})

function drawMinimap(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const r = props.resolution
  ctx.clearRect(0, 0, r, r)

  // 绘制内容区域轮廓
  const s = miniScale.value
  const cw = props.contentWidth * s
  const ch = props.contentHeight * s
  const ox = (r - cw) / 2
  const oy = (r - ch) / 2

  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(ox, oy, cw, ch)
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 1
  ctx.strokeRect(ox, oy, cw, ch)

  // 绘制中心点标记
  ctx.fillStyle = '#51d6a9'
  ctx.beginPath()
  ctx.arc(r / 2, r / 2, 2, 0, Math.PI * 2)
  ctx.fill()
}

watch(
  () => [props.contentWidth, props.contentHeight, props.viewportX, props.viewportY],
  () => {
    drawMinimap()
  },
  { deep: true, flush: 'post' }
)

onMounted(() => {
  drawMinimap()
})

function handleClick(e: MouseEvent): void {
  if (dragging.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = (e.clientX - rect.left) / miniScale.value
  const y = (e.clientY - rect.top) / miniScale.value
  emit('navigate', x, y)
}

function handleMouseDown(e: MouseEvent): void {
  if ((e.target as HTMLElement).classList.contains('minimap-viewport')) return
  startDrag(e)
}

function handleViewportMouseDown(e: MouseEvent): void {
  e.stopPropagation()
  startDrag(e)
}

function startDrag(e: MouseEvent): void {
  dragging.value = false
  const startX = e.clientX
  const startY = e.clientY
  const startViewportX = props.viewportX
  const startViewportY = props.viewportY

  const onMove = (ev: MouseEvent): void => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragging.value = true
    }
    const scale = props.scale / miniScale.value
    emit('navigate', startViewportX - dx * scale, startViewportY - dy * scale)
  }

  const onUp = (): void => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    setTimeout(() => { dragging.value = false }, 50)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style lang="scss" scoped>
.minimap-container {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.minimap-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.minimap-viewport {
  position: absolute;
  border: 2px solid #51d6a9;
  background: rgba(81, 214, 169, 0.1);
  cursor: move;
  pointer-events: auto;
}
</style>
