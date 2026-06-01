<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明：该案例展示了如何在组织架构图中直接使用 @sketch-ruler/core 的 TransformEngine
      与 @sketch-ruler/canvas 的 InputManager，实现画布的缩放（Ctrl + 滚轮）与平移（空格 +
      鼠标拖动），并在 Canvas 2D 上绘制层级组织架构，节点可拖拽、连线采用正交折线。
    </div>
    <div class="toolbar">
      <div class="info" v-if="selectedNode">
        <span class="info-label">选中:</span>
        <span class="info-value">{{ selectedNode.label }} ({{ selectedNode.role || selectedNode.type }})</span>
      </div>
      <div class="spacer" />
      <div class="hud-inline">
        <span>缩放: {{ (scale * 100).toFixed(0) }}%</span>
      </div>
    </div>
    <div class="canvas-wrapper" ref="canvasWrapperRef" :class="cursorClass">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { TransformEngine } from '@sketch-ruler/core'
import { InputManager } from '@sketch-ruler/canvas'

/* ---------- 类型 ---------- */
type OrgType = 'person' | 'department'

interface OrgNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  role?: string
  type: OrgType
  color: string
}

interface OrgEdge {
  from: string
  to: string
}

/* ---------- 数据 ---------- */
const nodes = ref<OrgNode[]>([
  { id: 'ceo', x: 400, y: 40, w: 140, h: 60, label: '王总', role: 'CEO', type: 'person', color: '#1e3a5f' },

  { id: 'cto', x: 160, y: 190, w: 140, h: 55, label: '李工', role: '技术 VP', type: 'person', color: '#2e5e8e' },
  { id: 'cpo', x: 400, y: 190, w: 140, h: 55, label: '张产品', role: '产品 VP', type: 'person', color: '#2e5e8e' },
  { id: 'cdo', x: 640, y: 190, w: 140, h: 55, label: '刘设计', role: '设计 VP', type: 'person', color: '#2e5e8e' },

  { id: 'fe', x: 60, y: 340, w: 120, h: 50, label: '前端组', type: 'department', color: '#4a90c6' },
  { id: 'be', x: 200, y: 340, w: 120, h: 50, label: '后端组', type: 'department', color: '#4a90c6' },
  { id: 'qa', x: 130, y: 440, w: 120, h: 50, label: '测试组', type: 'department', color: '#4a90c6' },

  { id: 'pd1', x: 340, y: 340, w: 120, h: 50, label: '产品一部', type: 'department', color: '#4a90c6' },
  { id: 'pd2', x: 480, y: 340, w: 120, h: 50, label: '产品二部', type: 'department', color: '#4a90c6' },

  { id: 'ui', x: 600, y: 340, w: 120, h: 50, label: 'UI 组', type: 'department', color: '#4a90c6' },
  { id: 'ux', x: 740, y: 340, w: 120, h: 50, label: 'UX 组', type: 'department', color: '#4a90c6' }
])

const edges: OrgEdge[] = [
  { from: 'ceo', to: 'cto' },
  { from: 'ceo', to: 'cpo' },
  { from: 'ceo', to: 'cdo' },

  { from: 'cto', to: 'fe' },
  { from: 'cto', to: 'be' },
  { from: 'cto', to: 'qa' },

  { from: 'cpo', to: 'pd1' },
  { from: 'cpo', to: 'pd2' },

  { from: 'cdo', to: 'ui' },
  { from: 'cdo', to: 'ux' }
]

/* ---------- 状态 ---------- */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const canvasWrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const scale = ref(1)
const cursorClass = ref('')
const selectedId = ref<string | null>(null)

const selectedNode = computed(() => nodes.value.find((n) => n.id === selectedId.value) ?? null)

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

const calculateInitialTransform = () => {
  const rw = rectWidth.value
  const rh = rectHeight.value
  const contentW = 920
  const contentH = 560
  const s = Math.min((rw * 0.88) / contentW, (rh * 0.88) / contentH)
  return {
    scale: s,
    x: (rw - contentW * s) / 2,
    y: (rh - contentH * s) / 2 + 10
  }
}

/* ---------- 拖拽 ---------- */
let dragNode: OrgNode | null = null
let dragOffset = { x: 0, y: 0 }
let isSpacePressed = false

const getMousePos = (e: MouseEvent) => ({
  screenX: e.offsetX,
  screenY: e.offsetY
})

