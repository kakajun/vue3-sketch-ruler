<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10">Ctrl+鼠标滚轮缩放画布</div>
      <div class="mr10">空白键+鼠标左键键移动画布</div>
      <div class="scale mr10">缩放比:{{ cpuScale }}</div>
      <div class="scale mr10">参考线:{{ JSON.stringify(post.lines) }}</div>
    </div>
    <div class="top font16">
      <button class="mr10 font16" @click="post.showRuler = !post.showRuler">
        {{ (post.showRuler ? '隐藏' : '显示') + '规尺' }}
      </button>
      <button class="mr10 font16" @click="post.isShowReferLine = !post.isShowReferLine">
        {{ (post.isShowReferLine ? '隐藏' : '显示') + '参考线' }}
      </button>
      <button class="mr10 font16" @click="post.showMinorTicks = !post.showMinorTicks">
        {{ (post.showMinorTicks ? '隐藏' : '显示') + '次刻度' }}
      </button>
      <button class="mr10 font16" @click="lockLine = !lockLine">
        {{ lockLine ? '解锁' : '锁定' }}参考线
      </button>
      <button class="mr10 font16" @click="toggleZoomMode">
        {{ zoomMode === 'pointer' ? '鼠标' : zoomMode === 'viewport-center' ? '视口' : '内容' }}
      </button>
      <button class="mr10 font16" @click="changeShadow">模拟阴影切换</button>
      <select v-model="animationMode" class="mr10 font16">
        <option value="ease-out">ease-out</option>
        <option value="damped">damped</option>
        <option value="exponential">exponential</option>
        <option value="direct">direct</option>
      </select>
      <button class="mr10 font16" @click.stop="resetMethod">还原</button>
      <button class="mr10 font16" @click.stop="zoomOutMethod">缩小</button>
      <span class="mr10 font16">步长:{{ post.zoomStep }}</span>
      <input
        class="mr10 font16"
        v-model.number="post.zoomStep"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        style="width: 80px"
      />
      <span class="mr10 font16">范围:{{ post.minZoom }}~{{ post.maxZoom }}</span>
      <span class="mr10 font16">吸附:{{ post.snapThreshold }}px</span>
      <input
        class="mr10 font16"
        v-model.number="post.snapThreshold"
        type="range"
        min="0"
        max="20"
        step="1"
        style="width: 80px"
      />
      <span class="mr10 font16">边距比:{{ post.paddingRatio }}</span>
      <input
        class="mr10 font16"
        v-model.number="post.paddingRatio"
        type="range"
        min="0"
        max="0.5"
        step="0.05"
        style="width: 80px"
      />
      <span class="mr10 font16">缩放:</span>
      <input
        class="mr10 font16"
        :value="state.scale"
        type="range"
        min="0.3"
        max="3"
        step="0.1"
        @input="scaleChange"
      />
    </div>

    <div
      class="wrapper"
      :class="[!store.isLight ? 'blackwrapper' : 'whitewrapper']"
      :style="rectStyle"
    >
      <SketchRuler
        ref="sketchRef"
        v-model:scale="state.scale"
        :lock-line="lockLine"
        :width="post.width"
        :height="post.height"
        :canvas-width="post.canvasWidth"
        :canvas-height="post.canvasHeight"
        :thick="post.thick"
        :palette="cpuPalette"
        :show-ruler="post.showRuler"
        :show-minor-ticks="post.showMinorTicks"
        :is-show-refer-line="post.isShowReferLine"
        :lines="post.lines"
        :shadow="post.shadow"
        :enable-animation="true"
        :animation-mode="animationMode"
        :zoom-mode="zoomMode"
        :zoom-step="post.zoomStep"
        :min-zoom="post.minZoom"
        :max-zoom="post.maxZoom"
        :snap-threshold="post.snapThreshold"
        :padding-ratio="post.paddingRatio"
        :plugins="plugins"
        @zoomchange="handleZoomChange"
        @update:lines="handleLinesChange"
        @on-corner-click="handleCornerClick"
      >
        <template #default>
          <div data-type="page" :style="canvasStyle" @mousedown="handleMouseDown">
            <img class="img-style" :src="bgImg" alt="" />
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

      <div class="demo-minimap">
        <Minimap
          bgColor="gray"
          :content-width="post.canvasWidth"
          :content-height="post.canvasHeight"
          :viewport-x="viewportOffset.x"
          :viewport-y="viewportOffset.y"
          :viewport-width="post.width"
          :viewport-height="post.height"
          :scale="state.scale"
          :width="200"
          :height="150"
          @navigate="handleNavigate"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SketchRuler, Minimap, definePlugin } from 'vue3-sketch-ruler'
