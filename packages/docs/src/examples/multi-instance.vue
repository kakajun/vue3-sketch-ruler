<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">多实例演示：同一页面挂载两个 SketchRule，各自独立缩放与平移</div>
    </div>

    <div class="instance-row">
      <div class="instance-wrapper">
        <div class="label">实例 A</div>
        <div class="wrapper whitewrapper" :style="rectStyleA">
          <SketchRule ref="sketchruleRefA" v-bind="postA">
            <template #default>
              <div data-type="page" :style="canvasStyleA">
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
          </SketchRule>
        </div>
      </div>

      <div class="instance-wrapper">
        <div class="label">实例 B</div>
        <div class="wrapper whitewrapper" :style="rectStyleB">
          <SketchRule ref="sketchruleRefB" v-bind="postB">
            <template #default>
              <div data-type="page" :style="canvasStyleB">
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
          </SketchRule>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const sketchruleRefA = ref()
const sketchruleRefB = ref()

const postA = reactive({
  thick: 20,
  width: 700,
  height: 400,
  showShadowText: false,
  canvasWidth: 600,
  canvasHeight: 300,
  showRuler: true,
  palette: { bgColor: 'transparent', lineType: 'dashed', lineColor: '#51d6a9' },
  isShowReferLine: true,
  shadow: {
    x: 0,
    y: 0,
    width: 200,
    height: 200
  },
  lines: {
    h: [0, 150],
    v: [0, 300]
  }
})

const postB = reactive({
  thick: 20,
  width: 700,
  height: 400,
  showShadowText: false,
  canvasWidth: 500,
  canvasHeight: 350,
  showRuler: true,
  palette: { bgColor: 'transparent', lineType: 'solid', lineColor: '#f56c6c' },
  isShowReferLine: true,
  shadow: {
    x: 0,
    y: 0,
    width: 150,
    height: 150
  },
  lines: {
    h: [100],
    v: [200]
  }
})

const rectStyleA = computed(() => {
  return {
    width: `${postA.width}px`,
    height: `${postA.height}px`
  }
})

const rectStyleB = computed(() => {
  return {
    width: `${postB.width}px`,
    height: `${postB.height}px`
  }
})

const canvasStyleA = computed(() => {
  return {
    width: `${postA.canvasWidth}px`,
    height: `${postA.canvasHeight}px`
  }
})

const canvasStyleB = computed(() => {
  return {
    width: `${postB.canvasWidth}px`,
    height: `${postB.canvasHeight}px`
  }
})
</script>

<style lang="scss">
.demo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.instance-row {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.instance-wrapper {
  margin-bottom: 20px;
}

.label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
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
