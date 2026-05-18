# vue3-sketch-ruler 2.x → 3.x 迁移指南

> 本指南面向从 2.x 升级至 3.x 的用户。

## 快速迁移

```bash
# 1. 升级依赖
npm install vue3-sketch-ruler@latest

# 2. 运行自动迁移脚本
npx vue3-sketch-ruler-migrate ./src

# 3. 手动处理脚本无法自动替换的部分（见下方 Breaking Changes）
```

## Breaking Changes 清单

### 1. 组件名变更

| 2.x                              | 3.x             |
| -------------------------------- | --------------- |
| `<SketchRule>` / `<sketch-rule>` | `<SketchRuler>` |

```vue
<!-- Before -->
<SketchRule ... />

<!-- After -->
<SketchRuler ... />
```

### 2. 插槽变更

| 2.x    | 3.x                           |
| ------ | ----------------------------- |
| `#btn` | `#toolbar="{ tools, state }"` |

```vue
<!-- Before -->
<template #btn>
  <button @click="zoomIn">放大</button>
</template>

<!-- After -->
<template #toolbar="{ tools, state }">
  <button @click="tools.zoomIn">放大</button>
  <span>{{ (state.scale * 100).toFixed(0) }}%</span>
</template>
```

`tools` 暴露的方法：

- `zoomIn()` / `zoomOut()` — 缩放
- `reset()` — 还原
- `setZoomMode(mode)` — 切换缩放模式
- `zoomToPreset(scale)` — 缩放到预设级别
- `toggleReferLine()` — 切换参考线显示
- `toggleLinePanel()` — 切换参考线面板

`state` 暴露的状态：

- `scale: number` — 当前缩放比例
- `offset: { x, y }` — 当前偏移
- `zoomMode: string` — 当前缩放模式
- `showReferLine: boolean` — 参考线是否显示
- `showLinePanel: boolean` — 面板是否显示

### 3. 事件变更

| 2.x           | 3.x             |
| ------------- | --------------- |
| `@zoomStart`  | `@update:scale` |
| `@handleLine` | `@update:lines` |
| `@zoomchange` | 保留，参数不变  |

### 4. 移除 simple-panzoom 依赖

3.x 内置 `TransformEngine`，不再需要 `simple-panzoom`：

```bash
npm uninstall simple-panzoom
```

### 5. palette 扩展

3.x 的 `palette` 兼容 2.x 的所有字段，并新增参考线样式配置：

```ts
interface RulerPalette {
  // 2.x 兼容字段
  bgColor: string
  tickColor: string
  labelColor: string
  guideLineColor: string
  guideLineLockedColor: string
  hoverBg: string
  hoverColor: string
  borderColor: string
  // 3.x 新增
  guideLineStyle?: 'solid' | 'dashed' | 'dotted'
  guideLineWidth?: number
  labelEnabled?: boolean
  labelPosition?: 'start' | 'center' | 'end'
  labelFormat?: (value: number) => string
}
```

### 6. 新增 Props

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `zoomMode` | `'pointer' \| 'viewport-center' \| 'content-center'` | 缩放原点模式 |
| `animationMode` | `'direct' \| 'ease-out' \| 'damped' \| 'exponential'` | 动画模式 |
| `enableAnimation` | `boolean` | 是否启用平滑动画 |
| `showLinePanel` | `boolean` | 是否显示参考线管理面板 |
| `plugins` | `SketchRulerPlugin[]` | 插件列表 |
| `debug` | `boolean` | 是否启用调试面板 |

### 7. 键盘快捷键（默认启用）

| 快捷键             | 功能         |
| ------------------ | ------------ |
| `Ctrl/Cmd + 0`     | 缩放至 100%  |
| `Ctrl/Cmd + -`     | 缩小         |
| `Ctrl/Cmd + =`     | 放大         |
| `Ctrl/Cmd + 1`     | 适配视口     |
| `Space + 拖拽`     | 临时平移     |
| `Ctrl + Shift + D` | 切换调试面板 |

## 新功能速览

### 插件系统

```ts
import { SketchRuler } from 'vue3-sketch-ruler'
import type { SketchRulerPlugin } from 'vue3-sketch-ruler'

const myPlugin: SketchRulerPlugin = {
  name: 'my-plugin',
  beforeZoom: async (ctx) => {
    if (ctx.to > 5) ctx.cancel()
  },
  onLineCreate: (ctx) => {
    console.log('created', ctx.line)
  }
}
```

### 多画布管理

```ts
import { CanvasManager, BUILTIN_TEMPLATES } from 'vue3-sketch-ruler'

const manager = new CanvasManager()
manager.addCanvas({ name: '画布1', width: 1920, height: 1080 })
manager.applyTemplate('A4 Portrait')
```

### 缩略图导航

```vue
<Minimap
  :content-width="1000"
  :content-height="500"
  :viewport-x="offset.x"
  :viewport-y="offset.y"
  :viewport-width="width"
  :viewport-height="height"
  :scale="scale"
  @navigate="handleNavigate"
/>
```

## 构建产物格式

3.x 提供四种构建格式：

| 格式 | 文件                | 适用场景              |
| ---- | ------------------- | --------------------- |
| ESM  | `lib/index.js`      | Vite、Webpack 5+      |
| CJS  | `lib/index.cjs`     | Node.js、旧版构建工具 |
| UMD  | `lib/index.umd.cjs` | 浏览器 `<script src>` |
| IIFE | `lib/index.iife.js` | 书签脚本、微前端      |

```ts
// Tree-shaking 友好
import { SketchRuler, TransformEngine, useCanvasTransform } from 'vue3-sketch-ruler'
```
