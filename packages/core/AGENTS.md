# @sketch-ruler/core 项目指南

> 本文件面向 AI Coding Agent，用于快速理解 `@sketch-ruler/core` 的结构、API 与开发约定。

---

## 包概述

`@sketch-ruler/core` 是 **框架无关** 的核心层，零外部依赖。负责：

- 坐标变换引擎（TransformEngine）
- 矩阵运算与坐标转换
- 刻度计算与配置
- 参考线状态管理（LineManager）
- 多画布管理器（CanvasManager）
- 插件系统（PluginManager）
- 吸附引擎（SnapEngine）
- Minimap 引擎（MinimapEngine）

---

## 目录结构

```
src/
├── engine/           # 变换引擎、矩阵、坐标转换、Minimap 引擎
│   ├── transform-engine.ts
│   ├── matrix.ts
│   ├── coordinate.ts
│   ├── minimap-engine.ts
│   └── index.ts
├── state/            # 状态管理（RulerState、LineManager）
│   ├── ruler-state.ts
│   ├── line-manager.ts
│   └── index.ts
├── managers/         # 多画布管理器
│   └── canvas-manager.ts
├── plugins/          # 插件系统
│   ├── plugin-manager.ts
│   └── index.ts
├── scale/            # 刻度计算
│   ├── tick-config.ts
│   └── index.ts
├── snap/             # 吸附引擎
│   └── snap-engine.ts
├── types/            # 框架无关的纯类型定义
│   └── index.ts
├── utils/            # ID 生成、线段工具函数
│   ├── id-utils.ts
│   └── line-utils.ts
└── index.ts          # 统一导出入口
```

---

## 构建与测试

```bash
# 安装依赖（在根目录执行）
pnpm i

# 构建本包
cd packages/core && pnpm build

# 运行测试
cd packages/core && pnpm test

# 测试监听模式
cd packages/core && pnpm test:watch
```

---

## 编码约定

- **语言**：TypeScript 5.9+，strict 模式
- **模块**：ESM（`"type": "module"`）
- **DOM 依赖**：引擎层（`engine/`）**禁止**直接操作 DOM；DOM 相关逻辑由 `@sketch-ruler/canvas` 处理
- **命名**：
  - 类名：PascalCase（`TransformEngine`、`CanvasManager`）
  - 类型/接口：PascalCase，以 `Type` 或 `Options` 结尾（`TransformState`、`TransformEngineOptions`）
  - 纯工具函数：camelCase（`importLines`、`exportLines`）
- **导出风格**：`index.ts` 按模块分类导出，类型与实现分离（`export` / `export type`）

---

## 关键 API 速查

### TransformEngine

```ts
const engine = new TransformEngine(
  { x: 0, y: 0, scale: 1 },
  { minZoom: 0.1, maxZoom: 10, enableAnimation: true, animationMode: 'ease-out' }
)
engine.onUpdate((state) => { ... })   // 订阅状态
engine.zoomBy(dScale, originX, originY) // 相对缩放
engine.zoomTo(scale, originX, originY)  // 绝对缩放
engine.panBy(dx, dy)                    // 相对平移
engine.setTransform({ scale, x, y })    // 直接设置
engine.destroy()
```

### CanvasManager

```ts
const manager = new CanvasManager([...])
manager.onUpdate((state) => { ... })
manager.addCanvas(config)
manager.switchCanvas(id)
manager.removeCanvas(id)
manager.updateCanvasState(id, { scale, offsetX, offsetY })
manager.updateCanvasLines(id, importLines({ h, v }))
```

### 参考线格式转换

- `importLines({ h, v })` — `{h, v}` → `GuideLine[]`
- `exportLines(guideLines)` — `GuideLine[]` → `{h, v}`

### 矩阵与坐标

- `fromTransform(scale, x, y)` → `Matrix6`
- `toWorldPoint(matrix, screenX, screenY)` — 屏幕 → 世界
- `toScreenPoint(matrix, worldX, worldY)` — 世界 → 屏幕

---

## 子路径导出

| 路径 | 用途 |
|------|------|
| `@sketch-ruler/core` | 完整导出 |
| `@sketch-ruler/core/engine` | 仅引擎层（TransformEngine、矩阵、坐标） |
| `@sketch-ruler/core/state` | 仅状态管理 |
| `@sketch-ruler/core/plugins` | 仅插件系统 |
| `@sketch-ruler/core/scale` | 仅刻度计算 |

---

## 注意事项

- `TransformEngine` 的所有坐标计算基于 **左上角原点** (`0, 0`)，外部 CSS 需要配合 `transform-origin: 0 0`
- `CanvasManager` 的 `lines` 字段存储的是内部 `GuideLine[]` 格式，与 SketchRuler 组件的 `{h, v}` 格式需通过 `importLines` / `exportLines` 转换
- 新增模块时，请在 `src/index.ts` 中按分类添加导出
