<template>
  <div
    ref="rootRef"
    class="sketch-ruler"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot
      name="toolbar"
      :tools="{
        zoomIn,
        zoomOut,
        reset,
        setZoomMode,
        zoomToPreset,
        toggleReferLine: onCornerClick,
        toggleLinePanel
      }"
      :state="toolbarState"
    />
    <div
      class="canvasedit-parent"
      :style="rectStyle"
      :class="cursorClass"
    >
      <div ref="canvasRef" class="canvasedit" :style="canvasStyle" :class="cursorClass">
        <slot />
      </div>
      <!-- M2: 全局参考线 Canvas 层，pointer-events: none 由 RulerLine.vue 处理交互 -->
      <canvas
        v-show="showReferLine"
        ref="guideLinesCanvasRef"
        class="guide-lines-canvas"
        :style="guideLinesCanvasStyle"
      />
    </div>

    <!-- 水平标尺 -->
    <RulerWrapperV3
      v-show="showRuler"
      :style="{ marginLeft: thick + 'px', width: rectWidth + 'px' }"
      :vertical="false"
      :width="width - thick"
      :height="thick"
      :thick="thick"
      :scale="ownScale"
      :offset="offset"
      :lines="horizontalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
      :render-lines-in-canvas="true"
      @add-line="handleAddLine"
      @update-line="handleUpdateLine"
    />

    <!-- 垂直标尺 -->
    <RulerWrapperV3
      v-show="showRuler"
      :style="{ marginTop: thick + 'px', top: 0, height: rectHeight + 'px' }"
      :vertical="true"
      :width="thick"
      :height="height - thick"
      :thick="thick"
      :scale="ownScale"
      :offset="offset"
      :lines="verticalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
      :render-lines-in-canvas="true"
      @add-line="handleAddLine"
      @update-line="handleUpdateLine"
    />

    <a
      v-show="showRuler"
      class="corner"
      :style="cornerStyle"
      @click="onCornerClick"
    />

    <RulerLinePanel
      v-if="showLinePanel"
      :lines="stateManager.getLines().value"
      @add="handlePanelAdd"
      @remove="handlePanelRemove"
      @update="handlePanelUpdate"
      @clear="handlePanelClear"
    />

    <DebugOverlay
      v-if="props.debug"
      ref="debugRef"
      :transform="{
        scale: ownScale.value,
        offsetX: offset.value.x,
        offsetY: offset.value.y
      }"
      :draw-calls="drawCallCount"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide, onMounted, onUnmounted } from 'vue'
import { markRaw } from 'vue'
import { useCanvasTransform } from '../composables/useCanvasTransform'
import { InputManager } from '../input/input-manager'
import { StateManager } from '../state/state-manager'
import { RulerContextKey } from '../state/ruler-context'
import type { GuideLine, RulerContext, RulerPalette } from '../state/ruler-context'
import { renderGuideLines } from '../renderers/guide-line-renderer'
import RulerWrapperV3 from './RulerWrapperV3.vue'
import RulerLinePanel from './RulerLinePanel.vue'
import { PluginManager } from '../plugins/plugin-manager'
import type { SketchRulerPlugin } from '../plugins/types'
import DebugOverlay from './DebugOverlay.vue'

// 2.x 兼容 props
export interface SketchRulerV3Props {
  showRuler?: boolean
  scale?: number
  thick?: number
  width?: number
  height?: number
  canvasWidth?: number
  canvasHeight?: number
  palette?: Partial<RulerPalette>
  lines?: { h: number[]; v: number[] }
  isShowReferLine?: boolean
  snapThreshold?: number
  lockLine?: boolean
  selfHandle?: boolean
  zoomStep?: number
  minZoom?: number
  maxZoom?: number
  /** 动画模式：direct | ease-out | damped | exponential */
  animationMode?: 'direct' | 'ease-out' | 'damped' | 'exponential'
  /** 缩放原点模式：pointer | viewport-center | content-center */
  zoomMode?: 'pointer' | 'viewport-center' | 'content-center'
  /** 是否启用平滑动画 */
  enableAnimation?: boolean
  /** 是否显示参考线管理面板 */
  showLinePanel?: boolean
  /** 插件列表 */
  plugins?: SketchRulerPlugin[]
  /** 是否启用调试模式 */
  debug?: boolean
}

