import { produceState, createDefaultState } from './ruler-state'
import type { RulerState, RulerAction } from './ruler-state'
import type { GuideLine } from '../types'
import { generateLineId } from '../utils/id-utils'

export class LineManager {
  private state: RulerState
  private listeners = new Set<(state: RulerState) => void>()

  constructor(initialLines: GuideLine[] = []) {
    this.state = createDefaultState()
    if (initialLines.length > 0) {
      this.state = produceState(this.state, { type: 'setLines', lines: initialLines })
    }
  }

  private dispatch(action: RulerAction): void {
    this.state = produceState(this.state, action)
    this.listeners.forEach((cb) => cb(this.state))
  }

  onUpdate(cb: (state: RulerState) => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  getState(): RulerState {
    return this.state
  }

  getLines(): GuideLine[] {
    return this.state.lines
  }

  addLine(line: Omit<GuideLine, 'id'>): GuideLine {
    const newLine: GuideLine = { ...line, id: generateLineId() }
    this.dispatch({ type: 'addLine', line: newLine })
    return newLine
  }

  removeLine(id: string): boolean {
    const exists = this.state.lines.some((l) => l.id === id)
    if (!exists) return false
    this.dispatch({ type: 'removeLine', id })
    return true
  }

  updateLine(id: string, updates: Partial<Omit<GuideLine, 'id'>>): boolean {
    const exists = this.state.lines.some((l) => l.id === id)
    if (!exists) return false
    this.dispatch({ type: 'updateLine', id, updates })
    return true
  }

  moveLine(id: string, position: number): boolean {
    return this.updateLine(id, { position })
  }

  toggleLock(id: string): boolean {
    const line = this.state.lines.find((l) => l.id === id)
    if (!line) return false
    return this.updateLine(id, { locked: !line.locked })
  }

  toggleVisible(id: string): boolean {
    const line = this.state.lines.find((l) => l.id === id)
    if (!line) return false
    return this.updateLine(id, { visible: !line.visible })
  }

  clear(): void {
    this.dispatch({ type: 'setLines', lines: [] })
  }

  setLines(lines: GuideLine[]): void {
    this.dispatch({ type: 'setLines', lines: [...lines] })
  }
}
