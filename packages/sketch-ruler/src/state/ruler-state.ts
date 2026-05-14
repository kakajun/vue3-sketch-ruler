import type { GuideLine, RulerPalette, SnapConfig } from './ruler-context'

/**
 * RulerState - 标尺全局状态快照
 * M1 基础版：包含参考线、配色、吸附配置
 */
export interface RulerState {
  lines: GuideLine[]
  palette: RulerPalette
  snapConfig: SnapConfig
  showReferLine: boolean
}

/** 状态变更动作联合类型 */
export type RulerAction =
  | { type: 'addLine'; line: GuideLine }
  | { type: 'removeLine'; id: string }
  | { type: 'moveLine'; id: string; position: number }
  | { type: 'updateLine'; id: string; updates: Partial<Omit<GuideLine, 'id'>> }
  | { type: 'setLines'; lines: GuideLine[] }
  | { type: 'importLegacy'; legacy: { h: number[]; v: number[] } }
  | { type: 'setPalette'; palette: Partial<RulerPalette> }
  | { type: 'setSnapConfig'; config: Partial<SnapConfig> }
  | { type: 'toggleReferLine'; value?: boolean }

/**
 * 创建默认状态
 */
export function createDefaultState(): RulerState {
  return {
    lines: [],
    palette: {
      bgColor: '#f6f7f9',
      tickColor: '#BABBBC',
      labelColor: '#7D8694',
      guideLineColor: '#51d6a9',
      guideLineLockedColor: '#d4d7dc',
      hoverBg: '#000',
      hoverColor: '#fff',
      borderColor: '#eeeeef'
    },
    snapConfig: {
      enabled: true,
      threshold: 5,
      strength: 0.5
    },
    showReferLine: true
  }
}

/**
 * produceState - 纯函数状态更新
 * 返回新状态，结构共享未变更部分
 */
export function produceState(current: RulerState, action: RulerAction): RulerState {
  switch (action.type) {
    case 'addLine': {
      return {
        ...current,
        lines: [...current.lines, action.line]
      }
    }

    case 'removeLine': {
      const filtered = current.lines.filter((l) => l.id !== action.id)
      if (filtered.length === current.lines.length) return current
      return { ...current, lines: filtered }
    }

    case 'moveLine': {
      const idx = current.lines.findIndex((l) => l.id === action.id)
      if (idx === -1) return current
      const updated = [...current.lines]
      updated[idx] = { ...updated[idx], position: action.position }
      return { ...current, lines: updated }
    }

    case 'updateLine': {
      const idx = current.lines.findIndex((l) => l.id === action.id)
      if (idx === -1) return current
      const updated = [...current.lines]
      updated[idx] = { ...updated[idx], ...action.updates }
      return { ...current, lines: updated }
    }

    case 'setLines': {
      if (action.lines === current.lines) return current
      return { ...current, lines: action.lines }
    }

    case 'importLegacy': {
      const lines: GuideLine[] = []
      let id = 0
      for (const h of action.legacy.h) {
        lines.push({
          id: `h-${id++}`,
          orientation: 'h',
          position: h,
          visible: true,
          locked: false
        })
      }
      for (const v of action.legacy.v) {
        lines.push({
          id: `v-${id++}`,
          orientation: 'v',
          position: v,
          visible: true,
          locked: false
        })
      }
      return { ...current, lines }
    }

    case 'setPalette': {
      return {
        ...current,
        palette: { ...current.palette, ...action.palette }
      }
    }

    case 'setSnapConfig': {
      return {
        ...current,
        snapConfig: { ...current.snapConfig, ...action.config }
      }
    }

    case 'toggleReferLine': {
      return {
        ...current,
        showReferLine: action.value !== undefined ? action.value : !current.showReferLine
      }
    }

    default:
      return current
  }
}
