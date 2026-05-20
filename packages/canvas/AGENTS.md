# @sketch-ruler/canvas 项目指南

> 本文件面向 AI Coding Agent，用于快速理解 `@sketch-ruler/canvas` 的结构、API 与开发约定。

---

## 包概述

`@sketch-ruler/canvas` 是 **框架无关** 的 Canvas 2D 渲染器与 DOM 输入管理器。职责：

- Canvas 2D 标尺渲染（Canvas2DRenderer）
- 离屏缓存（OffscreenRulerCache）
- 标签缓存（LabelCache）
- 鼠标/键盘/滚轮事件适配（InputManager、MouseAdapter、KeyboardAdapter）
- 滚轮标准化（WheelNormalizer）

**唯一外部依赖**：`@sketch-ruler/core`

---

## 目录结构

```
src/
├── renderers/        # Canvas 2D 渲染器与缓存
│   ├── canvas-2d-renderer.ts
│   ├── offscreen-ruler-cache.ts
│   ├── label-cache.ts
│   ├── types.ts
│   └── index.ts
├── input/            # DOM 输入管理
│   ├── input-manager.ts      # 统一输入入口
│   ├── mouse-adapter.ts      # 鼠标事件封装
│   ├── keyboard-adapter.ts   # 键盘快捷键
│   ├── wheel-normalizer.ts   # 滚轮标准化
│   └── index.ts
└── index.ts          # 统一导出入口
```

---

## 构建与测试

```bash
# 安装依赖（在根目录执行）
pnpm i

# 构建本包
cd packages/canvas && pnpm build

# 运行测试
cd packages/canvas && pnpm test

# 测试监听模式
cd packages/canvas && pnpm test:watch
```

---

## 编码约定

- **语言**：TypeScript 5.9+，strict 模式
- **模块**：ESM（`"type": "module"`）
- **DOM 依赖**：本包是唯一允许直接操作 DOM 和 Canvas 2D API 的包
- **事件绑定**：所有 DOM 事件监听器必须在 `destroy()` / `unbind()` 中清理，避免内存泄漏
- **命名**：
  - 类名：PascalCase（`InputManager`、`Canvas2DRenderer`）
  - 回调接口：以 `Callbacks` 结尾（`MouseAdapterCallbacks`）

---

## 关键 API 速查

### InputManager

```ts
const input = new InputManager(engine, {
  zoomStep: 0.25,
  zoomMode: 'pointer',          // 'pointer' | 'viewport-center' | 'content-center'
  viewportSize: { width, height },
  contentSize: { width, height },
  onCursorChange: (cls) => { }  // 'default' | 'grab' | 'grabbing'
})
input.bind(containerElement)    // 事件绑定到 container.parentElement
input.setZoomMode(mode)
input.getCursorClass()
input.destroy()                 // 清理所有事件监听
```

**内置交互**：
- `Ctrl/Cmd + 滚轮`：缩放
- `Space + 鼠标左键拖拽`：平移
- `Ctrl+0`：100% 缩放
- `Ctrl++` / `Ctrl+-`：放大/缩小
- `Ctrl+1`：适配视口

### Canvas2DRenderer

```ts
const renderer = new Canvas2DRenderer(canvasElement)
renderer.render({
  width, height, scale, offset,
  vertical: false,   // false=水平, true=垂直
  thick, marks, config, palette
})
```

### 底层适配器（自行组合）

```ts
const mouse = new MouseAdapter(parent, callbacks)
mouse.bind()
mouse.unbind()

const kb = new KeyboardAdapter({ onShortcut: (combo, e) => { } })
kb.bind()
kb.unbind()
```

---

## 子路径导出

| 路径 | 用途 |
|------|------|
| `@sketch-ruler/canvas` | 完整导出 |
| `@sketch-ruler/canvas/renderers` | 仅渲染器与缓存 |
| `@sketch-ruler/canvas/input` | 仅输入管理层 |

---

## 与 @sketch-ruler/core 的协作

```ts
import { TransformEngine, computeScaleMarks, getTickConfig } from '@sketch-ruler/core'
import { InputManager, Canvas2DRenderer } from '@sketch-ruler/canvas'

const engine = new TransformEngine({ x: 0, y: 0, scale: 1 })
const input = new InputManager(engine, { zoomMode: 'pointer' })
input.bind(canvasElement)

engine.onUpdate((state) => {
  content.style.transform = `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.x}, ${state.y})`
  const marks = computeScaleMarks({ scale: state.scale, offset: state.x, length, thick, config })
  renderer.render({ ... })
})
```

---

## 注意事项

- `InputManager.bind(container)` 实际将滚轮/鼠标事件绑定到 `container.parentElement`，因此 `parentElement` 必须存在
- `MouseAdapter` 的 `onWheel` 回调接收 `(WheelEvent, NormalizedWheel)`，滚轮标准化逻辑在 `WheelNormalizer` 中
- 新增 DOM 事件相关逻辑时，请务必提供对应的解绑方法，确保 `destroy()` 能完整清理
