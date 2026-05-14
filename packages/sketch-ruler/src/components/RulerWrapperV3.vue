<template>
  <div :class="containerClass">
    <canvas
      ref="canvasRef"
      class="ruler"
      :style="rulerStyle"
      @mousedown.stop="handleDragStart"
    />
    <div v-show="showReferLine && !renderLinesInCanvas" class="lines">
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
import { useRulerScale } from '../composables/useRulerScale'
import { Canvas2DRenderer } from '../renderers/canvas-2d-renderer'

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
  /** 参考线是否由外部 Canvas 统一绘制（M2 性能优化） */
  renderLinesInCanvas?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  renderLinesInCanvas: false
})
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

// === 接入 useRulerScale + Canvas2DRenderer ===
const viewportSize = computed(() => ({
  width: props.width,
  height: props.height
}))

const scaleRef = computed(() => props.scale)
const offsetRef = computed(() => ({
  x: props.vertical ? 0 : props.offset,
  y: props.vertical ? props.offset : 0
}))

const { ticks } = useRulerScale({
  thick: props.thick,
  viewportSize,
  scale: scaleRef,
  offset: offsetRef,
  vertical: props.vertical
})

const renderer = new Canvas2DRenderer()

function drawRuler(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = ratio.value
  canvas.width = Math.round(props.width * dpr)
  canvas.height = Math.round(props.height * dpr)

  renderer.render(ctx, [{
    type: 'ruler',
    marks: ticks.value,
    vertical: props.vertical,
    thick: props.thick,
    width: props.width,
    height: props.height,
    ratio: dpr,
    palette: props.palette
  }], {
    x: 0,
    y: 0,
    width: props.width,
    height: props.height
  })
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
