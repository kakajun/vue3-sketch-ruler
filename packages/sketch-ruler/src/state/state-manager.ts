/**
 * StateManager - 不可变状态快照管理
 * M1 基础版本：管理参考线数组的增删改
 */

import { ref, type Ref } from 'vue'
import type { GuideLine } from './ruler-context'

export interface RulerState {
  lines: GuideLine[]
}

export class StateManager {
  private lines: Ref<GuideLine[]>
  private idCounter = 0

  constructor(initialLines: GuideLine[] = []) {
    this.lines = ref([...initialLines])
  }

  getLines(): Ref<GuideLine[]> {
    return this.lines
  }

  addLine(line: Omit<GuideLine, 'id'>): GuideLine {
    const newLine: GuideLine = {
      ...line,
      id: `line-${++this.idCounter}-${Date.now()}`
    }
    this.lines.value = [...this.lines.value, newLine]
    return newLine
  }

  removeLine(id: string): boolean {
    const before = this.lines.value.length
    this.lines.value = this.lines.value.filter((l) => l.id !== id)
    return this.lines.value.length < before
  }

  updateLine(id: string, updates: Partial<Omit<GuideLine, 'id'>>): boolean {
    let found = false
    this.lines.value = this.lines.value.map((l) => {
      if (l.id === id) {
        found = true
        return { ...l, ...updates }
      }
      return l
    })
    return found
  }

  moveLine(id: string, position: number): boolean {
    return this.updateLine(id, { position })
  }

  toggleLock(id: string): boolean {
    const line = this.lines.value.find((l) => l.id === id)
    if (!line) return false
    return this.updateLine(id, { locked: !line.locked })
  }

  toggleVisible(id: string): boolean {
    const line = this.lines.value.find((l) => l.id === id)
    if (!line) return false
    return this.updateLine(id, { visible: !line.visible })
  }

  clear(): void {
    this.lines.value = []
  }

  setLines(lines: GuideLine[]): void {
    this.lines.value = [...lines]
  }
}
