# vue3-sketch-ruler 项目说明

> 本文件面向 AI 编程助手。如果你要修改、扩展或调试本项目，请先阅读本文。

## 项目概述

`vue3-sketch-ruler` 是一个基于 Vue 3 + TypeScript 的标尺组件库，适用于低代码平台、大屏可视化、做图工具等场景，提供类似 Photoshop 的缩放与标尺辅助线体验。

本项目采用 pnpm monorepo 架构，主要包含：

- **核心库** (`packages/sketch-ruler`)：可发布的 npm 包 `vue3-sketch-ruler`
- **文档站点** (`packages/docs`)：基于 Vite 的示例与演示站点，部署在 GitHub Pages
- **公共模块** (`packages/common`)：共享的 i18n 等工具
- **simple-panzoom** (`packages/simple-panzoom`)：2.x 版本使用的外部缩放库，3.x 架构正在内置 TransformEngine 以替代它（当前目录为空，迁移中）

当前版本：`2.4.1`，同时正在进行 **v3.0.0 架构重构**（详见 `DEVELOPMENT_PLAN.md`）。

---

## 技术栈

| 层级               | 技术                                           |
| ------------------ | ---------------------------------------------- |
| 框架               | Vue 3.5+（Composition API / `<script setup>`） |
| 语言               | TypeScript 5.9+                                |
| 构建工具           | Vite 7+                                        |
| 包管理器           | pnpm 9+（workspace 模式）                      |
| 测试               | Vitest 4+ + jsdom + `@vue/test-utils`          |
| 代码检查           | oxlint + oxfmt（不使用 ESLint/Prettier）       |
| 样式               | SCSS                                           |
| UI 组件（文档站）  | Element Plus                                   |
| 状态管理（文档站） | Pinia 3+                                       |
| 路由（文档站）     | Vue Router 4+                                  |

---

## 仓库结构

```
├── packages/
│   ├── sketch-ruler/        # 核心 npm 包
│   │   ├── src/
│   │   │   ├── components/  # Vue 组件（SketchRuler.vue、CanvasRuler.vue、RulerWrapperV3.vue 等）
│   │   │   ├── engine/      # 纯数学变换引擎（零 DOM 依赖）
│   │   │   ├── composables/ # Vue 组合式函数
│   │   │   ├── renderers/   # Canvas 渲染抽象与实现
│   │   │   ├── input/       # 输入管理（鼠标、键盘、滚轮）
│   │   │   ├── state/       # 状态管理（参考线、配色、吸附配置）
│   │   │   ├── managers/    # 多画布管理器（CanvasManager）
│   │   │   ├── plugins/     # 插件系统类型与管理器
│   │   │   └── index.ts     # 库入口
│   │   ├── test/            # Vitest 单元测试
│   │   ├── lib/             # 构建产物（Vite library mode 输出）
│   │   ├── vite.config.ts   # 库模式构建配置（ESM/CJS/UMD/IIFE）
│   │   └── vitest.config.ts # 测试配置
│   ├── docs/                # 文档与演示站点
│   │   ├── src/             # 示例页面、Vue 组件、HTML demo
│   │   ├── dist/            # 构建输出（部署到 gh-pages）
│   │   └── vite.config.ts
│   └── common/              # 共享模块（i18n）
├── scripts/
│   ├── release.js           # 手动发布脚本（交互式版本选择 + npm publish）
│   └── migrate.js           # 2.x → 3.x 自动迁移脚本
├── .github/workflows/
│   └── gh-pages.yml         # CI：build → test → deploy
├── package.json             # 根 package.json（workspace root）
├── pnpm-workspace.yaml      # pnpm workspace 配置
├── tsconfig.common.json     # 共享 tsconfig 基础配置
├── .oxlintrc.json           # oxlint 配置
├── .oxfmtrc.json            # oxfmt 格式化配置
├── DEVELOPMENT_PLAN.md      # v3.0.0 重构详细计划
└── MIGRATION.md             # 2.x → 3.x 迁移指南
```

---

## 常用命令

所有命令均在**项目根目录**执行：