const hitTest = (worldX: number, worldY: number): OrgNode | null => {
  for (let i = nodes.value.length - 1; i >= 0; i--) {
    const n = nodes.value[i]
    if (worldX >= n.x && worldX <= n.x + n.w && worldY >= n.y && worldY <= n.y + n.h) {
      return n
    }
  }
  return null
}

const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  if (isSpacePressed) return
  e.stopPropagation()

  const { screenX, screenY } = getMousePos(e)
  const world = engine.toWorldPoint(screenX, screenY)
  const node = hitTest(world.x, world.y)

  if (node) {
    dragNode = node
    dragOffset = { x: world.x - node.x, y: world.y - node.y }
    selectedId.value = node.id
    draw()
  } else {
    selectedId.value = null
    draw()
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!dragNode) return
  const { screenX, screenY } = getMousePos(e)
  const world = engine.toWorldPoint(screenX, screenY)
  dragNode.x = world.x - dragOffset.x
  dragNode.y = world.y - dragOffset.y
  draw()
}

const handleMouseUp = () => {
  dragNode = null
}

const boundHandleMouseUp = handleMouseUp.bind(null)

/* ---------- 绘制网格 ---------- */
const drawGrid = (ctx: CanvasRenderingContext2D) => {
  const step = 50
  const minorStep = 10
  const w = rectWidth.value
  const h = rectHeight.value

  const topLeft = engine.toWorldPoint(0, 0)
  const bottomRight = engine.toWorldPoint(w, h)

  const startX = Math.floor(topLeft.x / minorStep) * minorStep
  const startY = Math.floor(topLeft.y / minorStep) * minorStep
  const endX = Math.ceil(bottomRight.x / minorStep) * minorStep
  const endY = Math.ceil(bottomRight.y / minorStep) * minorStep

  const maxLines = 300
  const hCount = Math.ceil((endX - startX) / minorStep)
  const vCount = Math.ceil((endY - startY) / minorStep)

  if (hCount > maxLines || vCount > maxLines) {
    const mainStartX = Math.floor(topLeft.x / step) * step
    const mainStartY = Math.floor(topLeft.y / step) * step
    const mainEndX = Math.ceil(bottomRight.x / step) * step
    const mainEndY = Math.ceil(bottomRight.y / step) * step
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    for (let x = mainStartX; x <= mainEndX; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, mainStartY)
      ctx.lineTo(x, mainEndY)
      ctx.stroke()
    }
    for (let y = mainStartY; y <= mainEndY; y += step) {
      ctx.beginPath()
      ctx.moveTo(mainStartX, y)
      ctx.lineTo(mainEndX, y)
      ctx.stroke()
    }
    return
  }

  ctx.strokeStyle = '#f0f0f0'
  ctx.lineWidth = 1
  for (let x = startX; x <= endX; x += minorStep) {
    ctx.beginPath()
    ctx.moveTo(x, startY)
    ctx.lineTo(x, endY)
    ctx.stroke()
  }
  for (let y = startY; y <= endY; y += minorStep) {
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
  }

  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1.5
  for (let x = startX; x <= endX; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, startY)
    ctx.lineTo(x, endY)
    ctx.stroke()
  }
  for (let y = startY; y <= endY; y += step) {
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
  }
}

/* ---------- 绘制节点 ---------- */
const drawNode = (ctx: CanvasRenderingContext2D, node: OrgNode) => {
  const { x, y, w, h, label, role, type, color } = node
  const isSelected = selectedId.value === node.id
  const r = type === 'person' ? 8 : 4

  ctx.save()

  if (isSelected) {
    ctx.shadowColor = 'rgba(64, 158, 255, 0.45)'
    ctx.shadowBlur = 14
  }

  // 背景
  ctx.fillStyle = color
  ctx.strokeStyle = isSelected ? '#409eff' : '#fff'
  ctx.lineWidth = isSelected ? 2.5 : 1.5
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
  ctx.stroke()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  if (type === 'person') {
    // 头像占位圆
    const avatarR = 14
    const avatarX = x + 28
    const avatarY = y + h / 2
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.beginPath()
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 姓名
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${13}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x + 52, y + h / 2 - 7)

    // 职位
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = `11px sans-serif`
    ctx.fillText(role || '', x + 52, y + h / 2 + 9)
  } else {
    // 部门节点
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${13}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x + w / 2, y + h / 2)
  }

  ctx.restore()
}

/* ---------- 绘制正交连线 ---------- */
const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
  const arrowSize = 6
  ctx.fillStyle = '#b0b0b0'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - arrowSize * Math.cos(angle - Math.PI / 6), y - arrowSize * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x - arrowSize * Math.cos(angle + Math.PI / 6), y - arrowSize * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

