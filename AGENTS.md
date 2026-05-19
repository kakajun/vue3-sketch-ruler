# vue3-sketch-ruler 项目指南

> 本文件面向 AI Coding Agent，用于快速理解项目结构、构建流程与开发约定。

---

## 项目概述

`vue3-sketch-ruler` 是一个基于 **Vue 3 + TypeScript** 的标尺组件库，适用于低代码平台、大屏可视化、做图工具等场景，提供类似 Photoshop 的缩放与标尺辅助线体验。

主要特性：

- Vue 3 Composition API / `<script setup>`
- 完整的 TypeScript 类型定义
- 内置 TransformEngine 变换引擎（零外部 panzoom 依赖）
- 多种缩放模式：鼠标中心、视口中心、内容中心
- 可配置参考线（拖拽创建、吸附、锁定）
- 内置 Minimap 缩略图导航（支持拖拽视口、点击跳转）
- 插件系统（生命周期钩子 + 自定义渲染器）
- 动画支持：ease-out / damped / exponential / direct
- 平台与业务代码通过插槽分离

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3.5+ (Composition API) |
| 语言 | TypeScript 5.9+ (strict 模式) |
| 构建工具 | Vite 7.x |
| 包管理器 | pnpm 9.x（workspace 模式） |
| 测试框架 | Vitest 4.x + jsdom |
| Vue 测试 | `@vue/test-utils` |
| 代码检查 | oxlint 1.64+ |
| 代码格式化 | oxfmt 0.49+ |
| Git Hooks | husky + lint-staged（当前 hook 文件为弃用占位，未实际启用） |
| 文档站点 | Vite + Vue 3 SPA（位于 `packages/docs`） |

---

## Monorepo 结构

项目使用 **pnpm workspace** 管理，根目录 `package.json` 声明 `workspaces: ["packages/*"]`。

```
packages/
├── sketch-ruler/      # 主发布包：vue3-sketch-ruler
├── core/              # 框架无关核心：@sketch-ruler/core
├── canvas/            # Canvas 渲染与 DOM 输入：@sketch-ruler/canvas
├── docs/              # 文档与示例站点：root-doc
└── common/            # 私有共享包：root-common（目前仅含 i18n）
```

### 各包职责

| 包名 | 发布名 | 说明 |
|------|--------|------|
| `packages/sketch-ruler` | `vue3-sketch-ruler` | 对外发布的 Vue 3 组件包。导出 `SketchRuler`、`Minimap` 组件，以及 Vue 相关的 composables、plugins。依赖 `@sketch-ruler/core` 与 `@sketch-ruler/canvas`。 |
| `packages/core` | `@sketch-ruler/core` | 框架无关核心层：坐标变换引擎（TransformEngine）、矩阵运算、刻度计算、状态管理（RulerState / LineManager）、插件管理（PluginManager）、吸附引擎（SnapEngine）、多画布管理器（CanvasManager）、Minimap 引擎。零外部依赖。 |
| `packages/canvas` | `@sketch-ruler/canvas` | 框架无关的 Canvas 2D 渲染器与 DOM 输入管理器。负责鼠标/键盘/滚轮事件适配、离屏缓存、标签缓存。依赖 `@sketch-ruler/core`。 |
| `packages/docs` | `root-doc` | 文档演示站点，使用 Vite 构建，包含大量示例（basic、bigscreen、edit、multi-instance 等）。依赖 `vue3-sketch-ruler` workspace 包。 |
| `packages/common` | `root-common` | 私有内部包，目前主要提供 `i18n` 实例供 docs 使用。 |

所有发布包均声明 `type: "module"` 与 `sideEffects: false`。

---

## 构建与开发命令

以下命令均在**项目根目录**执行：

```bash
# 安装依赖
pnpm i

# 开发模式（先构建 sketch-ruler，再启动 docs）
pnpm dev

# 仅启动 docs（假设 sketch-ruler 已构建）
pnpm d

# 构建主库（仅构建 sketch-ruler 包）
pnpm build

# 构建文档站点（先 build 再 build docs）
pnpm build:demo

# 运行测试（仅 sketch-ruler 包的测试）
pnpm test

# 代码检查
pnpm lint:check        # oxlint 检查
pnpm lint              # oxlint --fix 自动修复

# 代码格式化
pnpm fmt               # oxfmt 格式化
pnpm fmt:check         # oxfmt --check 检查格式

# 生成 changelog
pnpm changelog

# 发布（交互式选择版本）
pnpm release

# 清理 node_modules
pnpm clean
```

