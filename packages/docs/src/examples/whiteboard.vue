<template>
  <div class="whiteboard" ref="wrapperRef">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="tool-group">
        <button
          v-for="t in tools"
          :key="t.id"
          :class="['tool-btn', { active: tool === t.id }]"
          :title="t.label"
          @click="tool = t.id"
        >
          <span class="tool-icon" v-html="toolIcons[t.id]" />
        </button>
      </div>
      <div class="divider" />
      <div class="color-group">
        <button
          v-for="c in colors"
          :key="c"
          :class="['color-btn', { active: currentColor === c }]"
          :style="{ background: c }"
          @click="currentColor = c"
        />
      </div>
      <div class="divider" />
      <button class="tool-btn" title="清空画布" @click="clearAll">🗑️</button>
    </div>

    <!-- 画布区 -->
    <div class="canvas-wrapper" ref="canvasWrapperRef" :class="cursorClass">
      <canvas ref="canvasRef" />
      <div class="hud">
        <span>缩放: {{ (scale * 100).toFixed(0) }}%</span>
        <span>元素: {{ elements.length }}</span>
        <span class="hint">Ctrl+滚轮缩放 | 空格拖拽 | Delete 删除</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TransformEngine } from '@sketch-ruler/core'
import { InputManager } from '@sketch-ruler/canvas'

/* ---------- 类型 ---------- */
interface Point {
  x: number
  y: number
}

type ElementType = 'rect' | 'ellipse' | 'line' | 'freedraw' | 'text'

interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  w: number
  h: number
  color: string
  strokeWidth: number
  selected: boolean
}

interface FreedrawElement extends BaseElement {
  type: 'freedraw'
  points: Point[]
}

interface TextElement extends BaseElement {
  type: 'text'
  text: string
}

interface LineElement extends BaseElement {
  type: 'line'
}

interface RectElement extends BaseElement {
  type: 'rect'
}

interface EllipseElement extends BaseElement {
  type: 'ellipse'
}

type Element = RectElement | EllipseElement | LineElement | FreedrawElement | TextElement

type Tool = 'select' | 'freedraw' | 'rect' | 'ellipse' | 'line' | 'text'

/* ---------- 状态 ---------- */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const canvasWrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const scale = ref(1)
const cursorClass = ref('')
const tool = ref<Tool>('select')
const currentColor = ref('#333333')
const defaultElements = (): Element[] => [
  {
    id: 'el-1',
    type: 'text',
    x: -280,
    y: -200,
    w: 0,
    h: 0,
    text: 'vue3-sketch-ruler 无限白板',
    color: '#333333',
    strokeWidth: 0,
    selected: false
  },
  {
    id: 'el-2',
    type: 'rect',
    x: -260,
    y: -120,
    w: 180,
    h: 120,
    color: '#1971c2',
    strokeWidth: 2,
    selected: false
  },
  {
    id: 'el-3',
    type: 'ellipse',
    x: 40,
    y: -120,
    w: 160,
    h: 120,
    color: '#2f9e44',
    strokeWidth: 2,
    selected: false
  },
  {
    id: 'el-4',
    type: 'line',
    x: -260,
    y: 80,
    w: 240,
    h: 140,
    color: '#f08c00',
    strokeWidth: 2,
    selected: false
  },
  {
    id: 'el-5',
    type: 'freedraw',
    x: 20,
    y: 60,
    w: 180,
    h: 60,
    points: [
      { x: 20, y: 120 },
      { x: 50, y: 70 },
      { x: 80, y: 120 },
      { x: 110, y: 70 },
      { x: 140, y: 120 },
      { x: 170, y: 70 },
      { x: 200, y: 120 }
    ],
    color: '#9c36b5',
    strokeWidth: 2,
    selected: false
  },
  {
    id: 'el-6',
    type: 'ellipse',
    x: -80,
    y: 200,
    w: 200,
    h: 100,
    color: '#e03131',
    strokeWidth: 2,
    selected: false
  },
  {
    id: 'el-7',
    type: 'text',
    x: -60,
    y: 235,
    w: 0,
    h: 0,
    text: 'Ctrl+滚轮缩放  空格拖拽',
    color: '#333333',
    strokeWidth: 0,
    selected: false
  }
]

const elements = ref<Element[]>(defaultElements())
const isSpacePressed = ref(false)

let idCounter = 7
const generateId = () => `el-${++idCounter}`

const tools = [
  { id: 'select' as Tool, label: '选择' },
  { id: 'freedraw' as Tool, label: '手绘' },
  { id: 'rect' as Tool, label: '矩形' },
  { id: 'ellipse' as Tool, label: '圆形' },
  { id: 'line' as Tool, label: '直线' },
  { id: 'text' as Tool, label: '文本' }
]