```bash
# 安装依赖
pnpm i

# 开发文档站点（先构建库，再启动文档站）
pnpm dev
# 或仅启动文档站（不重新构建库）
pnpm d

# 构建核心库
pnpm build

# 构建文档站点（用于部署）
pnpm build:demo

# 运行测试（simple-panzoom + sketch-ruler）
pnpm test

# 代码检查
pnpm lint:check      # 检查
pnpm lint            # 自动修复

# 格式化
pnpm fmt             # 格式化
pnpm fmt:check       # 检查格式

# 发布（交互式）
pnpm release

# 清理 node_modules
pnpm clean
```

### 包级命令

```bash
# 仅构建 sketch-ruler
pnpm --filter ./packages/sketch-ruler build

# 仅运行 sketch-ruler 测试
pnpm --filter ./packages/sketch-ruler test

# 仅运行 sketch-ruler 测试（watch 模式）
pnpm --filter ./packages/sketch-ruler test:watch
```

---

## 核心包架构（`packages/sketch-ruler`）

v3.0.0 重构目标是将代码组织为**引擎 / 渲染 / 交互 / 数据 / 组件**五层分离架构：

### 1. 引擎层 (`src/engine/`) — 零 DOM 依赖

- `transform-engine.ts`：`TransformEngine` 类，维护 2D 仿射变换矩阵，支持动画（ease-out / damped / exponential / direct）
- `matrix.ts`：`Float64Array(6)` 紧凑矩阵运算
- `coordinate.ts`：屏幕坐标 ↔ 世界坐标转换

### 2. 渲染层 (`src/renderers/`)

- `canvas-2d-renderer.ts`：Canvas 2D 标尺绘制实现
- `label-cache.ts` / `offscreen-ruler-cache.ts`：离屏缓存与标签缓存
- `types.ts`：`Renderer` 抽象接口

### 3. 交互层 (`src/input/`)

- `input-manager.ts`：`InputManager` 类，统一处理鼠标滚轮缩放、空格拖拽平移、键盘快捷键
- `mouse-adapter.ts`：鼠标事件封装
- `keyboard-adapter.ts`：键盘快捷键映射
- `wheel-normalizer.ts`：滚轮事件标准化

### 4. 数据层 (`src/state/`)

- `ruler-state.ts`：不可变状态快照 + `produceState()` 纯函数更新
- `state-manager.ts`：`StateManager` 类，管理参考线集合
- `ruler-context.ts`：`RulerContext` provide/inject 上下文类型

### 5. 组件层 (`src/components/`)

- `SketchRuler.vue`：根组件，整合引擎、输入管理、状态管理、插件系统
- `RulerWrapperV3.vue`：标尺包裹层（水平/垂直）
- `CanvasRuler.vue`：Canvas 标尺绘制组件
- `RulerLine.vue`：参考线 DOM 组件
- `Minimap.vue`：缩略图导航组件

### 6. 其他模块

- `composables/`：`useCanvasTransform`、`useSketchRuler`、`useRulerScale`、`useSnapDetection` 等
- `managers/`：`CanvasManager` 多画布标签页管理
- `plugins/`：插件系统（生命周期钩子 + 自定义渲染器）

---

## 构建产物

`packages/sketch-ruler/lib/` 输出四种格式：

| 格式 | 文件            | 用途                                    |
| ---- | --------------- | --------------------------------------- |
| ESM  | `index.js`      | Vite / Webpack 5+ / Rollup              |
| CJS  | `index.cjs`     | Node.js / 旧版构建工具                  |
| UMD  | `index.umd.cjs` | 浏览器 `<script src>`                   |
| IIFE | `index.iife.js` | 书签脚本、微前端                        |
| 样式 | `style.css`     | 组件样式                                |
| 类型 | `index.d.ts`    | TypeScript 声明（vite-plugin-dts 生成） |

`vue` 被标记为 external，不会打包进产物。

---

## 代码风格规范

本项目使用 **oxlint** 做代码检查、**oxfmt** 做格式化，不使用 ESLint/Prettier。

关键配置（见 `.oxfmtrc.json`）：

- 缩进：2 空格，不使用 Tab
- 分号：不使用
- 引号：单引号
- 尾随逗号：不保留
- 箭头函数参数：始终加括号
- Vue 文件中的 script/style 不额外缩进

提交前会自动运行 `lint-staged`（通过 husky），对修改的文件执行 `oxlint --fix` + `oxfmt`。

---

