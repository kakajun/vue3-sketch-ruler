<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明：该案例展示了如何在拓扑图/网络图中直接使用 @sketch-ruler/core 的 TransformEngine
      与 @sketch-ruler/canvas 的 InputManager，实现画布的缩放（Ctrl + 滚轮）与平移（空格 +
      鼠标拖动），并在 Canvas 2D 上绘制服务器拓扑与网络设备拓扑，节点可拖拽、连线带带宽标签。
    </div>
    <div class="toolbar">
      <div class="scene-group">
        <button
          v-for="s in scenes"
          :key="s.id"
          :class="['scene-btn', { active: currentScene === s.id }]"
          @click="switchScene(s.id)"
        >
          {{ s.label }}
        </button>
      </div>
      <div class="divider" />
      <div class="info" v-if="selectedNode">
        <span class="info-label">选中:</span>
        <span class="info-value">{{ selectedNode.label }} ({{ selectedNode.type }})</span>
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
type NodeType = 'server' | 'database' | 'switch' | 'router' | 'firewall' | 'loadbalancer' | 'cloud' | 'user' | 'internet' | 'storage'

interface TopoNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  type: NodeType
  color: string
  meta?: string
}

interface TopoEdge {
  from: string
  to: string
  label?: string
}

interface SceneData {
  id: string
  label: string
  nodes: TopoNode[]
  edges: TopoEdge[]
}

/* ---------- 场景数据 ---------- */
const scenes: SceneData[] = [
  {
    id: 'server',
    label: '服务器拓扑',
    nodes: [
      { id: 'user', x: 400, y: 40, w: 80, h: 40, label: '用户端', type: 'user', color: '#909399' },
      { id: 'cdn', x: 400, y: 130, w: 100, h: 50, label: 'CDN 节点', type: 'cloud', color: '#409eff', meta: '边缘加速' },
      { id: 'gw', x: 400, y: 240, w: 100, h: 50, label: 'API 网关', type: 'server', color: '#409eff', meta: 'Kong' },
      { id: 'lb', x: 400, y: 340, w: 120, h: 60, label: '负载均衡', type: 'loadbalancer', color: '#13c2c2', meta: 'Nginx' },
      { id: 'svc1', x: 180, y: 460, w: 120, h: 60, label: '订单服务', type: 'server', color: '#409eff', meta: 'Cluster A' },
      { id: 'svc2', x: 340, y: 460, w: 120, h: 60, label: '支付服务', type: 'server', color: '#409eff', meta: 'Cluster A' },
      { id: 'svc3', x: 500, y: 460, w: 120, h: 60, label: '库存服务', type: 'server', color: '#409eff', meta: 'Cluster B' },
      { id: 'svc4', x: 660, y: 460, w: 120, h: 60, label: '用户服务', type: 'server', color: '#409eff', meta: 'Cluster B' },
      { id: 'db1', x: 220, y: 600, w: 110, h: 55, label: '订单 DB', type: 'database', color: '#722ed1', meta: 'MySQL 主' },
      { id: 'db2', x: 380, y: 600, w: 110, h: 55, label: '支付 DB', type: 'database', color: '#722ed1', meta: 'MySQL 主' },
      { id: 'cache', x: 540, y: 600, w: 110, h: 55, label: '缓存集群', type: 'storage', color: '#faad14', meta: 'Redis Cluster' },
      { id: 'mq', x: 700, y: 600, w: 110, h: 55, label: '消息队列', type: 'storage', color: '#fa541c', meta: 'Kafka' }
    ],
    edges: [
      { from: 'user', to: 'cdn', label: 'HTTPS' },
      { from: 'cdn', to: 'gw', label: '80/443' },
      { from: 'gw', to: 'lb', label: '10Gbps' },
      { from: 'lb', to: 'svc1', label: '轮询' },
      { from: 'lb', to: 'svc2', label: '轮询' },
      { from: 'lb', to: 'svc3', label: '轮询' },
      { from: 'lb', to: 'svc4', label: '轮询' },
      { from: 'svc1', to: 'db1', label: 'TCP' },
      { from: 'svc2', to: 'db2', label: 'TCP' },
      { from: 'svc3', to: 'cache', label: 'TCP' },
      { from: 'svc4', to: 'mq', label: 'TCP' }
    ]
  },
  {
    id: 'network',
    label: '网络设备拓扑',
    nodes: [
      { id: 'internet', x: 400, y: 40, w: 120, h: 50, label: 'Internet', type: 'internet', color: '#909399' },
      { id: 'fw1', x: 320, y: 150, w: 100, h: 60, label: '主防火墙', type: 'firewall', color: '#f5222d', meta: 'HA' },
      { id: 'fw2', x: 480, y: 150, w: 100, h: 60, label: '备防火墙', type: 'firewall', color: '#f5222d', meta: 'HA' },
      { id: 'core1', x: 280, y: 280, w: 120, h: 60, label: '核心交换机-A', type: 'switch', color: '#52c41a', meta: '40G' },
      { id: 'core2', x: 500, y: 280, w: 120, h: 60, label: '核心交换机-B', type: 'switch', color: '#52c41a', meta: '40G' },
      { id: 'aggr1', x: 100, y: 420, w: 120, h: 55, label: '汇聚-办公', type: 'switch', color: '#73d13d', meta: '10G' },
      { id: 'aggr2', x: 340, y: 420, w: 120, h: 55, label: '汇聚-生产', type: 'switch', color: '#73d13d', meta: '10G' },
      { id: 'aggr3', x: 580, y: 420, w: 120, h: 55, label: '汇聚-研发', type: 'switch', color: '#73d13d', meta: '10G' },
      { id: 'router1', x: 760, y: 280, w: 100, h: 60, label: '边界路由', type: 'router', color: '#fa8c16', meta: 'BGP' },
      { id: 'srv1', x: 60, y: 560, w: 100, h: 50, label: '办公服务器', type: 'server', color: '#409eff' },
      { id: 'srv2', x: 300, y: 560, w: 100, h: 50, label: '生产服务器', type: 'server', color: '#409eff' },
      { id: 'srv3', x: 540, y: 560, w: 100, h: 50, label: '研发服务器', type: 'server', color: '#409eff' }
    ],
    edges: [
      { from: 'internet', to: 'fw1', label: '10G' },
      { from: 'internet', to: 'fw2', label: '10G' },
      { from: 'fw1', to: 'core1', label: '10G' },
      { from: 'fw2', to: 'core2', label: '10G' },
      { from: 'core1', to: 'core2', label: '40G 堆叠' },
      { from: 'core1', to: 'aggr1', label: '10G' },
      { from: 'core1', to: 'aggr2', label: '10G' },
      { from: 'core2', to: 'aggr2', label: '10G' },
      { from: 'core2', to: 'aggr3', label: '10G' },
      { from: 'core2', to: 'router1', label: '10G' },
      { from: 'aggr1', to: 'srv1', label: '1G' },
      { from: 'aggr2', to: 'srv2', label: '1G' },
      { from: 'aggr3', to: 'srv3', label: '1G' }
    ]
  }
]

