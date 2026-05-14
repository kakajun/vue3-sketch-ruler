<template>
  <div class="ruler-line-panel" :class="{ collapsed: collapsed }">
    <div class="panel-header" @click="collapsed = !collapsed">
      <span class="panel-title">参考线</span>
      <span class="panel-count">{{ visibleLines.length }}</span>
      <span class="panel-toggle">{{ collapsed ? '▸' : '▾' }}</span>
    </div>
    <div v-show="!collapsed" class="panel-body">
      <div class="panel-toolbar">
        <input v-model="search" class="panel-search" type="text" placeholder="搜索位置..." />
        <button class="btn-icon" title="清除全部" @click="handleClearAll">🗑</button>
        <button class="btn-icon" title="添加横向参考线" @click="handleAdd('h')">➕ H</button>
        <button class="btn-icon" title="添加纵向参考线" @click="handleAdd('v')">➕ V</button>
      </div>
      <div class="line-list">
        <div
          v-for="line in filteredLines"
          :key="line.id"
          class="line-item"
          :class="{ locked: line.locked }"
        >
          <span class="line-orient">{{ line.orientation === 'h' ? 'H' : 'V' }}</span>
          <span class="line-pos">{{ formatPos(line.position) }}</span>
          <button
            class="btn-lock"
            :title="line.locked ? '解锁' : '锁定'"
            @click="handleToggleLock(line)"
          >
            {{ line.locked ? '🔒' : '🔓' }}
          </button>
          <button class="btn-delete" title="删除" @click="handleRemove(line)">✕</button>
        </div>
        <div v-if="filteredLines.length === 0" class="line-empty">暂无参考线</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GuideLine } from '../state/ruler-context'

interface Props {
  lines: GuideLine[]
  format?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  format: (v: number) => String(Math.round(v))
})

const emit = defineEmits<{
  (e: 'add', orientation: 'h' | 'v', position?: number): void
  (e: 'remove', id: string): void
  (e: 'update', id: string, updates: Partial<Omit<GuideLine, 'id'>>): void
  (e: 'clear'): void
}>()

const collapsed = ref(false)
const search = ref('')

const visibleLines = computed(() => props.lines.filter((l) => l.visible !== false))

const filteredLines = computed(() => {
  const q = search.value.trim()
  if (!q) return visibleLines.value
  return visibleLines.value.filter((l) => formatPos(l.position).includes(q))
})

function formatPos(v: number): string {
  return props.format(v)
}

function handleToggleLock(line: GuideLine): void {
  emit('update', line.id, { locked: !line.locked })
}

function handleRemove(line: GuideLine): void {
  emit('remove', line.id)
}

function handleClearAll(): void {
  emit('clear')
}

function handleAdd(orientation: 'h' | 'v'): void {
  // 默认添加到画布中心（100px 位置，实际应由父组件根据画布尺寸计算）
  emit('add', orientation, 100)
}
</script>

<style lang="scss" scoped>
.ruler-line-panel {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 200px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  z-index: 100;
  transition: width 0.2s ease;

  &.collapsed {
    width: auto;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #f0f0f0;
}

.panel-title {
  font-weight: 600;
  flex: 1;
}

.panel-count {
  color: #999;
  font-size: 11px;
}

.panel-toggle {
  color: #666;
}

.panel-body {
  padding: 8px;
}

.panel-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  align-items: center;
}

.panel-search {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
  outline: none;

  &:focus {
    border-color: #51d6a9;
  }
}

.btn-icon,
.btn-lock,
.btn-delete {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 3px;
  line-height: 1;

  &:hover {
    background: #f0f0f0;
  }
}

.line-list {
  max-height: 240px;
  overflow-y: auto;
}

.line-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 4px;

  &:hover {
    background: #f8f8f8;
  }

  &.locked {
    opacity: 0.7;
  }
}

.line-orient {
  width: 18px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 10px;
}

.line-pos {
  flex: 1;
  font-family: monospace;
}

.line-empty {
  text-align: center;
  color: #aaa;
  padding: 12px 0;
  font-size: 11px;
}
</style>
