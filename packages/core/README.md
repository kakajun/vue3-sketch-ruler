# @sketch-ruler/core

> 框架无关的核心层：坐标变换引擎、多画布管理、参考线状态、吸附引擎、Minimap 引擎、刻度计算等。零外部依赖。

## 安装

```bash
npm install @sketch-ruler/core
# 或
pnpm add @sketch-ruler/core
```

## 快速上手

### TransformEngine — 2D 变换引擎

维护缩放/平移状态，内置多种动画插值模式。

```ts
import { TransformEngine } from '@sketch-ruler/core'

const engine = new TransformEngine(
  { x: 0, y: 0, scale: 1 }, // 初始状态
  { minZoom: 0.1, maxZoom: 10, enableAnimation: true, animationMode: 'ease-out' }
)

// 监听状态变化（注册时立即回调一次当前状态）
const unsubscribe = engine.onUpdate((state) => {
  console.log('scale', state.scale, 'offset', state.x, state.y)
})

// 以屏幕坐标 (400, 300) 为原点放大 0.5
engine.zoomBy(0.5, 400, 300)

// 缩放到指定比例
engine.zoomTo(2, 400, 300)

// 平移
engine.panBy(100, -50)

// 直接设置
engine.setTransform({ scale: 1, x: 0, y: 0 })

// 坐标转换
const world = engine.toWorldPoint(100, 100) // 屏幕 → 世界
const screen = engine.toScreenPoint(50, 50) // 世界 → 屏幕

// 清理
unsubscribe()
engine.destroy()
```

### CanvasManager — 多画布管理器

管理多个画布配置，支持模板、切换、导入导出。

```ts
import { CanvasManager, BUILTIN_TEMPLATES, exportLines, importLines } from '@sketch-ruler/core'

const manager = new CanvasManager([
  { name: '首页', width: 1920, height: 1080, lines: { h: [100], v: [200] } },
  { name: '详情页', width: 375, height: 812 }
])

// 监听状态变化
manager.onUpdate((state) => {
  console.log('当前画布:', state.activeId, '总数:', state.canvases.length)
})

// 应用内置模板
const id = manager.applyTemplate('A4 Portrait')

// 切换画布（自动保存缩略图）
manager.switchCanvas(id)

// 更新当前画布的缩放与偏移
manager.updateCanvasState(id, { scale: 0.8, offsetX: 100, offsetY: 50 })

// 更新参考线（SketchRuler 发出的是 {h, v}，需先 importLines）
manager.updateCanvasLines(id, importLines({ h: [0, 250], v: [0, 500] }))

// 导出参考线（转回 {h, v} 给 SketchRuler）
const canvas = manager.activeCanvas
if (canvas) {
  const lines = exportLines(canvas.lines) // => { h: number[], v: number[] }
}

// 删除画布
manager.removeCanvas(id)
```

### 插件系统 — PluginManager

```ts
import { PluginManager } from '@sketch-ruler/core'
import type { SketchRulerPlugin } from '@sketch-ruler/core'

const pluginManager = new PluginManager()

const myPlugin: SketchRulerPlugin = {
  name: 'logger',
  beforeZoom: (ctx) => {
    console.log('zoom from', ctx.from, 'to', ctx.to)
    return true // return false 可阻止缩放
  },
  onLineCreate: (ctx) => console.log('line created', ctx.line.id),
  onLineDelete: (ctx) => console.log('line deleted', ctx.line.id)
}

pluginManager.register(myPlugin)
```

### 吸附引擎 — SnapEngine

```ts
import { SnapEngine } from '@sketch-ruler/core'

const snapEngine = new SnapEngine({
  threshold: 5,
  scale: 1,
  tickTargets: [0, 100, 200],
  guideLineTargets: [150],
  strength: 0.5
})

// 对水平方向位置 102 进行吸附
const result = snapEngine.snap(102, 'h')

if (result) {
  console.log('吸附到', result.position, '目标类型', result.target.type)
}
```

### MinimapEngine — 缩略图导航引擎

