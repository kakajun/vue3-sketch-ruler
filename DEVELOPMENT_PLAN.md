# vue3-sketch-ruler 3.0 重构开发计划（技术详细版）

> 基于《vue3-sketch-ruler 库重构与优化方案》拟定  
> 版本目标：**v3.0.0** —— 架构现代化、渲染 GPU 化、体验专业化、能力平台化

---

## 一、总体策略

| 维度 | 策略 |
|------|------|
| **节奏** | 分 5 个里程碑（Milestone）递进交付，每 Milestone 产出可独立测试的 Alpha 版本 |
| **兼容性** | 不提供 2.x 运行时兼容层（成本过高），但提供 `npx vue3-sketch-ruler-migrate` 自动化迁移脚本 |
| **分支管理** | 从 `main` 切出 `v3-dev` 长期开发分支；每 Milestone 合并后打 `v3.0.0-alpha.x` Tag |
| **质量门禁** | 每阶段必须满足：单元测试覆盖率 ≥ 80%、ESLint 0 Error、CI 通过、手动验收清单通过 |

---

## 二、里程碑详细规划

### Milestone 1：架构奠基（预计 5 周）

**目标**：彻底移除 `simple-panzoom` 外部依赖，内置精简变换引擎；全面迁移至 Vue 3 Composition API；建立引擎/渲染/交互/数据四层架构；产出可跑通基础缩放、平移、标尺显示的 Alpha 内核。

#### W1：引擎层——TransformEngine 内置化

**技术方案**：
- 新建 `packages/sketch-ruler/src/engine/` 目录，存放零 DOM 依赖的纯数学引擎。
- `matrix.ts`：使用 `Float64Array(6)` 紧凑存储 2D 仿射变换矩阵 `[a, b, c, d, e, f]`，提供纯函数接口：
  - `createMatrix()` → 单位矩阵
  - `multiply(m1, m2)` → 矩阵乘法
  - `invert(m)` → 矩阵求逆（用于屏幕坐标 ↔ 世界坐标转换）
  - `decompose(m)` → 分解出 `{ scale, translateX, translateY }`
- `coordinate.ts`：齐次坐标变换，支持批量转换优化。核心函数：
  - `toWorldPoint(matrix, screenX, screenY)`
  - `toScreenPoint(matrix, worldX, worldY)`
  - `fitRect(contentRect, viewportRect, mode: 'contain' | 'cover' | 'center')` → 计算最优初始变换矩阵
- `TransformEngine` 类：维护内部矩阵状态，所有缩放/平移操作转化为矩阵运算，仅在 `requestAnimationFrame` 回调中一次性写入 `style.transform`。

**关键接口设计**：
```ts
class TransformEngine {
  private matrix: Float64Array(6)
  private pending = false
  private target: { x: number; y: number; scale: number }

  setTransform(t: { x: number; y: number; scale: number }): void
  panBy(dx: number, dy: number): void
  zoomBy(dScale: number, originX: number, originY: number): void
  zoomTo(scale: number, originX: number, originY: number): void
  toWorldPoint(screenX: number, screenY: number): Point
  toScreenPoint(worldX: number, worldY: number): Point
  getState(): { x: number; y: number; scale: number }
  onUpdate(callback: (state: TransformState) => void): () => void
}
```

**rAF 动画循环机制**：
- 内部维护 `pendingTransform` 标志位。用户交互产生新变换请求时，参数存入 `target` 并设置标志，而非立即执行 DOM 更新。
- 若无非待执行 rAF 回调，则注册新任务。在 rAF 回调中，从队列取出最新参数（丢弃中间状态），计算变换矩阵，执行单次 DOM 写入。
- 量化收益：100ms 内触发 10 次滚轮事件，同步模式产生 10 次独立渲染流水线，rAF 模式仅需 1-2 次。

**验收标准**：
- 单元测试覆盖 `matrix.ts`、`coordinate.ts` 全部接口（含边界条件：零矩阵、极大/极小 scale）。
- 100 次滚轮事件压缩至 ≤2 次 rAF 回调（通过 `jest.spyOn(window, 'requestAnimationFrame')` 或 Vitest 等价方式验证）。
- 与 2.x 的 simple-panzoom 做坐标映射一致性对比：同一起点、相同滚轮输入，最终 `scale/translateX/translateY` 差值 < 0.5px。

**文件结构**：
```
packages/sketch-ruler/src/engine/
├── matrix.ts           # 纯函数矩阵运算
├── coordinate.ts       # 坐标映射、fitRect
├── transform-engine.ts # TransformEngine 类 + rAF 循环
└── index.ts            # 统一导出
```

---

#### W2：Vue 现代化——全面 Composition API + `<script setup>`

**技术方案**：
- 所有 `.vue` 组件从 Options API + `components: { SketchRule }` 模式迁移至 `<script setup lang="ts">`。
- 建立核心组合式函数（Composables），遵循"自底向上"策略：
  - `useRulerScale()`：封装标尺刻度计算逻辑（输入 scale/offset/viewportSize，输出刻度数组）。
  - `useCanvasTransform()`：封装 `TransformEngine` 与 Vue 响应式的桥接。
  - `useSnapDetection()`：参考线吸附检测的纯逻辑封装（先实现基础版本，M3 再扩展为智能吸附）。