/* ---------- 状态 ---------- */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const canvasWrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const scale = ref(1)
const cursorClass = ref('')
const currentScene = ref('server')
const selectedId = ref<string | null>(null)

const nodes = ref<TopoNode[]>([...scenes[0].nodes])
const edges = ref<TopoEdge[]>([...scenes[0].edges])

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
  const contentW = 900
  const contentH = 700
  const s = Math.min((rw * 0.88) / contentW, (rh * 0.88) / contentH)
  return {
    scale: s,
    x: (rw - contentW * s) / 2,
    y: (rh - contentH * s) / 2 + 20
  }
}

/* ---------- 拖拽 ---------- */
let dragNode: TopoNode | null = null
let dragOffset = { x: 0, y: 0 }
let isSpacePressed = false

const getMousePos = (e: MouseEvent) => ({
  screenX: e.offsetX,
  screenY: e.offsetY
})

const hitTest = (worldX: number, worldY: number): TopoNode | null => {
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
const drawNodeShape = (ctx: CanvasRenderingContext2D, node: TopoNode, isSelected: boolean) => {
  const { x, y, w, h, type, color } = node
  const r = 6

  ctx.save()

  if (isSelected) {
    ctx.shadowColor = 'rgba(64, 158, 255, 0.45)'
    ctx.shadowBlur = 14
  }

  ctx.fillStyle = color
  ctx.strokeStyle = isSelected ? '#409eff' : '#fff'
  ctx.lineWidth = isSelected ? 2.5 : 1.5

  switch (type) {
    case 'database': {
      // 圆柱体
      const ry = h * 0.25
      ctx.beginPath()
      ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillRect(x, y + ry, w, h - ry * 2)
      ctx.strokeRect(x, y + ry, w, h - ry * 2)
      ctx.beginPath()
      ctx.ellipse(x + w / 2, y + h - ry, w / 2, ry, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w / 2, y + h - ry, w / 2, ry, 0, 0, Math.PI)
      ctx.stroke()
      break
    }
    case 'router': {
      // 菱形
      ctx.beginPath()
      ctx.moveTo(x + w / 2, y)
      ctx.lineTo(x + w, y + h / 2)
      ctx.lineTo(x + w / 2, y + h)
      ctx.lineTo(x, y + h / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'firewall': {
      // 盾牌
      const cx = x + w / 2
      const cy = y + h / 2
      const sw = w * 0.4
      const sh = h * 0.4
      ctx.beginPath()
      ctx.moveTo(cx, cy - sh)
      ctx.bezierCurveTo(cx + sw, cy - sh * 0.5, cx + sw, cy + sh * 0.3, cx, cy + sh)
      ctx.bezierCurveTo(cx - sw, cy + sh * 0.3, cx - sw, cy - sh * 0.5, cx, cy - sh)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'loadbalancer': {
      // 六边形
      const hx = w / 2
      const hy = h / 2
      const hw = w / 2 - 2
      const hh = h / 2 - 2
      ctx.beginPath()
      ctx.moveTo(x + hx + hw * 0.5, y + hy - hh)
      ctx.lineTo(x + hx + hw, y + hy - hh * 0.3)
      ctx.lineTo(x + hx + hw, y + hy + hh * 0.3)
      ctx.lineTo(x + hx + hw * 0.5, y + hy + hh)
      ctx.lineTo(x + hx - hw * 0.5, y + hy + hh)
      ctx.lineTo(x + hx - hw, y + hy + hh * 0.3)
      ctx.lineTo(x + hx - hw, y + hy - hh * 0.3)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    default: {
      // 圆角矩形（server, cloud, storage, user, internet）
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
      ctx.fill()
      ctx.stroke()
      break
    }
  }

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0

  // 文字
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${12}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(node.label, x + w / 2, y + h / 2 - (node.meta ? 7 : 0))

  if (node.meta) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = `10px sans-serif`
    ctx.fillText(node.meta, x + w / 2, y + h / 2 + 9)
  }

  ctx.restore()
}

const drawNode = (ctx: CanvasRenderingContext2D, node: TopoNode) => {
  const isSelected = selectedId.value === node.id
  drawNodeShape(ctx, node, isSelected)
}

/* ---------- 绘制连线 ---------- */
const getEdgePoints = (from: TopoNode, to: TopoNode) => {
  const cx1 = from.x + from.w / 2
  const cy1 = from.y + from.h / 2
  const cx2 = to.x + to.w / 2
  const cy2 = to.y + to.h / 2

  // 从边界出射
  let x1 = cx1
  let y1 = cy1
  let x2 = cx2
  let y2 = cy2

  const dx = cx2 - cx1
  const dy = cy2 - cy1
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  if (absDx > absDy) {
    x1 = dx > 0 ? from.x + from.w : from.x
    y1 = cy1
    x2 = dx > 0 ? to.x : to.x + to.w
    y2 = cy2
  } else {
    x1 = cx1
    y1 = dy > 0 ? from.y + from.h : from.y
    x2 = cx2
    y2 = dy > 0 ? to.y : to.y + to.h
  }

  return { x1, y1, x2, y2 }
}

const drawEdge = (ctx: CanvasRenderingContext2D, edge: TopoEdge) => {
  const from = nodes.value.find((n) => n.id === edge.from)
  const to = nodes.value.find((n) => n.id === edge.to)
  if (!from || !to) return

  const { x1, y1, x2, y2 } = getEdgePoints(from, to)

  const cp1x = x1 + (x2 - x1) * 0.5
  const cp1y = y1
  const cp2x = x2 - (x2 - x1) * 0.5
  const cp2y = y2

  ctx.save()
  ctx.strokeStyle = '#b0b0b0'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2)
  ctx.stroke()

  // 箭头
  const arrowSize = 7
  const angle = Math.atan2(y2 - cp2y, x2 - cp2x)
  ctx.fillStyle = '#b0b0b0'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()

  // 标签
  if (edge.label) {
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2 - 10
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    const textW = ctx.measureText(edge.label).width + 8
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillRect(mx - textW / 2, my - 12, textW, 16)
    ctx.fillStyle = '#606266'
    ctx.fillText(edge.label, mx, my)
  }

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

  edges.value.forEach((edge) => drawEdge(ctx, edge))
  nodes.value.forEach((node) => drawNode(ctx, node))

  ctx.restore()
}

/* ---------- 场景切换 ---------- */
const switchScene = (id: string) => {
  currentScene.value = id
  selectedId.value = null
  dragNode = null
  const scene = scenes.find((s) => s.id === id)
  if (scene) {
    nodes.value = scene.nodes.map((n) => ({ ...n }))
    edges.value = [...scene.edges]
  }
  const { scale, x, y } = calculateInitialTransform()
  engine.setTransform({ scale, x, y })
  draw()
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
      contentSize: { width: 900, height: 700 },
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
.scene-group {
  display: flex;
  gap: 6px;
}
.scene-btn {
  padding: 5px 14px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  transition: all 0.15s;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  &.active {
    background: #ecf5ff;
    border-color: #409eff;
    color: #409eff;
    font-weight: 600;
  }
}
.divider {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  margin: 0 4px;
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
