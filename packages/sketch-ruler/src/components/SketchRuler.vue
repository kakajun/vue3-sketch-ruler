<template>
  <div class="sketch-ruler" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <slot
      name="toolbar"
      :tools="{
        zoomIn,
        zoomOut,
        reset,
        setZoomMode,
        zoomToPreset,
        toggleReferLine: onCornerClick
      }"
      :state="toolbarState"
    />
    <div class="canvasedit-parent" :style="rectStyle" :class="cursorClass">
      <div ref="canvasRef" class="canvasedit" :style="canvasStyle" :class="cursorClass">
        <slot />
      </div>
    </div>

    <!-- 水平标尺 -->
    <RulerWrapperV3
      v-show="showRuler"
      :style="{ width: rectWidth + 'px' }"
      :vertical="false"
      :width="width"
      :height="thick"
      :thick="thick"
      :scale="ownScale"
      :offset="offset"
      :lines="horizontalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
      :shadow-start="shadow.x"
      :shadow-length="shadow.width"
      :render-lines-in-canvas="false"
      :canvas-size="canvasWidth"
      :show-minor-ticks="showMinorTicks"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :delete-label="deleteLabel"
      :lock-line="lockLine"
      @add-line="handleAddLine"
      @update-line="handleUpdateLine"
      @delete-line="handleDeleteLine"
    />

    <!-- 垂直标尺 -->
    <RulerWrapperV3
      v-show="showRuler"
      :style="{ height: rectHeight + 'px' }"
      :vertical="true"
      :width="thick"
      :height="height"
      :thick="thick"
      :scale="ownScale"
      :offset="offset"
      :lines="verticalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
      :shadow-start="shadow.y"
      :shadow-length="shadow.height"
      :render-lines-in-canvas="false"
      :canvas-size="canvasHeight"
      :show-minor-ticks="showMinorTicks"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :delete-label="deleteLabel"
      :lock-line="lockLine"
      @add-line="handleAddLine"
      @update-line="handleUpdateLine"
      @delete-line="handleDeleteLine"
    />

    <a v-show="showRuler" class="corner" :style="cornerStyle" @click="onCornerClick" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide, onMounted, onUnmounted } from 'vue'
import { markRaw } from 'vue'
import { useCanvasTransform } from '../composables/useCanvasTransform'
import { InputManager } from '@sketch-ruler/canvas'
import { RulerContextKey } from '../state/ruler-context'
import { importLines, generateLineId, getZoomOrigin, fitRect } from '@sketch-ruler/core'
import type { GuideLine, RulerContext, RulerPalette, ZoomMode } from '../state/ruler-context'

import RulerWrapperV3 from './RulerWrapperV3.vue'
import { PluginManager } from '@sketch-ruler/core'
import type { SketchRulerPlugin, PluginApi } from '@sketch-ruler/core'
import { eye64, closeEye64 } from './cornerImg64'

export interface SketchRulerProps {
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
  zoomMode?: ZoomMode
  /** 是否启用平滑动画 */
  enableAnimation?: boolean
  /** 插件列表 */
  plugins?: SketchRulerPlugin[]
  /** 是否自动居中画布 */
  autoCenter?: boolean
  /** 阴影区域（画布高亮） */
  shadow?: { x: number; y: number; width: number; height: number }
  /** 初始偏移（autoCenter=false 时生效） */
  initialOffset?: { x: number; y: number }
  /** 是否显示次刻度线，默认 false */
  showMinorTicks?: boolean
  paddingRatio?: number
  eyeIcon?: string
  closeEyeIcon?: string
  /** 参考线拖出画布时显示的删除提示文案 */
  deleteLabel?: string
}

