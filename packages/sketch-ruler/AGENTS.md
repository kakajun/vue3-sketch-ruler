# vue3-sketch-ruler

> 面向 AI 编程助手的包级说明文档。如果你要修改或扩展 `vue3-sketch-ruler` 组件，请先阅读本文。

## 作用

`vue3-sketch-ruler` 是 monorepo 的核心 npm 包，提供一个基于 Vue 3 + TypeScript 的标尺组件，适用于低代码平台、大屏可视化、做图工具等场景，提供类似 Photoshop 的缩放与标尺辅助线体验。

主要能力：

- 水平 / 竖直 Canvas 标尺刻度绘制
- 以鼠标为中心的画布缩放（基于 `simple-panzoom`）
- 空格 + 拖拽平移画布
- 参考线新增、拖拽、吸附、删除
- 阴影区域高亮与阴影刻度数字
- 初始化自动居中对齐
- 支持多实例

## 安装与引入

```bash
npm install vue3-sketch-ruler
```

```js
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
// TS 类型
import type { SketchRulerProps, PaletteType } from 'vue3-sketch-ruler'
```

CDN 引入：

```html
<script src="https://unpkg.com/vue3-sketch-ruler/lib/index.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/vue3-sketch-ruler/lib/style.css" />
```

## 基础使用

```vue
<template>
  <SketchRule
    :thick="16"
    v-model:scale="scale"
    :width="1600"
    :height="800"
    :canvasWidth="1000"
    :canvasHeight="500"
    :isShowReferLine="true"
    :lines="lines"
    @onCornerClick="handleCornerClick"
  >
    <template #default>
      <div data-type="page" :style="canvasStyle">
        <!-- 你的业务内容 -->
      </div>
    </template>
    <template #btn="{ reset, zoomIn, zoomOut }">
      <button @click="reset">还原</button>
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut">缩小</button>
    </template>
  </SketchRule>
</template>

<script setup>
import { ref } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const scale = ref(1)
const lines = ref({ h: [100, 200], v: [150] })

const handleCornerClick = () => {
  console.log('点击左上角眼睛图标')
}
</script>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scale | 缩放值（支持 `v-model:scale`） | `number` | `1` |
| rate | 初始化标尺的缩放 | `number` | `1` |
| thick | 标尺厚度 | `number` | `16` |
| width | 容器宽度 | `number` | `1400` |
| height | 容器高度 | `number` | `800` |
| canvasWidth | 画布宽度 | `number` | `700` |
| canvasHeight | 画布高度 | `number` | `700` |
| paddingRatio | 画布与外框间隔比例 | `number` | `0.2` |
| autoCenter | 初始化自动居中对齐 | `boolean` | `true` |
| isShowReferLine | 是否显示参考线 | `boolean` | `true` |
| showRuler | 是否显示标尺 | `boolean` | `true` |
| showShadowText | 是否显示阴影文字 | `boolean` | `true` |
| lines | 初始参考线 | `{ h: number[], v: number[] }` | `{ h: [], v: [] }` |
| snapsObj | 吸附刻度集合 | `{ h: number[], v: number[] }` | `{ h: [], v: [] }` |
| snapThreshold | 吸附距离（像素） | `number` | `5` |
| shadow | 阴影区域配置 | `{ x, y, width, height }` | `{ x: 0, y: 0, width: 0, height: 0 }` |
| gridRatio | 刻度颗粒度 | `number` | `1` |
| selfHandle | 是否自行处理缩放/平移监听 | `boolean` | `false` |
| panzoomOption | `simple-panzoom` 扩展参数 | `PanzoomOptions` | `-` |
| palette | 标尺样式配置 | `PaletteType` | 见下表 |

### palette 默认值

| 属性            | 说明             | 默认值    |
| --------------- | ---------------- | --------- |
| bgColor         | 画布背景         | `#f6f7f9` |
| longfgColor     | 长刻度颜色       | `#BABBBC` |
| fontColor       | 刻度字体颜色     | `#7D8694` |
| fontShadowColor | 阴影刻度字体颜色 | `#106ebe` |
| shadowColor     | 激活阴影背景     | `#E8E8E8` |
| lineColor       | 参考线颜色       | `#51d6a9` |
| lineType        | 参考线线型       | `solid`   |
| lockLineColor   | 锁定参考线颜色   | `#d4d7dc` |
| hoverColor      | 标签字体颜色     | `#fff`    |
| hoverBg         | 标签背景颜色     | `#000`    |
| borderColor     | 尺子外边框颜色   | `#eeeeef` |

