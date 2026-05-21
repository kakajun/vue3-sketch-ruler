import type { GuideLine } from '../types'
import { generateCanvasId } from '../utils/id-utils'
import { importLines } from '../utils/line-utils'

export interface CanvasConfig {
  id?: string
  name?: string
  width?: number
  height?: number
  scale?: number
  offsetX?: number
  offsetY?: number
  lines?: { h: number[]; v: number[] }
}

export interface CanvasState {
  id: string
  name: string
  width: number
  height: number
  scale: number
  offsetX: number
  offsetY: number
  lines: GuideLine[]
  thumbnail?: string | null
}

export type CanvasTemplate = Omit<CanvasConfig, 'id'>

export const BUILTIN_TEMPLATES: Record<string, CanvasTemplate> = {
  'A4 Portrait': { name: 'A4 纵向', width: 794, height: 1123 },
  'A4 Landscape': { name: 'A4 横向', width: 1123, height: 794 },
  'Web 1920': { name: 'Web 1920', width: 1920, height: 1080 },
  'Web 1440': { name: 'Web 1440', width: 1440, height: 900 },
  'Mobile 375': { name: 'Mobile 375', width: 375, height: 812 },
  'Mobile 414': { name: 'Mobile 414', width: 414, height: 896 }
}

export interface CanvasManagerState {
  canvases: CanvasState[]
  activeId: string
}

export class CanvasManager {
  private canvases: CanvasState[] = []
  private activeId = ''
  private templates = new Map<string, CanvasTemplate>()
  private globalLines: GuideLine[] = []
  private listeners = new Set<(state: CanvasManagerState) => void>()

  constructor(initialCanvases: CanvasConfig[] = []) {
    for (const [name, template] of Object.entries(BUILTIN_TEMPLATES)) {
      this.templates.set(name, template)
    }
    for (const config of initialCanvases) {
      this.addCanvas(config)
    }
  }

  private notify(): void {
    const state: CanvasManagerState = {
      canvases: [...this.canvases],
      activeId: this.activeId
    }
    this.listeners.forEach((cb) => cb(state))
  }

  onUpdate(cb: (state: CanvasManagerState) => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  getState(): CanvasManagerState {
    return { canvases: [...this.canvases], activeId: this.activeId }
  }

  get activeCanvas(): CanvasState | null {
    return this.canvases.find((c) => c.id === this.activeId) ?? null
  }

  addCanvas(config?: Partial<CanvasConfig>): string {
    const id = config?.id ?? generateCanvasId()
    const state: CanvasState = {
      id,
      name: config?.name ?? `画布 ${this.canvases.length + 1}`,
      width: config?.width ?? 1920,
      height: config?.height ?? 1080,
      scale: config?.scale ?? 1,
      offsetX: config?.offsetX ?? 0,
      offsetY: config?.offsetY ?? 0,
      lines: importLines(config?.lines),
      thumbnail: null
    }
    this.canvases = [...this.canvases, state]
    if (!this.activeId) {
      this.activeId = id
    }
    this.notify()
    return id
  }

  removeCanvas(canvasId: string): void {
    const idx = this.canvases.findIndex((c) => c.id === canvasId)
    if (idx === -1) return
    const newList = [...this.canvases]
    newList.splice(idx, 1)
    this.canvases = newList
    if (this.activeId === canvasId && newList.length > 0) {
      this.activeId = newList[0].id
    }
    this.notify()
  }

  switchCanvas(canvasId: string): void {
    if (!this.canvases.some((c) => c.id === canvasId)) return
    const current = this.activeCanvas
    if (current && current.id !== canvasId) {
      this.captureThumbnail(current.id)
    }
    this.activeId = canvasId
    const target = this.canvases.find((c) => c.id === canvasId)
    if (target) {
      target.thumbnail = null
    }
    this.notify()
  }

  updateCanvasState(
    canvasId: string,
    updates: Partial<Pick<CanvasState, 'scale' | 'offsetX' | 'offsetY' | 'name'>>
  ): void {
    this.canvases = this.canvases.map((c) => (c.id === canvasId ? { ...c, ...updates } : c))
    this.notify()
  }

  updateCanvasLines(canvasId: string, lines: GuideLine[]): void {
    this.canvases = this.canvases.map((c) => (c.id === canvasId ? { ...c, lines: [...lines] } : c))
    this.notify()
  }

  registerTemplate(name: string, template: CanvasTemplate): void {
    this.templates.set(name, template)
  }

  getTemplateNames(): string[] {
    return Array.from(this.templates.keys())
  }

  applyTemplate(name: string): string | null {
    const template = this.templates.get(name)
    if (!template) return null
    return this.addCanvas(template)
  }

  setGlobalLines(lines: { h: number[]; v: number[] }): void {
    this.globalLines = importLines(lines)
  }

  getGlobalLines(): GuideLine[] {
    return [...this.globalLines]
  }

  getMergedLines(canvasId: string): GuideLine[] {
    const canvas = this.canvases.find((c) => c.id === canvasId)
    if (!canvas) return []
    return [...this.globalLines, ...canvas.lines]
  }

  exportCanvas(canvasId: string): CanvasState | null {
    const canvas = this.canvases.find((c) => c.id === canvasId)
    return canvas ? { ...canvas } : null
  }

  importCanvas(snapshot: CanvasState): void {
    const exists = this.canvases.some((c) => c.id === snapshot.id)
    if (exists) {
      this.canvases = this.canvases.map((c) => (c.id === snapshot.id ? { ...snapshot } : c))
    } else {
      this.canvases = [...this.canvases, { ...snapshot }]
    }
    this.notify()
  }

  private captureThumbnail(canvasId: string): void {
    const canvas = this.canvases.find((c) => c.id === canvasId)
    if (canvas) {
      canvas.thumbnail = 'data:image/png;base64,placeholder'
    }
  }
}