各子包内部也有独立的 `build` / `test` / `test:watch` 脚本，可直接进入子目录执行。

---

## 构建输出

- `packages/sketch-ruler` 构建产物输出到 `lib/`，包含以下格式：
  - `index.js` (ESM)
  - `index.cjs` (CJS)
  - `index.umd.cjs` (UMD)
  - `index.iife.js` (IIFE)
  - `index.d.ts`（类型声明，由 `vite-plugin-dts` 生成）
  - `style.css`（组件样式）
- `packages/core` 与 `packages/canvas` 同样输出到各自 `lib/`，支持 ESM / CJS / UMD / IIFE。

---

## 测试策略

- 测试框架：**Vitest**，环境为 **jsdom**，开启 `globals: true`。
- 测试文件放在各包的 `test/` 目录下，命名约定为 `*.spec.ts`。
- Vue 组件测试使用 `@vue/test-utils` 的 `mount`，需设置 `attachTo: document.body`。
- 核心引擎测试使用 `vi.useFakeTimers` 验证动画插值。

### 运行测试

```bash
# 根目录运行 sketch-ruler 的测试
pnpm test

# 进入子包运行该包测试
cd packages/core && pnpm test
cd packages/canvas && pnpm test
```

### 现有测试覆盖

- `packages/core/test/`：矩阵、坐标变换、TransformEngine、CanvasManager、LineManager、PluginManager、RulerState
- `packages/canvas/test/`：InputManager、WheelNormalizer
- `packages/sketch-ruler/test/`：SketchRuler 组件集成测试、composables（useCanvasTransform、useRulerScale、useSnapDetection）

---

## 代码风格与 lint 规则

项目使用 **oxlint** 做静态检查，**oxfmt** 做格式化。

### 关键配置

- `.oxlintrc.json`：启用 `typescript` 与 `unicorn` 插件，`correctness` 类别默认关闭。对 `.ts`/`.js` 强制 `no-var`、`prefer-const`、`prefer-rest-params`、`prefer-spread`。忽略 `node_modules` 与 `lib`。
- `.oxfmtrc.json`：
  - 缩进：2 空格，不使用 Tab
  - 无分号 (`semi: false`)
  - 单引号 (`singleQuote: true`)
  - 无尾随逗号 (`trailingComma: none`)
  - 箭头函数始终加括号 (`arrowParens: always`)

### 提交前自动格式化

根目录 `package.json` 中配置了 `lint-staged`：

```json
"lint-staged": {
  "*.{js,ts,mjs,cjs,vue}": ["oxlint --fix", "oxfmt"]
}
```

> 注意：当前仓库中没有 `stylelint` 配置文件，且 `.husky` 目录下的 hook 脚本为 husky v9 弃用占位，实际预提交钩子**未生效**。

---

## TypeScript 配置

- 基线配置：`tsconfig.common.json`
  - `target: "ES2022"`，`module: "ESNext"`
  - `strict: true`，`noImplicitReturns: true`
  - `composite: true`，`declaration: true`，`declarationMap: true`
- 各包 `tsconfig.json` 继承基线，额外设置：
  - `moduleResolution: "bundler"`
  - `allowImportingTsExtensions: true`
  - `emitDeclarationOnly: true`
  - `lib: ["ES2022", "DOM", "DOM.Iterable"]`
  - `types: ["vitest", "node"]`
  - `include` 包含 `**/*.ts`、`**/*.vue`（sketch-ruler 包）、`**/*.json`
  - `exclude` 排除 `test`、`**/*.spec.ts`、`vite.config.ts`、`vitest.config.ts`

---

## 开发约定

### 目录与模块组织

