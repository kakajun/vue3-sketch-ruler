<template>
  <div :class="containerClass">
    <canvas
      ref="canvasRef"
      class="ruler"
      :style="rulerStyle"
      @pointerdown.stop="handlePointerDown"
    />
    <!-- 拖拽创建参考线预览 -->
    <div
      v-if="isCreatingLine"
      class="preview-line"
      :class="{ snapping: isSnapping }"
      :style="previewStyle"
    >
      <span class="preview-label">{{ Math.round(previewWorldPos) }}</span>
    </div>
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

// === M3 W12: 拖拽创建参考线 + 吸附预览 ===
const isCreatingLine = ref(false)
const isSnapping = ref(false)
const previewScreenPos = ref(0)
const previewWorldPos = ref(0)

const previewStyle = computed(() => {
  const pos = previewScreenPos.value
  if (props.vertical) {
    return {
      left: `${pos}px`,
      top: 0,
      height: '100%',
      width: '1px'
    }
  }
  return {
    top: `${pos}px`,
    left: 0,
    width: '100%',
    height: '1px'
  }
})

function handlePointerDown(e: PointerEvent): void {
  // 仅在标尺区域（非刻度标签区域）触发
  isCreatingLine.value = true
  isSnapping.value = false
  updatePreview(e)

  const onMove = (moveEvent: PointerEvent) => {
    updatePreview(moveEvent)
  }

  const onUp = (upEvent: PointerEvent) => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)

    if (isCreatingLine.value) {
      // 如果拖拽距离很小（< 3px），视为点击直接创建；否则按最终位置创建
      const worldPos = previewWorldPos.value
      if (worldPos >= 0) {
        emit('addLine', {
          orientation: props.vertical ? 'v' : 'h',
          position: Math.round(worldPos),
          visible: true,
          locked: false
        })
      }
    }

    isCreatingLine.value = false
    isSnapping.value = false
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function updatePreview(e: PointerEvent): void {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  const screenPos = props.vertical
    ? e.clientX - rect.left
    : e.clientY - rect.top

  // 基础世界坐标
  let worldPos = (screenPos - props.offset) / props.scale

  // 吸附检测：查找最近的刻度
  const snapThreshold = 10 / props.scale // 10 像素转换为世界坐标
  let bestTick: number | null = null
  let bestDist = Infinity

  for (const mark of ticks.value) {
    if (!mark.isMajor) continue
    const dist = Math.abs(worldPos - mark.value)
    if (dist < snapThreshold && dist < bestDist) {
      bestDist = dist
      bestTick = mark.value
    }
  }

  if (bestTick !== null) {
    worldPos = bestTick
    isSnapping.value = true
  } else {
    isSnapping.value = false
  }

  previewScreenPos.value = worldPos * props.scale + props.offset
  previewWorldPos.value = worldPos
}

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

// handleDragStart 已替换为 handlePointerDown + 吸附预览
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

.preview-line {
  position: absolute;
  pointer-events: none;
  background: v-bind('palette.guideLineColor');
  opacity: 0.5;
  z-index: 5;

  &.snapping {
    opacity: 0.9;
    background: v-bind('palette.hoverBg');
  }
}

.preview-label {
  position: absolute;
  background: v-bind('palette.hoverBg');
  color: v-bind('palette.hoverColor');
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
}
</style>
