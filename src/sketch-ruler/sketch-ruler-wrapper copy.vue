<template>
  <div ref="ruler" class="style-ruler">
    <!-- :shadow="shadow" -->
    <!-- 水平方向 -->
    <SketchRule
      :ratio="ratio"
      :thick="thick"
      :scale="scale"
      :width="width"
      :height="height"
      :start-x="startX"
      :start-y="startY"
      :corner-active="true"
      :lines="lines"
      :isShow-refer-line="isShowReferLine"
      :palette="palette"
    ></SketchRule>
    <div
      ref="screensRef"
      class="screens"
      @mousewheel="handleWheel"
      @click="$emit('ClickOutside2ClearAll', $event)"
    >
      <div ref="containerRef" class="screen-container">
        <slot :style="canvasStyle"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import InnerBox from './inner-box.vue'
// import SketchRule from './index.vue'
import { computed, defineComponent, onMounted, ref, nextTick } from 'vue'
import { SketchRulerWrapperProps, sketchRulerWrapperProps } from './index-types'
import getPalette from './mixin'
export default defineComponent({
  name: 'SketchRulerWrapper',
  components: {
    // SketchRule
    // InnerBox
  },
  props: sketchRulerWrapperProps,
  emits: ['onCornerClick', 'handleLine', 'ClickOutside2ClearAll'],
  setup(props: SketchRulerWrapperProps, { slots, emit }) {
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    let scale = ref(1)
    const isImgOpen = ref(true) //眼镜打开
    // 这里处理默认值,因为直接写在props的default里面时,可能某些属性用户未必会传,那么这里要做属性合并,防止属性丢失
    const paletteCpu = computed(() => getPalette(props.palette))
    const ruler = ref<HTMLElement | null>(null)
    let width = ref(0)
    let height = ref(0)
    onMounted(() => {
      if (ruler.value) {
        const refruler = ruler.value.getBoundingClientRect()
        width.value = refruler.width - 21
        height.value = refruler.height - 21
      }
      // 初始化尺子阴影和线条
      setStart()
    })
    const cornerStyle = computed(() => {
      return {
        backgroundColor: paletteCpu.value.bgColor,
        width: props.thick + 'px',
        height: props.thick + 'px',
        borderRight: `1px solid ${paletteCpu.value.borderColor}`,
        borderBottom: `1px solid ${paletteCpu.value.borderColor}`
      }
    })
    /**
     * @desc    : 画布大小,一定要是computer里面,否则缩放页面会失效
     * @author  : mj
     * @date  : 2020/12/13
     * @update   by
     */
    const canvasStyle = computed(() => {
      const css = {
        left: '60px',
        top: '60px',
        paddingRight: '20px',
        paddingBottom: '30px',
        // zIndex: 10,
        transformOrigin: '50% 0',
        transform: `scale(${scale.value})`
      }
      return css
    })
    let startX = ref(0)
    let startY = ref(0)
    // 图片点击事件
    const imgClick = () => {
      props.isShowReferLine = !props.isShowReferLine
    }

    const screensRef = ref<HTMLElement | null>(null)
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
          console.log(startX.value, startY.value)
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
    /**
     * @description:左上角点击事件
     * @param {*}
     * @return {*}
     */
    const onCornerClick = (e: MouseEvent) => {
      emit('onCornerClick', e)
    }
    return {
      setStart,
      handleWheel,
      screensRef,
      startY,
      startX,
      imgClick,
      canvasStyle,
      isImgOpen,
      scale,
      width,
      height,
      ruler,
      paletteCpu,
      cornerStyle,
      onCornerClick
    }
  }
})
</script>

<style lang="scss" scoped>
// .ruler {
//   position: absolute;
//   z-index: 3; /* 需要比resizer高 */
// }
// .style-ruler {
//   position: absolute;
//   width: 100%; /* scrollbar width */
//   height: 100%;
//   overflow: hidden;
//   font-size: 12px;

//   span {
//     line-height: 1;
//   }
// }
.screens {
  // position: relative;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}
// .corner {
//   position: absolute;
//   top: 0;
//   left: 0;

//   pointer-events: auto;
//   cursor: pointer;
//   box-sizing: content-box;
//   transition: all 0.2s ease-in-out;
// }

// .indicator {
//   position: absolute;
//   pointer-events: none;
//   .value {
//     position: absolute;
//     background: white;
//   }
// }
// .canvas-content {
//   position: absolute;
//   justify-content: center;
//   // top: 80px;
//   // left: 200px;
//   // width: 200px;
//   // height: 200px;
//   // margin-left: 380px;
//   background: lightblue;
//   transform-origin: 50% 0;
// }
.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}
// .ruler {
//   width: 100%;
//   height: 100%;
//   pointer-events: auto;
// }
</style>