const props = withDefaults(defineProps<SketchRulerProps>(), {
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
  plugins: () => [],
  autoCenter: true,
  shadow: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  initialOffset: () => ({ x: 0, y: 0 }),
  showMinorTicks: false,
  paddingRatio: 0.2,
  deleteLabel: '放开删除'
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
const rectWidth = computed(() => props.width)
const rectHeight = computed(() => props.height)

const { scale, offset, engine, setTransform, zoomBy, zoomTo, panBy, reset } = useCanvasTransform({
  initialScale: props.scale,
  initialOffset: props.initialOffset,
  minZoom: props.minZoom,
  maxZoom: props.maxZoom,
  enableAnimation: props.enableAnimation,
  animationMode: props.animationMode,
  autoCenter: props.autoCenter,
  canvasSize: { width: props.canvasWidth, height: props.canvasHeight },
  viewportSize: { width: rectWidth.value, height: rectHeight.value },
  paddingRatio: props.paddingRatio
})

const ownScale = computed(() => scale.value)

// 外部 prop 变化 → 同步到引擎，并根据 zoomMode 选择缩放原点
watch(
  () => props.scale,
  (newScale) => {
    if (newScale !== undefined && Math.abs(newScale - scale.value) > 1e-10) {
      const origin = getZoomOrigin({
        mode: props.zoomMode,
        viewportSize: { width: rectWidth.value, height: rectHeight.value },
        contentSize: { width: props.canvasWidth, height: props.canvasHeight },
        offset: { x: offset.value.x, y: offset.value.y },
        scale: scale.value
      })

      engine.zoomTo(newScale, origin.x, origin.y)
    }
  }
)

watch(
  () => props.zoomMode,
  (mode) => {
    inputManager?.setZoomMode(mode)
  }
)

watch(
  () => props.animationMode,
  (mode) => {
    if (mode) {
      engine.setAnimationMode(mode)
    }
  }
)

watch(
  () => props.paddingRatio,
  () => {
    if (props.autoCenter) {
      const fit = fitRect(
        { x: 0, y: 0, width: props.canvasWidth, height: props.canvasHeight },
        { x: 0, y: 0, width: rectWidth.value, height: rectHeight.value },
        'contain',
        props.paddingRatio
      )
      setTransform({ scale: fit.scale, x: fit.x, y: fit.y })
    }
  }
)

// 监听引擎变化，向上 emit（带防抖避免循环）
let emittingScale = false
watch(scale, (newScale) => {
  if (!emittingScale) {
    emittingScale = true
    emit('update:scale', newScale)
    requestAnimationFrame(() => {
      emittingScale = false
    })
  }
})

let emittingOffset = false
watch(
  offset,
  (newOffset) => {
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
      requestAnimationFrame(() => {
        emittingOffset = false
      })
    }
  },
  { deep: true }
)

// === 输入管理 ===
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
      contentSize: { width: props.canvasWidth, height: props.canvasHeight },
      onCursorChange: (cls) => {
        cursorClass.value = cls
      },
      zoomInterceptor: {
        beforeZoom: async (from, to, originX, originY) => {
          return await pluginManager.beforeZoom({
            from,
            to,
            center: { x: originX, y: originY },
            cancel: () => {}
          })
        },
        afterZoom: (from, to, originX, originY) => {
          pluginManager.afterZoom({
            from,
            to,
            center: { x: originX, y: originY }
          })
        }
      },
      panInterceptor: {
        beforePan: async (dx, dy) => {
          return await pluginManager.beforePan({
            offset: { ...offset.value },
            delta: { x: dx, y: dy },
            cancel: () => {}
          })
        },
        afterPan: (dx, dy) => {
          pluginManager.afterPan({
            offset: { ...offset.value },
            delta: { x: dx, y: dy }
          })
        }
      }
    })
    inputManager.bind(canvasRef.value)
    cursorClass.value = inputManager.getCursorClass()
  }
})

onUnmounted(() => {
  inputManager?.destroy()
  inputManager = null
})

const cursorClass = ref('default')

// === 参考线状态管理 ===
const guideLines = ref<GuideLine[]>(importLines(props.lines))

const horizontalLines = computed(() =>
  guideLines.value.filter((l) => l.orientation === 'h' && l.visible !== false)
)
const verticalLines = computed(() =>
  guideLines.value.filter((l) => l.orientation === 'v' && l.visible !== false)
)

// === 插件系统 ===
const pluginManager = new PluginManager()

const pluginApi: PluginApi = {
  getState: () => ({
    scale: scale.value,
    offset: { ...offset.value },
    lines: guideLines.value
  }),
  zoomBy,
  zoomTo,
  panBy,
  setTransform
}
pluginManager.setApi(pluginApi)

watch(
  () => props.plugins,
  (newPlugins, oldPlugins) => {
    if (newPlugins === oldPlugins) return
    pluginManager.clear()
    for (const plugin of newPlugins ?? []) {
      pluginManager.register(plugin)
    }
  },
  { immediate: true }
)

function syncGuideLines(newLines: { h: number[]; v: number[] }): void {
  const existing = guideLines.value
  const updated: GuideLine[] = []

  const existingH = existing.filter((l) => l.orientation === 'h')
  newLines.h.forEach((pos, idx) => {
    if (idx < existingH.length) {
      updated.push({ ...existingH[idx], position: pos })
    } else {
      updated.push({
        id: generateLineId(),
        orientation: 'h',
        position: pos,
        visible: true,
        locked: false
      })
    }
  })

  const existingV = existing.filter((l) => l.orientation === 'v')
  newLines.v.forEach((pos, idx) => {
    if (idx < existingV.length) {
      updated.push({ ...existingV[idx], position: pos })
    } else {
      updated.push({
        id: generateLineId(),
        orientation: 'v',
        position: pos,
        visible: true,
        locked: false
      })
    }
  })

  guideLines.value = updated
}

watch(
  () => props.lines,
  (newLines) => {
    if (newLines) syncGuideLines(newLines)
  },
  { deep: true }
)

// 画布/容器尺寸变化时重新居中
watch(
  [() => props.canvasWidth, () => props.canvasHeight, () => props.width, () => props.height],
  () => {
    if (!props.autoCenter) return
    const w = props.width
    const h = props.height
    const cw = props.canvasWidth
    const ch = props.canvasHeight
    if (w > 0 && h > 0 && cw > 0 && ch > 0) {
      const fit = fitRect(
        { x: 0, y: 0, width: cw, height: ch },
        { x: 0, y: 0, width: w, height: h },
        'contain',
        props.paddingRatio
      )
      setTransform({ scale: fit.scale, x: fit.x, y: fit.y })
    }
  }
)

