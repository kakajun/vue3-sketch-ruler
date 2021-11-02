<template>
  <canvas
    ref="canvas"
    class="ruler"
    @click="handle($event, 'click')"
    @mouseenter="handle($event, 'enter')"
    @mousemove="handle($event, 'move')"
    @mouseleave="$emit('update:showIndicator', false)"
  />
</template>
<script lang="ts">
import { drawCavaseRuler } from './utils'
import { reactive, ref, onMounted, watch, defineComponent } from 'vue'
import { canvasProps, CanvasProps } from './canvas-types'
export default defineComponent({
  name: 'CanvasRuler',
  props: canvasProps,
  emits: ['onAddLine', 'update:showIndicator', 'update:valueNum'],
  setup(props: CanvasProps, { emit }) {
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
        canvas.value.width = props.width! * ratio!
        canvas.value.height = props.height! * ratio!
        const ctx = state.canvasContext
        if (ctx) {
          ctx.font = `${12 * ratio!}px -apple-system,
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
        scale: props.scale!,
        width: props.width!,
        height: props.height!,
        palette: props.palette!
      }

      if (state.canvasContext) {
        drawCavaseRuler(
          state.canvasContext,
          props.start!,
          props.selectStart!,
          props.selectLength!,
          options,
          !props.vertical
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
    const handle = (e: MouseEvent, key: string) => {
      const getValueByOffset = (offset: number, start: number, scale: number) =>
        Math.round(start + offset / scale)
      const offset = props.vertical ? e.offsetY : e.offsetX
      const value = getValueByOffset(offset, props.start!, props.scale!)
      switch (key) {
        case 'click':
          emit('onAddLine', value)
          break
        case 'enter':
          emit('update:valueNum', value)
          emit('update:showIndicator', true)
          break
        default:
          emit('update:valueNum', value)
          break
      }
    }
    return {
      handle,
      canvas
    }
  }
})
</script>