const toolIcons: Record<Tool, string> = {
  select:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>',
  freedraw:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  rect:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  ellipse:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>',
  line:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>',
  text:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2M9 20h6M12 5v15"/></svg>'
}

const colors = ['#333333', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5']

/* ---------- 引擎 ---------- */
const engine = new TransformEngine(
  { x: 0, y: 0, scale: 1 },
  { minZoom: 0.1, maxZoom: 5, enableAnimation: false }
)

let inputManager: InputManager | null = null
let unsubscribe: (() => void) | null = null

/* ---------- 尺寸 ---------- */
const updateDimensions = () => {
  if (canvasWrapperRef.value) {
    rectWidth.value = canvasWrapperRef.value.clientWidth
    rectHeight.value = canvasWrapperRef.value.clientHeight
  }
  if (canvasRef.value) {
    canvasRef.value.width = rectWidth.value
    canvasRef.value.height = rectHeight.value
  }
}

/* ---------- 拖拽状态 ---------- */
interface DragState {
  type: 'move' | 'create' | 'pan'
  el?: Element
  offsetX?: number
  offsetY?: number
  startX?: number
  startY?: number
  startScreenX?: number
  startScreenY?: number
  startOffsetX?: number
  startOffsetY?: number
}

let dragState: DragState | null = null

const getMousePos = (e: MouseEvent) => ({
  screenX: e.offsetX,
  screenY: e.offsetY
})

/* ---------- 数学工具 ---------- */
function distToSegment(p: Point, v: Point, w: Point): number {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y)
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)))
}

/* ---------- Hit Test ---------- */
function hitTest(el: Element, wx: number, wy: number): boolean {
  const padding = 6
  switch (el.type) {
    case 'rect':
      return (
        wx >= el.x - padding &&
        wx <= el.x + el.w + padding &&
        wy >= el.y - padding &&
        wy <= el.y + el.h + padding
      )
    case 'ellipse': {
      const cx = el.x + el.w / 2
      const cy = el.y + el.h / 2
      const rx = Math.abs(el.w) / 2 + padding
      const ry = Math.abs(el.h) / 2 + padding
      const dx = wx - cx
      const dy = wy - cy
      return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.2
    }
    case 'line':
      return (
        distToSegment(
          { x: wx, y: wy },
          { x: el.x, y: el.y },
          { x: el.x + el.w, y: el.y + el.h }
        ) < 8
      )
    case 'freedraw':
      return el.points.some((p) => Math.hypot(p.x - wx, p.y - wy) < 12)
    case 'text':
      return wx >= el.x && wx <= el.x + el.w && wy >= el.y && wy <= el.y + el.h
  }
  return false
}

/* ---------- 手绘风格渲染 ---------- */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647 - 0.5
  }
}

function roughLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed = 1
) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const seg = Math.max(2, Math.floor(len / 12))
  const dx = (x2 - x1) / seg
  const dy = (y2 - y1) / seg
  const rnd = seededRandom(seed)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  for (let i = 1; i < seg; i++) {
    ctx.lineTo(x1 + dx * i + rnd() * 2.5, y1 + dy * i + rnd() * 2.5)
  }
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function roughRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed = 1) {
  roughLine(ctx, x, y, x + w, y, seed)
  roughLine(ctx, x + w, y, x + w, y + h, seed + 7)
  roughLine(ctx, x + w, y + h, x, y + h, seed + 13)
  roughLine(ctx, x, y + h, x, y, seed + 19)
}

function roughEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed = 1
) {
  const seg = 20
  const rnd = seededRandom(seed)
  ctx.beginPath()
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2
    const px = cx + Math.cos(a) * rx + rnd() * 2
    const py = cy + Math.sin(a) * ry + rnd() * 2
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
}