const drawEdges = (ctx: CanvasRenderingContext2D) => {
  const parentMap = new Map<string, string[]>()
  edges.forEach((e) => {
    if (!parentMap.has(e.from)) parentMap.set(e.from, [])
    parentMap.get(e.from)!.push(e.to)
  })

  ctx.save()
  ctx.strokeStyle = '#b0b0b0'
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  parentMap.forEach((childrenIds, parentId) => {
    const parent = nodes.value.find((n) => n.id === parentId)
    if (!parent) return
    const children = childrenIds
      .map((id) => nodes.value.find((n) => n.id === id))
      .filter(Boolean) as OrgNode[]
    if (children.length === 0) return

    const px = parent.x + parent.w / 2
    const py = parent.y + parent.h

    if (children.length === 1) {
      const child = children[0]
      const cx = child.x + child.w / 2
      const cy = child.y
      const midY = (py + cy) / 2
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px, midY)
      ctx.lineTo(cx, midY)
      ctx.lineTo(cx, cy)
      ctx.stroke()
      drawArrow(ctx, cx, cy, Math.PI / 2)
      return
    }

    const cxs = children.map((c) => c.x + c.w / 2)
    const minCx = Math.min(...cxs)
    const maxCx = Math.max(...cxs)
    const minCy = Math.min(...children.map((c) => c.y))
    const midY = (py + minCy) / 2

    // 主干：parent 底部 -> 水平分叉线
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, midY)
    ctx.lineTo(minCx, midY)
    ctx.stroke()

    // 水平分叉线
    ctx.beginPath()
    ctx.moveTo(minCx, midY)
    ctx.lineTo(maxCx, midY)
    ctx.stroke()

    // 各子分支
    children.forEach((child) => {
      const cx = child.x + child.w / 2
      const cy = child.y
      ctx.beginPath()
      ctx.moveTo(cx, midY)
      ctx.lineTo(cx, cy)
      ctx.stroke()
      drawArrow(ctx, cx, cy, Math.PI / 2)
    })
  })

  ctx.restore()
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

  drawGrid(ctx)
  drawEdges(ctx)
  nodes.value.forEach((node) => drawNode(ctx, node))

  ctx.restore()
}

/* ---------- 初始化 ---------- */
const init = () => {
  updateDimensions()
  const { scale, x, y } = calculateInitialTransform()
  engine.setTransform({ scale, x, y })

  if (canvasRef.value) {
    inputManager = new InputManager(engine, {
      zoomStep: 0.2,
      zoomMode: 'pointer',
      viewportSize: { width: rectWidth.value, height: rectHeight.value },
      contentSize: { width: 920, height: 560 },
      onCursorChange: (cls) => {
        cursorClass.value = cls
      }
    })
    inputManager.bind(canvasRef.value)

    canvasRef.value.addEventListener('mousedown', handleMouseDown)
    canvasRef.value.addEventListener('mousemove', handleMouseMove)
    canvasRef.value.addEventListener('mouseup', handleMouseUp)
    canvasRef.value.addEventListener('mouseleave', handleMouseUp)
    document.addEventListener('mouseup', boundHandleMouseUp)
    document.addEventListener('keydown', (e) => { if (e.key === ' ') isSpacePressed = true })
    document.addEventListener('keyup', (e) => { if (e.key === ' ') isSpacePressed = false })
  }
}

const onResize = () => {
  updateDimensions()
  draw()
}

onMounted(() => {
  unsubscribe = engine.onUpdate(() => {
    draw()
  })

  init()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  unsubscribe?.()
  inputManager?.destroy()
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousedown', handleMouseDown)
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
    canvasRef.value.removeEventListener('mouseup', handleMouseUp)
    canvasRef.value.removeEventListener('mouseleave', handleMouseUp)
  }
  document.removeEventListener('mouseup', boundHandleMouseUp)
  engine.destroy()
})
</script>

<style lang="scss" scoped>
.description {
  font-size: 14px;
  padding: 8px 16px;
  text-align: center;
  color: #666;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
}
.info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}
.info-label {
  color: #909399;
}
.info-value {
  color: #409eff;
  font-weight: 600;
}
.spacer {
  flex: 1;
}
.hud-inline {
  font-size: 12px;
  color: #909399;
}
.canvas-wrapper {
  flex: 1;
  position: relative;
  background: #fafafc;
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
</style>
