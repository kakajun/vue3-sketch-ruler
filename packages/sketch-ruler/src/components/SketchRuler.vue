<template>
  <div
    ref="rootRef"
    class="sketch-ruler"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot
      name="toolbar"
      :reset="reset"
      :zoom-in="zoomIn"
      :zoom-out="zoomOut"
      :state="{ scale: ownScale, offset }"
    />
    <div
      class="canvasedit-parent"
      :style="rectStyle"
      :class="cursorClass"
    >
      <div ref="canvasRef" class="canvasedit" :class="cursorClass">
        <slot />
      </div>
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
      :offset="offset.x"
      :lines="horizontalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
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
      :offset="offset.y"
      :lines="verticalLines"
      :palette="paletteCpu"
      :show-refer-line="showReferLine"
      @add-line="handleAddLine"
      @update-line="handleUpdateLine"
    />

    <a
      v-show="showRuler"
      class="corner"
      :style="cornerStyle"
      @click="onCornerClick"
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
import RulerWrapperV3 from './RulerWrapperV3.vue'

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
  maxZoom: 10
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
  autoCenter: true,
  canvasSize: { width: props.canvasWidth, height: props.canvasHeight },
  viewportSize: { width: rectWidth.value, height: rectHeight.value },
  paddingRatio: 0.2
})

const ownScale = computed(() => scale.value)

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
      selfHandle: false
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
  stateManager.addLine(line)
  emit('update:lines', stateManager.exportToLegacy())
}

const handleUpdateLine = (id: string, position: number): void => {
  stateManager.moveLine(id, position)
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
  height: rectHeight.value + 'px'
}))

const cornerStyle = computed(() => ({
  width: props.thick + 'px',
  height: props.thick + 'px',
  borderRight: `1px solid ${paletteCpu.value.borderColor}`,
  borderBottom: `1px solid ${paletteCpu.value.borderColor}`
}))

// === 方法 ===
const zoomIn = (): void => {
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.width / 2 : 0
  const cy = rect ? rect.height / 2 : 0
  zoomBy(props.zoomStep, cx, cy)
}

const zoomOut = (): void => {
  const rect = canvasRef.value?.getBoundingClientRect()
  const cx = rect ? rect.width / 2 : 0
  const cy = rect ? rect.height / 2 : 0
  zoomBy(-props.zoomStep, cx, cy)
}

const onCornerClick = (): void => {
  showReferLine.value = !showReferLine.value
  emit('onCornerClick', showReferLine.value)
}

// === 暴露 ===
defineExpose({
  engine,
  reset,
  zoomIn,
  zoomOut,
  cursorClass,
  setTransform,
  stateManager
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
    width: v-bind("props.canvasWidth + 'px'");
    height: v-bind("props.canvasHeight + 'px'");
    transform-origin: 0 0;
  }

  .canvasedit-parent {
    position: absolute;
    left: v-bind("props.thick + 'px'");
    top: v-bind("props.thick + 'px'");
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
