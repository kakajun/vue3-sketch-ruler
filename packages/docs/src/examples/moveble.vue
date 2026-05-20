<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">鼠标中键移动画布</div>
      <div class="scale mr10">缩放比:{{ cpuScale }}</div>
    </div>

    <div
      class="wrapper"
      :class="[state.isBlack ? 'balckwrapper' : 'whitewrapper']"
      :style="rectStyle"
    >
      <SketchRuler
        ref="sketchruleRef"
        v-model:scale="state.scale"
        v-model:lock-line="lockLine"
        v-bind="post"
        :self-handle="true"
      >
        <template #default>
          <div class="container" :style="canvasStyle">
            <movebleCom
              v-model:shadow="post.shadow"
              v-model:snaps-obj="post.snapsObj"
              :scale="state.scale"
            />
          </div>
        </template>
        <template #toolbar="{ tools, state }">
          <div class="btns">
            <button @click.stop="tools.reset">还原</button>
            <button @click.stop="tools.zoomIn">放大</button>
            <button @click.stop="tools.zoomOut">缩小</button>
          </div>
        </template>
      </SketchRuler>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import movebleCom from './edit/moveble.vue'

const sketchruleRef = ref()
const lockLine = ref(false)

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
        tickColor: '#BABBBC',
        labelColor: '#DEDEDE',
        shadowColor: '#525252',
        guideLineColor: '#51d6a9',
        borderColor: '#B5B5B5'
      }
    : {
        bgColor: 'transparent',
        guideLineColor: '#51d6a9',
        guideLineStyle: 'dashed'
      }
})

const post = reactive({
  thick: 20,
  width: 1470,
  height: 800,
  canvasWidth: 1242,
  canvasHeight: 1660,
  showRuler: true,
  palette: cpuPalette.value,
  snapsObj: { h: [], v: [] },
  shadow: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
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
  background-image:
    linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
.balckwrapper {
  background-color: #18181c;
  background-image:
    linear-gradient(#18181c 20px, transparent 0),
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