- 对于少量遗留兼容性需求（如 `defineOptions` 宏），在 composable 内部封装隔离处理。

**关键迁移清单**：
| 原文件 | 迁移后 | 说明 |
|--------|--------|------|
| `sketch-ruler/index.vue` (Options) | `SketchRuler.vue` (`<script setup>`) | 根组件，负责 provide RulerContext |
| `useLine.ts` | `useGuideLines.ts` + `useLineDrag.ts` | 拆分状态管理与拖拽交互 |
| `canvas-ruler/index.vue` | `CanvasRuler.vue` (`<script setup>`) | 纯展示组件，接收刻度数据 props |

**验收标准**：
- ESLint `@typescript-eslint/explicit-function-return-type` 0 报错。
- `grep -r "export default" packages/sketch-ruler/src/` 无残留（除 `defineOptions` 宏外）。
- `useCanvasTransform()` 可在非组件环境（纯 Node.js/Vitest）中测试。

---

#### W3：状态体系——provide/inject + 响应式优化

**技术方案**：
- 在 `SketchRuler` 根组件中通过 `provide(RulerContextKey, rulerContext)` 注入响应式上下文对象：

```ts
interface RulerContext {
  scale: Ref<number>
  offset: Ref<{ x: number; y: number }>
  viewportSize: Ref<{ width: number; height: number }>
  contentSize: Ref<{ width: number; height: number }>
  lines: Ref<GuideLine[]>
  snapConfig: SnapConfig
  palette: RulerPalette
  engine: TransformEngine // markRaw 标记，排除 Vue 代理
}
```

- **精细化响应式策略**：
  - `shallowRef<ScaleMark[]>` 管理刻度数据：仅对 `.value` 赋值建立响应式追踪，不递归遍历内部元素属性。缩放操作后基于新参数重新计算全部刻度，一次性替换。
  - `customRef` 实现节流式响应：参考线拖拽移动以 16ms（约 60fps）节流频率触发视图刷新。
  - `markRaw` 标记 `TransformEngine` 实例、Canvas 渲染上下文，排除 Vue 代理，通过显式事件回调通知组件更新。

**验收标准**：
- 组件树任意层级 `inject(RulerContextKey)` 可获取完整上下文，TypeScript 类型推导正确。
- 连续缩放操作（100 次 `scale` 变更）内存增长 < 1MB（Chrome DevTools Memory Profiler 测量）。
- `shallowRef` 刻度数组变更时，子组件渲染次数等于变更次数（非属性级级联触发）。

---

#### W4：模块解耦——引擎/渲染/交互/数据四层分离

**技术方案**：
- **引擎层**（`src/engine/`）：纯数学运算，零 DOM 依赖，全测试覆盖。已在前三周完成。
- **渲染层**（`src/renderers/`）：定义抽象 `Renderer` 接口，M1 先实现 `Canvas2DRenderer` 基础版（仅支持简单矩形/文本绘制，满足标尺基本需求）。

```ts
interface Renderer {
  render(ctx: CanvasRenderingContext2D, items: RenderItem[], viewportRect: Rect): void
  destroy(): void
}
```

- **交互层**（`src/input/`）：设计 `InputManager` 类，M1 先实现三级架构中的基础部分：
  - `MouseAdapter`：处理 `mousedown/mousemove/mouseup/wheel`
  - `WheelNormalizer`：统一不同浏览器滚轮事件 delta 值（Chrome/Firefox/Safari 的 deltaY 差异）
  - 操作分发器：将手势转换为引擎层命令，如滚轮事件 → `TransformEngine.zoomBy()`
- **数据层**（`src/state/`）：`RulerState` 接口定义，所有状态变更通过纯函数 `produceState(currentState, action): RulerState` 完成。M1 先实现基础状态（变换参数、参考线集合），不可变快照由外部状态库按需接入。

**目录结构**：
```
packages/sketch-ruler/src/
├── engine/           # 纯数学运算（零 DOM）
├── renderers/        # 渲染抽象 + Canvas2D 实现
│   ├── types.ts
│   ├── canvas-2d-renderer.ts
│   └── index.ts
├── input/            # 输入抽象 + 鼠标/滚轮适配器
│   ├── input-manager.ts
│   ├── mouse-adapter.ts
│   └── index.ts
├── state/            # 状态管理 + 不可变更新
│   ├── ruler-state.ts
│   ├── state-manager.ts
│   └── index.ts
├── composables/      # Vue 组合式函数
│   ├── useSketchRuler.ts
│   ├── useRulerScale.ts
│   ├── useCanvasTransform.ts
│   └── useSnapDetection.ts
├── components/       # Vue 组件
│   ├── SketchRuler.vue
│   ├── RulerWrapper.vue
│   ├── CanvasRuler.vue
│   └── RulerLine.vue
└── index.ts          # 库入口
```

