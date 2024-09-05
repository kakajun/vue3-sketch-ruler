<template>
  <Selecto
    ref="selectorRef"
    :dragContainer="'.container'"
    :selectableTargets="['.target']"
    :hitRate="0"
    :selectByClick="true"
    :selectFromInside="true"
    :toggleContinueSelect="['ctrl']"
    :keyContainer="window"
    :ratio="0"
    @drag-start="onDragStart"
    @select-end="onSelectEnd"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Selecto from './Selecto.vue'
const selectorRef = ref(null)
const targets = ref([])
const emit = defineEmits(['setTargetClass', 'dragStart'])
const props = defineProps({
  isMoveableElement: Function
})

const onSelectEnd = (e) => {
  debugger
  let { selected } = e
  //如果为拖拽，则将当前的整个dom事件传递给movable，确保选中元素后可以立马拖拽
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
