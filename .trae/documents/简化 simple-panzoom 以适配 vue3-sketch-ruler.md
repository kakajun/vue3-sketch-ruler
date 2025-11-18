## 目标
- 直接修改已存在的 `packages/simple-panzoom` 源码（包名仍为 `simple-panzoom`），仅保留 vue3-sketch-ruler 实际用到的功能；删除 SVG/IE/多指捏合等未用特性；优化事件/尺寸计算以提升性能。

## 修改范围
- `src/panzoom.ts`：
  - 移除 SVG 分支与 IE 相关逻辑；`Panzoom(elem)` 仅接受 `HTMLElement`。
  - 收敛事件：默认仅派发 `panzoomchange`；其他事件按开关启用。
  - 在 `zoom/pan/reset` 链路复用维度，减少重复 `getBoundingClientRect` 与样式读取。
- `src/css.ts`：
  - 删除 IE/SVG 写入分支；只缓存 `transform/transition` 前缀；
  - 拆分 `getDimensions` 为轻量/完整版本：`contain==='none'` 用轻量版。
- `src/isSVGElement.ts`、`src/isExcluded.ts`、`src/polyfills.js`：删除并移除引用。
- `src/events.ts`：统一 Pointer 事件；移除 Touch/Mouse 回退；`move/up` 使用 `{ passive:true }`。
- `src/pointers.ts`：移除多指捏合（若确认不保留）；保留单指拖动路径与 `handleDown/Move/Up`。
- `src/types.ts`：收敛选项类型与事件类型；保留对外 API 形状（必要函数）。

## 保留的 API/选项
- 选项：`noBind`, `canvas`, `cursor`, `startX/startY/startScale`, `disablePan`, `disableZoom`, `contain`, `minScale/maxScale`, `origin`, `step`, `touchAction`, `handleStartEvent`。
- API：`bind/destroy`, `handleDown/handleMove/handleUp`, `zoom/zoomIn/zoomOut/zoomWithWheel`, `pan`, `reset`, `setOptions`, `getPan/getScale`。

## 与现用法对齐（代码证据）
- 初始化与选项：`packages/sketch-ruler/src/sketch-ruler/index.vue:260`。
- 事件消费：`index.vue:241-252`（`scale/dimsOut`）。
- 交互：滚轮缩放 `index.vue:166-170`、空格/中键拖动 `index.vue:185-188,205-207` 与 `customizeButtons.vue:124-141`、左上角缩放 `basic2.vue:38`。

## 性能优化细节
- 维度计算：轻量/完整版本按需调用；同一操作链路内复用维度对象。
- 事件派发：仅派发 `panzoomchange`；`animate:true` 时用 `transitionend` 或一次计时。
- 指针：Pointer 统一，`passive:true`，`canvas` 模式下绑定到父容器。

## 测试
- 在 `packages/simple-panzoom` 添加单测与最小 e2e：覆盖 `zoomWithWheel` 焦点缩放（含 `contain` 三模式）、`pan` 与 `disablePan/Zoom`、`setOptions` 副作用、`origin:'0 0'` 与默认中心、`panzoomchange` 事件负载。

## 文档
- 更新 `packages/simple-panzoom/README.md`：保留/移除项、现代浏览器要求、与 vue3-sketch-ruler 的集成示例；在 `packages/sketch-ruler/README.md` 补充引用说明。

## 迁移
- 保持依赖 `simple-panzoom` 指向 workspace 包；不修改 `node_modules`；跑通 `packages/docs` 示例与测试，确保无回归。

请确认以上方案；确认后我将在 `packages/simple-panzoom` 内逐文件实施，并同步更新测试与文档。