/* ---------- 绘制元素 ---------- */
function drawElement(ctx: CanvasRenderingContext2D, el: Element) {
  ctx.strokeStyle = el.color
  ctx.fillStyle = el.color
  ctx.lineWidth = el.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (el.type) {
    case 'rect': {
      if (el.w !== 0 && el.h !== 0) {
        roughRect(ctx, el.x, el.y, el.w, el.h, el.id.charCodeAt(3))
      }
      break
    }
    case 'ellipse': {
      if (el.w !== 0 && el.h !== 0) {
        roughEllipse(ctx, el.x + el.w / 2, el.y + el.h / 2, Math.abs(el.w) / 2, Math.abs(el.h) / 2, el.id.charCodeAt(3))
      }
      break
    }
    case 'line': {
      if (el.w !== 0 || el.h !== 0) {
        roughLine(ctx, el.x, el.y, el.x + el.w, el.y + el.h, el.id.charCodeAt(3))
      }
      break
    }
    case 'freedraw': {
      const pts = el.points
      if (pts.length < 2) break
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y)
      }
      ctx.stroke()
      break
    }
    case 'text': {
      ctx.font = '20px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      const lines = el.text.split('\n')
      const lh = 26
      lines.forEach((line, i) => {
        ctx.fillText(line, el.x, el.y + i * lh)
      })
      // 首次渲染后计算包围盒
      if (el.w === 0 && lines.length > 0) {
        const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width))
        el.w = maxW
        el.h = lines.length * lh
      }
      break
    }
  }
}

function drawSelectionBox(ctx: CanvasRenderingContext2D, el: Element) {
  ctx.save()
  ctx.strokeStyle = '#409eff'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])

  let bx: number, by: number, bw: number, bh: number
  if (el.type === 'line') {
    bx = Math.min(el.x, el.x + el.w) - 6
    by = Math.min(el.y, el.y + el.h) - 6
    bw = Math.abs(el.w) + 12
    bh = Math.abs(el.h) + 12
  } else {
    bx = el.x - 4
    by = el.y - 4
    bw = (el.w || 0) + 8
    bh = (el.h || 0) + 8
  }

  ctx.strokeRect(bx, by, bw, bh)
  ctx.setLineDash([])

  // 四角手柄
  ctx.fillStyle = '#409eff'
  const handles = [
    [bx, by],
    [bx + bw, by],
    [bx, by + bh],
    [bx + bw, by + bh]
  ]
  handles.forEach(([hx, hy]) => {
    ctx.fillRect(hx - 3, hy - 3, 6, 6)
  })
  ctx.restore()
}