const showReferLine = ref(props.isShowReferLine)
watch(
  () => props.isShowReferLine,
  (v) => {
    showReferLine.value = v
  }
)

watch(
  () => props.showRuler,
  (v) => {
    context.showRuler.value = v
  }
)

function getExportedLines(): { h: number[]; v: number[] } {
  const h: number[] = []
  const v: number[] = []
  for (const line of guideLines.value) {
    if (line.visible !== false) {
      if (line.orientation === 'h') h.push(line.position)
      else v.push(line.position)
    }
  }
  return { h, v }
}

const handleAddLine = (line: Omit<GuideLine, 'id'>): void => {
  const newLine: GuideLine = { ...line, id: generateLineId() }
  guideLines.value = [...guideLines.value, newLine]
  pluginManager.onLineCreate({ line: newLine })
  emit('update:lines', getExportedLines())
}

const handleUpdateLine = (id: string, position: number): void => {
  const line = guideLines.value.find((l) => l.id === id)
  if (!line) return
  const from = line.position
  guideLines.value = guideLines.value.map((l) => (l.id === id ? { ...l, position } : l))
  pluginManager.onLineMove({ line: { ...line, position }, from, to: position })
  emit('update:lines', getExportedLines())
}

const handleDeleteLine = (id: string): void => {
  const line = guideLines.value.find((l) => l.id === id)
  guideLines.value = guideLines.value.filter((l) => l.id !== id)
  if (line) {
    pluginManager.onLineDelete({ line })
  }
  emit('update:lines', getExportedLines())
}

// === provide/inject 上下文 ===
const viewportSize = ref({ width: props.width, height: props.height })
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
  shadowColor: '#e9f7fe',
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
  lines: guideLines,
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
  left: 0,
  top: 0
}))

const canvasStyle = computed(() => ({
  width: props.canvasWidth + 'px',
  height: props.canvasHeight + 'px'
}))

const cornerStyle = computed(() => ({
  width: props.thick + 'px',
  height: props.thick + 'px',
  borderRight: `1px solid ${paletteCpu.value.borderColor}`,
  borderBottom: `1px solid ${paletteCpu.value.borderColor}`,
  backgroundImage: showReferLine.value
    ? `url(${props.eyeIcon ?? eye64})`
    : `url(${props.closeEyeIcon ?? closeEye64})`
}))

// === 方法 ===
const getPointerOrigin = (): { x: number; y: number } => {
  const parent = canvasRef.value?.parentElement
  const rect = parent ? parent.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)
  return { x: rect.width / 2, y: rect.height / 2 }
}

const zoomIn = async (): Promise<void> => {
  const { x: cx, y: cy } = getPointerOrigin()
  const from = scale.value
  const to = from + props.zoomStep
  const allowed = await pluginManager.beforeZoom({
    from,
    to,
    center: { x: cx, y: cy },
    cancel: () => {}
  })
  if (allowed) {
    zoomBy(props.zoomStep, cx, cy)
    pluginManager.afterZoom({ from, to, center: { x: cx, y: cy } })
  }
}

const zoomOut = async (): Promise<void> => {
  const { x: cx, y: cy } = getPointerOrigin()
  const from = scale.value
  const to = from - props.zoomStep
  const allowed = await pluginManager.beforeZoom({
    from,
    to,
    center: { x: cx, y: cy },
    cancel: () => {}
  })
  if (allowed) {
    zoomBy(-props.zoomStep, cx, cy)
    pluginManager.afterZoom({ from, to, center: { x: cx, y: cy } })
  }
}

const onCornerClick = (): void => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}

const toolbarState = computed(() => ({
  scale: ownScale.value,
  offset: offset.value,
  zoomMode: props.zoomMode,
  showReferLine: showReferLine.value
}))

const setZoomMode = (mode: ZoomMode): void => {
  if (inputManager) {
    inputManager.setZoomMode(mode)
  }
}

const ZOOM_PRESETS = [0.1, 0.25, 0.33, 0.5, 0.66, 1, 1.5, 2, 3, 4, 6, 8, 16]

const zoomToPreset = async (preset: number): Promise<void> => {
  const target = ZOOM_PRESETS.find((p) => p >= preset) ?? ZOOM_PRESETS[ZOOM_PRESETS.length - 1]
  const { x: cx, y: cy } = getPointerOrigin()
  const from = scale.value
  const allowed = await pluginManager.beforeZoom({
    from,
    to: target,
    center: { x: cx, y: cy },
    cancel: () => {}
  })
  if (allowed) {
    zoomTo(target, cx, cy)
    pluginManager.afterZoom({ from, to: target, center: { x: cx, y: cy } })
  }
}

// === 暴露 ===
defineExpose({
  engine,
  reset,
  zoomIn,
  zoomOut,
  cursorClass,
  setTransform,
  guideLines,
  setZoomMode,
  zoomToPreset
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
    z-index: 2;
    pointer-events: auto;
    cursor: pointer;
    box-sizing: content-box;
    transition: all 0.2s ease-in-out;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
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
