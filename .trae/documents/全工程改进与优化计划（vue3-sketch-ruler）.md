## 总览
- 目标：提升 API 一致性、交互稳定性、打包发布兼容性、代码质量与测试保障，优化文档与示例。
- 范围：组件库（packages/sketch-ruler）、文档站（packages/docs）、根层构建与 CI。

## 快速修正（API 与文档一致性）
- 统一事件与插槽命名：组件实际事件 `onCornerClick/zoomchange/update:scale/update:lockLine`（packages/sketch-ruler/src/sketch-ruler/index.vue:111）；文档补充这两类 `update:*` 事件，并将插槽方法统一为 `reset/zoomIn/zoomOut`（packages/sketch-ruler/README.md:235–241 当前有重复 `zoomIn`）。
- 校准默认值：`height` 文档为 900（packages/sketch-ruler/README.md:165），代码默认为 800；`canvasWidth` 文档为 1000（packages/sketch-ruler/README.md:170），`canvasHeight` 文档为 700（packages/sketch-ruler/README.md:171）；以代码为准或同步调整代码默认并在 README 标注。
- 将 `palette` 改为可选类型并在实现处合并默认值（packages/sketch-ruler/src/index-types.ts:49）。

## 稳定性与生命周期（事件绑定与 Panzoom 管理）
- 为组件增加卸载清理：当前仅 `onMounted` 初始化（packages/sketch-ruler/src/sketch-ruler/index.vue:216–218），无 `onUnmounted`；新增卸载时移除所有在挂载期间绑定到 `document/parent` 的 `wheel/keydown/keyup/touchstart/pointer*` 监听。
- 避免重复初始化：对 `width/height/canvasWidth/canvasHeight` 的 `watch` 会调用 `initPanzoom()`（packages/sketch-ruler/src/sketch-ruler/index.vue:314–319）；在 `initPanzoom()` 内先销毁旧实例、解绑 `panzoomchange`，再重建（packages/sketch-ruler/src/sketch-ruler/index.vue:253–254）。
- 优化滚轮与触控：仅在需要时 `preventDefault()`；使用 `{ passive: true/false }` 明确滚轮与触控监听行为范围（减少对页面滚动的副作用）。

## 构建与发布（包导出与 CDN 用法）
- 明确导出入口与格式：在 `packages/sketch-ruler/package.json` 增加 `module: lib/index.es.js` 与 `exports` 映射（packages/sketch-ruler/package.json:21–25）。
- 在 `vite.config.ts` 显式 `build.lib.formats: ['es','umd']` 并对齐文件名（packages/sketch-ruler/vite.config.ts:25–33）。
- 更新 README 的 CDN 链接与 UMD 全局名，确保与构建产物一致（packages/sketch-ruler/README.md:82–91）。

## 测试与质量保障
- 引入 `vitest + jsdom` 基础测试：
  - 刻度渲染与边界（packages/sketch-ruler/src/canvas-ruler/utils.ts:51–187，含 `getGridSize` 与文字位置计算）。
  - 吸附逻辑与阈值（packages/sketch-ruler/src/sketch-ruler/useLine.ts:50–54，`snapThreshold/scale`）。
  - 事件绑定与清理（挂载/卸载、`selfHandle` 切换）。
- 在 CI 中加入 `pnpm lint`、`pnpm test`、构建校验。

## Lint 与类型策略
- 调整 ESLint 解析设置：`ecmaVersion: 2022`、`sourceType: 'module'` 以匹配 ESM/TS（当前为 5 和 commonjs，eslint.config.mjs:44–45）。
- 保留必要的禁用项但逐步收紧规则，优先修复 `any` 的关键路径，完善 `FinalPaletteType/PaletteType` 使用一致性。

## 交互与体验
- 键盘与鼠标交互：限制监听作用域到组件容器；确保 `Space` 拖拽与 `Ctrl + wheel` 缩放不影响页面其它区域。
- DPR 适配与清晰度：维持 `devicePixelRatio` 的绘制策略且在窗口尺寸变化时仅重绘，不重复重建实例（utils.ts 已按 `ratio` 处理，packages/sketch-ruler/src/canvas-ruler/utils.ts:69–76）。

## 文档与示例
- 统一使用示例：`#btn` 插槽参数命名与文档一致；修正示例中的方法名（packages/sketch-ruler/README.md:134–139 采用 `resetMethod/...`）。
- 扩充示例：新增吸附示例、锁线示例、自定义滚轮与触控示例，并在文档站中分场景呈现（packages/docs）。

## CI 工作流现代化
- 移除 `::set-output`，改用 `$GITHUB_OUTPUT`（.github/workflows/gh-pages.yml:31）。
- 缓存与多步校验：添加 pnpm 缓存，分步执行安装、lint、test、build、部署（packages/docs/vite.config.ts:19 为构建目录）。

## 实施里程碑
- 第一阶段（快速一致性）：API/文档统一、插槽命名修正、默认值对齐、`palette` 可选。
- 第二阶段（稳定性）：卸载清理、Panzoom 重建治理、滚轮与触控监听范围与 passive 设置。
- 第三阶段（发布）：包导出规范化、Vite 格式对齐、CDN 文档更新。
- 第四阶段（质量）：引入 Vitest 测试与基础用例、CI 集成。
- 第五阶段（Lint/类型）：ESLint 配置升级与类型收紧、Palette 类型统一。
- 第六阶段（示例/文档）：补充示例场景、文档站内容优化。

## 验收与回归
- 树立用例清单：吸附/锁线/缩放/重建/卸载等关键场景。
- 本地与 CI 同步通过：`lint/test/build` 均通过后发布。
- 发布后通过 CDN 与 ES 模块两路验证（浏览器与打包器）。

如确认以上计划，我将按里程碑逐项执行并提交具体改动与验证。