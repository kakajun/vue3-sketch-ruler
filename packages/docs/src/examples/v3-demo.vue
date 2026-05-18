<template>
  <div class="wrapper whitewrapper" :style="rectStyle">
    <SketchRuler
      ref="sketchRef"
      v-model:scale="post.scale"
      :width="post.width"
      :height="post.height"
      :canvas-width="post.canvasWidth"
      :canvas-height="post.canvasHeight"
      :thick="post.thick"
      :palette="post.palette"
      :lines="post.lines"
      :is-show-refer-line="post.isShowReferLine"
      :enable-animation="true"
      animation-mode="ease-out"
      :zoom-mode="post.zoomMode"
      :show-ruler="post.showRuler"
      :plugins="plugins"
      @zoomchange="handleZoomChange"
      @update:lines="handleLinesChange"
    >
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
          <button @click.stop="tools.zoomToPreset(1)">100%</button>
          <button @click.stop="toggleZoomMode">
            {{ state.zoomMode === 'pointer' ? '鼠标' : state.zoomMode === 'viewport-center' ? '视口' : '内容' }}
          </button>
          <button @click.stop="post.showRuler = !post.showRuler">
            {{ post.showRuler ? '隐藏尺子' : '显示尺子' }}
          </button>
          <span class="scale-label">{{ (state.scale * 100).toFixed(0) }}%</span>
        </div>
      </template>
    </SketchRuler>

    <div class="demo-minimap">
      <Minimap
        :content-width="post.canvasWidth"
        :content-height="post.canvasHeight"
        :viewport-x="viewportOffset.x"
        :viewport-y="viewportOffset.y"
        :viewport-width="post.width"
        :viewport-height="post.height"
        :scale="post.scale"
        :width="200"
        :height="150"
        @navigate="handleNavigate"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted } from 'vue'
import { SketchRuler, Minimap } from 'vue3-sketch-ruler'
import type { SketchRulerPlugin } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

const sketchRef = ref()
const post = reactive({
  scale: 1,
  thick: 20,
  width: 1470,
  height: 700,
  canvasWidth: 1000,
  canvasHeight: 500,
  showRuler: true,
  palette: { bgColor: 'transparent', guideLineStyle: 'dashed' as const, labelEnabled: true },
  isShowReferLine: true,
  zoomMode: 'pointer' as 'pointer' | 'viewport-center' | 'content-center',
  lines: {
    h: [0, 250],
    v: [0, 500]
  }
})

const viewportOffset = reactive({ x: 0, y: 0 })

let prevAnimation = false

// 同步 SketchRuler 初始 autoCenter 状态到 minimap
onMounted(() => {
  const state = sketchRef.value?.engine?.getState?.()
  if (state) {
    viewportOffset.x = state.x
    viewportOffset.y = state.y
  }
})

const plugins: SketchRulerPlugin[] = [
  {
    name: 'demo-logger',
    onLineCreate: (ctx) => console.log('[plugin] line created', ctx.line.id),
    onLineDelete: (ctx) => console.log('[plugin] line deleted', ctx.line.id)
  }
]

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

const toggleZoomMode = () => {
  const modes: Array<'pointer' | 'viewport-center' | 'content-center'> = ['pointer', 'viewport-center', 'content-center']
  const idx = modes.indexOf(post.zoomMode)
  post.zoomMode = modes[(idx + 1) % modes.length]
}

const handleZoomChange = (detail: any) => {
  console.log('zoomchange', detail)
  viewportOffset.x = detail.x
  viewportOffset.y = detail.y
}

const handleLinesChange = (lines: { h: number[]; v: number[] }) => {
  console.log('lines changed', lines)
}

const handleDragStart = () => {
  const engine = sketchRef.value?.engine
  if (engine) {
    prevAnimation = (engine as any).enableAnimation
    ;(engine as any).enableAnimation = false
  }
}

const handleDragEnd = () => {
  const engine = sketchRef.value?.engine
  if (engine) {
    ;(engine as any).enableAnimation = prevAnimation
  }
}

const handleNavigate = (x: number, y: number) => {
  sketchRef.value?.setTransform({ x, y })
}
</script>

<style lang="scss">
.wrapper {
  position: relative;
  margin: 0 auto;
  background-size: 21px 21px, 21px 21px;
  border: 1px solid #dadadc;
}

.demo-minimap {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 10;
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
  align-items: center;
  gap: 8px;
  bottom: 20px;
  right: 220px;
  z-index: 999;

  button {
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
  }

  .scale-label {
    color: #333;
    font-size: 12px;
    min-width: 50px;
    text-align: center;
  }
}
</style>
