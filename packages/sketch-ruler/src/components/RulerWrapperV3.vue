<template>
  <div :class="containerClass">
    <canvas ref="canvasRef" class="ruler" :style="rulerStyle" @mousedown.stop="handlePointerDown" />
    <!-- 拖拽创建参考线预览 -->
    <div
      v-if="isCreatingLine"
      class="preview-line"
      :style="previewStyle"
    >
      <span class="preview-label">{{ Math.round(previewWorldPos) }}</span>
    </div>
    <div v-show="showReferLine && !renderLinesInCanvas" class="lines">
      <div
        v-for="line in displayLines"
        :key="line.id"
        class="line"
        :class="{ active: activeLineId === line.id }"
        :style="lineStyle(line)"
        @mouseenter.stop="handleLineEnter(line)"
        @mouseleave.stop="handleLineLeave"
        @mousedown.stop="handleLineMouseDown(line, $event)"
      >
        <span v-if="!line.locked" class="line-label">
          {{ lineLabelText(line) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { RulerPalette } from '../state/ruler-context'
import type { GuideLine } from '../state/ruler-context'
import { useRulerScale } from '../composables/useRulerScale'
import { Canvas2DRenderer } from '@sketch-ruler/canvas'
import { getTickConfig } from '@sketch-ruler/core'

interface Props {
  vertical: boolean
  width: number
  height: number
  thick: number
  scale: number
  offset: { x: number; y: number }
  lines: GuideLine[]
  palette: RulerPalette
  showReferLine: boolean
  /** 参考线是否由外部 Canvas 统一绘制（M2 性能优化） */
  renderLinesInCanvas?: boolean
  /** 阴影起始位置（世界坐标） */
  shadowStart?: number
  /** 阴影长度（世界坐标） */
  shadowLength?: number
  /** 画布尺寸（世界坐标），用于过滤超出范围的标注 */
  canvasSize?: number
  /** 是否显示次刻度线，默认 false */
  showMinorTicks?: boolean
  /** 画布宽度（世界坐标），用于参考线越界检测 */
  canvasWidth?: number
  /** 画布高度（世界坐标），用于参考线越界检测 */
  canvasHeight?: number
  /** 参考线拖出画布时显示的删除提示文案 */
  deleteLabel?: string
  /** 是否全局锁定参考线 */
  lockLine?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  renderLinesInCanvas: false,
  canvasWidth: 1000,
  canvasHeight: 1000,
  deleteLabel: '放开删除',
  lockLine: false
})
const emit = defineEmits(['addLine', 'updateLine', 'deleteLine'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ratio = ref(typeof window !== 'undefined' ? window.devicePixelRatio : 1)

const containerClass = computed(() => (props.vertical ? 'v-container' : 'h-container'))

const rulerStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px',
  cursor: props.lockLine ? 'default' : props.vertical ? 'ew-resize' : 'ns-resize',
  [props.vertical ? 'borderRight' : 'borderBottom']: `1px solid ${props.palette.borderColor}`
}))

const displayLines = computed(() => props.lines)

// === 已存在参考线交互 ===
const activeLineId = ref<string | null>(null)
const draggingLinePos = ref<number | null>(null)

// 缩放期间临时禁用参考线交互，防止滚轮事件被参考线拦截导致页面缩放
const isInScale = ref(false)
let scaleTimer: ReturnType<typeof setTimeout> | null = null
const deactivateAfterDelay = (): void => {
  if (scaleTimer) clearTimeout(scaleTimer)
  scaleTimer = setTimeout(() => {
    isInScale.value = false
  }, 1000)
}

watch(
  () => props.scale,
  () => {
    isInScale.value = true
    deactivateAfterDelay()
  }
)

function handleLineEnter(line: GuideLine): void {
  if (line.locked || props.lockLine) return
  activeLineId.value = line.id
}

function handleLineLeave(): void {
  activeLineId.value = null
}