const props = withDefaults(defineProps<SketchRulerV3Props>(), {
  showRuler: true,
  scale: 1,
  thick: 16,
  width: 1400,
  height: 800,
  canvasWidth: 700,
  canvasHeight: 700,
  palette: () => ({}),
  lines: () => ({ h: [], v: [] }),
  isShowReferLine: true,
  snapThreshold: 5,
  lockLine: false,
  selfHandle: false,
  zoomStep: 0.25,
  minZoom: 0.1,
  maxZoom: 10,
  animationMode: 'ease-out',
  zoomMode: 'pointer',
  enableAnimation: false,
  showLinePanel: false,
  plugins: () => [],
  debug: false
})

const emit = defineEmits([
  'update:scale',
  'update:offset',
  'zoomchange',
  'update:lines',
  'update:lockLine',
  'onCornerClick'
])

// === 变换引擎 ===
const rectWidth = computed(() => props.width - props.thick)
const rectHeight = computed(() => props.height - props.thick)

const { scale, offset, engine, setTransform, zoomBy, zoomTo, panBy, reset } = useCanvasTransform({
  initialScale: props.scale,
  initialOffset: { x: 0, y: 0 },
  minZoom: props.minZoom,
  maxZoom: props.maxZoom,
  enableAnimation: props.enableAnimation,
  animationMode: props.animationMode,
  autoCenter: true,
  canvasSize: { width: props.canvasWidth, height: props.canvasHeight },
  viewportSize: { width: rectWidth.value, height: rectHeight.value },
  paddingRatio: 0.2
})

const ownScale = computed(() => scale.value)

// === 插件系统 ===
const pluginManager = new PluginManager()
watch(() => props.plugins, (newPlugins) => {
  pluginManager.clear()
  for (const plugin of (newPlugins ?? [])) {
    pluginManager.register(plugin)
  }
}, { immediate: true, deep: true })

// 外部 prop 变化 → 同步到引擎
watch(() => props.scale, (newScale) => {
  if (newScale !== undefined && Math.abs(newScale - scale.value) > 1e-10) {
    engine.setTransform({ scale: newScale })
  }
})

// 监听引擎变化，向上 emit（带防抖避免循环）
let emittingScale = false
watch(scale, (newScale) => {
  if (!emittingScale) {
    emittingScale = true
    emit('update:scale', newScale)
    requestAnimationFrame(() => { emittingScale = false })
  }
})

let emittingOffset = false
watch(offset, (newOffset) => {
  if (!emittingOffset) {
    emittingOffset = true
    emit('zoomchange', {
      scale: scale.value,
      x: newOffset.x,
      y: newOffset.y
    })
    emit('update:offset', { x: newOffset.x, y: newOffset.y })
    // 同步 DOM transform
    if (canvasRef.value) {
      canvasRef.value.style.transform = `matrix(${scale.value}, 0, 0, ${scale.value}, ${newOffset.x}, ${newOffset.y})`
    }
    requestAnimationFrame(() => { emittingOffset = false })
  }
}, { deep: true })

// === 输入管理 ===
const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

let inputManager: InputManager | null = null

onMounted(() => {
  // 初始状态同步到 DOM（watch 不会在初始化时触发）
  if (canvasRef.value) {
    const s = scale.value
    const o = offset.value
    canvasRef.value.style.transform = `matrix(${s}, 0, 0, ${s}, ${o.x}, ${o.y})`
  }
  if (canvasRef.value && !props.selfHandle) {
    inputManager = new InputManager(engine, {
      zoomStep: props.zoomStep,
      selfHandle: false,
      zoomMode: props.zoomMode,
      viewportSize: { width: rectWidth.value, height: rectHeight.value },
      contentSize: { width: props.canvasWidth, height: props.canvasHeight }
    })
    inputManager.bind(canvasRef.value)
  }
})

onUnmounted(() => {
  inputManager?.destroy()
  inputManager = null
})

const cursorClass = computed(() => {
  return inputManager?.getCursorClass() ?? 'default'
})

// === 参考线状态管理 ===
const stateManager = new StateManager()
stateManager.importFromLegacy(props.lines)

const horizontalLines = computed(() =>
  stateManager.getLines().value.filter((l) => l.orientation === 'h' && l.visible !== false)
)
const verticalLines = computed(() =>
  stateManager.getLines().value.filter((l) => l.orientation === 'v' && l.visible !== false)
)

watch(
  () => props.lines,
  (newLines) => {
    stateManager.importFromLegacy(newLines)
  },
  { deep: true }
)

