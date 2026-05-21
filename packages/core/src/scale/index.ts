import type { ScaleMark } from '../types'
import { TICK_CONFIGS, getTickConfig, applyHysteresis } from './tick-config'

export interface ComputeScaleOptions {
  scale: number
  offset: number
  viewportSize: number
  thick: number
  vertical?: boolean
  canvasSize?: number
  showMinorTicks?: boolean
}

/**
 * 计算标尺刻度标记
 * 纯函数，零框架依赖
 */
export function computeScaleMarks(options: ComputeScaleOptions): ScaleMark[] {
  const { scale, offset, viewportSize, thick, canvasSize, showMinorTicks } = options

  if (viewportSize <= 0 || scale <= 0) {
    return []
  }

  const config = getTickConfig(scale)
  const interval = config.interval
  const subdivisions = config.subdivisions
  const subInterval = interval / subdivisions

  // 计算视口在世界坐标中的范围
  const worldStart = -offset / scale
  const worldEnd = (viewportSize - offset) / scale

  // 扩展缓冲区（左右各 0.5 倍视口宽度）
  const bufferSize = viewportSize / scale
  const renderStart = worldStart - bufferSize * 0.5
  const renderEnd = worldEnd + bufferSize * 0.5

  // 对齐到刻度间隔
  const firstMajor = Math.floor(renderStart / interval) * interval
  const marks: ScaleMark[] = []

  const endNum = canvasSize ?? Infinity

  for (let major = firstMajor; major <= renderEnd; major += interval) {
    // 主刻度
    const screenPos = major * scale + offset
    if (screenPos >= -thick && screenPos <= viewportSize + thick) {
      // 仅在世界坐标 [0, endNum] 范围内显示标签
      // 当离 endNum 太近时隐藏标签，避免与 endNum 刻度标签重叠
      const showLabel =
        major >= 0 &&
        major <= endNum &&
        (endNum === Infinity || major === endNum || endNum - major >= interval)
      marks.push({
        position: screenPos,
        length: thick * 0.6,
        isMajor: true,
        label: showLabel
          ? config.formatLabel
            ? config.formatLabel(major)
            : `${Math.round(major)}`
          : undefined,
        value: major
      })
    }

    // 次刻度（默认不显示，可通过 showMinorTicks 开启）
    if (showMinorTicks) {
      for (let i = 1; i < subdivisions; i++) {
        const subValue = major + i * subInterval
        const subScreenPos = subValue * scale + offset
        if (subScreenPos >= -thick && subScreenPos <= viewportSize + thick) {
          marks.push({
            position: subScreenPos,
            length: thick * 0.3,
            isMajor: false,
            value: subValue
          })
        }
      }
    }
  }

  // 特殊处理 canvas 最大宽度/高度刻度（同 master 分支的 setLast）
  if (endNum !== Infinity && endNum > 0) {
    const hasEndNum = marks.some((m) => m.isMajor && m.value === endNum)
    if (!hasEndNum) {
      const endScreenPos = endNum * scale + offset
      if (endScreenPos >= -thick && endScreenPos <= viewportSize + thick * 2) {
        marks.push({
          position: endScreenPos,
          length: thick * 0.6,
          isMajor: true,
          label: `${Math.round(endNum)}`,
          value: endNum
        })
        // 保持有序
        marks.sort((a, b) => a.position - b.position)
      }
    }
  }

  return marks
}

export { TICK_CONFIGS, getTickConfig, applyHysteresis }
