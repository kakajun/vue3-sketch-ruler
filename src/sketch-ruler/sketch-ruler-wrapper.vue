<template>
  <div class="rule-wrapper" ref="ruler">
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
      <div
        ref="containerRef"
        class="screen-container canvas-wrapper"
        :style="canvasStyle"
      >
        <div class="">
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
  emits: ['handleLine', 'getscele', 'ClickOutside2ClearAll'],
  setup(props: SketchRulerWrapperProps, { slots, attrs }) {
    let scale = ref(1)
    const paletteCpu = computed(() => getPalette(props.palette))
    const ruler = ref<HTMLElement | null>(null)
    let width = ref(0) // 尺规外部容器宽
    let height = ref(0)
    const screensRef = ref<HTMLElement | null>(null)
    const containerRef = ref<HTMLElement | null>(null)
    onMounted(() => {
      console.log(attrs, 'attrsattrs')
      if (ruler.value) {
        const refruler = ruler.value.getBoundingClientRect()
        width.value = refruler.width - 21
        height.value = refruler.height - 21
        console.log(width.value, height.value, ' width.value')
      }
      getInitAttributes()
      // 初始化尺子阴影和线条
      getCavasAttributes()
      // 滚动居中
      console.log(canvasWidth.value, 'canvasWidth.value')
      if (canvasWidth.value && screensRef.value) {
        let leftNum =
          containerRef.value &&
          containerRef.value.getBoundingClientRect().width - canvasWidth.value
        screensRef.value.scrollLeft = leftNum! / 2
      }
    })

    let startX = ref(0)
    let startY = ref(0)
    let canvasWidth = ref(0)
    let canvasHeight = ref(0)
    const setStart = () => {
      nextTick(() => {
        // 一定要用nextTick,否则缩放图形会飘
        getCavasAttributes()
      })
    }

    let initWidth: number = 0
    let initHeght: number = 0
    /**
     * @description: 获取初始画布大小值,因为需要给slot也注入样式,所以先要知道最开始是多大的
     * @param {*}
     * @return {*}
     */
    const getInitAttributes = () => {
      if (screensRef.value && slots.default && slots.default()[0].el) {
        const canvas = slots.default()[0].el as HTMLElement // 获取slot的dom
        console.log(canvas.style, 'canvas')
        const canvasR = canvas.getBoundingClientRect() // 获取slot的宽高值
        initWidth = canvasR.width
        initHeght = canvasR.height
      }
    }

    const getCavasAttributes = () => {
      if (screensRef.value && slots.default && slots.default()[0].el) {
        const canvas = slots.default()[0].el as HTMLElement // 获取slot的dom
        console.log(canvas.style, 'canvas')
        canvas.style.transform = `scale(${scale.value})`
        canvas.style.left = '0px'
        canvas.style.width = initWidth * scale.value + 'px' // 动态给外层注入宽高
        canvas.style.height = initHeght * scale.value + 'px'
        canvas.style.transformOrigin = '50% 0'
        const canvasR = canvas.getBoundingClientRect() // 获取slot的宽高值
        canvasWidth.value = canvasR.width
        canvasHeight.value = canvasR.height
        const screensRect = screensRef.value.getBoundingClientRect()
        // 标尺开始的刻度
        const startx =
          (screensRect.left + props.thick - canvasR.left) / scale.value
        const starty =
          (screensRect.top + props.thick - canvasR.top) / scale.value
        startX.value = startx >> 0
        startY.value = starty >> 0
      }
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
        // emit('getscele', scale.value)
        console.log(scale.value, 'scale.value')
      }
      setStart()
    }
    const canvasStyle = computed(() => {
      return {
        width: canvasWidth.value + 'px',
        height: canvasHeight.value + 'px',
        transform: `scale(${scale.value})`
      }
    })
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: canvasWidth.value,
        height: canvasHeight.value
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
      ruler,
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
.rule-wrapper {
  width: 100%;
  height: 100%;
}
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

.canvas-wrapper {
  top: 100px;
  background: #000;
  left: 50%;
  position: relative;
  transform-origin: 50% 0;
}
</style>
