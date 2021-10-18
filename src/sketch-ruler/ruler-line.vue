<template>
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
import { ref, computed, onMounted, defineComponent } from 'vue'
import { lineProps, LineProps } from './ruler-line-types'
export default defineComponent({
  name: 'LineRuler',
  props: lineProps,
  emits: ['onMouseDown', 'onRelease', 'onRemove'],
  setup(props: LineProps, { emit }) {
    const startValue = ref(0)
    const showLine = ref(true)
    onMounted(() => {
      startValue.value = props.value!
    })
    const setShowLine = (offset: number) => {
      showLine.value = offset >= 0
    }
    const offset = computed(() => {
      const offset = (startValue.value - props.start!) * props.scale!
      setShowLine(offset)
      const positionValue = offset + 'px'
      const position = props.vertical
        ? { top: positionValue }
        : { left: positionValue }
      return position
    })
    const borderCursor = computed(() => {
      const borderValue = `1px solid ${props.palette?.lineColor}`
      const border = props.vertical
        ? { borderTop: borderValue }
        : { borderLeft: borderValue }

      const cursorValue = props.isShowReferLine
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
        ? { left: props.thick + 'px' }
        : { top: props.thick + 'px' }
      return actionStyle
    })

    const handleDown = (e: MouseEvent) => {
      const startD = props.vertical ? e.clientY : e.clientX
      const initValue = startValue.value

      emit('onMouseDown')
      const onMove = (e: MouseEvent) => {
        const currentD = props.vertical ? e.clientY : e.clientX
        const newValue = Math.round(
          initValue + (currentD - startD) / props.scale!
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
.h-container {
  .line {
    top: 0;
    height: 100vh;
    padding-left: 5px;
    .action {
      transform: translateX(-24px);
      .value {
        margin-left: 4px;
      }
    }
  }
}

.v-container {
  .line {
    left: 0;
    width: 100vw;
    padding-top: 5px;
    .action {
      transform: translateY(-24px);
      flex-direction: column;
      .value {
        margin-top: 4px;
      }
    }
  }
}
</style>
