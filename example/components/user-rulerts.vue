<template>
  <div class="top">缩放比例:{{ state.scale }}</div>
  <div class="wrapper">
    <SketchRule
      :thick="state.thick"
      :scale="state.scale"
      :width="1380"
      :height="780"
      :start-x="state.startX"
      :start-y="state.startY"
      :shadow="shadow"
      :corner-active="true"
      :lines="state.lines"
    >
    </SketchRule>
    <div
      id="screens"
      ref="screensRef"
      @wheel="handleWheel"
      @scroll="handleScroll"
    >
      <div ref="containerRef" class="screen-container">
        <SketchRuleWrapper
          :zoomSize="state.zoomSize"
          :prevSize="state.prevSize"
          class="wrapper"
          :draggleRate="state.draggleRate"
          :preview-img="previewImg"
          :zoom-img="zoomImg"
        >
          <img class="imhhhh" :src="previewImg" />
          <!-- <div id="canvas" :style="canvasStyle" /> -->
        </SketchRuleWrapper>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import RulertsWrapper from '../components/user-ruler-wrapper.vue'
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick
} from 'vue'
import { SketchRule } from '../../src/index' // 这里可以换成打包后的
import previewImg from '../assets/product/onepuls8-pro-zoom.jpg'
import zoomImg from '../assets/bg.jpeg'
const rectWidth = 600
const rectHeight = 320
export default defineComponent({
  components: { SketchRule, RulertsWrapper },
  setup() {
    const screensRef = ref(null)
    const containerRef = ref(null)
    const state = reactive({
      /*预览大小*/
      zoomSize: {
        w: window.innerWidth - 400, // 定义外面容器大小,
        h: window.innerHeight - 300
      },
      draggleRate: 0.3,
      /* 整个视图大小 */
      prevSize: {
        w: window.innerWidth - 400, // 定义外面容器大小,
        h: window.innerHeight - 300
      },
      scale: 2, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [433, 588],
        v: [33, 143]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    })
    const shadow = computed(() => {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight
      }
    })
    const canvasStyle = computed(() => {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${state.scale})`
      }
    })
    // onMounted(() => {
    //   // 滚动居中
    //   screensRef.value.scrollLeft =
    //     containerRef.value.getBoundingClientRect().width / 2 - 400
    // })

    const handleScroll = () => {
      const screensRect = document
        .querySelector('#screens')
        .getBoundingClientRect()
      const canvasRect = document
        .querySelector('#canvas')
        .getBoundingClientRect()

      // 标尺开始的刻度
      const startX =
        (screensRect.left + state.thick - canvasRect.left) / state.scale
      console.log(startX, 'startX')
      const startY =
        (screensRect.top + state.thick - canvasRect.top) / state.scale
      state.startX = startX
      state.startY = startY
    }
    // 控制缩放值
    const handleWheel = (e: {
      ctrlKey: any
      metaKey: any
      preventDefault: () => void
      deltaY: number
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2)
        )
        state.scale = nextScale
      }
      nextTick(() => {
        handleScroll()
      })
    }

    return {
      zoomImg,
      previewImg,
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll
    }
  }
})
</script>
<style lang="scss">
.top {
  position: absolute;
  right: 100px;
  font-size: 20px;
}
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

body * {
  box-sizing: border-box;
  user-select: none;
}

.wrapper {
  position: absolute;
  top: 100px;
  left: 240px;
  /* 特别注意,这个width要和传入组件的width成对应关系,
   也就是 780width +thick20 =800
   否则影子不和容器搭配,这个在2X中会进行自动匹配修正,省得配置麻烦
    */
  width: 1400px;
  height: 800px;
  background-color: #f5f5f5;
  border: 1px solid #dadadc;
}

#screens {
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

.button {
  position: absolute;
  bottom: 100%;
  left: 100px;
}

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 600px;
  height: 320px;
  background: url('../assets/bg.png') no-repeat;
  background-size: 100% 100%;
  transform-origin: 50% 0;
}
</style>