function lineLabelText(line: GuideLine): string {
  if (activeLineId.value === line.id && draggingLinePos.value !== null) {
    const limit = props.vertical ? props.canvasWidth : props.canvasHeight
    const isOutOfCanvas = draggingLinePos.value < 0 || draggingLinePos.value > limit
    const screenPos = draggingLinePos.value * props.scale + (props.vertical ? props.offset.x : props.offset.y)
    const isOverRuler = screenPos <= props.thick
    if (isOutOfCanvas || isOverRuler) {
      return props.deleteLabel
    }
  }
  return String(Math.round(line.position))
}

function handleLineMouseDown(line: GuideLine, e: MouseEvent): void {
  if (line.locked || props.lockLine) return
  e.preventDefault()
  activeLineId.value = line.id
  draggingLinePos.value = line.position
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  const startMouse = props.vertical ? e.clientX - rect.left : e.clientY - rect.top
  const startPos = line.position
  let shouldDelete = false

  const onMove = (moveEvent: MouseEvent) => {
    const currentMouse = props.vertical
      ? moveEvent.clientX - rect.left
      : moveEvent.clientY - rect.top
    const delta = (currentMouse - startMouse) / props.scale
    let newPos = startPos + delta

    // 吸附到最近主刻度（基于当前缩放级别的刻度间隔，不依赖可见刻度数组）
    const snapThreshold = 10 / props.scale
    const interval = getTickConfig(props.scale).interval
    const gridPos = Math.round(newPos / interval) * interval
    const dist = Math.abs(newPos - gridPos)
    if (dist < snapThreshold) {
      newPos = gridPos
    }

    // 越界检测：记录是否拖出画布外，等鼠标放开时再删除
    const limit = props.vertical ? props.canvasWidth : props.canvasHeight
    const isOutOfCanvas = newPos < 0 || newPos > limit

    // 标尺区域检测：参考线被拖回到标尺区域（屏幕位置 ≤ thick）也应删除
    const screenPos = newPos * props.scale + (props.vertical ? props.offset.x : props.offset.y)
    const isOverRuler = screenPos <= props.thick

    shouldDelete = isOutOfCanvas || isOverRuler

    draggingLinePos.value = newPos

    // 始终更新位置，让线可以跟随鼠标移出画布
    emit('updateLine', line.id, Math.round(newPos))
  }

  const onUp = () => {
    if (shouldDelete) {
      emit('deleteLine', line.id)
    }
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    activeLineId.value = null
    draggingLinePos.value = null
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// === M3 W12: 拖拽创建参考线 + 吸附预览 ===
const isCreatingLine = ref(false)
const previewScreenPos = ref(0)
const previewWorldPos = ref(0)

const previewStyle = computed(() => {
  const pos = previewScreenPos.value
  const border = `1px dashed ${props.palette.guideLineColor}`
  if (props.vertical) {
    return {
      left: `${pos}px`,
      top: 0,
      height: '100%',
      width: '1px',
      borderLeft: border
    }
  }
  return {
    top: `${pos}px`,
    left: 0,
    width: '100%',
    height: '1px',
    borderBottom: border
  }
})

function handlePointerDown(e: MouseEvent): void {
  if (props.lockLine) return
  // 仅在标尺区域（非刻度标签区域）触发
  isCreatingLine.value = true
  updatePreview(e)

  const onMove = (moveEvent: MouseEvent) => {
    updatePreview(moveEvent)
  }

  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)

    if (isCreatingLine.value) {
      // 如果拖拽距离很小（< 3px），视为点击直接创建；否则按最终位置创建
      const worldPos = previewWorldPos.value
      const limit = props.vertical ? props.canvasWidth : props.canvasHeight
      const screenPos = previewScreenPos.value
      const isOverRuler = screenPos <= props.thick
      if (worldPos >= 0 && worldPos <= limit && !isOverRuler) {
        emit('addLine', {
          orientation: props.vertical ? 'v' : 'h',
          position: Math.round(worldPos),
          visible: true,
          locked: false
        })
      }
    }

    isCreatingLine.value = false
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function updatePreview(e: MouseEvent): void {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return

  const screenPos = props.vertical ? e.clientX - rect.left : e.clientY - rect.top

  // 参考线创建需要另一方向的 offset（水平标尺创建水平线需 Y 偏移，垂直标尺创建垂直线需 X 偏移）
  const canvasOffset = props.vertical ? props.offset.x : props.offset.y

  // 基础世界坐标：screenPos 是相对于标尺的坐标，需减去 thick 转换到画布坐标系
  let worldPos = (screenPos - canvasOffset) / props.scale

  // 吸附检测：吸附到最近主刻度（基于当前缩放级别的刻度间隔，不依赖可见刻度数组）
  const snapThreshold = 10 / props.scale // 10 像素转换为世界坐标
  const interval = getTickConfig(props.scale).interval
  const gridPos = Math.round(worldPos / interval) * interval
  const dist = Math.abs(worldPos - gridPos)

  if (dist < snapThreshold) {
    worldPos = gridPos
  }

  // 转回标尺容器坐标系，让预览线跟随鼠标/吸附位置
  previewScreenPos.value = worldPos * props.scale + canvasOffset
  previewWorldPos.value = worldPos
}

const lineStyle = (line: GuideLine) => {
  const canvasOffset = props.vertical ? props.offset.x : props.offset.y
  const pos = line.position * props.scale + canvasOffset
  const cursor =
    line.locked || props.lockLine ? 'default' : props.vertical ? 'ew-resize' : 'ns-resize'
  const pointerEvents: 'auto' | 'none' =
    line.locked || props.lockLine || isInScale.value ? 'none' : 'auto'
  if (props.vertical) {
    return {
      left: `${pos}px`,
      top: 0,
      height: '100vh',
      width: '1px',
      borderLeft: `1px dashed ${props.palette.guideLineColor}`,
      cursor,
      pointerEvents
    }
  }
  return {
    top: `${pos}px`,
    left: 0,
    width: '100vw',
    height: '1px',
    borderBottom: `1px dashed ${props.palette.guideLineColor}`,
    cursor,
    pointerEvents
  }
}

// === 接入 useRulerScale + Canvas2DRenderer ===
const viewportSize = computed(() => ({
  width: props.width,
  height: props.height
}))

const scaleRef = computed(() => props.scale)
const offsetRef = computed(() => ({
  x: props.vertical ? 0 : props.offset.x,
  y: props.vertical ? props.offset.y : 0
}))

const canvasSizeRef = computed(() => props.canvasSize ?? Infinity)
const showMinorTicksRef = computed(() => props.showMinorTicks ?? false)

const { ticks } = useRulerScale({
  thick: props.thick,
  viewportSize,
  scale: scaleRef,
  offset: offsetRef,
  vertical: props.vertical,
  canvasSize: canvasSizeRef,
  showMinorTicks: showMinorTicksRef
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

  renderer.render(
    ctx,
    [
      {
        type: 'ruler',
        marks: ticks.value,
        vertical: props.vertical,
        thick: props.thick,
        width: props.width,
        height: props.height,
        ratio: dpr,
        palette: props.palette,
        shadowStart: props.shadowStart,
        shadowLength: props.shadowLength,
        showShadowText: true,
        canvasSize: props.canvasSize
      }
    ],
    {
      x: 0,
      y: 0,
      width: props.width,
      height: props.height
    }
  )
}

onMounted(() => {
  drawRuler()
})

watch(
  () => [
    props.scale,
    props.offset,
    props.width,
    props.height,
    props.palette,
    props.shadowStart,
    props.shadowLength,
    props.showMinorTicks
  ],
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

.h-container {
  top: 0;
}

.v-container {
  left: 0;
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

.h-container .line {
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 4px;
  }
  &::before {
    top: -4px;
  }
  &::after {
    bottom: -4px;
  }
}

.v-container .line {
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 4px;
  }
  &::before {
    left: -4px;
  }
  &::after {
    right: -4px;
  }
}

.preview-line {
  position: absolute;
  pointer-events: none;
  z-index: 5;
}

.line-label,
.preview-label {
  position: absolute;
  color: v-bind('palette.hoverColor');
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  transform: scale(0.83);
}

.h-container .line-label,
.h-container .preview-label {
  top: 14px;
  left: 24px;
}

.v-container .line-label,
.v-container .preview-label {
  top: 24px;
  left: 10px;
}
</style>
