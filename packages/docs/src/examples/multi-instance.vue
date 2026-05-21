<template>
  <div class="demo">
    <div class="top font16">
      <div class="mr10"
        >多画布管理器演示：通过 CanvasManager 管理多个画布，各自独立保存缩放、偏移与参考线</div
      >
    </div>

    <div class="main-layout">
      <!-- 左侧画布列表 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">画布列表</span>
          <select v-model="selectedTemplate" class="template-select" @change="handleAddCanvas">
            <option value="">+ 添加画布</option>
            <option v-for="name in templateNames" :key="name" :value="name">
              {{ BUILTIN_TEMPLATES[name]?.name || name }}
            </option>
          </select>
        </div>

        <div class="canvas-list">
          <div
            v-for="canvas in canvases"
            :key="canvas.id"
            class="canvas-card"
            :class="{ active: canvas.id === activeId }"
            @click="switchCanvas(canvas.id)"
          >
            <div class="canvas-preview" :style="getPreviewStyle(canvas)">
              <span class="canvas-label">{{ canvas.name }}</span>
            </div>
            <div class="canvas-info">
              <span class="canvas-size">{{ canvas.width }} × {{ canvas.height }}</span>
              <span class="canvas-scale">{{ (canvas.scale * 100).toFixed(0) }}%</span>
            </div>
            <button
              v-if="canvases.length > 1"
              class="canvas-delete"
              @click.stop="removeCanvas(canvas.id)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧主编辑区 -->
      <div class="editor-area">
        <div class="editor-header">
          <span class="editor-title">{{ activeCanvas?.name || '未选择' }}</span>
          <span class="editor-meta">
            {{ activeCanvas?.width }} × {{ activeCanvas?.height }} | 参考线:
            {{ activeLines.h.length }}h / {{ activeLines.v.length }}v
          </span>
        </div>

        <div class="wrapper whitewrapper" :style="rectStyle">
          <SketchRuler
            v-if="activeCanvas"
            :key="activeId"
            ref="sketchRef"
            v-model:scale="activeCanvas.scale"
            :width="rectWidth"
            :height="rectHeight"
            :canvas-width="activeCanvas.width"
            :canvas-height="activeCanvas.height"
            :thick="20"
            :lines="activeLines"
            :auto-center="true"
            :palette="{ bgColor: 'transparent', guideLineStyle: 'dashed' }"
            :is-show-refer-line="true"
            @zoomchange="handleZoomChange"
            @update:lines="handleLinesChange"
          >
            <template #default>
              <div data-type="page" :style="getCanvasStyle(activeCanvas)">
                <div class="canvas-content" :style="getContentStyle(activeCanvas)">
                  <span class="content-label">{{ activeCanvas.name }}</span>
                  <span class="content-size">
                    {{ activeCanvas.width }} × {{ activeCanvas.height }}
                  </span>
                </div>
              </div>
            </template>
            <template #toolbar="{ tools, state }">
              <div class="btns">
                <button @click.stop="tools.reset">还原</button>
                <button @click.stop="tools.zoomIn">放大</button>
                <button @click.stop="tools.zoomOut">缩小</button>
                <button @click.stop="tools.zoomToPreset(1)">100%</button>
                <span class="scale-text">{{ (state.scale * 100).toFixed(0) }}%</span>
              </div>
            </template>
          </SketchRuler>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SketchRuler } from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css'
import { CanvasManager, BUILTIN_TEMPLATES, exportLines, importLines } from '@sketch-ruler/core'
import type { CanvasState, CanvasManagerState } from '@sketch-ruler/core'

const sketchRef = ref()
const rectWidth = 900
const rectHeight = 560

const manager = new CanvasManager([
  {
    name: 'Web 1920',
    width: 1920,
    height: 1080,
    scale: 0.4,
    lines: { h: [100, 540], v: [200, 960] }
  },
  {
    name: 'A4 纵向',
    width: 794,
    height: 1123,
    scale: 0.45,
    lines: { h: [300], v: [400] }
  },
  {
    name: 'Mobile 375',
    width: 375,
    height: 812,
    scale: 0.6,
    lines: { h: [200, 400], v: [100, 200] }
  }
])

const canvases = ref<CanvasState[]>([])
const activeId = ref('')
const selectedTemplate = ref('')

const templateNames = Object.keys(BUILTIN_TEMPLATES)

manager.onUpdate((state: CanvasManagerState) => {
  canvases.value = state.canvases
  activeId.value = state.activeId
})

// 初始化同步一次状态
const initState = manager.getState()
canvases.value = initState.canvases
activeId.value = initState.activeId

const activeCanvas = computed(() => {
  return canvases.value.find((c) => c.id === activeId.value) ?? null
})

const activeLines = computed(() => {
  const canvas = activeCanvas.value
  return canvas ? exportLines(canvas.lines) : { h: [], v: [] }
})

const rectStyle = computed(() => ({
  width: `${rectWidth}px`,
  height: `${rectHeight}px`
}))

const getCanvasStyle = (canvas: CanvasState) => ({
  width: `${canvas.width}px`,
  height: `${canvas.height}px`
})

const getContentStyle = (canvas: CanvasState) => {
  const hue = canvas.name.charCodeAt(0) % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 60%, 90%), hsl(${hue}, 60%, 80%))`
  }
}

const getPreviewStyle = (canvas: CanvasState) => {
  const ratio = canvas.width / canvas.height
  const w = ratio > 1 ? 64 : 64 / ratio
  const h = ratio > 1 ? 64 / ratio : 64
  const hue = canvas.name.charCodeAt(0) % 360
  return {
    width: `${w}px`,
    height: `${h}px`,
    background: `hsl(${hue}, 60%, 85%)`
  }
}

const switchCanvas = (id: string) => {
  manager.switchCanvas(id)
}

const removeCanvas = (id: string) => {
  manager.removeCanvas(id)
}

const handleAddCanvas = () => {
  const name = selectedTemplate.value
  if (!name) return
  const id = manager.applyTemplate(name)
  if (id) {
    manager.switchCanvas(id)
  }
  selectedTemplate.value = ''
}

const handleZoomChange = (detail: { scale: number; x: number; y: number }) => {
  manager.updateCanvasState(activeId.value, {
    scale: detail.scale
  })
}

const handleLinesChange = (lines: { h: number[]; v: number[] }) => {
  manager.updateCanvasLines(activeId.value, importLines(lines))
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
  font-size: 16px;
}

.mr10 {
  margin-right: 10px;
}

.main-layout {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

/* 侧边栏 */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.template-select {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.canvas-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.canvas-card {
  position: relative;
  padding: 10px;
  border-radius: 6px;
  border: 2px solid #e8e8e8;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
  }

  &.active {
    border-color: #409eff;
    background: #f0f7ff;
  }
}

.canvas-preview {
  margin: 0 auto 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-label {
  font-size: 11px;
  color: #666;
  font-weight: bold;
}

.canvas-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
}

.canvas-delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  border: none;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  .canvas-card:hover & {
    opacity: 1;
  }
}

/* 编辑区 */
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.editor-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.editor-meta {
  font-size: 12px;
  color: #999;
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

.canvas-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.content-label {
  font-size: 24px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.4);
}

.content-size {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.3);
}

.btns {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  bottom: 20px;
  right: 40px;
  z-index: 999;

  button {
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
  }

  .scale-text {
    color: #333;
    font-size: 12px;
    min-width: 50px;
    text-align: center;
  }
}
</style>
