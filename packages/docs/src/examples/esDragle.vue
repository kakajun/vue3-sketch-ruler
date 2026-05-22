<template>
  <div>
    <div
      class="wrapper"
      :class="[!store.isLight ? 'blackwrapper' : 'whitewrapper']"
      :style="rectStyle"
    >
      <SketchRuler ref="sketchruleRef" v-model:scale="scale" v-bind="post">
        <template #default>
          <div ref="dragParentRef" data-type="page" :style="canvasStyle">
            <Drager
              v-for="item in data.componentList"
              v-bind="item"
              :key="item.id"
              snap
              :scale-ratio="scale"
              class="dragerItem"
              :snap-threshold="10"
              markline
              :extra-lines="extraLines"
              @change="onChange($event, item)"
              @drag-start="onDragStart(item)"
            >
              <div @mousedown="onSelect(item)">
                <component :is="item.component">{{ item.text }}</component>
              </div>
            </Drager>
          </div>
        </template>
        <template #toolbar="{ tools }">
          <div class="btns">
            <button @click.stop="tools.reset">还原</button>
            <button @click.stop="tools.zoomIn">放大</button>
            <button @click.stop="tools.zoomOut">缩小</button>
          </div>
        </template>
      </SketchRuler>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, CSSProperties } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import Drager, { DragData } from 'es-drager'
import { useAppStore } from '@/store/app'
const store = useAppStore()
const sketchruleRef = ref()
const dragParentRef = ref<HTMLElement>()
const scale = ref(1)
const post = reactive<any>({
  thick: 20,
  width: 1470,
  height: 700,
  canvasWidth: 1000,
  canvasHeight: 500,
  showRuler: true,
  palette: { bgColor: 'transparent', guideLineStyle: 'dashed' },
  isShowReferLine: true,
  shadow: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  lines: {
    h: [300],
    v: [400]
  }
})
// 组件类型
interface ComponentType {
  id?: string
  component: string // 内部组件名称，自定义组件需要提前全局注册
  text?: string // 文本
  width?: number
  height?: number
  top?: number
  left?: number
  angle?: number
  style?: CSSProperties // 样式
}

interface EditorState {
  componentList: ComponentType[]
}
const data = ref<EditorState>({
  componentList: [
    {
      id: 'div1',
      component: 'div',
      text: 'div1',
      width: 100,
      height: 100,
      left: 0,
      top: 0
    },
    {
      id: 'div2',
      component: 'div',
      text: 'div2',
      width: 100,
      height: 100,
      top: 100,
      left: 100
    }
  ]
})
const rectStyle = computed(() => {
  return {
    width: `${post.width}px`,
    height: `${post.height}px`
  }
})

const canvasStyle = computed<CSSProperties>(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`,
    position: 'relative',
    background: store.isLight ? '#eff2f5' : '#333333'
  }
})

const activeId = ref<string>('')

// 拖拽开始时的快照（仿 moveble.vue）
const copyList = ref<ComponentType[]>([])

const setShadow = (item: ComponentType) => {
  post.shadow = {
    x: item.left ?? 0,
    y: item.top ?? 0,
    width: item.width ?? 0,
    height: item.height ?? 0
  }
}

const onSelect = (item: ComponentType) => {
  activeId.value = item.id!
  setShadow(item)
}

const onDragStart = (item: ComponentType) => {
  copyList.value = JSON.parse(JSON.stringify(data.value.componentList))
}

const onChange = (dragData: DragData, item: any): void => {
  const original = copyList.value.find((o) => o.id === item.id)

  // 只更新有效值，避免 es-drager 在纵轴返回异常值导致覆盖错误
  if (typeof dragData.left === 'number') item.left = dragData.left
  if (typeof dragData.top === 'number') item.top = dragData.top
  if (typeof dragData.width === 'number') item.width = dragData.width
  if (typeof dragData.height === 'number') item.height = dragData.height
  if (typeof dragData.angle === 'number') item.angle = dragData.angle

  // 如果 es-drager 传出的值异常（如 top 变成 0 或 undefined），用快照兜底
  if (original) {
    if (item.left == null || Number.isNaN(item.left)) item.left = original.left
    if (item.top == null || Number.isNaN(item.top)) item.top = original.top
    if (item.width == null || Number.isNaN(item.width)) item.width = original.width
    if (item.height == null || Number.isNaN(item.height)) item.height = original.height
  }

  setShadow(item)
}

const extraLines = (targetRect: DOMRect): Element[] => {
  // 可以返回dom元素列表
  return Array.from(document.querySelectorAll('.sketch-ruler .lines .line'))
}
</script>

<style lang="scss">
.wrapper {
  margin: 0 auto;
  background-size:
    21px 21px,
    21px 21px;
  border: 1px solid #dadadc;
}

.whitewrapper {
  background-color: #fafafc;
  background-image:
    linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}

.blackwrapper {
  background-color: #18181c;
  background-image:
    linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
}

.img-style {
  width: 100%;
  height: 100%;
}
.btns {
  position: absolute;
  display: flex;
  bottom: 20px;
  right: 40px;
  z-index: 999;
}
.dragerItem {
  background: blue;
}
</style>