## Events

| 事件名          | 说明               | 回调参数                                  |
| --------------- | ------------------ | ----------------------------------------- |
| onCornerClick   | 左上角眼睛图标点击 | `-`                                       |
| zoomchange      | 画布移动/缩放      | `{ dimsOut, originalEvent, scale, x, y }` |
| update:scale    | 缩放值双向绑定更新 | `number`                                  |
| update:lockLine | 参考线锁定状态更新 | `boolean`                                 |

## 插槽

| 插槽名  | 说明                                          | 作用域参数                   |
| ------- | --------------------------------------------- | ---------------------------- |
| default | 画布内容（必须用 `<template #default>` 包裹） | `-`                          |
| btn     | 右下角控制按钮                                | `{ reset, zoomIn, zoomOut }` |

## 自定义缩放/平移（selfHandle）

设置 `selfHandle` 为 `true` 后，组件不再自动监听滚轮/空格，可通过 `ref` 获取 `panzoomInstance` 自行控制：

```js
const panzoomInstance = sketchruleRef.value.panzoomInstance

// 示例：中键拖拽
document.addEventListener('pointerdown', (e) => {
  if (e.button === 1) {
    sketchruleRef.value.cursorClass = 'grabCursor'
    panzoomInstance.bind()
    panzoomInstance.handleDown(e)
    e.preventDefault()
  }
})
```

## 1.x 升级到 2.x 指南

### 1. package.json

将 `vue3-sketch-ruler` 版本升级到 `^2.4.0`。

### 2. 引入方式

| 版本 | 引入方式                                                     |
| ---- | ------------------------------------------------------------ |
| 1.x  | `import { SketchRule } from 'vue3-sketch-ruler'`（命名导出） |
| 2.x  | `import SketchRule from 'vue3-sketch-ruler'`（默认导出）     |

### 3. API 变更

| 变更项 | 1.x | 2.x |
| --- | --- | --- |
| scale 绑定 | `:scale="scale"` | `v-model:scale="scale"` |
| 画布尺寸 | `:width` / `:height` 同时表示容器和画布 | 拆分为 `:width` / `:height`（容器）和 `:canvasWidth` / `:canvasHeight`（画布） |
| 内容插槽 | 直接写在组件标签内 | 需用 `<template #default>` 包裹 |
| 滚动处理 | 手动计算 `startX` / `startY` | 2.x 内部 panzoom 自动处理，移除相关逻辑 |
| 容器结构 | 外层 `.edit-screens` + `.edit-screen-container` | 2.x 内部自带容器，移除多余 DOM |
| CSS 选择器 | `#mb-ruler` | `.sketch-ruler` |

### 4. 其他调整

- 移除了 `startX` / `startY` 的手动计算和 `handleScroll`
- 移除了 `$app` / `$container` 等滚动容器 ref（2.x 内部用 panzoom 管理）
- `scale` 改用 `computed` 的 getter/setter 配合 `v-model:scale`
- 添加了 `:shadow` 属性传入画布尺寸
- 拖拽逻辑改为通过 `panzoomInstance.pan()` 控制
- 样式路径 `vue3-sketch-ruler/lib/style.css` 保持不变，2.x 依然兼容

## 目录结构

```
packages/sketch-ruler/
├── src/
│   ├── sketch-ruler/     # 主组件、标尺包裹层、参考线、拖拽逻辑
│   ├── canvas-ruler/     # Canvas 绘制标尺刻度与阴影
│   ├── index-types.ts    # 公共类型定义（SketchRulerProps、PaletteType 等）
│   └── index.ts          # 库入口（默认导出 SketchRule 组件）
├── test/                 # Vitest 测试
├── lib/                  # Vite 构建产物（ES + UMD + 类型声明）
└── vite.config.ts        # 库模式构建配置
```

## 构建

```bash
# 在根目录执行
pnpm build
```

产物输出到 `packages/sketch-ruler/lib/`，包含：

- `index.js`（ES 模块）
- `index.umd.cjs`（UMD）
- `index.d.ts`（类型声明，由 vite-plugin-dts 自动生成）
- `style.css`（组件样式）

## 注意事项

1. **依赖关系**：本包依赖 `simple-panzoom`（`workspace:*`），修改 `simple-panzoom` 后需重新构建。
2. **高清屏**：Canvas 绘制时使用 `window.devicePixelRatio` 进行缩放，避免在高分屏上模糊。
3. **兼容性**：仅支持 Vue 3。如需 Vue 2 兼容版本，请使用项目的 `1x` 分支。
