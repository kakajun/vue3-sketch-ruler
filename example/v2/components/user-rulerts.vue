<template>
  <div>
    <div class="top">缩放比例:{{ state.scale }}</div>
    <button class="right" @click="showLineClick">辅助线开关</button>
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
          <div id="canvas" :style="canvasStyle" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick
} from 'vue-demi'

// import SketchRule from '../../../lib/v2/index.es.js'
// import SketchRule from '../../../src/index' // 这里可以换成打包后的
import SketchRule from '../index.es.js'
// import SketchRule from './index.es.js'
import '../../../lib/v2/style.css'
const rectWidth = 600
const rectHeight = 320
export default defineComponent({
  components: { SketchRule },
  setup() {
    const screensRef = ref(null)
    const containerRef = ref(null)
    const state = reactive({
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
    onMounted(() => {
      // 滚动居中
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - 400
    })

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
    const showLineClick = () => {
      state.isShowReferLine = !state.isShowReferLine
      console.log(state.isShowReferLine, 'state.isShowReferLine')
    }
    return {
      screensRef,
      containerRef,
      state,
      shadow,
      canvasStyle,
      handleWheel,
      handleScroll,
      showLineClick
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
.right {
  top: 200px;
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

#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  width: 600px;
  height: 320px;
  background: url('../assets/bg.jfif') no-repeat;
  background-size: 100% 100%;
  transform-origin: 50% 0;
}
</style>