**验收标准**：
- 引擎层 `import` 链中无任何 DOM API（`document`、`window`、`HTMLElement` 等），可通过 `grep` 自动化检查。
- 纯 Node.js 环境可运行 `engine/` 与 `state/` 的全部单元测试。

---

#### W5：整合联调 + 基础 CI 适配

**技术方案**：
- 将前四周的模块串联：
  1. `SketchRuler.vue` provide `RulerContext`
  2. `InputManager` 监听滚轮 → `TransformEngine` 计算矩阵 → rAF 更新 DOM → `CanvasRuler` 响应式重绘
  3. 空格 + 拖拽临时平移（空格按下时绑定 pan，松开时解绑）
- 恢复 2.x 的基础功能场景：显示水平/垂直标尺、滚轮缩放、空格平移、参考线渲染。
- CI 适配：`v3-dev` 分支的 GitHub Actions 工作流，先运行引擎层单元测试，再运行组件层测试。

**验收标准**：
- 通过原有 2.x `packages/docs/src/examples/basic/` 等价场景手工验收：标尺刻度正确显示、滚轮缩放以鼠标为中心、空格拖拽平移流畅。
- CI 绿色通过（Vitest 单元测试 + ESLint + TypeScript 编译）。

**风险点**：TransformEngine 的坐标映射精度必须与 2.x 保持像素级一致。  
**缓解措施**：W1 结束前编写"坐标映射一致性"对比测试，对 2.x 与 3.x 同一组输入输出做像素级 Diff。

---

### Milestone 2：渲染性能革命（预计 4 周）

**目标**：标尺全面 Canvas 化，引入离屏缓存、LOD 自适应、标签虚拟化；画布实现视口裁剪；参考线合并为单次 drawCall。帧率稳定在 60fps。

#### W6：Canvas 标尺重构——离屏缓存 + 动态刻度密度（LOD）

**技术方案**：
- **全面迁移至 Canvas 2D API**：移除标尺的 DOM 实现（如有），`CanvasRuler.vue` 内部使用 `<canvas>` 元素。
- **离屏缓存策略**：
  - `OffscreenCanvas`（或主线程 Canvas + `transferControlToOffscreen`，视浏览器支持而定）预渲染标尺静态外观。
  - 缓存内容：背景色填充、所有主/次刻度线条绘制、刻度数字标签的文本渲染。
  - 缓存失效条件：仅当"外观定义参数"（厚度、配色、刻度密度、字体样式）变更时重建。
  - 重建可异步执行（利用 `requestIdleCallback`），避免阻塞主线程。
- **动态刻度密度算法（LOD）**：

| 缩放区间 | 主刻度间隔 | 次刻度分割数 | 标签显示策略 |
|---------|-----------|------------|------------|
| scale < 0.2 | 500px | 5 | 仅显示千位整数 |
| 0.2 ≤ scale < 0.5 | 200px | 4 | 显示百位整数 |
| 0.5 ≤ scale < 1.0 | 100px | 5 | 显示十位整数 |
| 1.0 ≤ scale < 2.0 | 50px | 5 | 显示个位整数（默认） |
| 2.0 ≤ scale < 5.0 | 20px | 4 | 显示个位 + 小数位提示 |
| 5.0 ≤ scale < 10.0 | 10px | 5 | 显示一位小数 |
| scale ≥ 10.0 | 5px | 5 | 显示两位小数，科学计数法备选 |

- **滞后带（Hysteresis）机制**：从低向高跨越阈值时，在阈值 +10% 处触发升级；从高向低跨越时，在阈值 -10% 处触发降级。降低临界振荡概率约 80%。

**验收标准**：
- 1920px 视口、20px 标尺厚度、200 个刻度标签场景，标尺绘制耗时 < 1ms/帧（Chrome Performance Panel 测量 `drawImage` + 增量绘制总耗时）。
- 对比 2.x DOM 方案，同等场景性能提升 ≥ 75%。
- LOD 级别切换时无刻度密度振荡（录制 5 秒连续缩放视频，目视检查无闪烁跳变）。

**风险点**：Canvas 高清屏 `devicePixelRatio` 处理不当会导致模糊或坐标偏移。  
**缓解措施**：建立 "DPR 矩阵" 专项测试，覆盖 1x / 1.5x / 2x / 3x 屏幕模拟（通过 Vitest + jsdom 模拟 `window.devicePixelRatio`，或在真实设备验证）。

---

#### W7：刻度标签虚拟化 + 智能截断

**技术方案**：
- **标签虚拟化**：仅渲染视口可见区域及两侧缓冲区内的刻度标签。缓冲区宽度 = 视口宽度的 0.5 倍（左右各预渲染 50% 视口宽度）。
- **LRU 标签缓存池（LabelCache）**：
  - 键：`"{text}:{font}:{color}"` 哈希
  - 值：预栅格化的 `ImageBitmap` 或 `OffscreenCanvas`
  - 首次绘制某标签时执行完整 `fillText()` 并存入缓存；后续直接调用 `drawImage()` 贴图。
  - 容量上限 500 条（约占用 5-10MB 显存），LRU 淘汰策略。
