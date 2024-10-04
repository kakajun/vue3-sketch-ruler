<template>
  <div>
    <div class="wrapper whitewrapper" :style="rectStyle">
      <sketch-rule ref="sketchruleRef" v-bind="post">
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <img class="img-style" :src="bgImg" />
          </div>
        </template>
        <template #btn="{ reset, zoomIn, zoomOut }">
          <div class="btns">
            <button @click.stop="reset">还原</button>
            <button @click.stop="zoomIn">放大</button>
            <button @click.stop="zoomOut">缩小</button>
          </div>
        </template>
      </sketch-rule>
    </div>
  </div>
</template>
<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
const sketchruleRef = ref()
const post = reactive({
  thick: 20,
  width: 1470,
  height: 700,
  showShadowText: false,
  canvasWidth: 1000,
  canvasHeight: 500,
  showRuler: true,
  palette: { bgColor: 'transparent', lineType: 'dashed' },
  isShowReferLine: true,
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
  background-image: linear-gradient(#fafafc 20px, transparent 0),
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

// #app {
//   margin-top: 10px;
//   width: 100%;
// }
.top-tittle {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