/* ---------- 绘制网格 ---------- */
function drawDotGrid(ctx: CanvasRenderingContext2D, state: { scale: number }) {
  const gridSize = 20
  const w = rectWidth.value
  const h = rectHeight.value
  const topLeft = engine.toWorldPoint(0, 0)
  const bottomRight = engine.toWorldPoint(w, h)

  const startX = Math.floor(topLeft.x / gridSize) * gridSize
  const startY = Math.floor(topLeft.y / gridSize) * gridSize

  ctx.fillStyle = '#dcdcdc'
  const radius = Math.max(0.8, 1.2 / state.scale)

  for (let x = startX; x <= bottomRight.x; x += gridSize) {
    for (let y = startY; y <= bottomRight.y; y += gridSize) {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

/* ---------- 主绘制 ---------- */
const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const state = engine.getState()
  scale.value = state.scale

  ctx.clearRect(0, 0, rectWidth.value, rectHeight.value)
  ctx.save()
  ctx.setTransform(state.scale, 0, 0, state.scale, state.x, state.y)

  drawDotGrid(ctx, state)

  elements.value.forEach((el) => {
    drawElement(ctx, el)
    if (el.selected) drawSelectionBox(ctx, el)
  })

  ctx.restore()
}

/* ---------- 交互 ---------- */
const deselectAll = () => {
  elements.value.forEach((el) => (el.selected = false))
}

const clearAll = () => {
  elements.value = []
  dragState = null
}

const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  // 空格按下时让 InputManager 处理画布平移，自身不拦截
  if (isSpacePressed.value) return

  const { screenX, screenY } = getMousePos(e)
  const world = engine.toWorldPoint(screenX, screenY)

  if (tool.value === 'select') {
    e.stopPropagation()
    // 倒序查找，后画的在上面
    for (let i = elements.value.length - 1; i >= 0; i--) {
      const el = elements.value[i]
      if (hitTest(el, world.x, world.y)) {
        deselectAll()
        el.selected = true
        dragState = {
          type: 'move',
          el,
          offsetX: world.x - el.x,
          offsetY: world.y - el.y
        }
        draw()
        return
      }
    }
    deselectAll()
    draw()
    return
  }

  // 绘制工具
  e.stopPropagation()
  deselectAll()

  if (tool.value === 'freedraw') {
    const newEl: FreedrawElement = {
      id: generateId(),
      type: 'freedraw',
      x: world.x,
      y: world.y,
      w: 0,
      h: 0,
      points: [{ x: world.x, y: world.y }],
      color: currentColor.value,
      strokeWidth: 2,
      selected: false
    }
    elements.value.push(newEl)
    dragState = { type: 'create', el: newEl }
  } else if (tool.value === 'rect' || tool.value === 'ellipse' || tool.value === 'line') {
    const newEl: Element = {
      id: generateId(),
      type: tool.value as ElementType,
      x: world.x,
      y: world.y,
      w: 0,
      h: 0,
      color: currentColor.value,
      strokeWidth: 2,
      selected: false
    }
    elements.value.push(newEl)
    dragState = { type: 'create', el: newEl, startX: world.x, startY: world.y }
  } else if (tool.value === 'text') {
    const text = window.prompt('请输入文本', '文本')
    if (text) {
      const newEl: TextElement = {
        id: generateId(),
        type: 'text',
        x: world.x,
        y: world.y,
        w: 0,
        h: 0,
        text,
        color: currentColor.value,
        strokeWidth: 0,
        selected: true
      }
      elements.value.push(newEl)
      draw()
    }
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!dragState) return
  const { screenX, screenY } = getMousePos(e)
  const world = engine.toWorldPoint(screenX, screenY)

  if (dragState.type === 'move' && dragState.el) {
    dragState.el.x = world.x - (dragState.offsetX || 0)
    dragState.el.y = world.y - (dragState.offsetY || 0)
    draw()
  } else if (dragState.type === 'create' && dragState.el) {
    const el = dragState.el
    if (el.type === 'freedraw') {
      ;(el as FreedrawElement).points.push({ x: world.x, y: world.y })
      // 更新包围盒用于 hitTest
      const xs = (el as FreedrawElement).points.map((p) => p.x)
      const ys = (el as FreedrawElement).points.map((p) => p.y)
      el.x = Math.min(...xs)
      el.y = Math.min(...ys)
      el.w = Math.max(...xs) - el.x
      el.h = Math.max(...ys) - el.y
    } else if (el.type === 'rect' || el.type === 'ellipse') {
      el.x = Math.min(dragState.startX || 0, world.x)
      el.y = Math.min(dragState.startY || 0, world.y)
      el.w = Math.abs(world.x - (dragState.startX || 0))
      el.h = Math.abs(world.y - (dragState.startY || 0))
    } else if (el.type === 'line') {
      el.w = world.x - el.x
      el.h = world.y - el.y
    }
    draw()
  }
}

const handleMouseUp = () => {
  if (dragState?.type === 'create' && dragState.el) {
    // 创建完成后如果尺寸过小则移除
    const el = dragState.el
    if (
      (el.type === 'rect' || el.type === 'ellipse') &&
      (Math.abs(el.w) < 5 || Math.abs(el.h) < 5)
    ) {
      elements.value = elements.value.filter((e) => e.id !== el.id)
    } else if (el.type === 'line' && Math.abs(el.w) < 3 && Math.abs(el.h) < 3) {
      elements.value = elements.value.filter((e) => e.id !== el.id)
    }
  }
  dragState = null
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === ' ') {
    isSpacePressed.value = true
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    const before = elements.value.length
    elements.value = elements.value.filter((el) => !el.selected)
    if (elements.value.length !== before) draw()
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === ' ') {
    isSpacePressed.value = false
  }
}

/* ---------- 生命周期 ---------- */
const init = () => {
  updateDimensions()
  engine.setTransform({ scale: 1, x: rectWidth.value / 2, y: rectHeight.value / 2 })

  if (canvasRef.value) {
    inputManager = new InputManager(engine, {
      zoomStep: 0.25,
      zoomMode: 'pointer',
      viewportSize: { width: rectWidth.value, height: rectHeight.value },
      onCursorChange: (cls) => {
        cursorClass.value = cls
      }
    })
    inputManager.bind(canvasRef.value)

    canvasRef.value.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  }
}

const onResize = () => {
  updateDimensions()
  draw()
}

onMounted(() => {
  unsubscribe = engine.onUpdate(() => draw())
  init()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  unsubscribe?.()
  inputManager?.destroy()
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousedown', handleMouseDown)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  engine.destroy()
})
</script>

<style lang="scss" scoped>
.whiteboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.tool-group {
  display: flex;
  gap: 4px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: #606266;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  &.active {
    background: #ecf5ff;
    border-color: #409eff;
    color: #409eff;
  }
}

.tool-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;

  & > svg {
    width: 100%;
    height: 100%;
  }
}

.divider {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  margin: 0 4px;
}

.color-group {
  display: flex;
  gap: 4px;
}

.color-btn {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: #409eff;
  }
}

.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: default;

  &.grab {
    cursor: grab;
  }
  &.grabbing {
    cursor: grabbing;
  }
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.hud {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 16px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .hint {
    color: #a0a0a0;
  }
}
</style>
