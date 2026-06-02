# @sketch-ruler/selecto

> 面向 AI Coding Agent 的本地指南

## 概述

`@sketch-ruler/selecto` 是 `vue3-sketch-ruler` 生态的框选组件包，用于替代外部 `selecto` 库。

核心差异：本包使用屏幕坐标系（`clientX/Y` + `getBoundingClientRect`）进行 hit test，选择框以 `position: fixed` 绘制在 `document.body` 上，天然适配父级 CSS transform（如 sketch-ruler 的画布缩放/平移）。

## 结构

```
src/
├── engine/
│   └── selecto-engine.ts    # 框架无关的框选引擎
├── components/
│   └── SketchSelecto.vue    # Vue 3 封装组件
└── index.ts
```

## 依赖

- `@sketch-ruler/core`（workspace 依赖，目前仅类型/概念层面关联，引擎内部未直接调用 TransformEngine）
- `vue`（peerDependency）

## 构建

```bash
pnpm build
```

产物输出到 `lib/`，格式：ESM / CJS / UMD / IIFE。

## 测试

```bash
pnpm test
```

## 关键实现约定

1. **坐标系**：所有选择逻辑使用屏幕坐标系，不依赖世界坐标转换。
2. **选择框**：`fixed` 定位，pointer-events: none，z-index: 999999，绘制在 body 上。
3. **Hit test**：基于 DOMRect 相交面积计算，`hitRate` 控制相交面积占目标面积的比例阈值。
4. **selectFromInside**：若 `false`，拖拽起始点所在的 selectable target 不会被本次框选命中。
5. **toggleContinueSelect**：支持 `shift` / `ctrl` 等按键切换多选状态。
6. **事件兼容**：事件形状尽量与原 `selecto` 保持一致（`dragStart`, `selectStart`, `select`, `selectEnd`）。
