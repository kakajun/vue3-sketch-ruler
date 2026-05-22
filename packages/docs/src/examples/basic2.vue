<template>
  <div class="wrapper whitewrapper" :style="rectStyle">
    <SketchRuler ref="sketchruleRef" v-bind="post">
      <template #default>
        <div data-type="page" :style="canvasStyle">
          <img class="img-style" :src="bgImg" />
          <RulerInfo />
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
import { computed, ref, reactive, inject, h } from 'vue'
import { SketchRuler, RulerContextKey } from 'vue3-sketch-ruler'
import type { RulerContext } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'

// 内联子组件：演示通过 RulerContextKey inject 获取标尺上下文
// 使用渲染函数，避免字符串模板依赖运行时编译器
const RulerInfo = {
  setup() {
    const ctx = inject<RulerContext>(RulerContextKey)
    const scaleStr = computed(() => ctx?.scale.value.toFixed(2) ?? '-')
    const offsetStr = computed(() => {
      if (!ctx) return '-'
      return `(${ctx.offset.value.x.toFixed(0)}, ${ctx.offset.value.y.toFixed(0)})`
    })
    const lineCount = computed(() => ctx?.lines.value.length ?? 0)
    const showRuler = computed(() => ctx?.showRuler.value ?? false)

    return () => {
      if (!ctx) return null
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: '1.6',
            zIndex: 9999,
            pointerEvents: 'none',
            fontFamily: 'monospace'
          }
        },
        [
          h('div', `scale: ${scaleStr.value}`),
          h('div', `offset: ${offsetStr.value}`),
          h('div', `lines: ${lineCount.value}`),
          h('div', `showRuler: ${showRuler.value}`)
        ]
      )
    }
  }
}

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
