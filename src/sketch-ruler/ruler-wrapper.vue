<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :vertical="vertical"
      :style="{ cursor: vertical ? 'ew-resize' : 'ns-resize' }"
      :scale="scale"
      :width="width"
      :height="height"
      :start="start"
      :endNumX="endNumX"
      :endNumY="endNumY"
      :select-start="selectStart"
      :select-length="selectLength"
      :palette="palette"
      v-model:showIndicator="showIndicator"
    />
    <div v-show="isShowReferLine" class="lines">
      <RulerLine
        v-for="(v, i) in cpuLines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        :scale="scale"
        :start="start"
        :thick="thick"
        :palette="palette"
        :vertical="vertical"
        :is-show-refer-line="isShowReferLine"
        @on-remove="handleLineRemove"
        @on-release="handleLineRelease"
      />
    </div>
    <!-- v-show="showIndicator" -->
    <div
      class="indicator"
      @mousedown="mousedown"
      :style="[indicatorStyle, { cursor: vertical ? 'ew-resize' : 'ns-resize' }]"
    >
      <!-- <div class="value">{{ valueNum }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/index.vue'
import { ref, computed, onUnmounted } from 'vue'
import { wrapperProps } from './ruler-wrapper-types'

const props = defineProps(wrapperProps)
const emit = defineEmits(['update:lines', 'on-remove-line'])
const showIndicator = ref(false)
const valueNum = ref(props.thick / 2)
const isdragle = ref(false)
const rwClassName = computed(() => {
  const className = props.vertical ? 'v-container' : 'h-container'
  return className
})

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
  return {
    [positionKey]: valueNum.value + 'px',
    [gepKey]: -props.thick + 'px',
    cursor: props.vertical ? 'ew-resize' : 'ns-resize',
    [boderKey]: `1px solid ${props.palette?.lineColor}`
  }
})

/**
 * @description: 指示器按下时
 * @param {*} e
 */
const mousedown = (e: MouseEvent) => {
  isdragle.value = true
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}

/**
 * @description: 移动时,计算新增线条的位置
 * @param {*} e
 */
const mousemove = (e: MouseEvent) => {
  if (isdragle.value) {
    const { left, top } = props.parentRect
    const offset = props.vertical ? e.clientX : e.clientY
    const gap = props.vertical ? left : top
    valueNum.value = (offset - gap) / props.scale!
    console.log(offset, 'offsetoffset')
    console.log(valueNum.value, 'valueNum.value')
  }
}
const mouseup = (e: MouseEvent) => {
  const linePosition = valueNum.value
  valueNum.value = props.thick / 2
  isdragle.value = false
  handleLineRelease(linePosition)
}

const handleLineRelease = (value: number, index?: number) => {
  // 左右或上下超出时, 删除该条对齐线
  const offset = value - props.start
  const maxOffset = (props.vertical ? props.height : props.width) / props.scale!
  if (offset < 0 || offset > maxOffset) {
    if (index) {
      handleLineRemove(index)
    }
  } else {
    const num = props.startOther - props.thick + value
    props.vertical ? props.lines.v.push(num) : props.lines.h.push(num)
  }
}
const handleLineRemove = (index: any) => {
  props.lines.splice(index, 1)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', mousemove)
})
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
}
.h-container,
.v-container {
  position: absolute;
  .lines {
    pointer-events: none;
  }
  &:hover .lines {
    pointer-events: auto;
  }
  .indicator {
    z-index: 4; // 比尺子高
    position: absolute;
  }
}
.h-container {
  top: 0;
  .line {
    top: 0;
    height: 100vh;
    &:before,
    &:after {
      content: '';
      display: inline-block;
      width: 4px;
      height: 100vh;
      position: absolute;
    }
    &::before {
      left: -4px;
      top: 0px;
    }
    &::after {
      right: -4px;
      top: 0px;
    }
  }
  .indicator {
    width: 100vw;
    &:before,
    &:after {
      content: '';
      left: 0;
      display: inline-block;
      height: 5px;
      width: 100vw;
      position: absolute;
    }
    &::before {
      top: -5px;
    }

    &::after {
      bottom: -5px;
    }
    .value {
      width: auto;
      padding: 0 2px;
      margin-top: 4px;
      margin-left: 4px;
    }
  }
}

.v-container {
  left: 0;
  .line {
    left: 0;
    width: 100vw;
    &:before,
    &:after {
      content: '';
      display: inline-block;
      height: 4px;
      width: 100vw;
      position: absolute;
    }
    &::before {
      top: -5px;
      left: 0;
    }

    &::after {
      bottom: -5px;
      left: 0;
    }
  }
  .indicator {
    height: 100vw;
    &:before,
    &:after {
      content: '';
      display: inline-block;
      width: 4px;
      height: 100vh;
      position: absolute;
    }
    &::before {
      left: -4px;
    }
    &::after {
      right: -4px;
    }
    .value {
      left: 0;
      width: auto;
      padding: 0 2px;
      margin-top: -5px;
      margin-left: 2px;
      transform: rotate(-90deg);
      transform-origin: 0 0;
    }
  }
}
</style>
