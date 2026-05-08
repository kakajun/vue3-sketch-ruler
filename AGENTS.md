# vue3-sketch-ruler 项目指南

> 本文件面向 AI 编程助手。如果你对这个项目一无所知，请先阅读本文档。

## 项目概述

`vue3-sketch-ruler` 是一个基于 Vue 3 + TypeScript 的标尺组件库，适用于低代码平台、大屏可视化、做图工具等场景，提供类似 Photoshop 的缩放与标尺辅助线体验。

本项目采用 **pnpm workspace** 管理的 monorepo 结构，包含以下包：

| 包路径 | 名称 | 说明 |
|--------|------|------|
| `packages/sketch-ruler` | `vue3-sketch-ruler` | 核心标尺组件库，发布到 npm |
| `packages/simple-panzoom` | `simple-panzoom` | 简化的 panzoom 工具库（支持缩放/拖拽），独立发布 |
| `packages/docs` | `root-doc` | 文档与示例站点（Vite 应用） |
| `packages/common` | `root-common` | 内部共享模块（如 i18n），不发布 |

## 技术栈

- **框架**: Vue 3（Composition API `<script setup>`）
- **语言**: TypeScript（严格模式）
- **构建工具**: Vite（组件库与文档站点）、tsup（simple-panzoom）
- **包管理**: pnpm + workspaces
- **样式**: SCSS
- **测试**: Vitest + jsdom + `@vue/test-utils`
- **代码质量**: ESLint 9（Flat Config）+ Prettier + Husky + lint-staged

## 目录结构

```
├── packages/
│   ├── sketch-ruler/          # 核心库
│   │   ├── src/
│   │   │   ├── sketch-ruler/  # 主组件、标尺包裹层、参考线、拖拽逻辑
│   │   │   ├── canvas-ruler/  # Canvas 绘制标尺刻度与阴影
│   │   │   ├── index-types.ts # 公共类型定义
│   │   │   └── index.ts       # 库入口
│   │   ├── test/              # Vitest 测试
│   │   ├── lib/               # 构建产物（Vite 输出）
│   │   └── vite.config.ts     # 库模式构建配置（ES + UMD）
│   ├── simple-panzoom/        # panzoom 底层库
│   │   ├── src/               # TypeScript 源码
│   │   ├── test/              # Vitest 测试
│   │   └── lib/               # tsup 构建产物（ESM + CJS）
│   ├── docs/                  # 示例站点
│   │   ├── src/
│   │   │   ├── examples/      # 各种使用示例（basic、comprehensive、bigscreen 等）
│   │   │   ├── router/        # Vue Router 路由
│   │   │   ├── store/         # Pinia 状态管理
│   │   │   └── App.vue
│   │   └── vite.config.ts
│   └── common/                # 内部共享（i18n 等）
├── scripts/
│   └── release.js             # 手动发布脚本（更新版本号并 npm publish）
├── .github/workflows/
│   └── gh-pages.yml           # CI：构建 + 测试 + 部署 GitHub Pages
├── package.json               # 根 package.json（workspace 根）
├── pnpm-workspace.yaml        # pnpm workspace 声明
├── tsconfig.common.json       # 公共 TS 配置（被各包继承）
├── eslint.config.mjs          # ESLint Flat 配置
└── prettier.config.js         # Prettier 配置
```

## 常用命令

所有命令均在根目录执行：

```bash
# 安装依赖
pnpm i

# 本地开发（先构建库，再启动文档站点）
pnpm dev

# 仅启动文档站点（假设库已构建）
pnpm d

# 构建核心库
pnpm build

# 构建文档站点（用于部署）
pnpm build:demo

# 运行测试（两个包）
pnpm --filter ./packages/simple-panzoom test
pnpm --filter ./packages/sketch-ruler test

# 格式化代码
pnpm format

# 检查并自动修复 ESLint 问题
pnpm lint

# 生成 changelog
pnpm changelog

# 发布（交互式选择版本）
pnpm release
```

## 构建流程

### sketch-ruler
- 使用 Vite 的 **library mode** 构建
- 入口：`src/index.ts`
- 输出格式：`es` + `umd`
- 产物目录：`packages/sketch-ruler/lib/`
- 外部依赖：`vue`（不打包进库）
- 类型声明通过 `vite-plugin-dts` 自动生成并合并为 `lib/index.d.ts`
- CSS 产物固定输出为 `lib/style.css`

### simple-panzoom
- 使用 `tsup` 构建
- 输出格式：`esm` + `cjs`
- 产物目录：`packages/simple-panzoom/lib/`
- 同时运行 `tsc` 生成类型声明

