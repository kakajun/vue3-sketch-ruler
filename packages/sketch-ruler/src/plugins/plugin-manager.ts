import type {
  SketchRulerPlugin,
  RulerRenderer,
  BeforeZoomContext,
  AfterPanContext,
  OnSnapContext,
  OnLineContext,
  OnLineMoveContext
} from './types'

/**
 * PluginManager - 插件生命周期管理与钩子分发
 * M4 W18：支持 before/after 类钩子、自定义渲染器注册
 */
export class PluginManager {
  private plugins: SketchRulerPlugin[] = []
  private renderers = new Map<string, RulerRenderer>()
  private activeRenderer: string | null = null

  register(plugin: SketchRulerPlugin): () => void {
    this.plugins.push(plugin)

    if (plugin.registerRenderer) {
      const reg = plugin.registerRenderer()
      this.renderers.set(reg.name, reg.renderer)
      if (this.activeRenderer === null) {
        this.activeRenderer = reg.name
      }
    }

    // 返回卸载函数
    return () => this.unregister(plugin)
  }

  unregister(plugin: SketchRulerPlugin): void {
    const idx = this.plugins.indexOf(plugin)
    if (idx !== -1) {
      this.plugins.splice(idx, 1)
    }
    if (plugin.registerRenderer) {
      const reg = plugin.registerRenderer()
      this.renderers.delete(reg.name)
      if (this.activeRenderer === reg.name) {
        this.activeRenderer = this.renderers.keys().next().value ?? null
      }
    }
  }

  async beforeZoom(ctx: BeforeZoomContext): Promise<boolean> {
    let cancelled = false
    const cancel = (): void => {
      cancelled = true
    }
    const context = { ...ctx, cancel }

    for (const plugin of this.plugins) {
      if (plugin.beforeZoom) {
        await plugin.beforeZoom(context)
        if (cancelled) return false
      }
    }
    return true
  }

  afterPan(ctx: AfterPanContext): void {
    for (const plugin of this.plugins) {
      plugin.afterPan?.(ctx)
    }
  }

  onSnap(ctx: OnSnapContext): void {
    for (const plugin of this.plugins) {
      plugin.onSnap?.(ctx)
    }
  }

  onLineCreate(ctx: OnLineContext): void {
    for (const plugin of this.plugins) {
      plugin.onLineCreate?.(ctx)
    }
  }

  onLineDelete(ctx: OnLineContext): void {
    for (const plugin of this.plugins) {
      plugin.onLineDelete?.(ctx)
    }
  }

  onLineMove(ctx: OnLineMoveContext): void {
    for (const plugin of this.plugins) {
      plugin.onLineMove?.(ctx)
    }
  }

  // === 渲染器管理 ===

  setActiveRenderer(name: string): boolean {
    if (this.renderers.has(name)) {
      this.activeRenderer = name
      return true
    }
    return false
  }

  getActiveRenderer(): RulerRenderer | null {
    if (!this.activeRenderer) return null
    return this.renderers.get(this.activeRenderer) ?? null
  }

  getRendererNames(): string[] {
    return Array.from(this.renderers.keys())
  }

  hasRenderer(name: string): boolean {
    return this.renderers.has(name)
  }

  clear(): void {
    this.plugins = []
    this.renderers.clear()
    this.activeRenderer = null
  }
}