- **智能截断策略**：
  - 通过 `ctx.measureText()` 预计算标签文本宽度。
  - 当文本宽度超过可用空间时，自动省略低位数字或使用 SI 前缀（如 `1.2k` 替代 `1200`）。
  - 确保标签永不重叠。

**验收标准**：
- 快速平移（每秒 1000px）无标签空白闪烁。
- 缓存命中率 > 95%（典型使用模式下，通过统计缓存读取次数验证）。
- 标签绘制耗时从 `fillText` 的 0.5-2ms 降至 `drawImage` 的 0.01-0.05ms（单标签 micro-benchmark）。

---

#### W8：画布视口裁剪（Viewport Culling）

**技术方案**：
- 基于 `TransformEngine` 矩阵实时计算视口在世界坐标系中的边界矩形 `viewportRect`。
- 对每个待渲染元素通过边界框（AABB）与 `viewportRect` 做矩形相交检测，仅重叠元素提交至渲染层绘制。
- **大规模场景优化**（元素数量 > 10,000）：
  - 启用均匀网格（Uniform Grid）空间索引，将画布划分为固定大小单元格（如 256px × 256px）。
  - 元素按空间位置组织，视口查询转化为范围搜索，复杂度从 O(n) 降至 O(1) ~ O(k)，k 为覆盖单元格数。
  - 索引更新采用"惰性重建"：元素位置变更时标记脏区，下一帧渲染前批量重建受影响单元格。

**验收标准**：
- 10,000 个元素场景下，视口查询 + 可见性判定总耗时 < 2ms。
- 视口外元素 0 次绘制调用（通过自定义 Renderer 的调用计数验证）。

---

#### W9：参考线 Canvas 层 + 单次 drawCall

**技术方案**：
- 将参考线从独立 DOM 元素迁移至独立 Canvas 层（覆盖于主画布之上，`pointer-events: none` 或按需启用）。
- **批次合并**：
  - 所有横向参考线聚合为一组： `beginPath()` → 多次 `moveTo()`/`lineTo()` → 单次 `stroke()`。
  - 所有纵向参考线同理聚合为另一组。
  - 若支持个性化样式，按样式分组。批次数量 = 不同样式数量，通常控制在 3-5 组以内。
- 参考线标签（数值文本）采用与标尺标签相同的 `LabelCache` 机制缓存。

**验收标准**：
- 20 条参考线绘制从 20+ 次 DOM 样式更新压缩至 2-4 次 drawCall。
- CPU 耗时从 2-5ms 降至 0.2-0.5ms（Chrome Performance Panel 测量）。
- 参考线拖拽跟手无掉帧（60fps 稳定）。

---

### Milestone 3：交互体验升级（✅ 已完成）

**目标**：缩放交互双模式化、物理动画化；参考线系统支持拖拽创建、智能吸附、管理面板；键盘无障碍完备。

#### W10：双模式缩放 + 平滑缩放动画

**技术方案**：
- **三模式缩放机制**（方案中为双模式，扩展为三模式更完整）：

| 模式 | 标识 | 缩放原点 | 适用场景 | 默认触发 |
|------|------|---------|---------|---------|
| 设计模式 | `'pointer'` | 当前鼠标指针位置（世界坐标） | 精细设计、局部编辑 | Ctrl + 滚轮 |
| 演示模式 | `'viewport-center'` | 视口矩形几何中心 | 演示汇报、协作同步 | Alt + 滚轮 |
| 内容中心模式 | `'content-center'` | 画布内容边界框中心 | 全局概览、初始定位 | 双击空白处 |

- **平滑动画物理模型**：
  - **阻尼缩放（Damped Zoom）**：微分方程 `s̈ + 2ζω₀ṡ + ω₀²s = s_target`，默认 ζ = 0.8，ω₀ = 20 rad/s。
  - **指数缓动（Exponential Ease）**：`s_new = s_old + (s_target - s_old) × (1 - e^(-Δt/τ))`，τ = 80ms。
  - **直接映射（Direct）**：关闭动画，即时生效。
- 模式切换支持即时响应与 200ms 平滑过渡（原点位置插值）。

**验收标准**：
- 模式切换平滑过渡 200ms，画面无跳变。
- 120fps 预算内完成缩放响应（从滚轮事件到 DOM 更新 < 8ms）。
- 弹簧模型在快速滚轮后"轻微过冲、迅速稳定"，手感可主观验收。

---

#### W11：触控板手势 + 快捷键体系

**技术方案**：
- **PointerAdapter**（基于 W3C Pointer Events）统一处理鼠标、触摸、触控板：
  - 双指捏合：`PinchRecognizer` 解析两个指针点距离变化，输出缩放比例增量，原点为两指中心。
  - 惯性滑动：分析最后 100ms 内速度序列，速度 > 500px/s 时触发惯性动画。
- **KeyboardAdapter**：
  - 修饰键状态追踪（Ctrl/Cmd/Alt/Shift）。
  - 映射方向键、加减键为平移/缩放语义事件。
  - 冲突处理策略：可配置"拦截优先"或"浏览器优先"。
