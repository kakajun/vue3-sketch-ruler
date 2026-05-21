/**
 * KeyboardAdapter - 键盘事件适配器
 * M3 W11：修饰键状态追踪 + 快捷键映射
 */

export type KeyCombo = string

export interface KeyboardAdapterCallbacks {
  onShortcut?: (combo: KeyCombo, e: KeyboardEvent) => void
}

export class KeyboardAdapter {
  private callbacks: KeyboardAdapterCallbacks
  private boundKeyDown: (e: KeyboardEvent) => void
  private isBound = false

  constructor(callbacks: KeyboardAdapterCallbacks) {
    this.callbacks = callbacks
    this.boundKeyDown = this.handleKeyDown.bind(this)
  }

  bind(): void {
    if (this.isBound) return
    this.isBound = true
    document.addEventListener('keydown', this.boundKeyDown)
  }

  unbind(): void {
    if (!this.isBound) return
    this.isBound = false
    document.removeEventListener('keydown', this.boundKeyDown)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.repeat) return

    // 忽略输入框内的快捷键
    const activeElement = document.activeElement
    if (
      activeElement?.closest('.monaco-editor') ||
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return
    }

    const combo = this.parseCombo(e)
    this.callbacks.onShortcut?.(combo, e)
  }

  private parseCombo(e: KeyboardEvent): string {
    const parts: string[] = []
    if (e.ctrlKey || e.metaKey) parts.push('ctrl')
    if (e.altKey) parts.push('alt')
    if (e.shiftKey) parts.push('shift')

    let key = e.key.toLowerCase()
    // 规范化特殊键名
    if (key === ' ') key = 'space'
    if (key === '+') key = 'plus'
    if (key === '-') key = 'minus'
    if (key === '=') key = 'equal'

    parts.push(key)
    return parts.join('+')
  }
}