- **核心层** (`packages/core/src/`)：
  - `engine/` — 变换引擎、矩阵、坐标转换、Minimap 引擎
  - `state/` — 状态管理（RulerState、LineManager）
  - `plugins/` — 插件系统（PluginManager）
  - `scale/` — 刻度计算与配置
  - `snap/` — 吸附引擎
  - `managers/` — 多画布管理器（CanvasManager）
  - `types/` — 框架无关的纯类型定义
  - `utils/` — ID 生成、线段工具函数
- **Canvas 层** (`packages/canvas/src/`)：
  - `renderers/` — Canvas2DRenderer、离屏缓存、标签缓存
  - `input/` — InputManager、MouseAdapter、KeyboardAdapter、WheelNormalizer
- **Vue 层** (`packages/sketch-ruler/src/`)：
  - `components/` — Vue SFC（SketchRuler.vue、Minimap.vue、RulerWrapperV3.vue 等）
  - `composables/` — Vue 组合式函数（useCanvasTransform、useRulerScale、useSnapDetection 等）
  - `plugins/` — Vue 侧插件入口
  - `state/` — Vue 注入上下文（RulerContextKey）

### 编码风格

- Vue 单文件组件统一使用 `<script setup lang="ts">`。
- 优先使用 `ref` / `computed` / `watch` / `provide` / `inject` 等 Vue 3 组合式 API。
- Composables 命名以 `use` 开头，返回对象包含响应式状态与方法。
- 类型定义与实现分离：框架无关的类型集中在 `packages/core/src/types/index.ts`。
- 各包 `index.ts` 统一负责按模块分类的导出（类型、`export` / `export type` 分离）。
- 跨包引用使用 workspace 协议：`workspace:*`。

---

## 发布流程

发布由根目录 `scripts/release.js` 驱动：

1. 交互式提示选择版本（patch / minor / major / custom）。
2. 更新根目录及 `packages/sketch-ruler` 的 `package.json` 版本号。
3. 将根目录 `README.md` 复制到 `packages/sketch-ruler/README.md`。
4. 在 `packages/sketch-ruler` 目录执行 `npm publish`，发布到 `https://registry.npmjs.org/`。
5. 发布结束后删除临时复制的 `README.md`。

> 注意：脚本中 git add / commit / tag 的代码被注释掉了，发布**不会**自动打 tag 或提交。

---

## CI / CD

GitHub Actions 工作流：`.github/workflows/gh-pages.yml`

触发条件：`push` 或 `pull_request` 到 `main` / `master` 分支。

执行步骤：

1. 检出代码
2. 安装 pnpm 9 与 Node.js 24.x
3. `pnpm i --no-frozen-lockfile`
4. 构建 `simple-panzoom`（历史遗留步骤，当前仓库中该包已不存在，但 workflow 仍保留此步骤）
5. 构建 `sketch-ruler`
6. 运行测试 `pnpm test`
7. 构建文档 `pnpm build:demo`
8. 仅在 `push` 事件时，将 `packages/docs/dist` 部署到 GitHub Pages

---

## 安全与依赖注意事项

- 项目为前端组件库，不涉及服务端运行或用户敏感数据存储。
- `vue3-sketch-ruler` 作为发布包，在 `vite.config.ts` 中将 `vue` 设为 `external`，避免将 Vue 打包进产物。
- `@sketch-ruler/canvas` 将 `@sketch-ruler/core` 设为 `external`。
- 根目录 `pnpm.overrides` 固定了 `parse5` 版本为 `^7.1.2`，用于解决下游依赖冲突。
- 构建产物输出到各包 `lib/` 目录，该目录已在 `.gitignore` 中忽略，也受 oxlint 忽略。

---

## 快速参考

| 目的 | 命令 |
|------|------|
| 安装所有依赖 | `pnpm i` |
| 启动开发服务器 | `pnpm dev` |
| 构建组件库 | `pnpm build` |
| 构建文档 | `pnpm build:demo` |
| 运行所有测试 | `pnpm test` |
| 自动修复代码 | `pnpm lint && pnpm fmt` |
| 发布新版本 | `pnpm release` |

---

## 相关链接

- 源码仓库：https://github.com/kakajun/vue3-sketch-ruler
- 在线演示：https://kakajun.github.io/vue3-sketch-ruler
- NPM 包名：`vue3-sketch-ruler`