- **预设缩放级别**：优先数系设计：`10%, 25%, 33%, 50%, 66%, 100%, 150%, 200%, 300%, 400%, 600%, 800%, 1600%`。

| 快捷键 | 功能 |
|--------|------|
| Ctrl/Cmd + 0 | 缩放至 100% |
| Ctrl/Cmd + - | 缩小一个预设步长 |
| Ctrl/Cmd + = | 放大一个预设步长 |
| Ctrl/Cmd + 1 | 适配至视口（Fit），留 5% 边距 |
| Ctrl/Cmd + 2 | 适配至选中元素 |
| Space + 拖拽 | 临时平移工具 |

**验收标准**：
- 触控板捏合缩放原点准确（两指中心点与缩放中心偏差 < 5px）。
- 快捷键不冲突浏览器默认行为（如 Ctrl+0 不会触发浏览器缩放）。

---

#### W12：参考线拖拽创建 + CSS 变量吸附预览

**技术方案**：
- **拖拽创建交互**：
  1. 鼠标移至标尺区域，指针变为 `crosshair`。
  2. `pointerdown` 在标尺区域 → 立即创建半透明虚线预览线并跟随指针。
  3. `pointermove` 每帧更新预览线位置，同步显示当前坐标标签。
  4. `pointerup` 时若位置有效（在画布内）则正式创建，若拖回标尺区域则取消。
- **CSS 自定义属性驱动吸附预览**：
  - 在参考线层容器上定义 CSS 变量：`--snap-target-x`、`--snap-target-y`、`--snap-intensity`、`--snap-active`。
  - JavaScript 仅在吸附检测计算出目标位置后，通过 `element.style.setProperty()` 更新变量值。
  - 所有视觉效果由 CSS 驱动：

```css
.snap-preview-line {
  opacity: calc(var(--snap-active) * 0.6);
  transform: translateX(var(--snap-target-x));
  transition: opacity 0.15s ease, transform 0.1s ease-out;
  background-color: hsl(calc(60 - var(--snap-intensity) * 60), 100%, 50%);
}
```

**验收标准**：
- 拖拽创建流程响应延迟 < 16ms（从 `pointermove` 到预览线位置更新）。
- 吸附时无强制同步布局（Chrome Performance Panel 无紫色 Layout 阻塞）。

---

#### W13：智能吸附引擎

**技术方案**：
- **吸附目标类型与优先级**：

| 目标类型 | 检测机制 | 优先级 |
|---------|---------|--------|
| 等距分布 | 三元素以上自动计算等距分割点 | 最高 |
| 元素边界 | 自动检测可见元素边界框 | 高 |
| 元素中心线 | 检测元素水平/垂直中心 | 高 |
| 网格吸附 | 显式网格间距配置 | 中 |
| 参考线吸附 | 参考线间互相对齐 | 中 |

- `useRulerSnap()` 组合式函数：
  - 支持完全自定义的 `SnapRule` 接口：`{ id, priority, getTargets, getSnapPosition }`。
  - 默认规则包含：刻度吸附、参考线吸附。
  - 用户可注入自定义规则（如数据轴刻度吸附）。
- 吸附距离阈值默认 8px，吸附强度默认 0.5（"软吸附"：吸附后位置 = 原始位置 × 0.5 + 目标位置 × 0.5）。

**验收标准**：
- 50 个元素 + 100 条参考线场景，吸附计算总耗时 < 2ms。
- 自定义 `SnapRule` 可正确插入并生效（通过单测验证）。

**风险点**：智能吸附的"元素边界自动检测"需要遍历画布 DOM/数据，可能引发性能回退。  
**缓解措施**：元素边界缓存采用惰性重建，仅在元素变更时更新；提供 `snapTargets` 外部注入模式供重度场景绕过自动检测。

---

#### W14：参考线管理面板 + 样式自定义 + 无障碍

**技术方案**：
- **参考线管理面板**：
  - 可折叠浮动面板，通过 `v-model:panelVisible` 控制。
  - 功能：可视化列表（缩略图+数值+颜色）、批量操作（多选后锁定/隐藏/删除/改色）、搜索过滤（数值/方向/颜色/锁定状态）、预设管理（保存/切换布局方案）。
  - 操作支持撤销/重做（由外部状态管理实现）。
- **参考线样式系统**：

| 属性 | 类型 | 默认值 |
|------|------|--------|
| color | string | #EB5648 |
| lockedColor | string | #999999 |
| lineStyle | 'solid' \| 'dashed' \| 'dotted' | 'dashed' |
| lineWidth | number | 1 |
| labelEnabled | boolean | true |
| labelPosition | 'start' \| 'center' \| 'end' | 'start' |
| labelFormat | (value: number) => string | v => `${v}px` |

- **无障碍（A11y）**：
  - ARIA：`role="application"`（容器）、`role="scrollbar"`（标尺）、`role="separator"`（参考线）。
  - 键盘：Tab 聚焦标尺刻度、方向键 1px 微调（Shift+10px、Ctrl+吸附间隔）、Enter 创建参考线。
  - 高对比度：`prefers-contrast: high` 媒体查询自动启用纯黑/纯白配色。

