<template>
  <SketchSelecto
    ref="selectorRef"
    drag-container=".container"
    :selectable-targets="['.target']"
    :hit-rate="0"
    :select-by-click="true"
    :select-from-inside="true"
    :toggle-continue-select="['ctrl']"
    @drag-start="onDragStart"
    @select-end="onSelectEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import { SketchSelecto } from '@sketch-ruler/selecto'

const selectorRef = ref(null)
const targets = ref([])
const emit = defineEmits(['setTargetClass', 'dragStart'])
const props = defineProps({
  isMoveableElement: Function
})

const onSelectEnd = (e) => {
  let { selected } = e
  // 如果为拖拽，则将当前的整个 dom 事件传递给 movable，确保选中元素后可以立马拖拽
  if (e.isDragStart) {
    e.inputEvent.preventDefault()
    console.log('dragStart', e.inputEvent)

    emit('dragStart', e.inputEvent)
    // props.moveableRef.dragStart(e.inputEvent)
  }
  targets.value = selected
  let layerClass = selected.map((item) => '.' + item.id)
  emit('setTargetClass', layerClass)
}

const onDragStart = (e) => {
  const target = e.inputEvent.target
  if (
    props.isMoveableElement(target) ||
    targets.value.some((t) => t === target || t.contains(target))
  ) {
    e.stop()
  }
}
</script>
