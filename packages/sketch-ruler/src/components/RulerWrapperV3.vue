<template>
  <div :class="containerClass">
    <canvas
      ref="canvasRef"
      class="ruler"
      :style="rulerStyle"
      @mousedown.stop="handleDragStart"
    />
    <div v-show="showReferLine" class="lines">
      <div
        v-for="line in displayLines"
        :key="line.id"
        class="line"
        :style="lineStyle(line)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { RulerPalette } from '../state/ruler-context'
import type { GuideLine } from '../state/ruler-context'

interface Props {
  vertical: boolean
  width: number
  height: number
  thick: number
  scale: number
  offset: number
  lines: GuideLine[]
  palette: RulerPalette
  showReferLine: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['addLine', 'updateLine'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ratio = ref(typeof window !== 'undefined' ? window.devicePixelRatio : 1)

const containerClass = computed(() =>
  props.vertical ? 'v-container' : 'h-container'
)

const rulerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px',
  cursor: props.vertical ? 'ew-resize' : 'ns-resize',
  [props.vertical ? 'borderRight' : 'borderBottom']:
    `1px solid ${props.palette.borderColor}`
}))

const displayLines = computed(() => props.lines)

const lineStyle = (line: GuideLine) => {
  const pos = line.position * props.scale + props.offset + props.thick
  if (props.vertical) {
    return {
      left: `${pos}px`,
      top: 0,
      height: '100vh',
      width: '1px',
      borderLeft: `1px dashed ${props.palette.guideLineColor}`
    }
  }
  return {
    top: `${pos}px`,
    left: 0,
    width: '100vw',
    height: '1px',
    borderBottom: `1px dashed ${props.palette.guideLineColor}`
  }
}

// 简化的标尺绘制（M1 基础版，M2 将全面 Canvas 化）
function drawRuler(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = ratio.value
  canvas.width = Math.round(props.width * dpr)
  canvas.height = Math.round(props.height * dpr)

  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, props.width, props.height)

  // 背景
  ctx.fillStyle = props.palette.bgColor
  ctx.fillRect(0, 0, props.width, props.height)

  // 刻度
  ctx.fillStyle = props.palette.tickColor
  ctx.font = '10px sans-serif'
  ctx.textBaseline = 'middle'

  const scale = props.scale
  const offset = props.offset
  const isHorizontal = !props.vertical
  const size = isHorizontal ? props.width : props.height

  // 主刻度间隔（简化版，固定 50px）
  const interval = 50
  const startWorld = (-offset) / scale
  const endWorld = (size - offset) / scale
  const firstTick = Math.floor(startWorld / interval) * interval

  for (let world = firstTick; world <= endWorld; world += interval / 5) {
    const isMajor = Math.abs(world % interval) < 0.1
    const screenPos = world * scale + offset

    if (screenPos < -5 || screenPos > size + 5) continue

    ctx.beginPath()
    if (isHorizontal) {
      ctx.moveTo(screenPos, isMajor ? 0 : props.thick * 0.5)
      ctx.lineTo(screenPos, props.thick)
    } else {
      ctx.moveTo(isMajor ? 0 : props.thick * 0.5, screenPos)
      ctx.lineTo(props.thick, screenPos)
    }
    ctx.strokeStyle = props.palette.tickColor
    ctx.lineWidth = 1
    ctx.stroke()

    if (isMajor && world >= 0) {
      const label = `${Math.round(world)}`
      if (isHorizontal) {
        ctx.fillText(label, screenPos + 2, props.thick * 0.6)
      } else {
        ctx.save()
        ctx.translate(props.thick * 0.6, screenPos + 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(label, 0, 0)
        ctx.restore()
      }
    }
  }
}

onMounted(() => {
  drawRuler()
})

watch(
  () => [props.scale, props.offset, props.width, props.height, props.palette],
  () => {
    drawRuler()
  },
  { deep: true }
)

const handleDragStart = (e: MouseEvent): void => {
  // M1 简化版：直接从标尺拖拽创建参考线
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const pos = props.vertical
    ? e.clientX - rect.left
    : e.clientY - rect.top
  const worldPos = (pos - props.offset) / props.scale

  emit('addLine', {
    orientation: props.vertical ? 'v' : 'h',
    position: Math.round(worldPos),
    visible: true,
    locked: false
  })
}
</script>

<style lang="scss" scoped>
.h-container,
.v-container {
  position: absolute;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.line {
  position: absolute;
  pointer-events: auto;
}
</style>
