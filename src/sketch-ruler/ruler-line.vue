<template>
  <!-- 线的显示 -->
  <div
    v-show="showLine"
    class="line"
    :style="[offset, borderCursor]"
    @mousedown="handleDown"
  >
    <div class="action" :style="actionStyle">
      <span class="del" @click="handleRemove">&times;</span>
      <span class="value">{{ startValue }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, defineComponent, inject } from 'vue'

import { SketchRulerProps } from 'src/index-types'
export default defineComponent({
  name: 'LineRuler',
  props: {
    index: Number,
    start: Number,
    vertical: Boolean,
    value: Number
  },
  emits: ['onMouseDown', 'onRelease', 'onRemove'],
  setup(props, { emit }) {
    const injectObj = inject('sketch') as SketchRulerProps
    const { isShowReferLine, palette, thick } = injectObj
    const startValue = ref(0)
    const showLine = ref(true)
    onMounted(() => {
      startValue.value = props.value!
    })
    const setShowLine = (offset: number) => {
      showLine.value = offset >= 0
    }
    const offset = computed(() => {
      const offset = (startValue.value - props.start!) * injectObj.scale
      setShowLine(offset)
      const positionValue = offset + 'px'
      const position = props.vertical
        ? { top: positionValue }
        : { left: positionValue }
      return position
    })
    const borderCursor = computed(() => {
      console.log(palette?.lineColor, 'palette.lineColor')
      const borderValue = `1px solid ${palette?.lineColor}`
      const border = props.vertical
        ? { borderTop: borderValue }
        : { borderLeft: borderValue }
      const cursorValue = isShowReferLine
        ? props.vertical
          ? 'ns-resize'
          : 'ew-resize'
        : 'none'
      return {
        cursor: cursorValue,
        ...border
      }
    })
    const actionStyle = computed(() => {
      const actionStyle = props.vertical
        ? { left: thick + 'px' }
        : { top: thick + 'px' }
      return actionStyle
    })

    const handleDown = (e: MouseEvent) => {
      const startD = props.vertical ? e.clientY : e.clientX
      const initValue = startValue.value

      emit('onMouseDown')
      const onMove = (e: MouseEvent) => {
        const currentD = props.vertical ? e.clientY : e.clientX
        const newValue = Math.round(
          initValue + (currentD - startD) / injectObj.scale
        )
        startValue.value = newValue
      }
      const onEnd = () => {
        emit('onRelease', startValue.value, props.index)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onEnd)
    }
    const handleRemove = () => {
      emit('onRemove', props.index)
    }
    return {
      startValue,
      showLine,
      offset,
      borderCursor,
      actionStyle,
      handleDown,
      handleRemove
    }
  }
})
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
  .action {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    pointer-events: none;
    transform: scale(0.83);
  }
  .del {
    padding: 3px 5px;
    cursor: pointer;
    visibility: hidden;
  }
  &:hover .del {
    visibility: visible;
  }
}
</style>
