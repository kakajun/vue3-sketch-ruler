<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { ref, nextTick, watch, toRefs } from 'vue'
import GroupSelectable from './GroupSelectable.vue'

interface TargetItem {
  id: string
  className: string
  left: number
  top: number
  background: string
  width: number
  height: number
  zIndex?: number // 可选字段
}

const emit = defineEmits(['update:shadow', 'update:snapsObj'])
const props = defineProps<{
  scale: number
  snapsObj: object
  shadow: object
}>()
const draggable = true
const moveableRef = ref(null)
const targets = ref(['target0'])

const snapDirections = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  center: true,
  middle: true
}

const elementSnapDirections = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  center: true,
  middle: true
}

const copyTargetList = ref()

const targetList = ref([
  {
    id: 'target0',
    className: 'element0 target0',
    left: 200,
    top: 150,
    background: '#ee8',
    width: 600,
    zIndex: 1,
    height: 600
  },
  {
    id: 'target1',
    className: 'element1 target1',
    left: 600,
    top: 150,
    zIndex: 1,
    background: 'rgb(52, 55, 221)',
    width: 400,
    height: 300
  },
  {
    id: 'target2',
    className: 'element2 target2',
    left: 100,
    top: 600,
    zIndex: 1,
    background: 'rgb(212, 67, 152)',
    width: 400,
    height: 400
  }
])

const dragStart = (event: any) => {
  nextTick(() => {
    moveableRef.value.dragStart(event)
  })
}

// 点击事件，设置当前选中元素的id
const handleClick = (event: MouseEvent, item: TargetItem) => {
  const id = item.id
  targetList.value.forEach((o: TargetItem) => (o.zIndex = 1))
  item.zIndex = 2
  targets.value = ['.' + id]

  // console.log(targets.value, '  targets.value')

  // nextTick(() => {
  //   // moveableRef.value.dragStart(event)
  // })
}
const onDragStart = (e: Record<string, any>) => {
  copyTargetList.value = JSON.parse(JSON.stringify(targetList.value))
}

const isMoveableElement = (target: any) => {
  return moveableRef.value.isMoveableElement(target)
}
const onDrag = (params: Record<string, any>) => {
  let { target, translate } = params
  const { id } = target.dataset
  const { left, top, width, height } = copyTargetList.value.find((o: { id: string }) => o.id == id)
  const [x, y] = translate
  const obj = targetList.value.find((o: { id: string }) => o.id == id)
  obj.left = left + x
  obj.top = top + y
  emit('update:shadow', {
    x: obj.left,
    y: obj.top,
    width,
    height
  })
}

watch(
  () => targetList,
  () => {
    const h = targetList.value.map((item: TargetItem) => item.top)
    const v = targetList.value.map((item: TargetItem) => item.left)
    emit('update:snapsObj', {
      h,
      v
    })
  },
  { deep: true } // 确保深度监听
)

const getStyle = (item: any) => {
  return {
    left: item.left + 'px',
    top: item.top + 'px',
    lineHeight: item.height + 'px',
    width: item.width + 'px',
    height: item.height + 'px',
    zIndex: item.zIndex,
    transform: 'rotate(0deg)', // 覆盖原来的,否则会有偏移
    background: item.background
  }
}

const setTargetClass = (targetIds: string[]) => {
  targets.value = targetIds
  console.log(targetIds, 'targetIds')
}

const onDragEnd = (e: { lastEvent: any; target: any }) => {
  moveableRef.value.updateRect()
}
</script>
<template>
  <div>
    <div class="container">
      <div
        v-for="item in targetList"
        :id="item.id"
        :key="item.id"
        class="target"
        :class="item.className"
        :data-id="item.id"
        :data-left="item.left"
        :data-top="item.top"
        :style="getStyle(item)"
        @mousedown="handleClick($event, item)"
        >{{ item.className }}
      </div>
    </div>

    <Moveable
      id="moveable"
      ref="moveableRef"
      :snappable="true"
      :snap-gap="true"
      :scalable="true"
      :resizable="true"
      :rotatable="true"
      :zoom="2"
      :snap-directions="snapDirections"
      :element-snap-directions="elementSnapDirections"
      :snap-threshold="5 / scale"
      :target="targets"
      :draggable="draggable"
      :element-guidelines="['.container', '.element0', '.element1', '.element2']"
      @drag="onDrag"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
    />
    <GroupSelectable
      :is-moveable-element="isMoveableElement"
      @drag-start="dragStart"
      @set-target-class="setTargetClass"
    />
  </div>
</template>

<style lang="scss" scoped>
.target {
  position: absolute;
  text-align: center;
  color: #333;
  font-size: 30px;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}
</style>
