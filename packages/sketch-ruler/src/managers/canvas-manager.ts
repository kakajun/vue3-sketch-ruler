import { ref, type Ref, shallowRef } from 'vue'
import type { GuideLine } from '../state/ruler-context'

export interface CanvasConfig {
  id: string
  name: string
  width: number
  height: number
  scale?: number
  offsetX?: number
  offsetY?: number
  lines?: { h: number[]; v: number[] }
  /** 全局参考线（在所有画布间共享） */
  globalLines?: { h: number[]; v: number[] }
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
  /** 缩略图缓存（非激活画布自动降级） */
  thumbnail?: string | null
}

export type CanvasTemplate = Omit<CanvasConfig, 'id'>

/**
 * CanvasManager - 多画布标签页管理
 * M4 W16：状态隔离、全局参考线、缩略图降级
 */
// W19：内置页面模板预设
export const BUILTIN_TEMPLATES: Record<string, CanvasTemplate> = {
  'A4 Portrait': { name: 'A4 纵向', width: 794, height: 1123 },
  'A4 Landscape': { name: 'A4 横向', width: 1123, height: 794 },
  'Web 1920': { name: 'Web 1920', width: 1920, height: 1080 },
  'Web 1440': { name: 'Web 1440', width: 1440, height: 900 },
  'Mobile 375': { name: 'Mobile 375', width: 375, height: 812 },
  'Mobile 414': { name: 'Mobile 414', width: 414, height: 896 }
}

export class CanvasManager {
  private canvases = shallowRef<CanvasState[]>([])
  private activeId = ref<string>('')
  private globalLines: GuideLine[] = []
  private templates = new Map<string, CanvasTemplate>()
  private idCounter = 0

  constructor(initialCanvases: CanvasConfig[] = []) {
    // 注册内置模板
    for (const [name, template] of Object.entries(BUILTIN_TEMPLATES)) {
      this.templates.set(name, template)
    }
    for (const config of initialCanvases) {
      this.addCanvas(config)
    }
    if (this.canvases.value.length > 0) {
      this.activeId.value = this.canvases.value[0].id
    }
  }

  get activeCanvasId(): Ref<string> {
    return this.activeId
  }

  get canvasesList(): Ref<CanvasState[]> {
    return this.canvases
  }

  get activeCanvas(): CanvasState | null {
    return this.canvases.value.find((c) => c.id === this.activeId.value) ?? null
  }

  addCanvas(config?: Partial<CanvasConfig>): string {
    const id = config?.id ?? `canvas-${++this.idCounter}-${Date.now()}`
    const state: CanvasState = {
      id,
      name: config?.name ?? `画布 ${this.canvases.value.length + 1}`,
      width: config?.width ?? 1920,
      height: config?.height ?? 1080,
      scale: config?.scale ?? 1,
      offsetX: config?.offsetX ?? 0,
      offsetY: config?.offsetY ?? 0,
      lines: this.importLines(config?.lines),
      thumbnail: null
    }
    this.canvases.value = [...this.canvases.value, state]
    if (!this.activeId.value) {
      this.activeId.value = id
    }
    return id
  }

  removeCanvas(canvasId: string): void {
    const idx = this.canvases.value.findIndex((c) => c.id === canvasId)
    if (idx === -1) return
    const newList = [...this.canvases.value]
    newList.splice(idx, 1)
    this.canvases.value = newList
    if (this.activeId.value === canvasId && newList.length > 0) {
      this.activeId.value = newList[0].id
    }
  }

  switchCanvas(canvasId: string): void {
    if (!this.canvases.value.some((c) => c.id === canvasId)) return

    // 为当前画布生成缩略图缓存
    const current = this.activeCanvas
    if (current && current.id !== canvasId) {
      this.captureThumbnail(current.id)
    }

    this.activeId.value = canvasId

    // 激活时清除缩略图缓存，恢复完整渲染
    const target = this.canvases.value.find((c) => c.id === canvasId)
    if (target) {
      target.thumbnail = null
    }
  }

  updateCanvasState(
    canvasId: string,
    updates: Partial<Pick<CanvasState, 'scale' | 'offsetX' | 'offsetY' | 'name'>>
  ): void {
    this.canvases.value = this.canvases.value.map((c) => {
      if (c.id === canvasId) {
        return { ...c, ...updates }
      }
      return c
    })
  }

  updateCanvasLines(canvasId: string, lines: GuideLine[]): void {
    this.canvases.value = this.canvases.value.map((c) => {
      if (c.id === canvasId) {
        return { ...c, lines: [...lines] }
      }
      return c
    })
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

  /** 设置全局参考线（在所有画布间共享） */
  setGlobalLines(lines: { h: number[]; v: number[] }): void {
    this.globalLines = this.importLines(lines)
  }

  getGlobalLines(): GuideLine[] {
    return [...this.globalLines]
  }

  /** 合并画布的本地参考线与全局参考线 */
  getMergedLines(canvasId: string): GuideLine[] {
    const canvas = this.canvases.value.find((c) => c.id === canvasId)
    if (!canvas) return []
    return [...this.globalLines, ...canvas.lines]
  }

  /** 导出画布快照 */
  exportCanvas(canvasId: string): CanvasState | null {
    const canvas = this.canvases.value.find((c) => c.id === canvasId)
    return canvas ? { ...canvas } : null
  }

  /** 导入画布快照 */
  importCanvas(snapshot: CanvasState): void {
    const exists = this.canvases.value.some((c) => c.id === snapshot.id)
    if (exists) {
      this.canvases.value = this.canvases.value.map((c) =>
        c.id === snapshot.id ? { ...snapshot } : c
      )
    } else {
      this.canvases.value = [...this.canvases.value, { ...snapshot }]
    }
  }

  private captureThumbnail(canvasId: string): void {
    // 缩略图降级：实际项目中可在此调用 html2canvas 或自行绘制 Canvas
    // 此处标记 thumbnail 为非 null 表示已降级
    const canvas = this.canvases.value.find((c) => c.id === canvasId)
    if (canvas) {
      canvas.thumbnail = 'data:image/png;base64,placeholder'
    }
  }

  private importLines(legacy?: { h: number[]; v: number[] }): GuideLine[] {
    if (!legacy) return []
    const lines: GuideLine[] = []
    let id = 0
    for (const h of legacy.h) {
      lines.push({
        id: `h-${id++}-${Date.now()}`,
        orientation: 'h',
        position: h,
        visible: true,
        locked: false
      })
    }
    for (const v of legacy.v) {
      lines.push({
        id: `v-${id++}-${Date.now()}`,
        orientation: 'v',
        position: v,
        visible: true,
        locked: false
      })
    }
    return lines
  }
}
