<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :style="{ cursor: vertical ? 'ew-resize' : 'ns-resize' }"
      :scale="scale"
      :width="width"
      :height="height"
      :start="start"
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
      :select-start="selectStart"
      :select-length="selectLength"
      :palette="palette"
      :rate="rate"
      :gridRatio="gridRatio"
      @handle-drag-start="mousedown"
    />
    <div v-show="isShowReferLine" class="lines">
      <RulerLine
        v-for="(v, i) in cpuLines"
        :key="v + i"
        :lockLine="isLockLine"
        :index="i"
        :value="v >> 0"
        :scale="scale"
        :start="start"
        :canvasWidth="canvasWidth"
        :snapThreshold="snapThreshold"
        :snapsObj="snapsObj"
        :canvasHeight="canvasHeight"
        :lines="lines"
        :thick="thick"
        :palette="palette"
        :vertical="vertical"
        :is-show-refer-line="isShowReferLine"
        :rate="rate"
      />
    </div>

    <div
      class="indicator"
      @mouseenter="showLabel = true"
      @mousemove="handleMouseMove"
      @mouseleave="showLabel = false"
      v-show="isdragle"
      :style="[indicatorStyle, { cursor: vertical ? 'ew-resize' : 'ns-resize' }]"
    >
      <div class="action" :style="actionStyle">
        <span v-if="showLabel" class="value">{{ labelContent }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/index.vue'
import { ref, computed, watch } from 'vue'
import useLine from './useLine' // 引入自定义hook

const props = defineProps<{
  scale: number
  thick: number
  canvasWidth: number
  canvasHeight: number
  palette: object
  vertical: boolean
  width: number
  height: number
  start: number
  startOther: number
  lines: object
  selectStart: number
  selectLength: number
  isShowReferLine: boolean
  parentRect: object | null
  rate: number
  snapThreshold: number
  snapsObj: object
  gridRatio: number
  lockLine: boolean
}>()

const { actionStyle, handleMouseMove, handleMouseDown, labelContent, startValue } = useLine(
  props,
  !props.vertical
)
const isLockLine = ref(false)
const isdragle = ref(false)
const showLabel = ref(false)
const rwClassName = computed(() => {
  const className = props.vertical ? 'v-container' : 'h-container'
  return className
})
const emit = defineEmits(['changeLineState'])

const cpuLines = computed(() => {
  return props.vertical ? props.lines.h : props.lines.v
})
const rwStyle = computed(() => {
  const hContainer = {
    width: `calc(100% - ${props.thick}px)`,
    height: `${props.thick! + 1}px`,
    left: `${props.thick}` + 'px'
  }
  const vContainer = {
    width: `${props.thick && props.thick + 1}px`,
    height: `calc(100% - ${props.thick}px)`,
    top: `${props.thick}` + 'px'
  }
  return props.vertical ? vContainer : hContainer
})

const indicatorStyle = computed(() => {
  let positionKey = props.vertical ? 'left' : 'top'
  let gepKey = props.vertical ? 'top' : 'left'
  let boderKey = props.vertical ? 'borderLeft' : 'borderBottom'
  const offsetPx = (startValue.value - props.startOther) * props.scale + props.thick
  return {
    [positionKey]: offsetPx + 'px',
    [gepKey]: -props.thick + 'px',
    cursor: props.vertical ? 'ew-resize' : 'ns-resize',
    [boderKey]: `1px solid ${props.palette?.lineColor}`
  }
})

/**
 * @description: 指示器按下时
 * @param {*} e
 */
const mousedown = async (e: MouseEvent) => {
  isdragle.value = true
  isLockLine.value = false
  emit('changeLineState', false)
  // 初始化线条就在尺中间
  startValue.value = Math.round(props.startOther - props.thick / 2)
  await handleMouseDown(e)
  // 完了要重置一下
  isdragle.value = false
}

watch([() => props.lockLine], () => {
  isLockLine.value = props.lockLine
})
</script>

<style lang="scss">
@import './mixins';

.h-container,
.v-container {
  position: absolute;
  // .lines {
  //   pointer-events: none;
  // }
  // &:hover .lines {
  //   pointer-events: auto;
  // }
  .indicator {
    z-index: 4; // 比尺子高
    position: absolute;
  }

  .line {
    // pointer-events: auto;
    position: absolute;
  }

  .action {
    position: absolute;
  }

  .value {
    transform: scale(0.83);
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
  }
}
.h-container {
  top: 0;
  .line {
    @include vertical-border(100vh, 4px, -4px);
  }
  .indicator {
    @include extendable-border(4px, 100vw, -5px);
  }
}

.v-container {
  left: 0;
  .line {
    @include extendable-border(4px, 100vw, -5px);
  }
  .indicator {
    @include vertical-border(100vh, 4px, -4px);
  }
}
</style>
