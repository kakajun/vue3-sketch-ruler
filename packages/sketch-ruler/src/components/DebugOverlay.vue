<template>
  <div v-if="visible" class="debug-overlay" :style="overlayStyle">
    <div class="debug-header">
      <span class="debug-title">Debug</span>
      <button class="debug-close" @click="visible = false">✕</button>
    </div>
    <div class="debug-body">
      <div class="debug-section">
        <div class="debug-label">Transform</div>
        <div class="debug-row">scale: {{ format(transform.scale) }}</div>
        <div class="debug-row">offsetX: {{ format(transform.offsetX) }}</div>
        <div class="debug-row">offsetY: {{ format(transform.offsetY) }}</div>
      </div>
      <div class="debug-section">
        <div class="debug-label">Matrix</div>
        <div class="debug-row mono">{{ matrixStr }}</div>
      </div>
      <div class="debug-section">
        <div class="debug-label">Performance</div>
        <div class="debug-row">FPS: {{ perf.fps }}</div>
        <div class="debug-row">Frame: {{ perf.frameTime.toFixed(2) }}ms</div>
        <div class="debug-row">DrawCalls: {{ perf.drawCalls }}</div>
        <div class="debug-row">Memory: {{ perf.memory }}MB</div>
      </div>
      <div class="debug-section">
        <div class="debug-label">Events (last {{ events.length }})</div>
        <div
          v-for="(evt, i) in events"
          :key="i"
          class="debug-row event"
        >
          {{ evt.type }} @{{ evt.x }},{{ evt.y }} {{ evt.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  transform: {
    scale: number
    offsetX: number
    offsetY: number
    matrix?: number[]
  }
  drawCalls?: number
}

const props = withDefaults(defineProps<Props>(), {
  drawCalls: 0
})

const visible = ref(false)

const overlayStyle = computed(() => ({
  position: 'absolute' as const,
  top: '40px',
  right: '8px',
  width: '220px',
  pointerEvents: 'auto' as const,
  zIndex: 999
}))

const matrixStr = computed(() => {
  const m = props.transform.matrix ?? [
    props.transform.scale, 0, 0,
    props.transform.scale, props.transform.offsetX, props.transform.offsetY
  ]
  return `[${m.map((v) => v.toFixed(3)).join(', ')}]`
})

const perf = ref({ fps: 0, frameTime: 0, drawCalls: 0, memory: 0 })
const events = ref<{ type: string; x: number; y: number; time: string }[]>([])

let rafId = 0
let lastTime = performance.now()
let frameCount = 0

function updatePerf(): void {
  const now = performance.now()
  frameCount++
  const delta = now - lastTime
  if (delta >= 1000) {
    perf.value.fps = Math.round((frameCount * 1000) / delta)
    perf.value.frameTime = delta / frameCount
    perf.value.drawCalls = props.drawCalls
    perf.value.memory = Math.round((performance as any).memory?.usedJSHeapSize / 1048576 || 0)
    frameCount = 0
    lastTime = now
  }
  rafId = requestAnimationFrame(updatePerf)
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault()
    visible.value = !visible.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  rafId = requestAnimationFrame(updatePerf)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  cancelAnimationFrame(rafId)
})

function format(n: number): string {
  return n.toFixed(3)
}

// 供外部调用的日志方法
function logEvent(type: string, x: number, y: number): void {
  events.value.unshift({
    type,
    x: Math.round(x),
    y: Math.round(y),
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
  })
  if (events.value.length > 10) {
    events.value = events.value.slice(0, 10)
  }
}

defineExpose({ logEvent, visible })
</script>

<style lang="scss" scoped>
.debug-overlay {
  background: rgba(0, 0, 0, 0.85);
  color: #0f0;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.4;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid #333;
}

.debug-title {
  font-weight: bold;
  color: #fff;
}

.debug-close {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}

.debug-body {
  padding: 8px 10px;
  max-height: 400px;
  overflow-y: auto;
}

.debug-section {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.debug-label {
  color: #888;
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.debug-row {
  padding: 1px 0;

  &.mono {
    word-break: break-all;
  }

  &.event {
    color: #ccc;
    font-size: 10px;
  }
}
</style>
