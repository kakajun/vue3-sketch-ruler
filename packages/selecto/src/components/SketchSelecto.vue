<template>
  <div ref="elRef" style="display: none"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { SelectoEngine } from '../engine/selecto-engine'
import type {
  SelectoEngineOptions,
  SelectoDragStartEvent,
  SelectoSelectStartEvent,
  SelectoSelectEvent,
  SelectoSelectEndEvent
} from '../engine/selecto-engine'

export interface SketchSelectoProps {
  dragContainer?: string | HTMLElement
  selectableTargets?: string[]
  selectByClick?: boolean
  selectFromInside?: boolean
  toggleContinueSelect?: string[]
  hitRate?: number
  ratio?: number
  keyContainer?: Window | HTMLElement
}

const props = withDefaults(defineProps<SketchSelectoProps>(), {
  selectByClick: true,
  selectFromInside: false,
  hitRate: 0,
  toggleContinueSelect: () => [],
  ratio: 0
})

const emit = defineEmits<{
  'drag-start': [e: SelectoDragStartEvent]
  'select-start': [e: SelectoSelectStartEvent]
  select: [e: SelectoSelectEvent]
  'select-end': [e: SelectoSelectEndEvent]
}>()

const elRef = ref<HTMLElement | null>(null)
let engine: SelectoEngine | null = null

function createEngine(): void {
  if (engine) {
    engine.destroy()
  }
  engine = new SelectoEngine({
    dragContainer: props.dragContainer,
    selectableTargets: props.selectableTargets,
    selectByClick: props.selectByClick,
    selectFromInside: props.selectFromInside,
    toggleContinueSelect: props.toggleContinueSelect,
    hitRate: props.hitRate,
    keyContainer: props.keyContainer
  })
  engine.on('dragStart', (e) => emit('drag-start', e))
  engine.on('selectStart', (e) => emit('select-start', e))
  engine.on('select', (e) => emit('select', e))
  engine.on('selectEnd', (e) => emit('select-end', e))
}

onMounted(() => {
  createEngine()
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})

watch(
  () => [
    props.dragContainer,
    props.selectableTargets,
    props.selectByClick,
    props.selectFromInside,
    props.toggleContinueSelect,
    props.hitRate,
    props.keyContainer
  ],
  (newVal, oldVal) => {
    const hasChanged = newVal.some((v, i) => {
      const ov = oldVal[i]
      if (Array.isArray(v) && Array.isArray(ov)) {
        return v.length !== ov.length || v.some((item, idx) => item !== ov[idx])
      }
      return v !== ov
    })
    if (hasChanged) {
      createEngine()
    }
  },
  { deep: true }
)

function clickTarget(inputEvent: MouseEvent, target: Element): void {
  engine?.clickTarget(inputEvent, target)
}

function getSelectedTargets(): Element[] {
  return engine?.getSelectedTargets() ?? []
}

function setSelectedTargets(targets: Element[]): void {
  engine?.setSelectedTargets(targets)
}

defineExpose({
  clickTarget,
  getSelectedTargets,
  setSelectedTargets
})
</script>
