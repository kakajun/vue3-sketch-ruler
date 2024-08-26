<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">鼠标中键移动画布 </div>
      <div class="scale mr10"> 缩放比:{{ cpuScale }} </div>
    </div>

    <div
      class="wrapper"
      :class="[state.isBlack ? 'balckwrapper' : 'whitewrapper']"
      :style="rectStyle"
    >
      <SketchRule
        ref="sketchruleRef"
        v-model:scale="state.scale"
        v-model:lockLine="lockLine"
        v-bind="post"
        :selfHandle="true"
      >
        <template #default>
          <div class="container" :style="canvasStyle">
            <movebleCom
              :scale="state.scale"
              v-model:shadow="post.shadow"
              v-model:snapsObj="post.snapsObj"
            />
          </div>
        </template>
        <template #btn="{ reset, zoomIn, zoomOut }">
          <div class="btns">
            <button @click.stop="reset">还原</button>
            <button @click.stop="zoomIn">放大</button>
            <button @click.stop="zoomOut">缩小</button>
          </div>
        </template>
      </SketchRule>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import SketchRule from '../../src/index' // 这里可以换成打包后的
import type { PanzoomEvent } from 'simple-panzoom'
import movebleCom from './edit/moveble.vue'

const sketchruleRef = ref()

// 更多配置,参见 https://github.com/timmywil/panzoom
const panzoomOption = reactive({
  maxScale: 3,
  minScale: 0.3,
  disablePan: false,
  disableZoom: false,
  contain: 'none', // 'inside' | 'outside' | 'none'
  handleStartEvent: (event: PanzoomEvent['panzoomstart']) => {
    event.preventDefault()
    console.log('handleStartEvent', event)
  }
})
const lockLine = ref(false)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  const panzoomInstance = sketchruleRef.value.panzoomInstance
  const parentDom = document.getElementsByClassName('canvasedit-parent')
  if (parentDom[0]) {
    const parent = parentDom[0]
    parent &&
      parent.addEventListener('wheel', function (e: WheelEvent) {
        if (e.ctrlKey || e.metaKey) {
          panzoomInstance.zoomWithWheel(e)
        }
      })

    // 让按下鼠标中键才能移动画布,千万不能用mousedown, 否则会出现缩放bug, 因为panzoom内部对pointerId有判断,而mousedown里面并没有pointerId
    document.addEventListener('pointerdown', function (e) {
      if (e.button === 1) {
        sketchruleRef.value.cursorClass = 'grabCursor'
        panzoomInstance.bind()
        panzoomInstance.handleDown(e)
        e.preventDefault()
      }
    })

    document.addEventListener('pointerup', function (e) {
      if (e.button === 1) {
        panzoomInstance.destroy()
        console.log('放开了')
        sketchruleRef.value.cursorClass = 'defaultCursor'
      }
    })
  }
})

const handleResize = () => {
  if (sketchruleRef.value) {
    sketchruleRef.value.initPanzoom()
  }
}

const state = reactive({
  scale: 1,
  isBlack: false
})

const cpuPalette = computed(() => {
  return state.isBlack
    ? {
        bgColor: 'transparent',
        hoverBg: '#fff',
        hoverColor: '#000',
        longfgColor: '#BABBBC', // ruler longer mark color
        fontColor: '#DEDEDE', // ruler font color
        shadowColor: '#525252', // ruler shadow color
        lineColor: '#51d6a9',
        borderColor: '#B5B5B5'
      }
    : {
        bgColor: 'transparent',
        lineColor: '#51d6a9',
        lineType: 'dashed'
      }
})

const post = reactive({
  thick: 20,
  width: 1470,
  height: 800,
  canvasWidth: 1242,
  canvasHeight: 1660,
  // width: 770,
  // height: 400,
  // canvasWidth: 600,
  // canvasHeight: 400,

  showRuler: true,
  palette: cpuPalette.value,
  snapsObj: { h: [], v: [] },
  shadow: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  panzoomOption: panzoomOption,
  isShowReferLine: true,
  lines: {
    h: [0, 250],
    v: [0, 500]
  }
})

const rectStyle = computed(() => {
  return {
    width: `${post.width}px`,
    height: `${post.height}px`
  }
})

const cpuScale = computed(() => {
  const num = Number(state.scale)
  return num.toFixed(2)
})

const canvasStyle = computed(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`
  }
})
</script>

<style lang="scss">
.demo {
  width: 100%;
  // padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
}
.top {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  width: 100%;
}

.font16 {
  font-size: 16px;
}
.mr10 {
  margin-right: 10px;
}

.wrapper {
  margin: 0 auto;
  background-size:
    21px 21px,
    21px 21px;
  border: 1px solid #dadadc;
}
.whitewrapper {
  background-color: #fafafc;
  background-image: linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
.balckwrapper {
  background-color: #18181c;
  background-image: linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
}
.container {
  background: rgb(236, 236, 234);
}
.button {
  bottom: 100%;
}

.img-style {
  width: 100%;
  height: 100%;
}
.btns {
  position: absolute;
  display: flex;
  bottom: 20px;
  right: 40px;
  z-index: 999;
}
</style>
