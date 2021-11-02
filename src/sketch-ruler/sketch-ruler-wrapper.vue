<template>
  <div>
    <SketchRule
      :thick="thick"
      :scale="scale"
      :width="width"
      :start-x="startX"
      :start-y="startY"
      :shadow="shadow"
      :palette="paletteCpu"
      :height="height"
      :corner-active="true"
      :lines="lines"
      @handleLine="$emit('handleLine')"
      @onCornerClick="handleCornerClick"
    >
    </SketchRule>
    <div class="screens" ref="screensRef" @wheel="handleWheel">
      <div ref="containerRef" class="screen-container">
        <div class="canvas" :style="canvasStyle">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { SketchRulerWrapperProps, sketchRulerWrapperProps } from './index-types'
import { computed, defineComponent, ref, onMounted, nextTick } from 'vue'
import SketchRule from './index.vue' // 这里可以换成打包后的
import getPalette from './mixin'
export default defineComponent({
  name: 'SketchRulerWrapper',
  components: { SketchRule },
  props: sketchRulerWrapperProps,
  emits: ['handleLine', 'ClickOutside2ClearAll'],
  setup(props: SketchRulerWrapperProps, { slots }) {
    let scale = ref(1)
    const paletteCpu = computed(() => getPalette(props.palette))
    const ruler = ref<HTMLElement | null>(null)
    let width = ref(0)
    let height = ref(0)
    const screensRef = ref<HTMLElement | null>(null)
    const containerRef = ref<HTMLElement | null>(null)
    onMounted(() => {
      if (ruler.value) {
        const refruler = ruler.value.getBoundingClientRect()
        width.value = refruler.width - 21
        height.value = refruler.height - 21
      }
      // 滚动居中
      if (screensRef.value && containerRef.value) {
        screensRef.value.scrollLeft =
          containerRef.value &&
          containerRef.value.getBoundingClientRect().width / 2 - 400
      }

      // 初始化尺子阴影和线条
      setStart()
    })

    let startX = ref(0)
    let startY = ref(0)
    const setStart = () => {
      nextTick(() => {
        if (screensRef.value && slots.default && slots.default()[0].el) {
          const canvas = slots.default()[0].el as HTMLElement // 获取slot的dom
          const canvasR = canvas.getBoundingClientRect() // 获取slot的宽高值
          const screensRect = screensRef.value.getBoundingClientRect()
          // 标尺开始的刻度
          const startx =
            (screensRect.left + props.thick - canvasR.left) / scale.value
          const starty =
            (screensRect.top + props.thick - canvasR.top) / scale.value
          startX.value = startx >> 0
          startY.value = starty >> 0
          // console.log(startX.value, startY.value)
        }
      })
    }

    // 控制缩放值
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, scale.value - e.deltaY / 1000).toFixed(2)
        )
        // if (nextScale > 1.5) scale.value = 1.5
        // else if (nextScale < 0.5) scale.value = 0.5
        scale.value = nextScale
      }
      setStart()
    }

    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: width.value,
        height: height.value
      }
    })
    const canvasStyle = computed(() => {
      return {
        width: width.value,
        height: height.value,
        transform: `scale(${scale.value})`
      }
    })
    const handleCornerClick = () => {
      return
    }
    return {
      screensRef,
      containerRef,
      scale,
      startX,
      width,
      height,
      startY,
      paletteCpu,
      shadow,
      canvasStyle,
      handleWheel,
      handleCornerClick
    }
  }
})
</script>
<style lang="scss">
.screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.scale-value {
  position: absolute;
  bottom: 100%;
  left: 0;
}

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

.canvas {
  position: relative;
  top: 80px;
  left: 50%;
  width: 600px;
  height: 320px;
  transform-origin: 50% 0;
}
</style>