**验收标准**：
- 面板操作支持批量锁定/隐藏/删除/改色。
- WCAG 2.1 AA 对比度达标（所有文本/背景组合 ≥ 4.5:1）。
- 屏幕阅读器（NVDA/VoiceOver）可正确朗读参考线位置与状态。

---

### Milestone 4：平台级功能扩展（✅ 已完成）

**目标**：多画布管理、协作基础、缩略图导航、插件系统。

#### W15：多画布标签页管理

**技术方案**：
- **状态隔离**：每个画布拥有独立的变换状态、参考线集。
- **状态共享**：可选的"全局参考线"层，在所有画布间共享（通过 `globalLines` 配置）。
- **内存管理**：非激活画布自动降级为缩略图缓存，释放渲染资源（Canvas 对象、WebGL 上下文），激活时即时恢复。
- **API 设计**：

```ts
interface CanvasManager {
  activeCanvasId: Ref<string>
  canvases: Ref<CanvasState[]>
  addCanvas(config?: Partial<CanvasConfig>): string // 返回 canvasId
  removeCanvas(canvasId: string): void
  switchCanvas(canvasId: string): void
  registerTemplate(name: string, config: CanvasConfig): void
}
```

**验收标准**：
- 切换画布后，变换参数与参考线状态正确恢复（与切换前一致）。
- 非激活画布内存占用下降 > 80%（Chrome DevTools Memory Profiler）。

---

#### W16：缩略图导航（Minimap）

**技术方案**：
- **独立渲染管线**：
  - 分辨率固定 256×256 或 512×512，与主视图无关。
  - 元素几何简化（复杂路径 → 包围盒）、文本省略、特效关闭。
  - 降采样系数 10-50 倍，渲染耗时控制在 1-2ms。
- **脏区追踪与增量更新**：
  - 订阅画布内容变更事件，标记受影响区域为"脏区"。
  - 独立 rAF 循环，优先级低于主视图（可配置每 3-5 帧更新一次）。
  - 纯视口平移/缩放操作仅需更新视口覆盖层（矩形框），耗时 < 0.1ms。
- **交互反馈**：
  - 点击 Minimap → 主视图平滑动画跳转至对应位置。
  - 拖拽 Minimap 视口框 → 实时同步主视图变换参数。

**验收标准**：
- Minimap 更新耗时 < 2ms（内容变更时）。
- 纯视口操作（平移/缩放）Minimap 视口框更新 < 0.1ms。
- 点击跳转动画流畅（200ms ease-out）。

---

#### W17：插件系统——生命周期钩子 + 自定义渲染器

**技术方案**：
- **生命周期钩子**：

```ts
interface SketchRulerHooks {
  beforeZoom: (ctx: { from: number; to: number; center: Point; cancel: () => void }) => void | Promise<void>
  afterPan: (ctx: { offset: Point; delta: Point }) => void
  onSnap: (ctx: { line: GuideLine; targets: SnapTarget[]; applied: SnapTarget | null }) => void
  onLineCreate: (ctx: { line: GuideLine }) => void
  onLineDelete: (ctx: { line: GuideLine }) => void
  // ...
}
```

- `before` 类钩子可通过 `cancel()` 阻止操作执行。
- **自定义渲染器注册**：

```ts
interface RulerRenderer {
  renderTicks(ctx: CanvasRenderingContext2D, ticks: Tick[], config: RenderConfig): void
  renderLabels(ctx: CanvasRenderingContext2D, labels: Label[], config: RenderConfig): void
}

sketchRuler.registerRenderer('minimal', new MinimalRulerRenderer())
sketchRuler.setActiveRenderer('minimal')
```

**验收标准**：
- 插件可通过 `beforeZoom` 拦截并取消缩放（单测验证）。
- 第三方渲染器可完全覆盖默认绘制逻辑（提供 Demo 验证）。

**风险点**：多画布 + 插件的组合可能导致状态管理复杂度爆炸。  
**缓解措施**：冻结核心状态接口，插件仅通过钩子只读访问。

---

#### W18：工具栏插槽化 + 跨画布复制粘贴 + 页面模板

**技术方案**：
- **工具栏完全插槽化**：

```vue
<SketchRuler>
  <template #toolbar="{ tools, state }">
    <tools.zoomIn />
    <tools.zoomOut />
    <tools.reset />
    <MyCustomTool :scale="state.scale" />
  </template>
</SketchRuler>
```

- 内置工具以对象形式暴露，用户可选择性使用、重新排序或完全替换。
- **跨画布复制粘贴**：
  - 复制操作捕获元素完整状态（位置、样式、元数据）。
  - 粘贴时根据目标画布的当前缩放与偏移，自动调整元素位置以保持视觉一致性。
  - 参考线跨画布粘贴时自动转换坐标值。
- **页面模板系统**：

