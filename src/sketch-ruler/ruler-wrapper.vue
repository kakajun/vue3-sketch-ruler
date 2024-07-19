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
      @handleDragStart="mousedown"
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
        @on-release="handleLineRelease"
      />
    </div>

    <div
      class="indicator"
      v-show="isdragle"
      :style="[indicatorStyle, { cursor: vertical ? 'ew-resize' : 'ns-resize' }]"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/index.vue'
import { ref, computed } from 'vue'
import { wrapperProps } from './ruler-wrapper-types'

const props = defineProps(wrapperProps)
const emit = defineEmits(['update:lines', 'on-remove-line'])

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
const mousedown = () => {
  isdragle.value = true
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup, { once: true })
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
    valueNum.value = offset - gap
    console.log(offset, 'offsetoffset')
    console.log(valueNum.value, 'valueNum.value')
  }
}
const mouseup = () => {
  const linePosition = valueNum.value
  valueNum.value = props.thick / 2
  isdragle.value = false
  document.removeEventListener('mousemove', mousemove)
  handleLineRelease(linePosition)
}

/**
 * @description:
 * @param {*} value  距离边框的位置
 * @param {*} index  选的哪条线
 */
const handleLineRelease = (value: number, index?: number) => {
  // 左右或上下超出时, 删除该条对齐线
  console.log(value, 'gap')
  console.log(index, 'indexindex')
  const num = (props.startOther - props.thick + value) / props.scale
  const maxOffset = props.vertical ? props.endNumX : props.endNumY
  if (num < 0 || num > maxOffset) {
    // 新增如果超出范围那么什么也不做
    if (index) {
      handleLineRemove(index)
    }
  }
  if (isNaN(index)) {
    props.vertical ? props.lines.v.push(num) : props.lines.h.push(num)
  }
}
const handleLineRemove = (index: any) => {
  cpuLines.value.splice(index, 1)
  console.log(cpuLines.value, 'arrs')
}
</script>

<style lang="scss">
@import './_mixins';

// .value {
//   transform: scale(0.83);
//   padding: 5px;
//   border-radius: 5px;
//   font-size: 12px;
//   white-space: nowrap;
// }

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
