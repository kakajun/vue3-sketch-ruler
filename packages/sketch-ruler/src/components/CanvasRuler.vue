<template>
  <canvas
    ref="canvasRef"
    class="ruler"
    :style="canvasStyle"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { ScaleMark } from '../composables/useRulerScale'
import type { RulerPalette } from '../state/ruler-context'
import { Canvas2DRenderer } from '../renderers/canvas-2d-renderer'

interface Props {
  marks: ScaleMark[]
  palette: RulerPalette
  vertical: boolean
  thick: number
  width: number
  height: number
  ratio?: number
}

const props = withDefaults(defineProps<Props>(), {
  ratio: () => (typeof window !== 'undefined' ? window.devicePixelRatio : 1)
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const renderer = new Canvas2DRenderer()

const canvasStyle = computed(() => ({
  width: props.width + 'px',
  height: props.height + 'px'
}))

function draw(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = props.ratio
  canvas.width = Math.round(props.width * dpr)
  canvas.height = Math.round(props.height * dpr)

  renderer.render(
    ctx,
    [
      {
        type: 'ruler',
        marks: props.marks,
        vertical: props.vertical,
        thick: props.thick,
        width: props.width,
        height: props.height,
        ratio: dpr,
        palette: props.palette
      }
    ],
    {
      x: 0,
      y: 0,
      width: props.width,
      height: props.height
    }
  )
}

onMounted(() => {
  draw()
})

watch(
  () => [props.marks, props.palette, props.vertical, props.thick, props.width, props.height, props.ratio],
  () => {
    draw()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.ruler {
  display: block;
}
</style>
