# vue3-sketch-ruler 项目指南

> 本文件面向 AI Coding Agent，用于快速理解 `vue3-sketch-ruler` 主发布包的结构、API 与开发约定。

---

## 包概述

`vue3-sketch-ruler` 是面向 **Vue 3** 的主发布包，基于 `@sketch-ruler/core` 与 `@sketch-ruler/canvas`，提供：

- `SketchRuler` 主组件（含标尺、画布、参考线）
- `Minimap` 缩略图组件
- Vue 组合式函数（composables）
- Vue 侧插件入口（`definePlugin`）
- 基于 `provide/inject` 的跨层级状态共享（`RulerContextKey`）

### SketchRuler 关键 Props

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `autoCenter` | 初始化时自动将画布居中 | `true` |
| `paddingRatio` | 自动居中时的边距比例（`0 ~ 0.5`），控制画布四周留白 | `0.2` |
| `initialOffset` | `autoCenter=false` 时使用的初始偏移 | `{ x:0, y:0 }` |

### Palette 默认值

| 属性 | 默认值 |
| --- | --- |
| `bgColor` | `#f6f7f9` |
| `tickColor` | `#BABBBC` |
| `labelColor` | `#7D8694` |
| `guideLineColor` | `#51d6a9` |
| `guideLineLockedColor` | `#d4d7dc` |
| `hoverBg` | `transparent` |
| `hoverColor` | `#000` |
| `borderColor` | `#eeeeef` |
| `shadowColor` | `#e9f7fe` |
| `guideLineStyle` | `'dashed'` |
| `guideLineWidth` | `1` |
| `labelEnabled` | `true` |

> `paddingRatio` 变更后会实时触发重新 fit 并更新画布位置（仅 `autoCenter=true` 时生效）。

---

## 技术栈

| 层级       | 技术                                     |
| ---------- | ---------------------------------------- |
| 框架       | Vue 3.5+ (Composition API)               |
| 语言       | TypeScript 5.9+ (strict 模式)            |
| 构建工具   | Vite 8.x                                 |
| 包管理器   | pnpm 9.x（workspace 模式）               |
| 测试框架   | Vitest 4.x + jsdom                       |
| Vue 测试   | `@vue/test-utils`                        |
| 代码检查   | oxlint 1.64+                             |
| 代码格式化 | oxfmt 0.49+                              |
| 文档站点   | Vite + Vue 3 SPA（位于 `packages/docs`） |

---

## 目录结构

```
src/
├── components/       # Vue SFC
│   ├── SketchRuler.vue      # 主组件（整合标尺+画布+参考线）
│   ├── Minimap.vue          # 缩略图导航组件
│   ├── RulerWrapperV3.vue   # 标尺容器（水平+垂直标尺包装）
│   ├── CanvasRuler.vue      # Canvas 标尺渲染组件
│   ├── RulerLine.vue        # 参考线 DOM 组件（拖拽、锁定、标签）
│   └── cornerImg64.ts       # 左上角角落图片 base64
├── composables/      # Vue 组合式函数
│   ├── useCanvasTransform.ts   # 画布变换（scale/offset）管理
│   ├── useRulerScale.ts        # 标尺刻度计算与响应式更新
│   ├── useRulerSnap.ts         # 智能吸附引擎（M3）
│   ├── useSnapDetection.ts     # 基础吸附检测（M1）
│   ├── useSketchRuler.ts       # Master Composable（整合变换+参考线+标尺样式）
│   └── index.ts
├── plugins/          # Vue 侧插件入口
│   └── index.ts             # definePlugin 辅助函数 + 类型重导出
├── state/            # Vue 注入上下文
│   └── ruler-context.ts     # RulerContext 接口 + RulerContextKey
└── index.ts          # 统一导出入口
```

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

### 子路径导出（package.json exports）

| 路径                            | 说明                        |
| ------------------------------- | --------------------------- |
| `vue3-sketch-ruler`             | 完整导出                    |
| `vue3-sketch-ruler/style.css`   | 组件样式                    |
| `vue3-sketch-ruler/engine`      | 透传 `@sketch-ruler/core`   |
| `vue3-sketch-ruler/composables` | 组合式函数                  |
| `vue3-sketch-ruler/renderers`   | 透传 `@sketch-ruler/canvas` |
| `vue3-sketch-ruler/plugins`     | 插件系统                    |

> 开发环境下 `development` 条件指向 `src/index.ts`，支持源码级调试。

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
- `packages/sketch-ruler/test/`：
  - `sketch-ruler.spec.ts` — SketchRuler 组件集成测试
  - `use-sketch-ruler.spec.ts` — useSketchRuler Master Composable 测试
  - `composables/` — useCanvasTransform、useRulerScale、useSnapDetection

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
  - `components/` — Vue SFC（SketchRuler.vue、Minimap.vue、RulerWrapperV3.vue、CanvasRuler.vue、RulerLine.vue、cornerImg64.ts）
  - `composables/` — Vue 组合式函数（useCanvasTransform、useRulerScale、useRulerSnap、useSnapDetection、useSketchRuler）
  - `plugins/` — Vue 侧插件入口（definePlugin）
  - `state/` — Vue 注入上下文（ruler-context.ts，含 RulerContextKey）

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

| 目的           | 命令                    |
| -------------- | ----------------------- |
| 安装所有依赖   | `pnpm i`                |
| 启动开发服务器 | `pnpm dev`              |
| 构建组件库     | `pnpm build`            |
| 构建文档       | `pnpm build:demo`       |
| 运行所有测试   | `pnpm test`             |
| 自动修复代码   | `pnpm lint && pnpm fmt` |
| 发布新版本     | `pnpm release`          |

---

## 相关链接

- 源码仓库：https://github.com/kakajun/vue3-sketch-ruler
- 在线演示：https://kakajun.github.io/vue3-sketch-ruler
- NPM 包名：`vue3-sketch-ruler`