## 测试策略

- **单元测试**：使用 Vitest + jsdom 环境 + `@vue/test-utils`
- **测试文件位置**：`packages/sketch-ruler/test/*.spec.ts`
- ** globals 模式**：测试中可以不用导入 `describe` / `test` / `expect`
- **现有测试覆盖**：
  - `canvas-manager.spec.ts`
  - `input-manager.spec.ts`
  - `plugin-manager.spec.ts`
  - `ruler-state.spec.ts`
  - `sketch-ruler.spec.ts`（组件集成测试）
  - `state-manager.spec.ts`
  - `use-sketch-ruler.spec.ts`
  - `wheel-normalizer.spec.ts`

### 运行测试

```bash
# 全部测试
pnpm test

# 仅 sketch-ruler 测试
pnpm --filter ./packages/sketch-ruler test

# watch 模式
pnpm --filter ./packages/sketch-ruler test:watch
```

---

## CI/CD 与部署

GitHub Actions 工作流 `.github/workflows/gh-pages.yml`：

1. 触发条件：`push` 或 `pull_request` 到 `main` / `master` 分支
2. 使用 Node.js 24.x + pnpm 9
3. 执行步骤：
   - `pnpm i --no-frozen-lockfile`
   - 构建 `simple-panzoom`
   - 构建 `sketch-ruler`
   - 运行测试 `pnpm test`
   - 构建文档 `pnpm build:demo`
   - **仅 push 时**：部署 `packages/docs/dist` 到 `gh-pages`

文档站点地址：`https://kakajun.github.io/vue3-sketch-ruler`

---

## 发布流程

使用根目录的 `scripts/release.js` 进行**交互式手动发布**：

1. 运行 `pnpm release`
2. 选择版本类型（patch / minor / major）或输入自定义版本
3. 脚本自动更新根目录和 `packages/sketch-ruler/package.json` 的版本号
4. 复制根目录 `README.md` 到包目录
5. 在 `packages/sketch-ruler/` 下执行 `npm publish`
6. 发布完成后删除临时复制的 `README.md`

注意：脚本中 git commit / tag 相关的命令被注释掉了，目前只做版本号更新和 npm 发布。

---

## 关键开发约定

1. **TypeScript 严格模式**：`strict: true`，所有包继承 `tsconfig.common.json`
2. **Vue 组件**：统一使用 `<script setup lang="ts">`
3. **引擎层纯净性**：`src/engine/` 中禁止引入任何 DOM API（`document`、`window`、`HTMLElement`），确保可在纯 Node.js 环境测试
4. **响应式优化**：
   - `TransformEngine` 实例使用 `markRaw()` 排除 Vue 代理
   - 刻度数据使用 `shallowRef` 管理
   - 参考线拖拽使用 `customRef` 节流
5. **状态更新**：数据层状态通过纯函数 `produceState(current, action)` 完成，保持不可变性
6. **插槽规范**：
   - `default` 插槽：画布内容（必须用 `<template #default>` 包裹）
   - `toolbar` 插槽：右下角控制按钮（v3 中由 `btn` 改名而来）
7. **多实例支持**：每个 `SketchRuler` 组件拥有独立的 `TransformEngine` 和 `StateManager`

---

## 给 AI 助手的特别提示

- **修改核心组件前**：先查看 `DEVELOPMENT_PLAN.md` 了解 v3.0.0 的长期架构方向，避免与重构计划冲突。
- **simple-panzoom**：该包目录目前为空，3.x 正在用内置 `TransformEngine` 替代它。如果看到代码中引用 `simple-panzoom`，说明是旧逻辑，迁移中应优先使用 `TransformEngine`。
- **测试**：新增逻辑后请在 `packages/sketch-ruler/test/` 补充测试。组件测试使用 `@vue/test-utils` 的 `mount()`，注意设置 `attachTo: document.body`。
- **构建产物**：修改 `sketch-ruler` 源码后，需要重新执行 `pnpm build` 才能在文档站中看到效果（文档站通过 `workspace:*` 引用本地构建产物）。
- **文档语言**：项目 README、注释、文档主要以**中文**为主，提交信息可使用中文或英文。
- **兼容性**：仅支持 Vue 3。如需 Vue 2 兼容版本，请使用项目的 `1x` 分支。