// 画布/容器尺寸变化时重新居中
watch(
  [() => props.canvasWidth, () => props.canvasHeight, () => props.width, () => props.height],
  () => {
    // 直接调用 setTransform 重新计算居中
    const w = props.width - props.thick
    const h = props.height - props.thick
    const cw = props.canvasWidth
    const ch = props.canvasHeight
    if (w > 0 && h > 0 && cw > 0 && ch > 0) {
      const scaleX = (w * 0.8) / cw
      const scaleY = (h * 0.8) / ch
      const newScale = Math.min(scaleX, scaleY)
      const newX = (w - cw * newScale) / 2
      const newY = (h - ch * newScale) / 2
      setTransform({ scale: newScale, x: newX, y: newY })
    }
  }
)

const showReferLine = ref(props.isShowReferLine)
watch(() => props.isShowReferLine, (v) => { showReferLine.value = v })

const handleAddLine = (line: Omit<GuideLine, 'id'>): void => {
  const newLine = stateManager.addLine(line)
  pluginManager.onLineCreate({ line: newLine })
  emit('update:lines', stateManager.exportToLegacy())
}

const handleUpdateLine = (id: string, position: number): void => {
  stateManager.moveLine(id, position)
  emit('update:lines', stateManager.exportToLegacy())
}

// === 参考线面板事件处理 ===
const handlePanelAdd = (orientation: 'h' | 'v', position?: number): void => {
  const pos = position ?? (orientation === 'h'
    ? (-offset.value.y + rectHeight.value / 2) / ownScale.value
    : (-offset.value.x + rectWidth.value / 2) / ownScale.value)
  stateManager.addLine({ orientation, position: pos, locked: false })
  emit('update:lines', stateManager.exportToLegacy())
}

const handlePanelRemove = (id: string): void => {
  const line = stateManager.getLines().value.find((l) => l.id === id)
  stateManager.removeLine(id)
  if (line) pluginManager.onLineDelete({ line })
  emit('update:lines', stateManager.exportToLegacy())
}

const handlePanelUpdate = (id: string, updates: Partial<Omit<GuideLine, 'id'>>): void => {
  const line = stateManager.getLines().value.find((l) => l.id === id)
  const prevPosition = line?.position
  stateManager.updateLine(id, updates)
  const updated = stateManager.getLines().value.find((l) => l.id === id)
  if (updated && prevPosition !== undefined && 'position' in updates && updates.position !== undefined) {
    pluginManager.onLineMove({ line: updated, from: prevPosition, to: updates.position })
  }
  emit('update:lines', stateManager.exportToLegacy())
}

const handlePanelClear = (): void => {
  const removed = [...stateManager.getLines().value]
  stateManager.clear()
  for (const line of removed) {
    pluginManager.onLineDelete({ line })
  }
  emit('update:lines', stateManager.exportToLegacy())
}

// === provide/inject 上下文 ===
const viewportSize = ref({ width: props.width - props.thick, height: props.height - props.thick })
const contentSize = ref({ width: props.canvasWidth, height: props.canvasHeight })

const paletteCpu = computed<RulerPalette>(() => ({
  bgColor: '#f6f7f9',
  tickColor: '#BABBBC',
  labelColor: '#7D8694',
  guideLineColor: '#51d6a9',
  guideLineLockedColor: '#d4d7dc',
  hoverBg: '#000',
  hoverColor: '#fff',
  borderColor: '#eeeeef',
  ...props.palette
}))

const snapConfig = {
  enabled: true,
  threshold: props.snapThreshold,
  strength: 0.5
}

const context: RulerContext = {
  scale,
  offset,
  viewportSize,
  contentSize,
  lines: stateManager.getLines(),
  snapConfig,
  palette: paletteCpu.value,
  engine: markRaw(engine),
  showRuler: ref(props.showRuler),
  showReferLine
}

provide(RulerContextKey, context)

// === 计算属性 ===
// rectWidth / rectHeight 已在变换引擎区域声明

const rectStyle = computed(() => ({
  background: paletteCpu.value.bgColor,
  width: rectWidth.value + 'px',
  height: rectHeight.value + 'px',
  left: props.thick + 'px',
  top: props.thick + 'px'
}))

const canvasStyle = computed(() => ({
  width: props.canvasWidth + 'px',
  height: props.canvasHeight + 'px'
}))

