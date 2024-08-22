<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { ref, nextTick } from 'vue'
import { isEqual } from 'lodash'
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

const targetList = ref([
  {
    id: 'target0',
    className: 'element0',
    left: 100,
    top: 150,
    background: '#ee8',
    width: 100,
    height: 100
  },
  {
    id: 'target1',
    className: 'element1',
    left: 300,
    top: 150,
    background: 'rgb(52, 55, 221)',
    width: 200,
    height: 100
  },
  {
    id: 'target2',
    className: 'element2',
    left: 100,
    top: 300,
    background: 'rgb(212, 67, 152)',
    width: 200,
    height: 200
  }
])

// 点击事件，设置当前选中元素的id
const handleClick = (event: MouseEvent, id: string) => {
  targetId.value = id
  nextTick(() => {
    moveableRef.value.dragStart(event)
  })
}

const updateLayout = (items: any) => {
  for (const item of items) {
    const oldItem = targetList.value.find((o: { id: string }) => o.id == item.id)
    if (!isEqual(oldItem, item)) {
      targetList.value.forEach((element: { id: string }) => {
        if (element.id == item.id) {
          element = item
        }
      })
    }
  }
}

/**
 * @description: 单个元素渲染走这里
 * @param {*} e
 * @author: majun
 */
const onRender = (e: any) => {
  const { style } = e.target
  const width = Number(style.width.replace('px', ''))
  const height = Number(style.height.replace('px', ''))
  // transform:"translate(15px, 22px)"
  const regex = /translate\((\d+)px,\s*(\d+)px\)/
  const match = e.transform.match(regex)
  if (!match) return
  // console.log(e, 'style')
  const dx = parseInt(match[1], 10)
  const dy = parseInt(match[2], 10)
  emit('update:shadow', {
    x: style.baseStartLeft + dx,
    y: style.baseStartTop + dy,
    width,
    height
  })
  e.target.style.cssText += e.cssText
}

const onDragStart = (e) => {
  // console.log(e, 'onDragStart')
  const { target } = e
  if (target) {
    const { style } = target
    style.baseStartLeft = parseFloat(style.left.replace('px', ''))
    style.baseStartTop = parseFloat(style.top.replace('px', ''))
  }
}

/**
 * @description: 单个元素拖拽结束
 * @param {*} e
 * @author: majun
 */
const onDragEnd = (e: { lastEvent: any; target: any }) => {
  console.log(e, 'onDragEnd')
  const { lastEvent, target } = e
  if (lastEvent) {
    const { left, top } = lastEvent
    const data = [
      {
        id: target.id,
        style: {
          width: target.offsetWidth,
          height: target.offsetHeight,
          left,
          top
        }
      }
    ]
    //更新组件位置信息
    updateLayout(data)
  }
}
</script>
<template>
  <div
    v-for="item in targetList"
    class="target"
    :class="item.className"
    :id="item.id"
    :style="{
      left: item.left + 'px',
      top: item.top + 'px',
      lineHeight: item.height + 'px',
      width: item.width + 'px',
      height: item.height + 'px',
      background: item.background
    }"
    :key="item.id"
    @mousedown="handleClick($event, item.id)"
    >{{ item.className }}</div
  >
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
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
    @render="onRender"
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