| 模板名称 | 尺寸 |
|---------|------|
| A4 纵向 | 210mm × 297mm |
| A4 横向 | 297mm × 210mm |
| Web 1920 | 1920px × 1080px |
| Web 1440 | 1440px × 900px |
| Mobile 375 | 375px × 812px |
| Mobile 414 | 414px × 896px |

- `registerTemplate(name, config)` API 支持用户扩展自定义模板。

**验收标准**：
- 工具栏可完全替换为自定义实现，状态绑定正常响应。
- 跨画布粘贴后元素视觉位置与原画布一致（误差 < 1px）。
- 模板一键创建后画布尺寸正确。

---

### Milestone 5：工程化与生态（预计 4 周）

**目标**：测试体系完善、构建分发现代化、调试模式、文档与迁移工具上线。

#### W20：测试体系补完

**技术方案**：
- **单元测试**：
  - 引擎层数学运算：属性测试（Property-Based Testing）使用 `fast-check` 生成随机输入，验证数学不变量：
    - "变换后再逆变换应回到原点"
    - "缩放比例始终约束在 [minZoom, maxZoom] 内"
    - "矩阵乘法满足结合律"
  - Composables 测试：`useSketchRuler()` 状态管理、`useRulerSnap()` 吸附计算。
  - 组件测试：`@vue/test-utils` 测试 `SketchRuler` props 响应、`RulerBar` 刻度渲染。
- **可视化回归测试**：
  - Playwright 截图对比：针对 5 个基准状态生成截图（默认视图、缩放 200%、平移偏移、参考线显示、暗色主题）。
  - 像素级对比阈值 0.1%，忽略抗锯齿差异。
  - 差异超过阈值需人工审核，审核结果更新基准。
- **性能基准测试**（Benchmark.js）：

| 测试项 | 目标指标 |
|--------|---------|
| 缩放响应延迟 | < 8ms |
| 平移帧率稳定性 | 99% 帧 > 55fps |
| 标尺渲染耗时 | < 1ms |
| 参考线吸附计算 | < 2ms |
| 内存占用趋势（10分钟） | < 10MB 增长，无泄漏 |

**验收标准**：
- 引擎层 + composables 测试覆盖率 ≥ 90%。
- CI 中性能回归 > 10% 自动阻断合并。
- 截图 Diff 阈值 0.1%，基准截图存入版本控制。

---

#### W21：构建与分发

**技术方案**：
- **Vite Library Mode 多格式输出**：

| 格式 | 扩展名 | 适用场景 |
|------|--------|---------|
| ESM | `.mjs` / `.js` (type: module) | Vite、Webpack 5+、Rollup |
| CJS | `.cjs` / `.js` (type: commonjs) | Node.js、旧版构建工具 |
| UMD | `.umd.cjs` | 浏览器 `<script src>` |
| IIFE | `.iife.js` | 书签脚本、微前端 |

- **Tree-shaking 优化**：
  - 细粒度导出：`import { useRulerSnap } from 'vue3-sketch-ruler/composables'`、`import { Canvas2DRenderer } from 'vue3-sketch-ruler/renderers'`。
  - `package.json` 标注 `"sideEffects": false`。
  - `exports` 字段配置条件导出，支持多路径映射。
- **体积目标**：
  - 仅核心缩放平移功能：< 15KB（gzip）
  - 全量引入（含 WebGL 后端、Minimap、多画布管理）：< 50KB（gzip）
- **CDN 构建**：官方 jsDelivr/unpkg 分发，提供 SRI 哈希安全校验。

**验收标准**：
- `sideEffects: false` 通过 `webpack-bundle-analyzer` / `rollup-plugin-visualizer` 验证未使用代码被消除。
- 各格式文件可在对应环境中正确加载（通过集成测试验证）。

---

#### W22：调试模式 + Volar 插件

**技术方案**：
- **调试模式**（`debug: true` 配置启用）：

| 调试功能 | 显示内容 |
|---------|---------|
| 坐标网格 | 世界坐标系网格线（主网格 100px，次网格 10px） |
| 变换矩阵 HUD | scale、offsetX、offsetY 实时数值，完整矩阵 a,b,c,d,e,f |
| 视口轮廓 | 当前视口在世界坐标系中的边界矩形 |
| 性能监控 | FPS、每帧渲染耗时（ms）、drawCall 次数、内存占用 |
| 事件追踪 | 最近 10 个输入事件的类型、坐标、时间戳 |
| 吸附可视化 | 吸附候选目标高亮、吸附距离标签标注 |

- 调试面板以浮动窗口叠加在画布之上，`Ctrl+Shift+D` 快捷键切换。
- **Volar 插件**：
  - 基于 `defineExpose` 和 `defineSlots` 宏，将组件公共 API 契约显式化。
  - 提供属性名自动补全、`v-model:` 绑定值类型实时校验、插槽参数类型提示、事件处理器参数类型推断。

**验收标准**：
- 调试面板不影响正常交互（`pointer-events` 正确处理）。
- Volar 插件在 VS Code 中可为 `<SketchRuler>` 的 `v-model:scale` 提供 `number` 类型推断。