```ts
import { MinimapEngine, MinimapDragSession } from '@sketch-ruler/core'

const engine = new MinimapEngine({
  contentWidth: 1920,
  contentHeight: 1080,
  viewportX: 0,
  viewportY: 0,
  viewportWidth: 1470,
  viewportHeight: 700,
  scale: 1,
  width: 200,
  height: 150
})

// 获取缩略图状态（miniScale、contentOffset、viewportRect）
const state = engine.getState()

// 检查是否可以平移
const canPan = engine.canPan()

// 点击缩略图某位置，计算对应画布偏移
const offset = engine.clickAt(100, 100, 0, 0)

// 拖拽会话
const session = engine.startDrag(0, 0, state.viewportRect.left, state.viewportRect.top)
const newState = session.move(10, 10) // DragSessionState
const finalOffset = session.end(10, 10)
```

### 参考线工具函数

```ts
import { importLines, exportLines, computeLineStyle } from '@sketch-ruler/core'
import type { GuideLine } from '@sketch-ruler/core'

// SketchRuler {h, v} → 内部 GuideLine[]
const guideLines: GuideLine[] = importLines({ h: [0, 250], v: [0, 500] })

// 内部 GuideLine[] → SketchRuler {h, v}
const lines = exportLines(guideLines) // { h: [0, 250], v: [0, 500] }

// 计算参考线在 DOM 中的样式
const style = computeLineStyle(guideLines[0], 1, 0, false, '#51d6a9')
```

### 矩阵与坐标工具

```ts
import {
  createMatrix,
  fromTransform,
  multiply,
  invert,
  toCSSString,
  toWorldPoint,
  toScreenPoint,
  fitRect,
  getZoomOrigin,
  batchToWorld,
  batchToScreen
} from '@sketch-ruler/core'

// 从变换状态生成矩阵
const matrix = fromTransform(1.5, 100, 50)

// 转 CSS matrix 字符串
const css = toCSSString(matrix) // "matrix(1.5, 0, 0, 1.5, 100, 50)"

// 屏幕坐标 → 世界坐标
const world = toWorldPoint(matrix, 200, 200)

// 批量转换
const points = batchToWorld(matrix, [
  { x: 0, y: 0 },
  { x: 100, y: 100 }
])

// 将内容矩形适配到视口
const fitted = fitRect({ width: 1920, height: 1080 }, { width: 1470, height: 700 }, 0.2)

// 获取缩放原点（根据 zoomMode 自动计算）
const origin = getZoomOrigin({
  mode: 'viewport-center',
  viewportSize: { width: 1470, height: 700 },
  contentSize: { width: 1920, height: 1080 },
  offset: { x: 0, y: 0 },
  scale: 1
})
```

### 刻度计算

```ts
import { computeScaleMarks, getTickConfig, applyHysteresis } from '@sketch-ruler/core'

const marks = computeScaleMarks({
  scale: 1,
  offset: 0,
  viewportSize: 800,
  thick: 20,
  config: getTickConfig(1)
})

// 应用滞回避免频繁跳变
const stableConfig = applyHysteresis(0.85, getTickConfig(0.8), getTickConfig(1))
```

## API 概览

| 模块 | 导出 | 说明 |
| --- | --- | --- |
| `TransformEngine` | 类 | 2D 仿射变换引擎，支持动画 |
| `CanvasManager` | 类 | 多画布生命周期管理 |
| `BUILTIN_TEMPLATES` | 常量 | 内置画布模板（A4、Web 1920、Mobile 等） |
| `PluginManager` | 类 | 插件注册与生命周期调度 |
| `SnapEngine` | 类 | 参考线吸附计算 |
| `computeEquidistantTargets` | 函数 | 计算等距分布吸附目标 |
| `MinimapEngine` | 类 | 缩略图视口映射与拖拽 |
| `MinimapDragSession` | 类 | 缩略图拖拽会话 |
| `LineManager` | 类 | 参考线增删改查 |
| `importLines` / `exportLines` | 函数 | 参考线格式转换 |
| `computeLineStyle` | 函数 | 参考线 DOM 样式计算 |
| `computeScaleMarks` | 函数 | 刻度标记计算 |
| `fromTransform` / `toWorldPoint` / `toScreenPoint` | 函数 | 矩阵与坐标转换 |
| `getZoomOrigin` | 函数 | 根据 zoomMode 计算缩放原点 |
| `generateLineId` / `generateCanvasId` | 函数 | ID 生成工具 |

## License

MIT
