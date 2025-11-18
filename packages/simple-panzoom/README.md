# simple-panzoom（精简版）

保留 vue3-sketch-ruler 实际用到的功能，移除 SVG、IE 与多指捏合等未用特性，提升性能与体积。

## 保留的 API
- `Panzoom(elem, options)`
- `bind/destroy`
- `handleDown/handleMove/handleUp`
- `pan`
- `zoom/zoomIn/zoomOut/zoomToPoint/zoomWithWheel`
- `reset`
- `setOptions`
- `getPan/getScale`

## 保留的选项
- `noBind`, `canvas`, `cursor`
- `startX`, `startY`, `startScale`
- `disablePan`, `disableZoom`
- `contain: 'inside' | 'outside' | 'none'`
- `minScale`, `maxScale`, `step`
- `origin`（支持字符串，如 `'0 0'`）
- `touchAction`, `handleStartEvent`, `overflow`

## 移除的特性
- SVG 专属实现与 IE 兼容分支
- `exclude/excludeClass`
- `relative`, `panOnlyWhenZoomed`, `disableXAxis/disableYAxis`, `roundPixels`
- 多指捏合与 Touch/Mouse 事件回退（统一使用 Pointer 事件）

## 性能优化
- 维度计算拆分轻量/完整版本并按需调用
- 同一操作链路内复用维度对象，降低 `getBoundingClientRect` 与样式读取次数
- 事件默认仅派发 `panzoomchange`，减少分发成本

## 与 vue3-sketch-ruler 的集成要点
- 容器初始化：`Panzoom(elem, { noBind: true, canvas: true, startX, startY, startScale, ... })`
- 滚轮缩放：在父容器监听 `wheel`，在 `Ctrl/Meta` 下调用 `zoomWithWheel(e)`
- 空格/中键拖动：通过 `bind()/destroy()` 与 `handleDown(e)` 控制拖动开启与结束
- 左上角缩放：传入 `origin: '0 0'`

## 事件
- `panzoomchange`：`detail` 包含 `{ x, y, scale, dimsOut }`

## 引用
- 基于 [panzoom](https://github.com/timmywil/panzoom) 实现

## 许可
MIT
