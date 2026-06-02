<script setup lang="ts">
import Moveable from 'vue3-moveable'
import { SketchSelecto } from '@sketch-ruler/selecto'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { ref, reactive, computed } from 'vue'

const hitRate = 0
const selectByClick = true
const selectFromInside = false
const toggleContinueSelect = ['shift']
const ratio = 0
const cubes = []
for (let i = 0; i < 30; ++i) {
  cubes.push(i)
}
const targets = ref<Element[]>([])
const moveableRef = ref<any>(null)
const selectoRef = ref<InstanceType<typeof SketchSelecto> | null>(null)
const sketchruleRef = ref<InstanceType<typeof SketchRuler> | null>(null)
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

const onClickGroup = (e: any) => {
  selectoRef.value?.clickTarget(e.inputEvent, e.inputTarget)
}
const onRender = (e: any) => {
  e.target.style.cssText += e.cssText
}
const onRenderGroup = (e: any) => {
  e.events.forEach((ev: any) => {
    ev.target.style.cssText += ev.cssText
  })
}
const onDragStart = (e: any) => {
  const target = e.inputEvent.target
  if (
    moveableRef.value.isMoveableElement(target) ||
    targets.value.some((t) => t === target || t.contains(target))
  ) {
    e.stop()
  }
}
const onSelectEnd = (e: any) => {
  if (e.isDragStartEnd) {
    e.inputEvent.preventDefault()
    moveableRef.value.waitToChangeTarget().then(() => {
      moveableRef.value.dragStart(e.inputEvent)
    })
  }
  targets.value = e.selected
}

const post = reactive({
  thick: 20,
  width: 770,
  height: 600,
  canvasWidth: 600,
  canvasHeight: 600,
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

const canvasStyle = computed(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`
  }
})
</script>
<template>
  <div class="moveable app">
    <h1>Change the Moveable targets by selecting it.</h1>
    <p class="description">使用 @sketch-ruler/selecto 替代 selecto，天然适配 transform</p>
    <div class="wrapper whitewrapper" :style="rectStyle">
      <SketchRuler ref="sketchruleRef" v-bind="post">
        <template #default>
          <div data-type="page" :style="canvasStyle">
            <div class="container">
              <Moveable
                ref="moveableRef"
                :target="targets"
                :draggable="true"
                @click-group="onClickGroup"
                @render="onRender"
                @render-group="onRenderGroup"
              />
              <SketchSelecto
                ref="selectoRef"
                drag-container=".elements"
                :selectable-targets="['.target']"
                :hit-rate="hitRate"
                :select-by-click="selectByClick"
                :select-from-inside="selectFromInside"
                :toggle-continue-select="toggleContinueSelect"
                :ratio="ratio"
                @drag-start="onDragStart"
                @select-end="onSelectEnd"
              />
              <div ref="elem" class="elements selecto-area">
                <div v-for="i in cubes" :key="i" class="cube target"></div>
              </div>
            </div>
          </div>
        </template>
        <template #toolbar="{ tools }">
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
<style lang="scss" scoped>
.app {
  position: relative;
  height: 1000px;
  padding: 10px 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
}

body {
  background: #fff;
}

.logo {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0px auto;
  font-size: 0;
  text-align: left;
}

.logo.logos {
  width: 320px;
  text-align: center;
}

.logos .selecto {
  padding: 16px;
}

.logo img {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.cube {
  display: inline-block;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  margin: 4px;

  background: #4af;

  --color: #4af;
  line-height: 40px;
}

h1,
.description {
  text-align: center;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #333;
  color: #333;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  cursor: pointer;
  width: 120px;
  height: 42px;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all ease 0.2s;
  margin: 0px 5px;
}

.button:hover {
  background: #333;
  color: white;
}

.elements {
  margin-top: 40px;
  border: 2px solid #eee;
}

.selecto-area {
  padding: 20px;
}

#selecto1 .cube {
  transition: all ease 0.2s;
}
.moveable {
  display: flex;
  flex-direction: column;
}
.moveable #selecto1 .cube {
  transition: none;
}

.selecto-area .selected {
  color: #fff;
  background: var(--color);
}

.scroll {
  overflow: auto;
  padding-top: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.infinite-viewer,
.scroll {
  width: 100%;
  height: 300px;
  box-sizing: border-box;
}

.infinite-viewer .viewport {
  padding-top: 10px;
}

.empty.elements {
  border: none;
}

.correct {
  position: relative;
  padding: 20px;
  text-align: center;
  margin: auto;
  width: 100%;
}
.correct .target {
  position: relative;
  width: 100px;
  height: 100px;
  color: #fff;
  margin: 10px 20px;
  line-height: 100px;
  text-align: center;
  display: inline-block;
}
.correct svg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0.9;
  transform: translateZ(0px);
}
.correct svg path {
  stroke: #333;
  stroke-width: 2;
  fill: transparent;
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
.btns {
  position: absolute;
  display: flex;
  bottom: 20px;
  right: 40px;
  z-index: 999;
}
</style>