### docs
- 标准 Vite 应用
- 构建输出到 `packages/docs/dist/`
- 通过 GitHub Actions 自动部署到 `gh-pages`

## 代码风格

- **缩进**: 2 个空格
- **分号**: 不使用末尾分号（`semi: false`）
- **引号**: 单引号
- **行宽**: 100 字符
- **尾随逗号**: 不使用（`trailingComma: 'none'`）
- **组件名模板大小写**: PascalCase（`vue/component-name-in-template-casing`）

ESLint 关键规则：
- 要求显式函数返回类型（`@typescript-eslint/explicit-function-return-type: error`）
- 禁止 floating promises（`@typescript-eslint/no-floating-promises: error`）
- Vue 3 推荐规则 + Prettier 集成

> 项目源码中存在大量中文注释，这是正常的开发习惯。

## 测试说明

- 测试框架：**Vitest**，环境为 **jsdom**
- `simple-panzoom` 测试：位于 `packages/simple-panzoom/test/panzoom.spec.ts`，覆盖初始化、缩放、禁用拖拽、边界限制等。
- `sketch-ruler` 测试：位于 `packages/sketch-ruler/test/sketch-ruler.spec.ts`，使用 `@vue/test-utils` 的 `mount`，覆盖 `zoomIn` 事件、`corner` 点击、`update:lockLine` 等交互。

运行测试前需要确保相关库已构建（尤其是 `simple-panzoom` 被 `sketch-ruler` 依赖时）。

## 组件架构

### 核心组件关系

```
SketchRule (sketch-ruler/index.vue)
├── RulerWrapper x2 (水平 / 竖直)
│   ├── CanvasRuler (canvas 绘制刻度、阴影、文字)
│   ├── RulerLine[] (参考线，可拖拽删除)
│   └── indicator (新增参考线时的指示器)
└── .canvasedit (通过 simple-panzoom 实现缩放/平移的画布插槽)
```

### 关键逻辑文件

- `useLine.ts`：参考线的拖拽、吸附（snap）、越界删除、标签显示的通用 composable
- `canvas-ruler/utils.ts`：Canvas 2D 绘制标尺刻度、阴影区域、阴影文字的纯函数
- `cornerImg64.ts`：左上角眼睛图标（显示/隐藏参考线）的 base64 图片

### 交互约定

- **Ctrl + 鼠标滚轮**：以鼠标位置为中心缩放画布
- **空格 + 鼠标拖拽**：平移画布（空格按下时绑定 panzoom，松开时解绑）
- **拖拽标尺**：在标尺上拖拽可新增参考线
- **拖拽参考线到画布外**：删除该参考线
- **参考线吸附**：靠近 `snapsObj` 中的刻度时会自动吸附
- **selfHandle**：设为 `true` 时，组件不再自动监听滚轮/空格，由外部通过 `ref` 自行调用 `panzoomInstance` 方法控制

## 发布与部署

### CI / CD
- GitHub Actions 工作流 `.github/workflows/gh-pages.yml`
- 触发条件：`push` 或 `pull_request` 到 `main` / `master`
- 流程：安装依赖 → 构建 `simple-panzoom` → 构建 `sketch-ruler` → 运行测试 → 构建文档 → 部署到 GitHub Pages

### npm 发布
- 使用 `scripts/release.js` 手动执行
- 支持交互式选择 `patch` / `minor` / `major` 或自定义版本
- 发布前会自动将根目录 `README.md` 拷贝到 `packages/sketch-ruler/`
- 仅发布 `sketch-ruler` 包（`packages` 数组当前只包含 `sketch-ruler`）

## 开发注意事项

1. **workspace 依赖**: `sketch-ruler` 依赖 `simple-panzoom` 时使用 `workspace:*`。修改 `simple-panzoom` 后需重新构建，才能被 `sketch-ruler` 正确使用。
2. **Canvas 高清屏**: 绘制时使用了 `window.devicePixelRatio` 进行缩放，避免在高分屏上模糊。
3. **类型导出**: 库的对外类型定义在 `src/index-types.ts` 中，通过 `src/index.ts` 导出。构建后类型文件合并到 `lib/index.d.ts`。
4. **样式隔离**: 组件内部使用 scoped SCSS，但全局类名（如 `.sketch-ruler`、`.h-container`、`.v-container`）在组件样式中定义。
5. **兼容性**: 该库仅支持 Vue 3。如需 Vue 2 兼容版本，项目有 `1x` 分支，但当前 `master` 为 2.x 版本，与 1.x 不兼容。
