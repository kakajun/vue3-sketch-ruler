<template>
  <div class="wrapper">
    <SketchRule
      :thick="thick"
      :scale="scale"
      :start-x="startX"
      :start-y="startY"
      :shadow="shadow"
      :hor-line-arr="lines.h"
      :ver-line-arr="lines.v"
      :corner-active="true"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
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
</template>
<script>
import { SketchRule } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
// import { SketchRule } from '../../src/index' // 这里可以换成打包后的
const rectWidth = 200
const rectHeight = 200
export default {
  components: { SketchRule },
  data() {
    return {
      scale: 2, //658813476562495, //1,
      startX: 0,
      startY: 0,
      wrapperwith: 1200,
      wrapperheight: 600,
      lines: {
        h: [0, 200],
        v: [0, 200]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: true // 显示参考线
    }
  },
  computed: {
    wrapperwithpx() {
      return this.wrapperwith + 'px'
    },
    wrapperheightpx() {
      return this.wrapperheight + 'px'
    },
    shadow() {
      return {
        x: 0,
        y: 0,
        width: rectWidth,
        height: rectHeight
      }
    },
    canvasStyle() {
      return {
        width: rectWidth,
        height: rectHeight,
        transform: `scale(${this.scale})`
      }
    }
  },
  mounted() {
    // console.log(SketchRule, "666666");
    // 滚动居中
    this.$refs.screensRef.scrollLeft =
      this.$refs.containerRef.getBoundingClientRect().width / 2 - 300 // 300 = #screens.width / 2
  },
  methods: {
    handleLine(lines) {
      this.lines = lines
    },
    handleCornerClick() {
      return
    },
    handleScroll() {
      const screensRect = document
        .querySelector('#screens')
        .getBoundingClientRect()
      const canvasRect = document
        .querySelector('#canvas')
        .getBoundingClientRect()

      // 标尺开始的刻度
      const startX =
        (screensRect.left + this.thick - canvasRect.left) / this.scale
      const startY =
        (screensRect.top + this.thick - canvasRect.top) / this.scale

      this.startX = startX
      this.startY = startY
    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        )
        this.scale = nextScale
      }
      this.$nextTick(() => {
        this.handleScroll()
      })
    }
  }
}
</script>
<style lang="scss">
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
  left: 100px;
  // vue3 新写法,可以共享js中的变量,必须要写
  width: v-bind(wrapperwithpx);
  height: v-bind(wrapperheightpx);
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
  width: 200px;
  height: 200px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>