---

#### W23：文档站点 + 迁移工具

**技术方案**：
- **VitePress 文档站点**：
  - 结构：快速开始、核心概念、API 参考、示例库、迁移指南。
  - 实时 Playground：基于 `@vue/repl` 实现，预置模板（空白画布、流程图编辑器、海报设计器、数据大屏）。
  - 每个示例可一键打开 StackBlitz/CodeSandbox。
- **自动化迁移脚本**：`npx vue3-sketch-ruler-migrate`
  - 扫描项目源码，自动替换 2.x API 为 3.x 等效写法：
    - `palette` 嵌套配置 → 扁平化配置
    - `lines` 命令式 API（`addLine()`/`removeLine()`）→ 响应式数组
    - `btn` 插槽 → `#toolbar` 插槽
  - 生成详细迁移报告（变更文件列表、无法自动处理的警告项）。
- **迁移指南**：
  - Breaking Changes 清单：每项说明"原写法 → 新写法 → 迁移理由"。
  - 附迁移前后的代码 diff。

**验收标准**：
- Playground 可在浏览器中实时编辑并预览（修改代码后 < 3 秒刷新）。
- 迁移脚本可正确处理 2.x 官方示例中的全部 API 调用（作为测试集）。

---

## 三、版本路线图

```
时间线 ──────────────────────────────────────────────────────────────>

M1 架构奠基        M2 渲染革命        M3 交互升级        M4 平台扩展        M5 工程化
[=====5w=====]    [====4w====]      [=====5w=====]     [=====5w=====]    [====4w====]
       |                 |                  |                  |               |
   v3.0.0-alpha.1   v3.0.0-alpha.2    v3.0.0-alpha.3     v3.0.0-alpha.4  v3.0.0-beta.1
   (内核可运行)      (60fps 标尺)       (专业交互)          (平台能力)       (RC 候选)
                                                                      |
                                                                 v3.0.0
                                                               (正式发布)
```

**总计预估工期**：约 **23 周（~5.5 个月）**，不含需求冻结后的稳定化期。

---

## 四、资源与依赖

| 资源 | 说明 |
|------|------|
| **核心人力** | 1 名架构师/技术负责人（全程）；2 名前端开发（M1-M5 全职）；1 名测试/工具开发（M3 介入，M5 主力） |
| **关键外部依赖** | WebGL 2.0 后端（M2 可选延后，不影响主线）；Yjs 协作 Demo（M5 社区示例，非核心阻塞） |
| **基础设施** | GitHub Actions CI（已具备）；npm 发布权限（已具备）；Vercel/Netlify（文档站点托管） |

---

## 五、关键决策记录（ADR）

1. **不保留 2.x 运行时兼容层**：方案中提到 `vue3-sketch-ruler/compat`，但开发计划将其降级为"迁移脚本 + 迁移指南"。原因：2.x 与 3.x 状态管理机制（命令式 API → 响应式数组）差异过大，兼容层会严重污染新架构。
2. **WebGL 后端列为 M2 可选任务**：若 M2 结束时 Canvas 2D 已满足 60fps（<1000 元素场景），WebGL 后端可推迟至 v3.1，避免阻塞 v3.0 发布。
3. **实时协作仅预留接口**：OT/CRDT 适配层在 M4 完成接口设计，但不实现完整逻辑，待 v3.x 迭代中根据社区需求启动。

---

## 六、风险总览与应急预案

| 风险 | 影响 | 概率 | 应急预案 |
|------|------|------|---------|
| TransformEngine 坐标映射精度不达标 | M1 延期 1-2 周，整体后移 | 中 | 建立 2.x/3.x 像素级 Diff 自动化测试；若无法解决，保留 simple-panzoom 作为可选后端 |
| Canvas 标尺在低端设备性能不及预期 | M2 需引入 WebGL 后端，增加 3 周 | 低 | M2 预留 1 周 Buffer；提前在 W6 做低端设备基准测试 |
| 团队成员对 Composition API 迁移经验不足 | M1 延期 | 低 | M1 W1 安排 2 天集中培训；Code Review 强制要求 |
| 社区对 Breaking Changes 反弹大 | v3 adoption 受阻 | 中 | M5 优先完成迁移脚本与迁移指南；v3.0.0 发布时配套发布升级直播/文章 |

---

## 七、即刻可启动的准备工作

1. **切分支**：从 `main` 创建 `v3-dev` 并设置分支保护规则。
2. **建目录**：在 `packages/sketch-ruler/src/` 下预创建 `engine/`、`renderers/`、`input/`、`state/` 四层目录。
3. **备环境**：升级根目录 Vite 至最新稳定版；确认 Vitest + `@vue/test-utils` 版本兼容 Vue 3.4+。
4. **写基线**：在 `v3-dev` 提交一份"坐标映射一致性"对比测试脚本（调用 2.x 现有构建产物与 3.x 新引擎做对比），作为 M1 W1 的开工基准。

---

*计划拟定日期：2026-05-14*  
*基于方案版本：《vue3-sketch-ruler 库重构与优化方案》*
