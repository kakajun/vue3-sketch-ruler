<script>
import Moveable from 'vue3-moveable'
import Selecto from './edit/Selecto.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import Panzoom from 'simple-panzoom'
import SketchRule from '../../src/index' // 这里可以换成打包后的
export default {
  components: { Moveable, Selecto, SketchRule },
  setup() {
    const hitRate = 0
    const selectByClick = true
    const selectFromInside = false
    const toggleContinueSelect = ['shift']
    const ratio = 0
    const cubes = []
    for (let i = 0; i < 30; ++i) {
      cubes.push(i)
    }
    const targets = ref([])
    const moveableRef = ref(null)
    const selectoRef = ref(null)
    const state = reactive({
      scale: 1,
      isBlack: false
    })
    // 更多配置,参见 https://github.com/timmywil/panzoom
    const panzoomOption = {
      noBind: true,
      maxScale: 3,
      minScale: 0.3,
      disablePan: true,
      disableZoom: false,
      contain: 'none', // 'inside' | 'outside' | 'none'
      handleStartEvent: (event) => {
        event.preventDefault()
        console.log('handleStartEvent', event)
      }
    }
    let panzoom
    onMounted(() => {
      // 放开就会有问题
      // const dom = document.querySelector('.moveable')
      // panzoom = Panzoom(dom, panzoomOption)
    })

    const zoom = () => {
      console.log('444')

      panzoom.zoomIn()
    }

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

    const onClickGroup = (e) => {
      selectoRef.value.clickTarget(e.inputEvent, e.inputTarget)
    }
    const onRender = (e) => {
      e.target.style.cssText += e.cssText
    }
    const onRenderGroup = (e) => {
      e.events.forEach((ev) => {
        ev.target.style.cssText += ev.cssText
      })
    }
    const onDragStart = (e) => {
      const target = e.inputEvent.target
      if (
        moveableRef.value.isMoveableElement(target) ||
        targets.value.some((t) => t === target || t.contains(target))
      ) {
        e.stop()
      }
    }
    const onSelectEnd = (e) => {
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
      height: 400,
      canvasWidth: 600,
      canvasHeight: 400,
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
    return {
      zoom,
      moveableRef,
      post,
      state,
      targets,
      onClickGroup,
      onRender,
      onRenderGroup,
      selectoRef,
      hitRate,
      selectByClick,
      selectFromInside,
      toggleContinueSelect,
      ratio,
      window,
      onDragStart,
      onSelectEnd,
      cubes
    }
  }
}
</script>
<template>
  <button @click="zoom">缩小</button>
  <div class="moveable app">
    <div class="container" style="transform: scale(1)">
      <div class="logo logos" id="logo">
        <a>
          <img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" />
        </a>
        <a>
          <img src="https://daybrush.com/moveable/images/256x256.png" />
        </a>
      </div>
      <h1>Change the Moveable targets by selecting it.</h1>
      <p class="description"
        >此例子存在意义是,Selecto不能和pzoom共存, 这到不是pazoom的问题,问题出在,
        Select的定位是fixed,如果父级标签有transform, 那么fixed就会相对于它, 目前看上去是正常的,
        但只要把我注释的style="transform: scale(1)",加入到下面
        container中,那么马上Slectro选择框定位就不准了</p
      >
      <Moveable
        ref="moveableRef"
        :target="targets"
        :draggable="true"
        @clickGroup="onClickGroup"
        @render="onRender"
        @renderGroup="onRenderGroup"
      />
      <Selecto
        ref="selectoRef"
        :dragContainer="'.elements'"
        :selectableTargets="['.target']"
        :hitRate="hitRate"
        :selectByClick="selectByClick"
        :selectFromInside="selectFromInside"
        :toggleContinueSelect="toggleContinueSelect"
        :ratio="ratio"
        :keyContainer="window"
        @dragStart="onDragStart"
        @selectEnd="onSelectEnd"
      />
      <div ref="elem" class="elements selecto-area">
        <div class="cube target" :key="i" v-for="i in cubes"></div>
      </div>
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
</style>