const cornerStyle = computed(() => ({
  width: props.thick + 'px',
  height: props.thick + 'px',
  borderRight: `1px solid ${paletteCpu.value.borderColor}`,
  borderBottom: `1px solid ${paletteCpu.value.borderColor}`
}))

// === M2: 全局参考线 Canvas 层 ===
const guideLinesCanvasRef = ref<HTMLCanvasElement | null>(null)
const debugRef = ref<InstanceType<typeof DebugOverlay> | null>(null)
const drawCallCount = ref(0)
const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

const guideLinesCanvasStyle = computed(() => ({
  position: 'absolute' as const,
  left: '0',
  top: '0',
  width: rectWidth.value + 'px',
  height: rectHeight.value + 'px',
  pointerEvents: 'none' as const,
  zIndex: 2
}))

function drawGuideLines(): void {
  const canvas = guideLinesCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = Math.round(rectWidth.value * dpr)
  canvas.height = Math.round(rectHeight.value * dpr)

  renderGuideLines(ctx, {
    lines: stateManager.getLines().value,
    scale: ownScale.value,
    offsetX: offset.value.x,
    offsetY: offset.value.y,
    thick: props.thick,
    width: rectWidth.value,
    height: rectHeight.value,
    ratio: dpr,
    palette: paletteCpu.value
  })
  drawCallCount.value++
}

watch(
  () => [
    stateManager.getLines().value.length,
    ownScale.value,
    offset.value.x,
    offset.value.y,
    showReferLine.value
  ],
  () => {
    drawGuideLines()
  },
  { deep: true, flush: 'post' }
)

onMounted(() => {
  drawGuideLines()
})

// === 方法 ===
const zoomIn = async (): Promise<void> => {
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.width / 2 : 0
  const cy = rect ? rect.height / 2 : 0
  const allowed = await pluginManager.beforeZoom({
    from: scale.value,
    to: scale.value + props.zoomStep,
    center: { x: cx, y: cy },
    cancel: () => {}
  })
  if (allowed) zoomBy(props.zoomStep, cx, cy)
}

const zoomOut = async (): Promise<void> => {
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.width / 2 : 0
  const cy = rect ? rect.height / 2 : 0
  const allowed = await pluginManager.beforeZoom({
    from: scale.value,
    to: scale.value - props.zoomStep,
    center: { x: cx, y: cy },
    cancel: () => {}
  })
  if (allowed) zoomBy(-props.zoomStep, cx, cy)
}

const onCornerClick = (): void => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}

const showLinePanel = ref(props.showLinePanel)
watch(() => props.showLinePanel, (v) => { showLinePanel.value = v })

const toolbarState = computed(() => ({
  scale: ownScale.value,
  offset: offset.value,
  zoomMode: props.zoomMode,
  showReferLine: showReferLine.value,
  showLinePanel: showLinePanel.value
}))

const toggleLinePanel = (): void => {
  showLinePanel.value = !showLinePanel.value
}

const setZoomMode = (mode: 'pointer' | 'viewport-center' | 'content-center'): void => {
  if (inputManager) {
    inputManager.setZoomMode(mode)
  }
}

const ZOOM_PRESETS = [0.1, 0.25, 0.33, 0.5, 0.66, 1, 1.5, 2, 3, 4, 6, 8, 16]

const zoomToPreset = (preset: number): void => {
  const target = ZOOM_PRESETS.find((p) => p >= preset) ?? ZOOM_PRESETS[ZOOM_PRESETS.length - 1]
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.width / 2 : 0
  const cy = rect ? rect.height / 2 : 0
  zoomTo(target, cx, cy)
}

// === 暴露 ===
defineExpose({
  engine,
  reset,
  zoomIn,
  zoomOut,
  cursorClass,
  setTransform,
  stateManager,
  setZoomMode,
  zoomToPreset,
  toggleLinePanel,
  debugRef
})
</script>

<style lang="scss">
.sketch-ruler {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;

  .canvasedit {
    transform-origin: 0 0;
  }

  .canvasedit-parent {
    position: absolute;
    overflow: hidden;
  }

  .corner {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: auto;
    cursor: pointer;
    box-sizing: content-box;
    transition: all 0.2s ease-in-out;
    background: v-bind("paletteCpu.bgColor");
  }

  .default {
    cursor: default !important;
  }

  .grab {
    cursor: grab !important;
  }

  .grabbing {
    cursor: grabbing !important;
  }
}
</style>