import type { ZoomMode } from 'vue3-sketch-ruler'
import type { PaletteType } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import bgImg from '../assets/bg.png'
import { computed, ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/app'

const store = useAppStore()
const sketchRef = ref()
const lockLine = ref(false)
const zoomMode = ref<ZoomMode>('pointer')
const animationMode = ref<'ease-out' | 'damped' | 'exponential' | 'direct'>('ease-out')

// ===================== 插件系统示例 =====================

/** 1. 日志插件 —— 展示 beforeZoom / afterZoom / beforePan / afterPan */
const logPlugin = definePlugin(() => ({
  name: 'log-plugin',
  priority: 5,
  beforeZoom(ctx) {
    console.log('[beforeZoom] 即将缩放', ctx.from, '->', ctx.to)
  },
  afterZoom(ctx) {
    console.log('[afterZoom] 缩放完成', ctx.from, '->', ctx.to)
  },
  beforePan(ctx) {
    console.log('[beforePan] 即将平移', 'delta:', ctx.delta)
  },
  afterPan(ctx) {
    console.log('[afterPan] 平移完成', 'offset:', ctx.offset)
  }
}))

/** 2. 参考线事件插件 —— 展示 onLineCreate / onLineMove / onLineDelete */
const lineEventPlugin = definePlugin(() => ({
  name: 'line-event-plugin',
  priority: 3,
  onLineCreate(ctx) {
    console.log('[onLineCreate] 创建参考线', ctx.line.orientation, ctx.line.position)
  },
  onLineMove(ctx) {
    console.log('[onLineMove] 移动参考线', ctx.line.id, ctx.from, '->', ctx.to)
  },
  onLineDelete(ctx) {
    console.log('[onLineDelete] 删除参考线', ctx.line.id)
  }
}))

/** 3. 限制缩放插件 —— 展示高优先级 + cancel 拦截 */
const zoomLimitPlugin = definePlugin(() => ({
  name: 'zoom-limit-plugin',
  priority: 10, // 最高优先级，最先执行
  beforeZoom(ctx) {
    if (ctx.to > 2.5) {
      console.warn('[zoomLimit] 超过 2.5 上限，取消缩放')
      ctx.cancel()
    }
  }
}))

/** 4. 状态监听插件 —— 展示 api.getState() 读取状态 */
const stateWatcherPlugin = definePlugin(() => ({
  name: 'state-watcher-plugin',
  priority: 1,
  afterZoom(ctx) {
    const { scale, offset, lines } = ctx.api.getState()
    console.log('[stateWatcher] afterZoom 状态快照:', { scale, offset, linesCount: lines.length })
  },
  afterPan(ctx) {
    const { scale, offset } = ctx.api.getState()
    console.log('[stateWatcher] afterPan 状态快照:', { scale, offset })
  }
}))

const plugins = [logPlugin(), lineEventPlugin(), zoomLimitPlugin(), stateWatcherPlugin()]

const toggleZoomMode = () => {
  const modes: Array<ZoomMode> = ['pointer', 'viewport-center', 'content-center']
  const idx = modes.indexOf(zoomMode.value)
  zoomMode.value = modes[(idx + 1) % modes.length]
}

const state = reactive({
  scale: 1
})

const viewportOffset = reactive({ x: 0, y: 0 })
let prevAnimation = false

// 同步 SketchRuler 初始 autoCenter 状态到 minimap
onMounted(() => {
  const s = sketchRef.value?.engine?.getState?.()
  if (s) {
    viewportOffset.x = s.x
    viewportOffset.y = s.y
    state.scale = s.scale
  }
})

const cpuPalette = computed<PaletteType>(() => {
  return !store.isLight
    ? {
        bgColor: 'transparent',
        tickColor: '#BABBBC',
        labelColor: '#DEDEDE',
        guideLineColor: '#51d6a9',
        guideLineLockedColor: '#d4d7dc',
        hoverBg: 'transparent',
        hoverColor: '#fff',
        borderColor: '#B5B5B5',
        shadowColor: '#525252'
      }
    : {
        bgColor: 'transparent',
        hoverColor: '#000',
        guideLineColor: '#51d6a9'
      }
})

const post = reactive({
  thick: 20,
  width: 1470,
  height: 750,
  canvasWidth: 1920,
  canvasHeight: 1080,
  showRuler: true,
  showMinorTicks: false,
  isShowReferLine: true,
  zoomStep: 0.25,
  minZoom: 0.1,
  maxZoom: 3,
  snapThreshold: 5,
  paddingRatio: 0.1,
  lines: {
    h: [0, 250],
    v: [0, 500]
  },
  shadow: {
    x: 0,
    y: 0,
    width: 300,
    height: 300
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
  return num.toFixed(1)
})

const canvasStyle = computed(() => {
  return {
    width: `${post.canvasWidth}px`,
    height: `${post.canvasHeight}px`
  }
})

const scaleChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target) {
    state.scale = Number(target.value)
  }
}

const handleCornerClick = (e: boolean): void => {
  console.log('handleCornerClick', e)
}

const handleZoomChange = (detail: { scale: number; x: number; y: number }): void => {
  viewportOffset.x = detail.x
  viewportOffset.y = detail.y
}

const handleLinesChange = (lines: { h: number[]; v: number[] }): void => {
  post.lines = lines
}

const changeShadow = (): void => {
  post.shadow.x = Math.random() * post.canvasWidth
  post.shadow.y = Math.random() * post.canvasHeight
}

const handleMouseDown = (e: MouseEvent): void => {
  console.log('handleMouseDown', e)
}

const zoomOutMethod = (): void => {
  sketchRef.value?.zoomOut?.()
}

const resetMethod = (): void => {
  sketchRef.value?.reset?.()
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
  sketchRef.value?.setTransform?.({ x, y })
}
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

.wrapper {
  position: relative;
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
.blackwrapper {
  background-color: #18181c;
  background-image:
    linear-gradient(#18181c 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #86909c 0);
}

.img-style {
  width: 100%;
  height: 100%;
}
.btns {
  position: absolute;
  display: flex;
  bottom: 20px;
  right: 220px;
  z-index: 999;
}

.demo-minimap {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 10;
}
</style>
