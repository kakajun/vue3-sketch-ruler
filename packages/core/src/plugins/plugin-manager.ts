import type {
  SketchRulerPlugin,
  RulerRenderer,
  BeforeZoomContext,
  AfterZoomContext,
  BeforePanContext,
  AfterPanContext,
  OnSnapContext,
  OnLineContext,
  OnLineMoveContext,
  PluginApi
} from '../types'

interface RendererRegistration {
  name: string
  renderer: RulerRenderer
}

/**
 * PluginManager - 插件生命周期管理与钩子分发
 * M4 W18：支持 before/after 类钩子、自定义渲染器注册、优先级、错误隔离
 */
export class PluginManager {
  private plugins: SketchRulerPlugin[] = []
  private renderers = new Map<string, RulerRenderer>()
  private rendererOwners = new WeakMap<SketchRulerPlugin, RendererRegistration>()
  private activeRenderer: string | null = null
  private api: PluginApi | null = null

  setApi(api: PluginApi): void {
    this.api = api
  }

  register(plugin: SketchRulerPlugin): () => void {
    this.plugins.push(plugin)
    this.sortPlugins()

    if (plugin.registerRenderer) {
      const reg = plugin.registerRenderer()
      this.renderers.set(reg.name, reg.renderer)
      this.rendererOwners.set(plugin, reg)
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

    const reg = this.rendererOwners.get(plugin)
    if (reg) {
      this.renderers.delete(reg.name)
      this.rendererOwners.delete(plugin)
      if (this.activeRenderer === reg.name) {
        this.activeRenderer = this.renderers.keys().next().value ?? null
      }
    }
  }

  private sortPlugins(): void {
    this.plugins.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
  }

  private getContext<T extends object>(base: T): T & { api: PluginApi } {
    if (!this.api) {
      throw new Error('[PluginManager] api not set. Call setApi() before dispatching hooks.')
    }
    return { ...base, api: this.api }
  }

  private safeCall(fn: () => void, pluginName: string, hookName: string): void {
    try {
      fn()
    } catch (err) {
      console.error(`[PluginManager] Plugin "${pluginName}" ${hookName} threw:`, err)
    }
  }

  private async safeCallAsync(
    fn: () => void | Promise<void>,
    pluginName: string,
    hookName: string
  ): Promise<void> {
    try {
      await fn()
    } catch (err) {
      console.error(`[PluginManager] Plugin "${pluginName}" ${hookName} threw:`, err)
    }
  }

  async beforeZoom(ctx: BeforeZoomContext): Promise<boolean> {
    let cancelled = false
    const cancel = (): void => {
      cancelled = true
    }
    const context = this.getContext({ ...ctx, cancel })

    for (const plugin of this.plugins) {
      if (plugin.beforeZoom) {
        await this.safeCallAsync(
          () => plugin.beforeZoom!(context),
          plugin.name,
          'beforeZoom'
        )
        if (cancelled) return false
      }
    }
    return true
  }

  afterZoom(ctx: AfterZoomContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.afterZoom) {
        this.safeCall(() => plugin.afterZoom!(context), plugin.name, 'afterZoom')
      }
    }
  }

  async beforePan(ctx: BeforePanContext): Promise<boolean> {
    let cancelled = false
    const cancel = (): void => {
      cancelled = true
    }
    const context = this.getContext({ ...ctx, cancel })

    for (const plugin of this.plugins) {
      if (plugin.beforePan) {
        await this.safeCallAsync(
          () => plugin.beforePan!(context),
          plugin.name,
          'beforePan'
        )
        if (cancelled) return false
      }
    }
    return true
  }

  afterPan(ctx: AfterPanContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.afterPan) {
        this.safeCall(() => plugin.afterPan!(context), plugin.name, 'afterPan')
      }
    }
  }

  onSnap(ctx: OnSnapContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.onSnap) {
        this.safeCall(() => plugin.onSnap!(context), plugin.name, 'onSnap')
      }
    }
  }

  onLineCreate(ctx: OnLineContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.onLineCreate) {
        this.safeCall(() => plugin.onLineCreate!(context), plugin.name, 'onLineCreate')
      }
    }
  }

  onLineDelete(ctx: OnLineContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.onLineDelete) {
        this.safeCall(() => plugin.onLineDelete!(context), plugin.name, 'onLineDelete')
      }
    }
  }

  onLineMove(ctx: OnLineMoveContext): void {
    const context = this.getContext(ctx)
    for (const plugin of this.plugins) {
      if (plugin.onLineMove) {
        this.safeCall(() => plugin.onLineMove!(context), plugin.name, 'onLineMove')
      }
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
    this.rendererOwners = new WeakMap()
    this.activeRenderer = null
  }
}
