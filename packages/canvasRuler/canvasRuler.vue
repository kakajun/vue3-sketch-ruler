<template>
  <canvas
    ref="canvas"
    class="ruler"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  />
</template>
<script lang="ts">
import { drawHorizontalRuler, drawVerticalRuler } from './utils'
import { reactive, ref, onMounted, watch, defineComponent } from 'vue'
import { props } from '../props'

export default defineComponent({
  name: 'CanvasRuler',
  props: {
    ...props,
    vertical: Boolean,
    start: {
      type: Number,
      default: 0
    },

    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    selectStart: {
      type: Number,
      default: 0
    },
    selectLength: {
      type: Number,
      default: 0
    }
  },
  emits: ['onAddLine', 'onIndicatorShow', 'onIndicatorMove', 'onIndicatorHide'],
  setup(props, { emit }) {
    const { width } = props
    const state = reactive({
      canvasContext: null as CanvasRenderingContext2D | null
    })
    const canvas = ref<HTMLCanvasElement | null>(null)
    onMounted(() => {
      initCanvasRef()
      updateCanvasContext()
      drawRuler()
    })
    const initCanvasRef = () => {
      state.canvasContext = canvas.value && canvas.value.getContext('2d')
    }
    const updateCanvasContext = () => {
      if (canvas.value) {
        const ratio = props.ratio
        // 比例宽高
        canvas.value.width = props.width * ratio
        canvas.value.height = props.height * ratio
        const ctx = state.canvasContext
        if (ctx) {
          ctx.font = `${12 * ratio}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
          ctx.lineWidth = 1
          ctx.textBaseline = 'middle'
        }
      }
    }
    const drawRuler = () => {
      const options = {
        scale: props.scale,
        width: props.width,
        height: props.height,
        palette: props.palette
      }

      if (props.vertical && state.canvasContext) {
        drawVerticalRuler(
          state.canvasContext,
          props.start,
          { y: props.selectStart, height: props.selectLength },
          options
        )
      } else if (state.canvasContext) {
        drawHorizontalRuler(
          state.canvasContext,
          props.start,
          { x: props.selectStart, width: props.selectLength },
          options
        )
      }
    }
    watch(
      () => props.start,
      () => drawRuler()
    )
    watch([() => props.width, () => props.height], () => {
      updateCanvasContext()
      drawRuler()
    })
    const getValueByOffset = (offset: number, start: number, scale: number) =>
      Math.round(start + offset / scale)
    const handleClick = (e: MouseEvent) => {
      const offset = props.vertical ? e.offsetY : e.offsetX
      const value = getValueByOffset(offset, props.start, props.scale)
      emit('onAddLine', value)
    }
    const handleEnter = (e: MouseEvent) => {
      const offset = props.vertical ? e.offsetY : e.offsetX
      const value = getValueByOffset(offset, props.start, props.scale)
      emit('onIndicatorShow', value)
    }
    const handleMove = (e: MouseEvent) => {
      const offset = props.vertical ? e.offsetY : e.offsetX
      const value = getValueByOffset(offset, props.start, props.scale)
      emit('onIndicatorMove', value)
    }
    const handleLeave = () => {
      emit('onIndicatorHide')
    }
    return {
      state,
      canvas,
      initCanvasRef,
      handleClick,
      handleEnter,
      handleMove,
      handleLeave
    }
  }
})
</script>
