<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明：该案例展示了如何在流程编辑器中直接使用 @sketch-ruler/core 的 TransformEngine
      与 @sketch-ruler/canvas 的 InputManager，实现画布的缩放（Ctrl + 滚轮）与平移（空格 +
      鼠标拖动），并在 Canvas 2D 上绘制可拖拽的流程节点与连线。
    </div>
    <div class="canvas-wrapper" ref="canvasWrapperRef" :class="cursorClass">
      <canvas ref="canvasRef" />
      <div class="hud">
        <span>缩放: {{ (scale * 100).toFixed(0) }}%</span>
        <span v-if="selectedId">选中: {{ selectedNode?.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { TransformEngine } from '@sketch-ruler/core'
import { InputManager } from '@sketch-ruler/canvas'

interface FlowNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  color: string
  type: 'start' | 'process' | 'decision' | 'end'
}

interface FlowEdge {
  from: string
  to: string
  label?: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const canvasWrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const scale = ref(1)
const cursorClass = ref('')
const selectedId = ref<string | null>(null)

const nodes = ref<FlowNode[]>([
  { id: 'start', x: 100, y: 240, w: 100, h: 50, label: '开始', color: '#67c23a', type: 'start' },
  { id: 'process1', x: 300, y: 240, w: 130, h: 50, label: '数据校验', color: '#409eff', type: 'process' },
  { id: 'decision', x: 550, y: 230, w: 130, h: 70, label: '是否通过?', color: '#e6a23c', type: 'decision' },
  { id: 'process2', x: 550, y: 420, w: 130, h: 50, label: '人工审核', color: '#409eff', type: 'process' },
  { id: 'end', x: 820, y: 240, w: 100, h: 50, label: '结束', color: '#f56c6c', type: 'end' }
])

const edges: FlowEdge[] = [
  { from: 'start', to: 'process1' },
  { from: 'process1', to: 'decision' },
  { from: 'decision', to: 'end', label: '是' },
  { from: 'decision', to: 'process2', label: '否' },
  { from: 'process2', to: 'end' }
]

const selectedNode = computed(() => nodes.value.find((n) => n.id === selectedId.value) ?? null)

const engine = new TransformEngine(
  { x: 0, y: 0, scale: 1 },
  { minZoom: 0.1, maxZoom: 5, enableAnimation: false }
)

let inputManager: InputManager | null = null
let unsubscribe: (() => void) | null = null
let rafId: number | null = null

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
  const contentW = 960
  const contentH = 520
  const s = Math.min((rw * 0.85) / contentW, (rh * 0.85) / contentH)
  return {
    scale: s,
    x: (rw - contentW * s) / 2,
    y: (rh - contentH * s) / 2
  }
}

let dragNode: FlowNode | null = null
let dragOffset = { x: 0, y: 0 }
let isSpacePressed = false

const getMousePos = (e: MouseEvent) => {
  // 使用 offsetX/offsetY，浏览器已自动处理 CSS 尺寸与 canvas 内部坐标映射
  return {
    screenX: e.offsetX,
    screenY: e.offsetY
  }
}

const hitTest = (worldX: number, worldY: number): FlowNode | null => {
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
  // 空格按下时让 InputManager 处理画布平移，自身不拦截
  if (isSpacePressed) return

  // 阻止冒泡，避免与 InputManager 在 parent 上的 mousedown 产生冲突
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

// 用于 document 级别的 mouseup，防止鼠标移出 canvas 后释放导致拖拽状态未清除
const boundHandleMouseUp = handleMouseUp.bind(null)

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

  // 限制绘制范围，避免缩极小时绘制数万条线导致卡顿
  const maxLines = 300
  const hCount = Math.ceil((endX - startX) / minorStep)
  const vCount = Math.ceil((endY - startY) / minorStep)

  if (hCount > maxLines || vCount > maxLines) {
    // 网格过密时只画主网格
    const mainStartX = Math.floor(topLeft.x / step) * step
    const mainStartY = Math.floor(topLeft.y / step) * step
    const mainEndX = Math.ceil(bottomRight.x / step) * step
    const mainEndY = Math.ceil(bottomRight.y / step) * step

    ctx.strokeStyle = '#d0d0d0'
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

  // 次网格
  ctx.strokeStyle = '#eaeaea'
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

  // 主网格
  ctx.strokeStyle = '#d0d0d0'
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

const drawNode = (ctx: CanvasRenderingContext2D, node: FlowNode) => {
  const r = 6
  const isSelected = selectedId.value === node.id

  ctx.save()

  if (isSelected) {
    ctx.shadowColor = 'rgba(64, 158, 255, 0.5)'
    ctx.shadowBlur = 12
  }

  ctx.fillStyle = node.color
  ctx.beginPath()
  ctx.roundRect(node.x, node.y, node.w, node.h, r)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  ctx.strokeStyle = isSelected ? '#409eff' : '#fff'
  ctx.lineWidth = isSelected ? 2.5 : 1.5
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = `bold ${14}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(node.label, node.x + node.w / 2, node.y + node.h / 2)

  ctx.restore()
}

const drawEdge = (ctx: CanvasRenderingContext2D, edge: FlowEdge) => {
  const from = nodes.value.find((n) => n.id === edge.from)
  const to = nodes.value.find((n) => n.id === edge.to)
  if (!from || !to) return

  const x1 = from.x + from.w
  const y1 = from.y + from.h / 2
  const x2 = to.x
  const y2 = to.y + to.h / 2

  const cp1x = x1 + (x2 - x1) * 0.5
  const cp1y = y1
  const cp2x = x2 - (x2 - x1) * 0.5
  const cp2y = y2

  ctx.save()
  ctx.strokeStyle = '#909399'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2)
  ctx.stroke()

  const arrowSize = 8
  const angle = Math.atan2(y2 - cp2y, x2 - cp2x)
  ctx.fillStyle = '#909399'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()

  if (edge.label) {
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2 - 8
    ctx.fillStyle = '#606266'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(edge.label, mx, my)
  }

  ctx.restore()
}

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

  edges.forEach((edge) => drawEdge(ctx, edge))
  nodes.value.forEach((node) => drawNode(ctx, node))

  ctx.restore()
}

const init = () => {
  updateDimensions()
  const { scale, x, y } = calculateInitialTransform()
  engine.setTransform({ scale, x, y })

  if (canvasRef.value) {
    inputManager = new InputManager(engine, {
      zoomStep: 0.25,
      zoomMode: 'pointer',
      viewportSize: { width: rectWidth.value, height: rectHeight.value },
      contentSize: { width: 960, height: 520 },
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
  if (rafId !== null) cancelAnimationFrame(rafId)
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
.hud {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 16px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
