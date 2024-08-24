<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { ref, nextTick } from 'vue'

const emit = defineEmits(['update:shadow', 'update:snapsObj'])
const props = defineProps<{
  scale: number
  snapsObj: object
  shadow: object
}>()
const draggable = true
const throttleDrag = 1
const edgeDraggable = false
const startDragRotate = 0
const throttleDragRotate = 0
const targetId = ref(null)
const moveableRef = ref(null)
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
    className: 'element0',
    left: 200,
    top: 150,
    background: '#ee8',
    width: 600,
    zIndex: 1,
    height: 600
  },
  {
    id: 'target1',
    className: 'element1',
    left: 600,
    top: 150,
    zIndex: 1,
    background: 'rgb(52, 55, 221)',
    width: 400,
    height: 300
  },
  {
    id: 'target2',
    className: 'element2',
    left: 100,
    top: 600,
    zIndex: 1,
    background: 'rgb(212, 67, 152)',
    width: 400,
    height: 400
  }
])

// 点击事件，设置当前选中元素的id
const handleClick = (event: MouseEvent, item: object) => {
  const id = item.id
  targetList.value.forEach((o) => (o.zIndex = 1))
  item.zIndex = 2
  targetId.value = id
  nextTick(() => {
    moveableRef.value.dragStart(event)
  })
}
const onDragStart = (e: Record<string, any>) => {
  copyTargetList.value = JSON.parse(JSON.stringify(targetList.value))
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

const onDragEnd = (e: { lastEvent: any; target: any }) => {
  moveableRef.value.updateRect()
}
</script>
<template>
  <div class="container">
    <div
      v-for="item in targetList"
      class="target"
      :class="item.className"
      :data-id="item.id"
      :data-left="item.left"
      :data-top="item.top"
      :id="item.id"
      :style="getStyle(item)"
      :key="item.id"
      @mousedown="handleClick($event, item)"
      >{{ item.className }}
     
    </div>
  </div>

  <Moveable
    ref="moveableRef"
    :snappable="true"
    :snapGap="true"
    :snapDirections="snapDirections"
    :elementSnapDirections="elementSnapDirections"
    :snapThreshold="5 / scale"
    :target="`#${targetId}`"
    :draggable="draggable"
    :throttleDrag="throttleDrag"
    :edgeDraggable="edgeDraggable"
    :startDragRotate="startDragRotate"
    :throttleDragRotate="throttleDragRotate"
    @drag="onDrag"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
  />
</template>

<style lang="scss" scoped>
.target {
  position: absolute;
  text-align: center;
  color: #333;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}
</style>
