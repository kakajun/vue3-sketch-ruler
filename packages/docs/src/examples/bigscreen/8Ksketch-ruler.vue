<template>
  <div class="wrapper" ref="wrapperRef">
    <div class="description">
      说明: 该案例展示了大分辨率8K大屏(8800*5097)上使用vue3-sketch-ruler插件,
      依然能做到上下左右居中正确
    </div>
    <SketchRule
      v-if="rectWidth && rectHeight"
      :thick="20"
      v-model:scale="scale"
      :width="rectWidth"
      :height="rectHeight"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :panzoom-option="panzoomOption"
      :lines="lines"
      :auto-center="true"
      :show-ruler="true"
    >
      <template #default>
        <img style="width: 100%; height: 100%" :src="leftImg" alt="Left Screen" />
      </template>
    </SketchRule>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import leftImg from '../../assets/8k.jpg'

const wrapperRef = ref<HTMLElement | null>(null)
const rectWidth = ref(0)
const rectHeight = ref(0)
const canvasWidth = ref(8800)
const canvasHeight = ref(5097)
const paddingRatio = ref(0.1)
const scale = ref(1)
const lines = ref({
  h: [0, 2400],
  v: [0, 800]
})

const panzoomOption = reactive({
  maxScale: 3,
  minScale: 0.01,
  disablePan: false,
  disableZoom: false
})

const updateDimensions = () => {
  if (wrapperRef.value) {
    rectWidth.value = wrapperRef.value.clientWidth
    rectHeight.value = wrapperRef.value.clientHeight
  } else {
    rectWidth.value = window.innerWidth
    rectHeight.value = window.innerHeight
  }
}

const initOptions = () => {
  updateDimensions()
}

const onResize = () => {
  initOptions()
}

const handleCornerClick = () => {
  console.log('handleCornerClick')
}

onMounted(() => {
  initOptions()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style lang="scss" scoped>
.description {
  position: absolute;
  top: 20px;
  left: 0;
  font-size: 16px;
  padding: 5px;
  width: 100%;
  text-align: center;
  color: #000;
  z-index: 1000;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #fafafc;
  background-image:
    linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
</style>
