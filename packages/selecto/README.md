# @sketch-ruler/selecto

> 框选引擎与 Vue 组件。专为 sketch-ruler 的 CSS transform 场景设计：选择框以 fixed 定位绘制在 body 上，天然不受父级缩放/平移影响。可替代外部 `selecto` 库。peer 依赖 `vue`。

## 安装

```bash
npm install @sketch-ruler/selecto
# 或
pnpm add @sketch-ruler/selecto
```

## 快速上手

### Vue 组件 — SketchSelecto

```vue
<script setup lang="ts">
import { SketchSelecto } from '@sketch-ruler/selecto'
import { ref } from 'vue'

const selectoRef = ref<InstanceType<typeof SketchSelecto> | null>(null)

function onSelectEnd(e: any) {
  e.selected.forEach((el: Element) => el.classList.add('selected'))
  e.removed.forEach((el: Element) => el.classList.remove('selected'))
}
</script>

<template>
  <SketchSelecto
    ref="selectoRef"
    :drag-container="'.canvas-wrap'"
    :selectable-targets="['.item']"
    :select-by-click="true"
    :toggle-continue-select="['shift', 'ctrl']"
    @select-end="onSelectEnd"
  />
  <div class="canvas-wrap">
    <div v-for="i in 20" :key="i" class="item">{{ i }}</div>
  </div>
</template>

<style>
.item.selected {
  outline: 2px solid #4299e1;
}
</style>
```

### 框架无关引擎 — SelectoEngine

如果你不想使用 Vue，可以直接使用底层引擎：

```ts
import { SelectoEngine } from '@sketch-ruler/selecto'

const engine = new SelectoEngine({
  dragContainer: '.canvas-wrap', // 监听鼠标事件的容器
  selectableTargets: ['.item'], // 可被选择的元素选择器
  selectByClick: true, // 允许点击选择
  selectFromInside: false, // 不允许从元素内部拖拽时选中该元素
  toggleContinueSelect: ['shift', 'ctrl'], // 按住 Shift/Ctrl 切换多选
  hitRate: 0 // 命中阈值：0 表示相交即选中，0.5 表示覆盖 50% 面积才选中
})

// 监听事件
engine.on('dragStart', (e) => {
  // 可调用 e.stop() 阻止本次选择，转交 moveable 等其他组件处理
  if (e.inputTarget.closest('.moveable')) {
    e.stop()
  }
})

engine.on('selectStart', (e) => {
  console.log('开始框选', e.inputTarget)
})

engine.on('select', (e) => {
  console.log('框选中', e.selected.length, '新增', e.added.length, '移除', e.removed.length)
})

engine.on('selectEnd', (e) => {
  console.log('选择结束', e.selected)
  // isDragStart: true 表示这是一次快速点击（而非拖拽）
  // clickCount: 点击次数（双击等）
})

// 程序化操作
engine.setSelectedTargets([document.querySelector('.item-1')!])
console.log(engine.getSelectedTargets())

// 销毁
engine.destroy()
```

## 事件说明

| 事件 | 触发时机 | 说明 |
| --- | --- | --- |
| `dragStart` | 鼠标按下时 | 可调用 `e.stop()` 阻止本次选择，用于与 moveable 等组件协作 |
| `selectStart` | 开始拖拽（移动超过阈值） | 不是点击，是真正的框选开始 |
| `select` | 拖拽过程中 | 实时反馈当前框选到的元素变化 |
| `selectEnd` | 鼠标抬起 | 最终选择结果，包含 `isDragStart` 标识是否为点击 |

## Props / 配置项

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `dragContainer` | `string \| HTMLElement` | `document.body` | 监听鼠标事件的容器（选择范围限制） |
| `selectableTargets` | `string[]` | `[]` | 可被选择的元素 CSS 选择器列表 |
| `selectByClick` | `boolean` | `true` | 是否允许点击选择 |
| `selectFromInside` | `boolean` | `false` | 是否允许从元素内部开始拖拽时选中该元素 |
| `toggleContinueSelect` | `string[]` | `[]` | 切换多选的按键，如 `['shift', 'ctrl']` |
| `hitRate` | `number` | `0` | 命中阈值 `0-1`，`0` 表示相交即选中，`1` 表示完全覆盖 |
| `keyContainer` | `Window \| HTMLElement` | `window` | 键盘监听容器 |

## API 概览

### SelectoEngine

| 方法 | 说明 |
| --- | --- |
| `on(event, handler)` | 注册事件监听器，返回取消订阅函数 |
| `getSelectedTargets()` | 获取当前选中的元素列表 |
| `setSelectedTargets(targets)` | 程序化设置选中元素 |
| `clickTarget(event, target)` | 程序化点击选中某个目标 |
| `destroy()` | 销毁引擎，清理事件监听和 DOM |

### SketchSelecto（Vue 组件 expose）

| 方法 | 说明 |
| --- | --- |
| `clickTarget(event, target)` | 程序化点击选中 |
| `getSelectedTargets()` | 获取当前选中的元素 |
| `setSelectedTargets(targets)` | 设置选中元素 |

## 与 sketch-ruler 的配合

在 sketch-ruler 的缩放/平移场景中，父级通常带有 `transform: matrix(...)`，这会导致普通框选库的选择框也被缩放变形。`@sketch-ruler/selecto` 的选择框以 `position: fixed` 绘制在 `document.body` 上，使用屏幕坐标系计算命中，因此完全不受父级 transform 影响。

```vue
<script setup lang="ts">
import { SketchRuler } from 'vue3-sketch-ruler'
import { SketchSelecto } from '@sketch-ruler/selecto'
</script>

<template>
  <SketchSelecto
    :drag-container="'.canvas-area'"
    :selectable-targets="['.design-item']"
  />
  <SketchRuler>
    <div class="canvas-area">
      <!-- 带有 transform 的内容 -->
      <div class="design-item" v-for="i in 10" :key="i" />
    </div>
  </SketchRuler>
</template>
```

## License

MIT
