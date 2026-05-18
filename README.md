# vue3-sketch-ruler

> 是一个基于 Vue 3 + TypeScript 的标尺组件库，适用于低代码平台、大屏可视化、做图工具等场景，提供类似 Photoshop 的缩放与标尺辅助线体验。

[![](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)](https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667) [![build status](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml/badge.svg?branch=master)](https://github.com/kakajun/vue3-sketch-ruler/actions/workflows/gh-pages.yml)

[![Cloud Studio Template](https://cs-res.codehub.cn/common/assets/icon-badge.svg)](https://cloudstudio.net/a/21005994397405184?channel=share&sharetype=Markdown)

<div align=center>
<img src="https://github.com/kakajun/vue3-sketch-ruler/blob/master/packages/docs/src/assets/logo.png" width="392" height="300">
</div>

## 🚀 Features

- 💪 Vue 3 Composition API / `<script setup>`
- 🔥 基于 TypeScript，类型完整
- 🎯 内置 TransformEngine 变换引擎，零外部依赖
- 🖱️ 多种缩放模式：鼠标中心、视口中心、内容中心
- 📐 可配置参考线（拖拽创建、吸附、锁定）
- 🗺️ 内置 Minimap 缩略图导航（支持拖拽视口、点击跳转）
- 🔌 插件系统（生命周期钩子 + 自定义渲染器）
- 🎨 动画支持：ease-out / damped / exponential / direct
- 📦 平台与业务代码通过插槽分离，专注业务即可

## 🦄 Demo

案例浏览: [https://kakajun.github.io/vue3-sketch-ruler](https://kakajun.github.io/vue3-sketch-ruler) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/master/packages/docs/src/assets/1.png)

[CodePen 示例](https://codepen.io/kakajun/pen/eYwagJb)

## 安装

```bash
npm install --save vue3-sketch-ruler

# 或
yarn add vue3-sketch-ruler

# 或
pnpm add vue3-sketch-ruler
```

## 引入方式

### ESM

```ts
import { SketchRuler, Minimap } from 'vue3-sketch-ruler'
import type { SketchRulerProps, SketchRulerPlugin } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
```

### CDN

```html
<script src="https://unpkg.com/vue3-sketch-ruler/lib/index.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/vue3-sketch-ruler/lib/style.css" />

<script>
  const { SketchRuler, Minimap } = window.Vue3SketchRuler
</script>
```

## 使用

### 基础用法

```vue
<template>
  <div class="wrapper" :style="{ width: width + 'px', height: height + 'px' }">
    <SketchRuler
      ref="sketchRef"
      v-model:scale="state.scale"
      :width="width"
      :height="height"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :thick="state.thick"
      :lines="state.lines"
      :is-show-refer-line="state.isShowReferLine"
      :enable-animation="true"
      animation-mode="ease-out"
      @zoomchange="handleZoomChange"
      @update:lines="handleLinesChange"
    >
      <template #default>
        <div data-type="page" :style="canvasStyle">
          <img :src="bgImg" style="width:100%;height:100%" />
        </div>
      </template>

      <template #toolbar="{ tools, state }">
        <div class="btns">
          <button @click="tools.reset">还原</button>
          <button @click="tools.zoomIn">放大</button>
          <button @click="tools.zoomOut">缩小</button>
          <button @click="tools.zoomToPreset(1)">100%</button>
          <span>{{ (state.scale * 100).toFixed(0) }}%</span>
        </div>
      </template>
    </SketchRuler>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const sketchRef = ref()
const width = 1470
const height = 700
const canvasWidth = 1000
const canvasHeight = 500

const state = reactive({
  scale: 1,
  thick: 20,
  isShowReferLine: true,
  lines: { h: [0, 250], v: [0, 500] }
})

const canvasStyle = {
  width: canvasWidth + 'px',
  height: canvasHeight + 'px'
}

const handleZoomChange = (detail: { scale: number; x: number; y: number }) => {
  console.log('zoomchange', detail)
}

const handleLinesChange = (lines: { h: number[]; v: number[] }) => {
  console.log('lines changed', lines)
}
</script>
```

### 配合 Minimap

```vue
<template>
  <SketchRuler ref="sketchRef" v-model:scale="state.scale" ...>
    <template #default>...</template>
  </SketchRuler>

  <Minimap
    :content-width="canvasWidth"
    :content-height="canvasHeight"
    :viewport-x="viewportOffset.x"
    :viewport-y="viewportOffset.y"
    :viewport-width="width"
    :viewport-height="height"
    :scale="state.scale"
    :width="200"
    :height="150"
    @navigate="handleNavigate"
  />
</template>

<script setup>
import { SketchRuler, Minimap } from 'vue3-sketch-ruler'

const sketchRef = ref()
const viewportOffset = reactive({ x: 0, y: 0 })

const handleZoomChange = (detail) => {
  viewportOffset.x = detail.x
  viewportOffset.y = detail.y
}

const handleNavigate = (x, y) => {
  sketchRef.value?.setTransform({ x, y })
}
</script>
```

### 插件系统

```ts
import type { SketchRulerPlugin } from 'vue3-sketch-ruler'

const plugins: SketchRulerPlugin[] = [
  {
    name: 'demo-logger',
    onLineCreate: (ctx) => console.log('line created', ctx.line.id),
    onLineDelete: (ctx) => console.log('line deleted', ctx.line.id)
  }
]
```

## API

### Props

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 容器宽度 | `number` | `1400` |
| height | 容器高度 | `number` | `800` |
| canvasWidth | 画布宽度 | `number` | `700` |
| canvasHeight | 画布高度 | `number` | `700` |
| thick | 标尺厚度 | `number` | `16` |
| scale | 缩放值（支持 `v-model:scale`） | `number` | `1` |
| showRuler | 是否显示标尺 | `boolean` | `true` |
| isShowReferLine | 是否显示参考线 | `boolean` | `true` |
| lines | 初始化参考线 | `{ h: number[]; v: number[] }` | `{ h: [], v: [] }` |
| palette | 标尺样式配置 | `Partial<RulerPalette>` | `{}` |
| shadow | 阴影高亮区域 | `{ x, y, width, height }` | `{ x:0, y:0, width:0, height:0 }` |
| zoomMode | 缩放原点模式 | `'pointer' \| 'viewport-center' \| 'content-center'` | `'pointer'` |
| zoomStep | 缩放步长 | `number` | `0.25` |
| minZoom | 最小缩放 | `number` | `0.1` |
| maxZoom | 最大缩放 | `number` | `10` |
| enableAnimation | 是否启用动画 | `boolean` | `false` |
| animationMode | 动画模式 | `'direct' \| 'ease-out' \| 'damped' \| 'exponential'` | `'ease-out'` |
| autoCenter | 初始化自动居中 | `boolean` | `true` |
| initialOffset | 初始偏移（autoCenter=false 时生效） | `{ x: number; y: number }` | `{ x:0, y:0 }` |
| snapThreshold | 吸附阈值 | `number` | `5` |
| lockLine | 是否锁定参考线 | `boolean` | `false` |
| selfHandle | 自行处理输入事件 | `boolean` | `false` |
| plugins | 插件列表 | `SketchRulerPlugin[]` | `[]` |

### Events

| 事件            | 描述               | 回调参数                       |
| --------------- | ------------------ | ------------------------------ |
| update:scale    | 缩放值双向绑定     | `number`                       |
| update:offset   | 偏移值双向绑定     | `{ x: number; y: number }`     |
| zoomchange      | 缩放/平移变化      | `{ scale, x, y }`              |
| update:lines    | 参考线变化         | `{ h: number[]; v: number[] }` |
| update:lockLine | 参考线锁定状态变化 | `boolean`                      |
| onCornerClick   | 左上角按钮点击     | `boolean`（参考线显示状态）    |

### Slots

| 插槽名 | 描述 | 作用域参数 |
| --- | --- | --- |
| default | 画布内容（**必须用 `<template #default>` 包裹**） | — |
| toolbar | 右下角工具栏 | `{ tools: { reset, zoomIn, zoomOut, zoomToPreset, setZoomMode, toggleReferLine }, state: { scale, offset, zoomMode, showReferLine } }` |

### Expose

通过 `ref` 可以调用以下方法：

| 方法                               | 描述                 |
| ---------------------------------- | -------------------- |
| `setTransform({ x?, y?, scale? })` | 设置变换状态         |
| `zoomIn()`                         | 放大                 |
| `zoomOut()`                        | 缩小                 |
| `reset()`                          | 重置到初始状态       |
| `zoomToPreset(scale)`              | 缩放到预设比例       |
| `setZoomMode(mode)`                | 设置缩放模式         |
| `engine`                           | TransformEngine 实例 |
| `stateManager`                     | 参考线状态管理器     |

### Palette

| 属性                 | 描述           | 默认值     |
| -------------------- | -------------- | ---------- |
| bgColor              | 画布背景       | `#f6f7f9`  |
| tickColor            | 刻度颜色       | `#BABBBC`  |
| labelColor           | 刻度标签颜色   | `#7D8694`  |
| guideLineColor       | 参考线颜色     | `#51d6a9`  |
| guideLineLockedColor | 锁定参考线颜色 | `#d4d7dc`  |
| hoverBg              | 标签背景色     | `#000`     |
| hoverColor           | 标签文字色     | `#fff`     |
| borderColor          | 尺子边框颜色   | `#eeeeef`  |
| guideLineStyle       | 参考线样式     | `'dashed'` |
| guideLineWidth       | 参考线宽度     | `1`        |
| labelEnabled         | 是否显示标签   | `true`     |

## Minimap API

| 属性           | 描述        | 类型     | 默认值 |
| -------------- | ----------- | -------- | ------ |
| contentWidth   | 内容宽度    | `number` | —      |
| contentHeight  | 内容高度    | `number` | —      |
| viewportX      | 视口 X 偏移 | `number` | —      |
| viewportY      | 视口 Y 偏移 | `number` | —      |
| viewportWidth  | 视口宽度    | `number` | —      |
| viewportHeight | 视口高度    | `number` | —      |
| scale          | 缩放比例    | `number` | —      |
| width          | 缩略图宽度  | `number` | `200`  |
| height         | 缩略图高度  | `number` | `150`  |

| 事件      | 描述           | 回调参数                 |
| --------- | -------------- | ------------------------ |
| navigate  | 导航到指定位置 | `(x: number, y: number)` |
| dragstart | 开始拖拽       | —                        |
| dragend   | 结束拖拽       | —                        |

## 变更记录

- **v3.x** 内置 TransformEngine 替代外部 panzoom，新增 Minimap、插件系统、多画布管理器
- **v2.4.x** 多实例支持
- **v2.3.x** 引用简化版 simple-panzoom，提升性能，更新全部依赖

## 🌈 Who is using this?

[avue大屏可视化工具](https://data.avuejs.com/build/1) ![image](https://github.com/kakajun/vue3-sketch-ruler/blob/1x/example/v2/assets/dp.png)

[GoView 高效拖拽式低代码数据可视化开发平台](https://vue.mtruning.club/#/project/items)

> open a PR to add your library ;)

### QQ 技术交流群：

<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=oqnBX-qn7gkWsdfYQdvNCzYbkeNknuOc&jump_from=webapi&authKey=4YXd2jvmWYU0cN8zUky5DoCD6kz+fjUyWv782GLUjDEIHctXYviSXD/pbqxm/ZDD"><img border="0" src="https://github.com/kakajun/vue3-sketch-ruler/blob/master/packages/docs/src/assets/group.png" alt="vue3-sketch-ruler" title="点击这里加入QQ群640166628"></a>

<div align=center>
<img src="https://github.com/kakajun/vue3-sketch-ruler/blob/master/packages/docs/src/assets/qq.png" width="243" height="287">
</div>

## 贡献者

<a href="https://github.com/kakajun/vue3-sketch-ruler/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kakajun/vue3-sketch-ruler" />
</a>

## 最后

这是个开源业余做的功能，欢迎加强该插件的小伙伴加入。如果 `vue3-sketch-ruler` 对您有帮助，请给个 star，您的鼓励是我最大的动力。

<a href='https://gitee.com/majun2232/vue3-sketch-Ruler'><img src='https://gitee.com/majun2232/vue3-sketch-Ruler/widgets/widget_4.svg' alt='Fork me on Gitee'></img></a>

## 引用

vue标尺组件 [vue-sketch-ruler](https://github.com/chuxiaoguo/vue-sketch-ruler.git)
