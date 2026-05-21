<template>
  <div class="wrapper whitewrapper" :style="rectStyle">
    <SketchRuler ref="sketchruleRef" v-bind="post">
      <template #default>
        <div data-type="page" :style="canvasStyle">
          <img class="img-style" :src="bgImg" />
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
</template>
<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
const sketchruleRef = ref()
const post = reactive({
  thick: 20,
  width: 1470,
  height: 700,
  canvasWidth: 1000,
  canvasHeight: 500,
  showRuler: true,
  palette: { bgColor: 'transparent', guideLineStyle: 'dashed' },
  isShowReferLine: true,
  autoCenter: false,
  initialOffset: { x: 100, y: 50 },
  shadow: {
    x: 0,
    y: 0,
    width: 300,
    height: 300
  },
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

const canvasStyle = computed(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`
  }
})
</script>

<style lang="scss">
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
