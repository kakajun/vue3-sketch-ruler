# @sketch-ruler/canvas

> 框架无关的 Canvas 2D 渲染器与 DOM 输入管理器。负责标尺绘制、离屏缓存、鼠标/键盘/滚轮事件适配。依赖 `@sketch-ruler/core`。

## 安装

```bash
npm install @sketch-ruler/canvas
# 或
pnpm add @sketch-ruler/canvas
```

## 快速上手

### InputManager — 统一输入管理

绑定到画布容器，自动处理 **Ctrl+滚轮缩放**、**空格+拖拽平移**、**键盘快捷键**（Ctrl+0 / Ctrl++/Ctrl+-）。

```ts
import { InputManager } from '@sketch-ruler/canvas'
import { TransformEngine } from '@sketch-ruler/core'

const engine = new TransformEngine({ x: 0, y: 0, scale: 1 })

const inputManager = new InputManager(engine, {
  zoomStep: 0.25,           // 滚轮缩放步长
  zoomMode: 'pointer',      // 'pointer' | 'viewport-center' | 'content-center'
  viewportSize: { width: 1470, height: 700 },
  contentSize: { width: 1920, height: 1080 },
  onCursorChange: (cls) => {
    // cls: 'default' | 'grab' | 'grabbing'
    container.className = cls
  }
})

// 绑定到画布 DOM（事件实际绑定到 parentElement）
inputManager.bind(canvasElement)

// 动态切换缩放模式
inputManager.setZoomMode('viewport-center')

// 获取当前光标类名
const cursorClass = inputManager.getCursorClass()

// 清理
inputManager.destroy()
```

**事件处理细节：**

- **滚轮缩放**：按住 `Ctrl` / `Cmd` + 滚轮，以 `zoomMode` 指定的原点进行缩放
- **空格拖拽**：按住 `Space` + 鼠标左键拖拽平移
- **键盘快捷键**：
  - `Ctrl+0`：缩放到 100%
  - `Ctrl++` / `Ctrl+=`：放大
  - `Ctrl+-`：缩小
  - `Ctrl+1`：适配视口（留 5% 边距）

### Canvas2DRenderer — Canvas 2D 标尺渲染器

```ts
import { Canvas2DRenderer } from '@sketch-ruler/canvas'

const canvas = document.getElementById('ruler') as HTMLCanvasElement
const renderer = new Canvas2DRenderer(canvas)

renderer.render({
  width: 1400,
  height: 20,
  scale: 1,
  offset: 0,
  vertical: false,          // false=水平标尺, true=垂直标尺
  thick: 20,
  marks: scaleMarks,        // 由 core 的 computeScaleMarks 生成
  config: tickConfig,
  palette: {
    bgColor: '#f6f7f9',
    tickColor: '#BABBBC',
    labelColor: '#7D8694',
    borderColor: '#eeeeef'
  }
})
```

### 离屏缓存 — OffscreenRulerCache

用于频繁重绘场景，将标尺渲染到 OffscreenCanvas 再 blit 到主 Canvas。

```ts
import { OffscreenRulerCache } from '@sketch-ruler/canvas'

const cache = new OffscreenRulerCache({ width: 1400, height: 20 })

cache.draw((ctx) => {
  // 使用 Canvas 2D 上下文绘制标尺
  ctx.fillStyle = '#f6f7f9'
  ctx.fillRect(0, 0, 1400, 20)
  // ... 绘制刻度
})

// 将缓存绘制到主 Canvas
ctx.drawImage(cache.canvas, 0, 0)
```

### 标签缓存 — LabelCache

缓存刻度文字标签，避免每帧重复测量文本。

```ts
import { LabelCache } from '@sketch-ruler/canvas'

const labelCache = new LabelCache()

// 获取或创建标签
const label = labelCache.get('100px', '12px Arial')
// label: { text: '100px', width: number, bitmap: ImageBitmap }
```

### 滚轮标准化 — WheelNormalizer

将不同浏览器/操作系统的滚轮事件统一为标准格式。

```ts
import { normalizeWheel, getZoomDelta } from '@sketch-ruler/canvas'

canvas.addEventListener('wheel', (e) => {
  const normalized = normalizeWheel(e)
  // normalized: { pixelX, pixelY, spinX, spinY }

  const delta = getZoomDelta(normalized, { zoomSpeed: 0.25 })
  engine.zoomBy(delta, e.clientX, e.clientY)
})
```

### 底层适配器（自行组合事件）

如果你不想用 `InputManager`，可以直接使用底层适配器：

```ts
import { MouseAdapter } from '@sketch-ruler/canvas'
import type { MouseAdapterCallbacks } from '@sketch-ruler/canvas'

const adapter = new MouseAdapter(parentElement, {
  onWheel: (e, normalized) => {
    // 自定义滚轮处理
  },
  onMouseDown: (e) => {
    // 自定义鼠标按下
  },
  onMouseMove: (e) => {
    // 自定义鼠标移动
  },
  onMouseUp: (e) => {
    // 自定义鼠标抬起
  },
  onMouseEnter: () => {},
  onMouseLeave: () => {}
} as MouseAdapterCallbacks)

adapter.bind()
// adapter.unbind()
```

```ts
import { KeyboardAdapter } from '@sketch-ruler/canvas'
import type { KeyCombo } from '@sketch-ruler/canvas'

const kb = new KeyboardAdapter({
  onShortcut: (combo: KeyCombo, e: KeyboardEvent) => {
    // combo: 'ctrl+0' | 'ctrl+plus' | 'ctrl+minus' | 'space' | ...
    console.log('shortcut', combo)
  }
})

kb.bind()
// kb.unbind()
```

## API 概览

| 导出 | 类型 | 说明 |
|------|------|------|
| `InputManager` | 类 | 统一输入管理（滚轮/拖拽/键盘） |
| `MouseAdapter` | 类 | 鼠标事件封装（wheel/mousedown/mousemove/mouseup） |
| `KeyboardAdapter` | 类 | 键盘快捷键封装 |
| `normalizeWheel` | 函数 | 滚轮事件标准化 |
| `getZoomDelta` | 函数 | 从标准化滚轮计算缩放增量 |
| `Canvas2DRenderer` | 类 | Canvas 2D 标尺渲染器 |
| `OffscreenRulerCache` | 类 | 离屏标尺缓存 |
| `LabelCache` | 类 | 刻度标签缓存 |

## 与 @sketch-ruler/core 的配合

```ts
import { TransformEngine, computeScaleMarks, getTickConfig } from '@sketch-ruler/core'
import { InputManager, Canvas2DRenderer } from '@sketch-ruler/canvas'

// 1. 创建引擎
const engine = new TransformEngine({ x: 0, y: 0, scale: 1 })

// 2. 绑定输入
const input = new InputManager(engine, { zoomMode: 'pointer' })
input.bind(canvasElement)

// 3. 监听状态并渲染
engine.onUpdate((state) => {
  // 更新 DOM transform
  content.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.x}, ${state.y})`

  // 渲染标尺
  const marks = computeScaleMarks({
    scale: state.scale,
    offset: state.x,
    length: 1400,
    thick: 20,
    config: getTickConfig(state.scale)
  })
  renderer.render({ width: 1400, height: 20, scale: state.scale, offset: state.x, marks })
})
```

## License

MIT
